import { db } from "@/lib/db";
import { cmsSections, contactSubmissions, announcements, notifications } from "@/db/schema/cms";
import { jobs } from "@/db/schema/jobs";
import { candidates } from "@/db/schema/candidates";
import { systemLogs } from "@/db/schema/logs";
import { eq, desc, like, or } from "drizzle-orm";
import { logger } from "@/lib/logger";

export class CmsService {
  static async getCmsSection(sectionKey: string) {
    try {
      const res = await db.select().from(cmsSections).where(eq(cmsSections.sectionKey, sectionKey)).limit(1);
      return res[0] || null;
    } catch {
      return null;
    }
  }

  static async updateCmsSection(sectionKey: string, title: string, subtitle: string, content: Record<string, unknown>) {
    try {
      const id = `cms_${sectionKey}`;
      const existing = await this.getCmsSection(sectionKey);

      if (existing) {
        await db
          .update(cmsSections)
          .set({ title, subtitle, content, updatedAt: new Date() })
          .where(eq(cmsSections.sectionKey, sectionKey));
      } else {
        await db.insert(cmsSections).values({
          id,
          sectionKey,
          title,
          subtitle,
          content,
        });
      }

      logger.info("database", "CMS section updated", { sectionKey });
      return true;
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : "CMS error";
      throw new Error(`CMS update failed: ${errMessage}`);
    }
  }

  static async submitContactForm(data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }) {
    try {
      const id = `contact_${Date.now()}`;
      const inserted = await db
        .insert(contactSubmissions)
        .values({
          id,
          ...data,
          status: "new",
        })
        .returning();

      logger.info("database", "Contact form submitted", { contactId: id, email: data.email });
      return inserted[0];
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : "Contact submission error";
      throw new Error(`Contact submission failed: ${errMessage}`);
    }
  }

  static async getAllContactSubmissions() {
    try {
      return await db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt));
    } catch {
      return [];
    }
  }

  static async replyToContactSubmission(id: string, replyMessage: string) {
    try {
      const updated = await db
        .update(contactSubmissions)
        .set({
          status: "replied",
          replyMessage,
          updatedAt: new Date(),
        })
        .where(eq(contactSubmissions.id, id))
        .returning();

      logger.info("database", "Replied to contact inquiry", { contactId: id });
      return updated[0];
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : "Reply error";
      throw new Error(`Reply failed: ${errMessage}`);
    }
  }

  static async createAnnouncement(data: {
    title: string;
    content: string;
    targetAudience?: string;
    isImportant?: boolean;
  }) {
    try {
      const id = `ann_${Date.now()}`;
      const inserted = await db
        .insert(announcements)
        .values({
          id,
          ...data,
        })
        .returning();

      logger.info("database", "Announcement published", { announcementId: id });
      return inserted[0];
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : "Announcement error";
      throw new Error(`Announcement creation failed: ${errMessage}`);
    }
  }

  static async getAllAnnouncements() {
    try {
      return await db.select().from(announcements).orderBy(desc(announcements.createdAt));
    } catch {
      return [
        {
          id: "ann_1",
          title: "GAMCA Medical Center Update for Saudi Arabia Applicants",
          content: "All candidates deploying to Saudi Arabia must complete biometric registration at approved GAMCA centers.",
          targetAudience: "all",
          isImportant: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
    }
  }

  static async createNotification(data: {
    userId: string;
    title: string;
    message: string;
    type?: string;
    link?: string;
  }) {
    try {
      const id = `notif_${Date.now()}`;
      await db.insert(notifications).values({
        id,
        ...data,
      });
      return true;
    } catch {
      return false;
    }
  }

  static async getUserNotifications(userId: string) {
    try {
      return await db
        .select()
        .from(notifications)
        .where(eq(notifications.userId, userId))
        .orderBy(desc(notifications.createdAt))
        .limit(20);
    } catch {
      return [];
    }
  }

  static async performGlobalSearch(queryStr: string) {
    if (!queryStr || queryStr.trim().length < 2) {
      return { candidates: [], jobs: [], logs: [] };
    }

    const q = `%${queryStr.trim()}%`;
    try {
      const [candidateResults, jobResults, logResults] = await Promise.all([
        db
          .select()
          .from(candidates)
          .where(or(like(candidates.fullName, q), like(candidates.cnic, q), like(candidates.phone, q)))
          .limit(5),
        db
          .select()
          .from(jobs)
          .where(or(like(jobs.title, q), like(jobs.companyName, q), like(jobs.country, q)))
          .limit(5),
        db
          .select()
          .from(systemLogs)
          .where(or(like(systemLogs.message, q), like(systemLogs.category, q)))
          .limit(5),
      ]);

      return {
        candidates: candidateResults,
        jobs: jobResults,
        logs: logResults,
      };
    } catch {
      return { candidates: [], jobs: [], logs: [] };
    }
  }
}
