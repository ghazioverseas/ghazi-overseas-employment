import { pgTable, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { jobs } from "./jobs";
import { candidates } from "./candidates";

export const pipelineStageEnum = pgEnum("pipeline_stage", [
  "applied",
  "documents_pending",
  "documents_verified",
  "interview_scheduled",
  "medical",
  "visa_processing",
  "ticket_issued",
  "departure",
  "completed",
]);

export const interviewModeEnum = pgEnum("interview_mode", ["online", "office", "phone"]);
export const interviewStatusEnum = pgEnum("interview_status", ["scheduled", "completed", "cancelled", "passed", "failed"]);
export const medicalStatusEnum = pgEnum("medical_status", ["pending", "passed", "failed"]);
export const visaStatusEnum = pgEnum("visa_status", ["pending", "submitted", "approved", "rejected"]);

export const jobApplications = pgTable("job_applications", {
  id: text("id").primaryKey(),
  jobId: text("job_id")
    .notNull()
    .references(() => jobs.id, { onDelete: "cascade" }),
  candidateId: text("candidate_id")
    .notNull()
    .references(() => candidates.id, { onDelete: "cascade" }),
  stage: pipelineStageEnum("stage").default("applied").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const interviews = pgTable("interviews", {
  id: text("id").primaryKey(),
  applicationId: text("application_id")
    .notNull()
    .references(() => jobApplications.id, { onDelete: "cascade" }),
  candidateId: text("candidate_id")
    .notNull()
    .references(() => candidates.id, { onDelete: "cascade" }),
  jobId: text("job_id")
    .notNull()
    .references(() => jobs.id, { onDelete: "cascade" }),
  interviewDate: text("interview_date").notNull(),
  interviewTime: text("interview_time").notNull(),
  mode: interviewModeEnum("mode").default("office").notNull(),
  location: text("location").default("Ghazi Overseas Head Office, Karachi"),
  notes: text("notes"),
  status: interviewStatusEnum("status").default("scheduled").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const medicals = pgTable("medicals", {
  id: text("id").primaryKey(),
  applicationId: text("application_id")
    .notNull()
    .references(() => jobApplications.id, { onDelete: "cascade" }),
  candidateId: text("candidate_id")
    .notNull()
    .references(() => candidates.id, { onDelete: "cascade" }),
  status: medicalStatusEnum("status").default("pending").notNull(),
  medicalDate: text("medical_date"),
  medicalCenter: text("medical_center").default("GAMCA Approved Medical Center"),
  remarks: text("remarks"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const visas = pgTable("visas", {
  id: text("id").primaryKey(),
  applicationId: text("application_id")
    .notNull()
    .references(() => jobApplications.id, { onDelete: "cascade" }),
  candidateId: text("candidate_id")
    .notNull()
    .references(() => candidates.id, { onDelete: "cascade" }),
  status: visaStatusEnum("status").default("pending").notNull(),
  visaNumber: text("visa_number"),
  issueDate: text("issue_date"),
  expiryDate: text("expiry_date"),
  remarks: text("remarks"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const tickets = pgTable("tickets", {
  id: text("id").primaryKey(),
  applicationId: text("application_id")
    .notNull()
    .references(() => jobApplications.id, { onDelete: "cascade" }),
  candidateId: text("candidate_id")
    .notNull()
    .references(() => candidates.id, { onDelete: "cascade" }),
  airline: text("airline").default("PIA / Saudi Arabian Airlines"),
  flightNumber: text("flight_number"),
  departureDate: text("departure_date"),
  departureAirport: text("departure_airport").default("Karachi (KHI)"),
  arrivalAirport: text("arrival_airport").default("Riyadh (RUH)"),
  pnr: text("pnr"),
  seat: text("seat"),
  ticketPdfKey: text("ticket_pdf_key"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
