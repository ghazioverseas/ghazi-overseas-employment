export type LogCategory = "auth" | "server" | "upload" | "database" | "validation";
export type LogLevel = "info" | "warn" | "error" | "fatal";

interface LogPayload {
  level: LogLevel;
  category: LogCategory;
  message: string;
  metadata?: Record<string, unknown>;
  userId?: string;
}

class Logger {
  private format(payload: LogPayload) {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      ...payload,
    });
  }

  public info(category: LogCategory, message: string, metadata?: Record<string, unknown>, userId?: string) {
    const payload: LogPayload = { level: "info", category, message, metadata, userId };
    console.log(this.format(payload));
  }

  public warn(category: LogCategory, message: string, metadata?: Record<string, unknown>, userId?: string) {
    const payload: LogPayload = { level: "warn", category, message, metadata, userId };
    console.warn(this.format(payload));
  }

  public error(category: LogCategory, message: string, metadata?: Record<string, unknown>, userId?: string) {
    const payload: LogPayload = { level: "error", category, message, metadata, userId };
    console.error(this.format(payload));
  }

  public fatal(category: LogCategory, message: string, metadata?: Record<string, unknown>, userId?: string) {
    const payload: LogPayload = { level: "fatal", category, message, metadata, userId };
    console.error(`[FATAL] ${this.format(payload)}`);
  }
}

export const logger = new Logger();
