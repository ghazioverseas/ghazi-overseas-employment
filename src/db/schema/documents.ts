import { pgTable, text, timestamp, integer, pgEnum, index } from "drizzle-orm/pg-core";
import { candidates } from "./candidates";

export const documentTypeEnum = pgEnum("document_type", [
  "passport",
  "cnic_front",
  "cnic_back",
  "cv",
  "medical_report",
  "experience_certificate",
  "degree_diploma",
  "photo",
]);

export const verificationStatusEnum = pgEnum("verification_status", [
  "pending",
  "verified",
  "rejected",
]);

export const documents = pgTable(
  "documents",
  {
    id: text("id").primaryKey(),
    candidateId: text("candidate_id")
      .notNull()
      .references(() => candidates.id, { onDelete: "cascade" }),
    documentType: documentTypeEnum("document_type").notNull(),
    originalFileName: text("original_file_name").notNull(),
    storageKey: text("storage_key").notNull().unique(),
    mimeType: text("mime_type").notNull(),
    fileSize: integer("file_size").notNull(),
    fileData: text("file_data"),
    uploadDate: timestamp("upload_date").defaultNow().notNull(),
    verificationStatus: verificationStatusEnum("verification_status")
      .default("pending")
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    candidateIdx: index("doc_candidate_idx").on(table.candidateId),
    storageKeyIdx: index("doc_storage_key_idx").on(table.storageKey),
    typeIdx: index("doc_type_idx").on(table.documentType),
  })
);
