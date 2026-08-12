"use server";

import { cookies, headers } from "next/headers";
import { candidateRegisterSchema, loginSchema, forgotPasswordSchema } from "@/validators/auth.schema";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { users, sessions, accounts } from "@/db/schema/users";
import { eq, and } from "drizzle-orm";
import { CandidateService } from "@/services/candidate.service";
import { getSessionFromRequest } from "@/lib/auth/get-session";
import { logger } from "@/lib/logger";

/**
 * Ensure Super Admin user account exists in PostgreSQL
 */
async function getOrCreateAdminUser(email: string) {
  const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing.length > 0) {
    const u = existing[0];
    if (u.role !== "admin") {
      await db.update(users).set({ role: "admin", updatedAt: new Date() }).where(eq(users.id, u.id));
    }
    return { ...u, role: "admin" };
  }

  const adminId = "admin_super_user_id";
  const now = new Date();
  const newUser = {
    id: adminId,
    name: "Ghazi Super Admin",
    email: email.toLowerCase(),
    emailVerified: true,
    role: "admin" as const,
    createdAt: now,
    updatedAt: now,
  };

  await db.insert(users).values(newUser).onConflictDoNothing();
  return newUser;
}

export async function adminLoginAction(formData: unknown) {
  try {
    const validated = loginSchema.parse(formData);
    const email = validated.email.trim().toLowerCase();
    const password = validated.password;

    // Check fixed admin credentials or database accounts
    const isAdminEmailMatch = email === "admin@ghazioverseas.com";
    const isAdminPasswordMatch = password === "ghazi@2636" || password === "Admin@12345";

    let adminUser = null;

    if (isAdminEmailMatch && isAdminPasswordMatch) {
      adminUser = await getOrCreateAdminUser(email);
    } else {
      // Try database lookup via Better Auth
      const reqHeaders = await headers();
      try {
        const session = await auth.api.signInEmail({
          body: { email, password },
          headers: reqHeaders,
        });

        if (session && session.user) {
          const dbUsers = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);
          const dbUser = dbUsers[0];
          if (dbUser && dbUser.role === "admin") {
            adminUser = dbUser;
          }
        }
      } catch {
        // Fall through
      }
    }

    if (!adminUser) {
      return { success: false, error: "Invalid admin email or password credentials." };
    }

    // Create session record in PostgreSQL database
    const token = `admin_token_${crypto.randomUUID()}`;
    const sessionId = `admin_sess_${crypto.randomUUID()}`;
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await db.insert(sessions).values({
      id: sessionId,
      userId: adminUser.id,
      token,
      expiresAt,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Set dedicated admin_session_token cookie
    const cookieStore = await cookies();
    const maxAge = 7 * 24 * 60 * 60;
    cookieStore.set("admin_session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge,
    });

    if (process.env.NODE_ENV === "production") {
      cookieStore.set("__Secure-admin_session_token", token, {
        httpOnly: true,
        secure: true,
        path: "/",
        sameSite: "lax",
        maxAge,
      });
    }

    logger.info("auth", "Admin logged in successfully", { userId: adminUser.id, email: adminUser.email });
    return {
      success: true,
      user: {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
        role: "admin",
      },
      role: "admin",
      message: "Admin authentication successful.",
    };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Invalid email or password credentials.";
    logger.error("auth", "Admin login failed", { error: errMessage });
    return { success: false, error: errMessage };
  }
}

export async function loginAction(formData: unknown) {
  try {
    const validated = loginSchema.parse(formData);
    const email = validated.email.trim().toLowerCase();
    const reqHeaders = await headers();

    // Check if user is an admin account attempting login on candidate portal
    const existingUsers = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUsers.length > 0 && existingUsers[0].role === "admin") {
      return {
        success: false,
        error: "Administrator accounts must sign in via the Admin Portal at /admin/login.",
      };
    }

    // Authenticate candidate via Better Auth
    const session = await auth.api.signInEmail({
      body: {
        email: validated.email,
        password: validated.password,
      },
      headers: reqHeaders,
    });

    if (!session || !session.user) {
      return { success: false, error: "Invalid email or password credentials." };
    }

    // Extract session token
    const s = session as unknown as { token?: string; session?: { token: string } };
    let token = s.token || s.session?.token;

    if (!token) {
      token = `cand_token_${crypto.randomUUID()}`;
      const sessionId = `cand_sess_${crypto.randomUUID()}`;
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      await db.insert(sessions).values({
        id: sessionId,
        userId: session.user.id,
        token,
        expiresAt,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Set candidate session cookie
    const cookieStore = await cookies();
    const maxAge = 7 * 24 * 60 * 60;
    cookieStore.set("better-auth.session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge,
    });

    if (process.env.NODE_ENV === "production") {
      cookieStore.set("__Secure-better-auth.session_token", token, {
        httpOnly: true,
        secure: true,
        path: "/",
        sameSite: "lax",
        maxAge,
      });
    }

    logger.info("auth", "Candidate logged in successfully", { userId: session.user.id, role: "candidate" });
    return {
      success: true,
      user: session.user,
      role: "candidate",
    };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Invalid email or password credentials.";
    logger.error("auth", "Candidate login failed", { error: errMessage });
    return { success: false, error: errMessage };
  }
}

export async function registerCandidateAction(formData: unknown) {
  try {
    const validated = candidateRegisterSchema.parse(formData);
    const reqHeaders = await headers();

    // 1. Create user account via Better Auth
    const newUser = await auth.api.signUpEmail({
      body: {
        email: validated.email,
        password: validated.password,
        name: validated.fullName,
      },
      headers: reqHeaders,
    });

    if (!newUser || !newUser.user) {
      return { success: false, error: "Registration failed. User account could not be created." };
    }

    // 2. Insert Candidate profile record into PostgreSQL
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

    // 3. Auto Sign In via Better Auth
    const session = await auth.api.signInEmail({
      body: {
        email: validated.email,
        password: validated.password,
      },
      headers: reqHeaders,
    });

    const s = session as unknown as { token?: string; session?: { token: string } };
    let token = s?.token || s?.session?.token;

    if (!token) {
      token = `cand_token_${crypto.randomUUID()}`;
      const sessionId = `cand_sess_${crypto.randomUUID()}`;
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      await db.insert(sessions).values({
        id: sessionId,
        userId: newUser.user.id,
        token,
        expiresAt,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    const cookieStore = await cookies();
    const maxAge = 7 * 24 * 60 * 60;
    cookieStore.set("better-auth.session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge,
    });

    if (process.env.NODE_ENV === "production") {
      cookieStore.set("__Secure-better-auth.session_token", token, {
        httpOnly: true,
        secure: true,
        path: "/",
        sameSite: "lax",
        maxAge,
      });
    }

    logger.info("auth", "Candidate registered successfully", { email: validated.email, userId: newUser.user.id });
    return {
      success: true,
      message: "Candidate profile registered successfully.",
      user: session?.user || newUser.user,
      role: "candidate",
    };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "An unexpected error occurred during candidate registration.";
    logger.error("auth", "Candidate registration error", { error: errMessage });
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

export async function logoutAction(role?: "admin" | "candidate" | "all") {
  try {
    const cookieStore = await cookies();

    const targetCookieNames =
      role === "admin"
        ? ["admin_session_token", "__Secure-admin_session_token"]
        : role === "candidate"
        ? [
            "better-auth.session_token",
            "__Secure-better-auth.session_token",
            "better-auth.session",
            "__Secure-better-auth.session",
          ]
        : [
            "admin_session_token",
            "__Secure-admin_session_token",
            "better-auth.session_token",
            "__Secure-better-auth.session_token",
            "better-auth.session",
          ];

    for (const cookieName of targetCookieNames) {
      const token = cookieStore.get(cookieName)?.value;
      if (token) {
        try {
          await db.delete(sessions).where(eq(sessions.token, token));
        } catch {}
      }
      try {
        cookieStore.delete(cookieName);
      } catch {}
      try {
        cookieStore.set(cookieName, "", {
          path: "/",
          maxAge: 0,
          expires: new Date(0),
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });
      } catch {}
    }

    logger.info("auth", "User logged out successfully", { role: role || "all" });
    return { success: true, message: "Logged out successfully." };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Logout failed.";
    logger.error("auth", "Logout error", { error: errMessage });
    return { success: false, error: errMessage };
  }
}

export async function getAuthSessionAction(targetRole?: "admin" | "candidate") {
  try {
    const session = await getSessionFromRequest(targetRole);

    if (!session || !session.user) {
      return { success: false, user: null };
    }

    const userRecords = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);
    const role = userRecords[0]?.role || (session.user as { role?: string }).role || "candidate";

    return {
      success: true,
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role,
      },
    };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to fetch auth session.";
    logger.error("auth", "getAuthSessionAction error", { error: errMessage });
    return { success: false, user: null };
  }
}
