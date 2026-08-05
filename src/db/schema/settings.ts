import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";

export const adminSettings = pgTable("admin_settings", {
  id: text("id").primaryKey(),
  bankName: text("bank_name").default("Meezan Bank Limited").notNull(),
  accountTitle: text("account_title").default("Ghazi Overseas Employment Pakistan").notNull(),
  accountNumber: text("account_number").default("0102030405060708").notNull(),
  iban: text("iban").default("PK36MEZN0001020304050607").notNull(),
  easypaisaNumber: text("easypaisa_number").default("03001234567").notNull(),
  easypaisaTitle: text("easypaisa_title").default("Ghazi Overseas Employment").notNull(),
  jazzcashNumber: text("jazzcash_number").default("03011234567").notNull(),
  jazzcashTitle: text("jazzcash_title").default("Ghazi Overseas Employment").notNull(),
  submissionFee: integer("submission_fee").default(500).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
