import { db } from "@/lib/db";
import { candidates } from "@/db/schema/candidates";
import { eq } from "drizzle-orm";
import { logger } from "@/lib/logger";
import { CandidateStatus, VerificationStatus } from "@/types";

export class CandidateService {
  static async getCandidateByUserId(userId: string) {
    try {
      const result = await db
        .select()
        .from(candidates)
        .where(eq(candidates.userId, userId))
        .limit(1);
      return result[0] || null;
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : "Unknown database error";
      logger.error("database", "Failed to fetch candidate profile by user ID", { userId, error: errMessage });
      return null;
    }
  }

  static async getCandidateById(candidateId: string) {
    try {
      const result = await db
        .select()
        .from(candidates)
        .where(eq(candidates.id, candidateId))
        .limit(1);
      return result[0] || null;
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : "Unknown database error";
      logger.error("database", "Failed to fetch candidate profile by ID", { candidateId, error: errMessage });
      return null;
    }
  }

  static async createCandidateProfile(data: {
    id: string;
    userId: string;
    fullName: string;
    fatherName?: string;
    cnic: string;
    passportNumber?: string;
    dateOfBirth?: string;
    gender?: string;
    phone: string;
    whatsapp?: string;
    address?: string;
    city?: string;
    province?: string;
    country?: string;
    profession?: string;
    yearsOfExperience?: number;
    education?: string;
  }) {
    try {
      const inserted = await db
        .insert(candidates)
        .values({
          id: data.id,
          userId: data.userId,
          fullName: data.fullName,
          fatherName: data.fatherName,
          cnic: data.cnic,
          passportNumber: data.passportNumber,
          dateOfBirth: data.dateOfBirth,
          gender: data.gender,
          phone: data.phone,
          whatsapp: data.whatsapp,
          address: data.address,
          city: data.city,
          province: data.province,
          country: data.country || "Pakistan",
          profession: data.profession,
          yearsOfExperience: data.yearsOfExperience || 0,
          education: data.education,
          status: "registered",
          paymentStatus: "pending_payment",
          submissionFee: 500,
        })
        .returning();
      
      logger.info("database", "Full candidate profile created", { candidateId: data.id, userId: data.userId });
      return inserted[0];
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : "Unknown database error";
      logger.error("database", "Failed to create full candidate profile", { data, error: errMessage });
      throw new Error(`Failed to insert candidate record: ${errMessage}`);
    }
  }

  static async updatePaymentSubmission(candidateId: string, transactionRef: string, proofKey?: string) {
    try {
      const updated = await db
        .update(candidates)
        .set({
          paymentStatus: "payment_under_review",
          status: "awaiting_payment_verification",
          transactionRef,
          paymentProofKey: proofKey || null,
          updatedAt: new Date(),
        })
        .where(eq(candidates.id, candidateId))
        .returning();

      logger.info("database", "Candidate submitted payment proof", { candidateId, transactionRef });
      return updated[0];
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : "Unknown database error";
      logger.error("database", "Failed to update candidate payment status", { candidateId, error: errMessage });
      throw new Error(`Failed to submit payment proof: ${errMessage}`);
    }
  }

  static async updateCandidateStatus(candidateId: string, status: CandidateStatus, paymentStatus?: VerificationStatus) {
    try {
      const payload: Record<string, unknown> = { status, updatedAt: new Date() };
      if (paymentStatus) {
        payload.paymentStatus = paymentStatus;
      }

      const updated = await db
        .update(candidates)
        .set(payload)
        .where(eq(candidates.id, candidateId))
        .returning();

      return updated[0];
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : "Unknown database error";
      logger.error("database", "Failed to update candidate status", { candidateId, status, error: errMessage });
      throw new Error(`Failed to update candidate status: ${errMessage}`);
    }
  }

  static async updateCandidateProfileByUserId(userId: string, data: {
    fullName?: string;
    fatherName?: string;
    cnic?: string;
    passportNumber?: string;
    dateOfBirth?: string;
    gender?: string;
    phone?: string;
    whatsapp?: string;
    address?: string;
    city?: string;
    province?: string;
    country?: string;
    profession?: string;
    yearsOfExperience?: number;
    education?: string;
  }) {
    try {
      const payload: Record<string, unknown> = {
        updatedAt: new Date(),
      };
      if (data.fullName !== undefined) payload.fullName = data.fullName;
      if (data.fatherName !== undefined) payload.fatherName = data.fatherName;
      if (data.cnic !== undefined) payload.cnic = data.cnic;
      if (data.passportNumber !== undefined) payload.passportNumber = data.passportNumber;
      if (data.dateOfBirth !== undefined) payload.dateOfBirth = data.dateOfBirth;
      if (data.gender !== undefined) payload.gender = data.gender;
      if (data.phone !== undefined) payload.phone = data.phone;
      if (data.whatsapp !== undefined) payload.whatsapp = data.whatsapp;
      if (data.address !== undefined) payload.address = data.address;
      if (data.city !== undefined) payload.city = data.city;
      if (data.province !== undefined) payload.province = data.province;
      if (data.country !== undefined) payload.country = data.country;
      if (data.profession !== undefined) payload.profession = data.profession;
      if (data.yearsOfExperience !== undefined) payload.yearsOfExperience = data.yearsOfExperience;
      if (data.education !== undefined) payload.education = data.education;

      const updated = await db
        .update(candidates)
        .set(payload)
        .where(eq(candidates.userId, userId))
        .returning();

      return updated[0] || null;
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : "Unknown database error";
      logger.error("database", "Failed to update candidate profile by user ID", { userId, error: errMessage });
      throw new Error(`Failed to update candidate profile: ${errMessage}`);
    }
  }
}
