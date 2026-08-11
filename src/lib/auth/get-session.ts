import { cookies, headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { sessions } from "@/db/schema/users";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";
import { logger } from "@/lib/logger";

export async function getSessionFromRequest() {
  try {
    // 1. Try Better Auth's standard getSession API
    const reqHeaders = await headers();
    const session = await auth.api.getSession({
      headers: reqHeaders,
    });

    if (session && session.user) {
      return session;
    }
  } catch {
    // Fall through to cookie + database fallback
  }

  try {
    // 2. Direct Cookie + Database Session Lookup Fallback for Vercel/Next 15 proxy compatibility
    const cookieStore = await cookies();
    const token =
      cookieStore.get("better-auth.session_token")?.value ||
      cookieStore.get("__Secure-better-auth.session_token")?.value ||
      cookieStore.get("better-auth.session")?.value;

    if (!token) {
      return null;
    }

    const dbSessions = await db
      .select()
      .from(sessions)
      .where(eq(sessions.token, token))
      .limit(1);

    if (dbSessions.length === 0) {
      return null;
    }

    const sessionRecord = dbSessions[0];
    if (new Date(sessionRecord.expiresAt) <= new Date()) {
      return null;
    }

    const userRecords = await db
      .select()
      .from(users)
      .where(eq(users.id, sessionRecord.userId))
      .limit(1);

    if (userRecords.length === 0) {
      return null;
    }

    const u = userRecords[0];
    return {
      session: {
        id: sessionRecord.id,
        userId: sessionRecord.userId,
        expiresAt: sessionRecord.expiresAt,
      },
      user: {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
      },
    };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Session resolution error";
    logger.error("auth", "getSessionFromRequest error", { error: errMessage });
    return null;
  }
}
