import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { sessions, users } from "@/db/schema/users";
import { eq } from "drizzle-orm";
import { logger } from "@/lib/logger";

export async function getSessionFromRequest(targetRole?: "admin" | "candidate") {
  try {
    const cookieStore = await cookies();
    let token: string | undefined;

    if (targetRole === "admin") {
      // Admin lookup strictly checks admin_session_token
      token =
        cookieStore.get("admin_session_token")?.value ||
        cookieStore.get("__Secure-admin_session_token")?.value;
    } else if (targetRole === "candidate") {
      // Candidate lookup strictly checks candidate session cookies
      token =
        cookieStore.get("better-auth.session_token")?.value ||
        cookieStore.get("__Secure-better-auth.session_token")?.value ||
        cookieStore.get("better-auth.session")?.value;
    } else {
      // Unspecified: try admin_session_token first, then candidate token
      token =
        cookieStore.get("admin_session_token")?.value ||
        cookieStore.get("__Secure-admin_session_token")?.value ||
        cookieStore.get("better-auth.session_token")?.value ||
        cookieStore.get("__Secure-better-auth.session_token")?.value ||
        cookieStore.get("better-auth.session")?.value;
    }

    if (!token) {
      return null;
    }

    // Direct Database Session Lookup
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

    // Enforce strict role isolation
    if (targetRole === "admin" && u.role !== "admin") {
      return null;
    }
    if (targetRole === "candidate" && u.role === "admin") {
      return null;
    }

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
