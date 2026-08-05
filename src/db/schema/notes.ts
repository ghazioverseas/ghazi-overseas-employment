import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { candidates } from "./candidates";
import { users } from "./users";

export const applicationNotes = pgTable("application_notes", {
  id: text("id").primaryKey(),
  candidateId: text("candidate_id")
    .notNull()
    .references(() => candidates.id, { onDelete: "cascade" }),
  adminId: text("admin_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  adminName: text("admin_name").notNull(),
  note: text("note").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
