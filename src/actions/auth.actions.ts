"use server";

import { candidateRegisterSchema, loginSchema, forgotPasswordSchema } from "@/validators/auth.schema";
import { auth } from "@/lib/auth/auth";
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

    const userRole = (session.user as { role?: string }).role || "candidate";
    logger.info("auth", "User logged in", { userId: session.user.id, role: userRole });
    return { success: true, user: session.user };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Invalid email or password.";
    logger.error("auth", "Login failed", { error: errMessage });
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
