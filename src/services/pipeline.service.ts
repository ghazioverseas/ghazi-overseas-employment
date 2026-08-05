import { db } from "@/lib/db";
import { jobApplications, interviews, medicals, visas, tickets } from "@/db/schema/pipeline";
import { eq, desc } from "drizzle-orm";
import { logger } from "@/lib/logger";

export class PipelineService {
  static async applyToJob(candidateId: string, jobId: string) {
    try {
      const existing = await db
        .select()
        .from(jobApplications)
        .where(eq(jobApplications.candidateId, candidateId))
        .limit(1);

      if (existing.length > 0) {
        return existing[0];
      }

      const id = `app_${Date.now()}`;
      const inserted = await db
        .insert(jobApplications)
        .values({
          id,
          jobId,
          candidateId,
          stage: "applied",
        })
        .returning();

      logger.info("database", "Job application submitted", { applicationId: id, candidateId, jobId });
      return inserted[0];
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : "Error applying to job";
      logger.error("database", "Job application failed", { error: errMessage });
      throw new Error(`Job application failed: ${errMessage}`);
    }
  }

  static async updateApplicationStage(applicationId: string, newStage: string, adminUserId: string) {
    try {
      const updated = await db
        .update(jobApplications)
        .set({
          stage: newStage as "applied" | "documents_pending" | "documents_verified" | "interview_scheduled" | "medical" | "visa_processing" | "ticket_issued" | "departure" | "completed",
          updatedAt: new Date(),
        })
        .where(eq(jobApplications.id, applicationId))
        .returning();

      logger.info("database", "Recruitment pipeline stage updated", { applicationId, newStage, adminUserId });
      return updated[0];
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : "Error updating pipeline stage";
      throw new Error(`Pipeline stage update failed: ${errMessage}`);
    }
  }

  static async scheduleInterview(data: {
    applicationId: string;
    candidateId: string;
    jobId: string;
    interviewDate: string;
    interviewTime: string;
    mode: "online" | "office" | "phone";
    location?: string;
    notes?: string;
  }) {
    try {
      const id = `int_${Date.now()}`;
      const inserted = await db
        .insert(interviews)
        .values({
          id,
          ...data,
          status: "scheduled",
        })
        .returning();

      await db
        .update(jobApplications)
        .set({ stage: "interview_scheduled", updatedAt: new Date() })
        .where(eq(jobApplications.id, data.applicationId));

      logger.info("database", "Interview scheduled", { interviewId: id, candidateId: data.candidateId });
      return inserted[0];
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : "Error scheduling interview";
      throw new Error(`Interview scheduling failed: ${errMessage}`);
    }
  }

  static async updateMedicalTracking(data: {
    applicationId: string;
    candidateId: string;
    status: "pending" | "passed" | "failed";
    medicalDate?: string;
    medicalCenter?: string;
    remarks?: string;
  }) {
    try {
      const id = `med_${Date.now()}`;
      const inserted = await db
        .insert(medicals)
        .values({
          id,
          ...data,
        })
        .returning();

      await db
        .update(jobApplications)
        .set({ stage: "medical", updatedAt: new Date() })
        .where(eq(jobApplications.id, data.applicationId));

      logger.info("database", "Medical tracking recorded", { candidateId: data.candidateId, status: data.status });
      return inserted[0];
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : "Error updating medical tracking";
      throw new Error(`Medical tracking failed: ${errMessage}`);
    }
  }

  static async updateVisaTracking(data: {
    applicationId: string;
    candidateId: string;
    status: "pending" | "submitted" | "approved" | "rejected";
    visaNumber?: string;
    issueDate?: string;
    expiryDate?: string;
    remarks?: string;
  }) {
    try {
      const id = `visa_${Date.now()}`;
      const inserted = await db
        .insert(visas)
        .values({
          id,
          ...data,
        })
        .returning();

      await db
        .update(jobApplications)
        .set({ stage: "visa_processing", updatedAt: new Date() })
        .where(eq(jobApplications.id, data.applicationId));

      logger.info("database", "Visa status recorded", { candidateId: data.candidateId, status: data.status });
      return inserted[0];
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : "Error updating visa status";
      throw new Error(`Visa tracking failed: ${errMessage}`);
    }
  }

  static async issueTicket(data: {
    applicationId: string;
    candidateId: string;
    airline: string;
    flightNumber?: string;
    departureDate?: string;
    departureAirport?: string;
    arrivalAirport?: string;
    pnr?: string;
    seat?: string;
    ticketPdfKey?: string;
  }) {
    try {
      const id = `tkt_${Date.now()}`;
      const inserted = await db
        .insert(tickets)
        .values({
          id,
          ...data,
        })
        .returning();

      await db
        .update(jobApplications)
        .set({ stage: "ticket_issued", updatedAt: new Date() })
        .where(eq(jobApplications.id, data.applicationId));

      logger.info("database", "Flight ticket issued", { candidateId: data.candidateId, pnr: data.pnr });
      return inserted[0];
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : "Error issuing flight ticket";
      throw new Error(`Ticket issuance failed: ${errMessage}`);
    }
  }

  static async getCandidatePipelineDetails(candidateId: string) {
    try {
      const application = await db
        .select()
        .from(jobApplications)
        .where(eq(jobApplications.candidateId, candidateId))
        .orderBy(desc(jobApplications.createdAt))
        .limit(1);

      const appRecord = application[0] || null;

      if (!appRecord) {
        return {
          stage: "applied",
          interview: null,
          medical: null,
          visa: null,
          ticket: null,
        };
      }

      const [interviewRes, medicalRes, visaRes, ticketRes] = await Promise.all([
        db.select().from(interviews).where(eq(interviews.applicationId, appRecord.id)).limit(1),
        db.select().from(medicals).where(eq(medicals.applicationId, appRecord.id)).limit(1),
        db.select().from(visas).where(eq(visas.applicationId, appRecord.id)).limit(1),
        db.select().from(tickets).where(eq(tickets.applicationId, appRecord.id)).limit(1),
      ]);

      return {
        application: appRecord,
        stage: appRecord.stage,
        interview: interviewRes[0] || null,
        medical: medicalRes[0] || null,
        visa: visaRes[0] || null,
        ticket: ticketRes[0] || null,
      };
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : "Error fetching candidate pipeline";
      logger.error("database", "Failed to fetch candidate pipeline", { candidateId, error: errMessage });
      return {
        stage: "applied",
        interview: null,
        medical: null,
        visa: null,
        ticket: null,
      };
    }
  }
}
