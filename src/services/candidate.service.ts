import { db } from "@/lib/db";
import { candidates } from "@/db/schema/candidates";
import { eq } from "drizzle-orm";
import { logger } from "@/lib/logger";

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
      throw new Error("Database query failed while fetching candidate profile");
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
      throw new Error("Database query failed while fetching candidate");
    }
  }

  static async createCandidateProfile(data: {
    id: string;
    userId: string;
    cnic: string;
    phone: string;
    passportNumber?: string;
    countryPreference?: string;
    tradeCategory?: string;
  }) {
    try {
      const inserted = await db
        .insert(candidates)
        .values({
          id: data.id,
          userId: data.userId,
          cnic: data.cnic,
          phone: data.phone,
          passportNumber: data.passportNumber,
          countryPreference: data.countryPreference,
          tradeCategory: data.tradeCategory,
          status: "registered",
        })
        .returning();
      
      logger.info("database", "Candidate profile created", { candidateId: data.id, userId: data.userId });
      return inserted[0];
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : "Unknown database error";
      logger.error("database", "Failed to create candidate profile", { data, error: errMessage });
      throw new Error("Failed to insert candidate profile record into database");
    }
  }
}
