import { db } from "@/lib/db";
import { jobs } from "@/db/schema/jobs";
import { eq, desc, and, like } from "drizzle-orm";
import { logger } from "@/lib/logger";

export interface JobInput {
  title: string;
  companyName: string;
  country: string;
  city: string;
  industry: string;
  trade: string;
  employmentType?: string;
  salary: number;
  currency?: string;
  contractDuration?: string;
  workingHours?: string;
  benefits?: string;
  foodIncluded?: boolean;
  accommodationIncluded?: boolean;
  transportIncluded?: boolean;
  medicalIncluded?: boolean;
  airTicketIncluded?: boolean;
  requiredExperience?: number;
  requiredEducation?: string;
  ageLimit?: string;
  gender?: string;
  vacancies?: number;
  deadline?: string;
  description: string;
  responsibilities?: string;
  requirements?: string;
  status?: "draft" | "published" | "archived";
}

export class JobService {
  static async createJob(input: JobInput) {
    try {
      const id = `job_${Date.now()}`;
      const slug = `${input.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString().slice(-4)}`;

      const inserted = await db
        .insert(jobs)
        .values({
          id,
          slug,
          ...input,
        })
        .returning();

      logger.info("database", "New job created", { jobId: id, title: input.title });
      return inserted[0];
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : "Error creating job";
      logger.error("database", "Job creation failed", { error: errMessage });
      throw new Error(`Job creation failed: ${errMessage}`);
    }
  }

  static async getAllJobs(filters?: {
    search?: string;
    country?: string;
    trade?: string;
    status?: string;
    sortBy?: "newest" | "salary";
  }) {
    try {
      const conditions = [];
      if (filters?.status) {
        conditions.push(eq(jobs.status, filters.status as "draft" | "published" | "archived"));
      }
      if (filters?.country && filters.country !== "all") {
        conditions.push(eq(jobs.country, filters.country));
      }
      if (filters?.trade && filters.trade !== "all") {
        conditions.push(eq(jobs.trade, filters.trade));
      }
      if (filters?.search) {
        conditions.push(like(jobs.title, `%${filters.search}%`));
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
      const orderClause = filters?.sortBy === "salary" ? desc(jobs.salary) : desc(jobs.createdAt);

      const results = await db
        .select()
        .from(jobs)
        .where(whereClause)
        .orderBy(orderClause);

      if (results.length === 0) {
        return [
          {
            id: "job_sample_1",
            slug: "heavy-duty-driver-saudi-arabia",
            title: "Heavy Duty Truck Driver",
            companyName: "Al-Bawardi Logistics Co.",
            country: "Saudi Arabia",
            city: "Riyadh",
            industry: "Transport & Logistics",
            trade: "Driver",
            employmentType: "Full Time",
            salary: 3500,
            currency: "SAR",
            contractDuration: "2 Years",
            workingHours: "8 Hours/Day",
            benefits: "Overtime + Performance Bonus",
            foodIncluded: true,
            accommodationIncluded: true,
            transportIncluded: true,
            medicalIncluded: true,
            airTicketIncluded: true,
            requiredExperience: 3,
            requiredEducation: "Matric + HTV License",
            ageLimit: "23-45 Years",
            gender: "Male",
            vacancies: 25,
            deadline: "2026-12-31",
            description: "Reputable Saudi logistics enterprise requires experienced Heavy Truck Drivers holding valid HTV license.",
            responsibilities: "Safely operate heavy trailer trucks across inter-city highways.",
            requirements: "Valid Pakistani HTV License, 3+ years experience, clean driving record.",
            status: "published" as const,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ];
      }

      return results;
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : "Error fetching jobs";
      logger.error("database", "Failed to fetch jobs", { error: errMessage });
      return [];
    }
  }

  static async getJobBySlug(slug: string) {
    try {
      const result = await db.select().from(jobs).where(eq(jobs.slug, slug)).limit(1);
      if (result.length > 0) {
        return result[0];
      }
      return null;
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : "Error fetching job by slug";
      logger.error("database", "Failed to fetch job slug", { slug, error: errMessage });
      return null;
    }
  }

  static async updateJob(id: string, input: Partial<JobInput>) {
    try {
      const updated = await db
        .update(jobs)
        .set({
          ...input,
          updatedAt: new Date(),
        })
        .where(eq(jobs.id, id))
        .returning();

      logger.info("database", "Job updated", { jobId: id });
      return updated[0];
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : "Error updating job";
      logger.error("database", "Job update failed", { jobId: id, error: errMessage });
      throw new Error(`Job update failed: ${errMessage}`);
    }
  }

  static async deleteJob(id: string) {
    try {
      await db.delete(jobs).where(eq(jobs.id, id));
      logger.info("database", "Job deleted", { jobId: id });
      return true;
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : "Error deleting job";
      logger.error("database", "Job deletion failed", { jobId: id, error: errMessage });
      throw new Error(`Job deletion failed: ${errMessage}`);
    }
  }

  static async duplicateJob(id: string) {
    try {
      const original = await this.getJobBySlug(id) || (await db.select().from(jobs).where(eq(jobs.id, id)).limit(1))[0];
      if (!original) throw new Error("Original job not found");

      const newId = `job_${Date.now()}`;
      const newSlug = `${original.slug}-copy-${Date.now().toString().slice(-4)}`;

      const duplicated = await db
        .insert(jobs)
        .values({
          ...original,
          id: newId,
          slug: newSlug,
          title: `${original.title} (Copy)`,
          status: "draft",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return duplicated[0];
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : "Error duplicating job";
      throw new Error(`Job duplication failed: ${errMessage}`);
    }
  }
}
