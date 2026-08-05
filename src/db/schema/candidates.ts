import { pgTable, text, timestamp, integer, pgEnum } from "drizzle-orm/pg-core";
import { users } from "./users";

export const candidateStatusEnum = pgEnum("candidate_status", [
  "registered",
  "profile_incomplete",
  "documents_pending",
  "awaiting_payment_verification",
  "under_review",
  "verified",
  "approved",
  "rejected",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending_payment",
  "payment_under_review",
  "approved",
  "rejected",
]);

export const candidates = pgTable("candidates", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  fullName: text("full_name").notNull(),
  fatherName: text("father_name"),
  cnic: text("cnic").notNull().unique(),
  passportNumber: text("passport_number").unique(),
  dateOfBirth: text("date_of_birth"),
  gender: text("gender"),
  phone: text("phone").notNull(),
  whatsapp: text("whatsapp"),
  address: text("address"),
  city: text("city"),
  province: text("province"),
  country: text("country").default("Pakistan"),
  profession: text("profession"),
  yearsOfExperience: integer("years_of_experience").default(0),
  education: text("education"),
  status: candidateStatusEnum("status").default("registered").notNull(),
  paymentStatus: paymentStatusEnum("payment_status").default("pending_payment").notNull(),
  transactionRef: text("transaction_ref"),
  paymentProofKey: text("payment_proof_key"),
  submissionFee: integer("submission_fee").default(500).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
