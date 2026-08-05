import { pgTable, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { users } from "./users";

export const candidateStatusEnum = pgEnum("candidate_status", [
  "registered",
  "profile_incomplete",
  "documents_pending",
  "under_review",
  "verified",
  "shortlisted",
  "rejected",
]);

export const candidates = pgTable("candidates", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  cnic: text("cnic").notNull().unique(),
  passportNumber: text("passport_number").unique(),
  phone: text("phone").notNull(),
  countryPreference: text("country_preference"),
  tradeCategory: text("trade_category"),
  status: candidateStatusEnum("status").default("registered").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
