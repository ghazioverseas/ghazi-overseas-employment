import { db } from "@/lib/db";
import { systemLogs } from "@/db/schema/logs";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";
import { LogCategory, LogLevel } from "@/lib/logger";

export class LogService {
  private static async getValidUserId(userId?: string): Promise<string | null> {
    if (!userId) return null;
    try {
      const userRes = await db.select({ id: users.id }).from(users).where(eq(users.id, userId)).limit(1);
      if (userRes.length > 0) return userRes[0].id;
      return null;
    } catch {
      return null;
    }
  }

  static async recordLog(
    level: LogLevel,
    category: LogCategory,
    message: string,
    metadata?: Record<string, unknown>,
    userId?: string
  ) {
    try {
      const validUserId = await this.getValidUserId(userId);

      await db.insert(systemLogs).values({
        id: crypto.randomUUID(),
        level,
        category,
        message,
        metadata: metadata || null,
        userId: validUserId,
      });
    } catch (error) {
      console.error("[LOG_SERVICE_ERROR] Failed to persist system log to PostgreSQL database", error);
    }
  }
}
