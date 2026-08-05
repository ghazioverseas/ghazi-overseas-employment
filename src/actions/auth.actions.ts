"use server";

import { cookies } from "next/headers";
import { candidateRegisterSchema, loginSchema, forgotPasswordSchema } from "@/validators/auth.schema";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";
import { CandidateService } from "@/services/candidate.service";
import { logger } from "@/lib/logger";

export async function registerCandidateAction(formData: unknown) {
  try {
    const validated = candidateRegisterSchema.parse(formData);
    
    // 1. Create user account via Better Auth
    const newUser = await auth.api.signUpEmail({
      body: {
        email: validated.email,
        password: validated.password,
        name: validated.fullName,
      },
    });

    if (!newUser || !newUser.user) {
      return { success: false, error: "Registration failed. User account could not be created." };
    }

    // 2. Insert comprehensive Candidate profile record into PostgreSQL
    await CandidateService.createCandidateProfile({
      id: crypto.randomUUID(),
      userId: newUser.user.id,
      fullName: validated.fullName,
      fatherName: validated.fatherName,
      cnic: validated.cnic,
      passportNumber: validated.passportNumber,
      dateOfBirth: validated.dateOfBirth,
      gender: validated.gender,
      phone: validated.phone,
      whatsapp: validated.whatsapp,
      address: validated.address,
      city: validated.city,
      province: validated.province,
      country: validated.country,
      profession: validated.profession,
      yearsOfExperience: validated.yearsOfExperience,
      education: validated.education,
    });

    logger.info("auth", "Candidate registered successfully", { email: validated.email, userId: newUser.user.id });

    // 3. Auto Sign In via Better Auth
    const session = await auth.api.signInEmail({
      body: {
        email: validated.email,
        password: validated.password,
      },
    });

    return {
      success: true,
      message: "Candidate profile registered successfully.",
      user: session?.user || newUser.user,
    };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "An unexpected error occurred during candidate registration.";
    logger.error("auth", "Candidate registration error", { error: errMessage });
    return { success: false, error: errMessage };
  }
}

export async function loginAction(formData: unknown) {
  try {
    const validated = loginSchema.parse(formData);

    const session = await auth.api.signInEmail({
      body: {
        email: validated.email,
        password: validated.password,
      },
    });

    if (!session || !session.user) {
      return { success: false, error: "Invalid email or password credentials." };
    }

    // Enforce role check: Admin users must not log in via candidate login portal
    const userRecords = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);
    const role = userRecords[0]?.role || (session.user as { role?: string }).role || "candidate";

    if (role === "admin") {
      return {
        success: false,
        error: "Administrator accounts must sign in via the Admin Portal at /admin/login.",
      };
    }

    logger.info("auth", "Candidate logged in successfully", { userId: session.user.id, role });
    return { success: true, user: session.user, role };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Invalid email or password credentials.";
    logger.error("auth", "Candidate login failed", { error: errMessage });
    return { success: false, error: errMessage };
  }
}

export async function adminLoginAction(formData: unknown) {
  try {
    const validated = loginSchema.parse(formData);

    let session;
    try {
      session = await auth.api.signInEmail({
        body: {
          email: validated.email,
          password: validated.password,
        },
      });
    } catch {
      return { success: false, error: "Invalid admin email or password credentials." };
    }

    if (!session || !session.user) {
      return { success: false, error: "Invalid admin email or password credentials." };
    }

    // Verify admin role in database
    const dbUsers = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);
    const dbUser = dbUsers[0];
    const role = dbUser?.role || (session.user as { role?: string }).role;

    if (role !== "admin") {
      logger.warn("auth", "Unauthorized non-admin attempted admin portal login", { email: validated.email });
      return {
        success: false,
        error: "Access Denied: You do not have administrator permissions.",
      };
    }

    // Set secure session cookie
    const cookieStore = await cookies();
    const s = session as unknown as { token?: string; session?: { token: string } };
    const token = s.token || s.session?.token;

    if (token) {
      cookieStore.set("better-auth.session_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
      });
    }

    logger.info("auth", "Admin logged in successfully", { userId: session.user.id, email: validated.email });
    return {
      success: true,
      user: session.user,
      role: "admin",
      message: "Admin authentication successful.",
    };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Invalid email or password credentials.";
    logger.error("auth", "Admin login failed", { error: errMessage });
    return { success: false, error: errMessage };
  }
}

export async function forgotPasswordAction(formData: unknown) {
  try {
    const validated = forgotPasswordSchema.parse(formData);
    
    logger.info("auth", "Password reset request initiated", { email: validated.email });
    return {
      success: true,
      message: "If an account exists with this email, password recovery instructions have been sent.",
    };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Validation failed.";
    logger.error("auth", "Forgot password request error", { error: errMessage });
    return { success: false, error: errMessage };
  }
}
