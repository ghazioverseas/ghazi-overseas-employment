import { db } from "@/lib/db";
import { systemLogs } from "@/db/schema/logs";
import { LogCategory, LogLevel } from "@/lib/logger";

export class LogService {
  static async recordLog(
    level: LogLevel,
    category: LogCategory,
    message: string,
    metadata?: Record<string, unknown>,
    userId?: string
  ) {
    try {
      await db.insert(systemLogs).values({
        id: crypto.randomUUID(),
        level,
        category,
        message,
        metadata: metadata || null,
        userId: userId || null,
      });
    } catch (error) {
      console.error("[LOG_SERVICE_ERROR] Failed to persist system log to PostgreSQL database", error);
    }
  }
}
