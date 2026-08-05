import { z } from "zod";

export const paymentProofSchema = z.object({
  candidateId: z.string().min(1, "Candidate ID is required"),
  transactionRef: z.string().min(3, "Transaction reference number or TID is required"),
  paymentMethod: z.enum(["bank_transfer", "easypaisa", "jazzcash"]),
  paymentProofKey: z.string().optional(),
});

export type PaymentProofInput = z.infer<typeof paymentProofSchema>;
