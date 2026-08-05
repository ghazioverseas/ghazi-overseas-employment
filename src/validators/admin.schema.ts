import { z } from "zod";

export const adminSettingsSchema = z.object({
  companyName: z.string().min(3, "Company name is required"),
  companyWebsite: z.string().url("Invalid website URL"),
  companyAddress: z.string().min(5, "Address is required"),
  companyPhone: z.string().min(5, "Phone is required"),
  companyEmail: z.string().email("Invalid email address"),
  submissionFee: z.coerce.number().min(0, "Submission fee must be 0 or greater"),
  isSubmissionFeeEnabled: z.boolean(),
  bankName: z.string().min(2, "Bank name is required"),
  accountTitle: z.string().min(2, "Account title is required"),
  accountNumber: z.string().min(5, "Account number is required"),
  iban: z.string().min(5, "IBAN is required"),
  showBank: z.boolean(),
  easypaisaTitle: z.string().min(2, "EasyPaisa title is required"),
  easypaisaNumber: z.string().min(5, "EasyPaisa number is required"),
  showEasypaisa: z.boolean(),
  jazzcashTitle: z.string().min(2, "JazzCash title is required"),
  jazzcashNumber: z.string().min(5, "JazzCash number is required"),
  showJazzcash: z.boolean(),
  autoDeleteDays: z.coerce.number().min(1, "Auto delete days must be at least 1"),
  maxUploadSizeMb: z.coerce.number().min(1, "Max upload size must be at least 1MB"),
});

export const createAdminUserSchema = z.object({
  fullName: z.string().min(3, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  role: z.enum(["admin", "candidate"]).default("admin"),
});

export type AdminSettingsInput = z.infer<typeof adminSettingsSchema>;
export type CreateAdminUserInput = z.infer<typeof createAdminUserSchema>;
