import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

export const candidateRegisterSchema = z
  .object({
    fullName: z.string().min(3, "Full name must be at least 3 characters long"),
    fatherName: z.string().min(3, "Father's name is required"),
    cnic: z.string().regex(/^\d{5}-\d{7}-\d{1}$/, "CNIC must follow format 12345-1234567-1"),
    passportNumber: z.string().optional(),
    noPassport: z.boolean().optional(),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    gender: z.enum(["Male", "Female", "Other"], { required_error: "Gender selection is required" }),
    phone: z.string().regex(/^(\+92|03)\d{9}$/, "Valid Pakistani phone number required (e.g. 03001234567)"),
    whatsapp: z.string().regex(/^(\+92|03)\d{9}$/, "Valid WhatsApp number required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string(),
    address: z.string().min(5, "Residential address is required"),
    city: z.string().min(2, "City is required"),
    province: z.string().min(2, "Province is required"),
    country: z.string().default("Pakistan"),
    profession: z.string().min(2, "Profession / Trade category is required"),
    yearsOfExperience: z.coerce.number().min(0, "Years of experience is required"),
    education: z.string().min(2, "Education level is required"),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
    if (!data.noPassport && (!data.passportNumber || data.passportNumber.trim() === "")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passport number is required (or check 'I don't have a passport')",
        path: ["passportNumber"],
      });
    }
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type CandidateRegisterInput = z.infer<typeof candidateRegisterSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
