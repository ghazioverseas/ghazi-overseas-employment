import { z } from "zod";

export const documentTypeSchema = z.enum([
  "passport",
  "cnic_front",
  "cnic_back",
  "cv",
  "medical_report",
  "experience_certificate",
  "degree_diploma",
  "photo",
]);

export const documentUploadSchema = z.object({
  candidateId: z.string().min(1, "Candidate ID is required"),
  documentType: documentTypeSchema,
  originalFileName: z.string().min(1, "File name is required"),
  mimeType: z.string().refine(
    (mime) => ["application/pdf", "image/jpeg", "image/png", "image/webp"].includes(mime),
    "Invalid MIME type. Only PDF, JPG, PNG, and WebP files are allowed."
  ),
  fileSize: z.number().max(10 * 1024 * 1024, "File size must not exceed 10MB"),
});

export type DocumentUploadInput = z.infer<typeof documentUploadSchema>;
