"use server";

import { candidateRegisterSchema, loginSchema, forgotPasswordSchema } from "@/validators/auth.schema";
import { auth } from "@/lib/auth/auth";
import { CandidateService } from "@/services/candidate.service";
import { logger } from "@/lib/logger";

export async function registerCandidateAction(formData: unknown) {
  try {
    const validated = candidateRegisterSchema.parse(formData);
    
    // Create user account via Better Auth
    const newUser = await auth.api.signUpEmail({
      body: {
        email: validated.email,
        password: validated.password,
        name: validated.fullName,
      },
    });

    if (!newUser || !newUser.user) {
      return { success: false, error: "Registration failed. User could not be created." };
    }

    // Create Candidate domain profile in database
    await CandidateService.createCandidateProfile({
      id: crypto.randomUUID(),
      userId: newUser.user.id,
      cnic: validated.cnic,
      phone: validated.phone,
    });

    logger.info("auth", "Candidate registered successfully", { email: validated.email });
    return { success: true, message: "Account created successfully. Please login." };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "An unexpected error occurred during registration.";
    logger.error("auth", "Candidate registration failed", { error: errMessage });
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
      return { success: false, error: "Invalid credentials." };
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
      message: "If an account exists with this email, password reset instructions have been sent.",
    };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Validation failed.";
    logger.error("auth", "Forgot password request error", { error: errMessage });
    return { success: false, error: errMessage };
  }
}
