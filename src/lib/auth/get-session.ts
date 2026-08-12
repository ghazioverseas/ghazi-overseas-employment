import { cookies, headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { sessions, users } from "@/db/schema/users";
import { eq } from "drizzle-orm";
import { logger } from "@/lib/logger";

export async function getSessionFromRequest(targetRole?: "admin" | "candidate") {
  try {
    const cookieStore = await cookies();
    let token: string | undefined;

    if (targetRole === "admin") {
      token =
        cookieStore.get("admin_session_token")?.value ||
        cookieStore.get("__Secure-admin_session_token")?.value;
    } else if (targetRole === "candidate") {
      token =
        cookieStore.get("better-auth.session_token")?.value ||
        cookieStore.get("__Secure-better-auth.session_token")?.value ||
        cookieStore.get("better-auth.session")?.value;
    } else {
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

    // 1. Try Better Auth API if header matches
    try {
      const customHeaders = new Headers(await headers());
      customHeaders.set("cookie", `better-auth.session_token=${token}`);
      const session = await auth.api.getSession({
        headers: customHeaders,
      });

      if (session && session.user) {
        const role = (session.user as { role?: string }).role || "candidate";
        if (targetRole === "admin" && role !== "admin") {
          // Token belongs to non-admin
        } else if (targetRole === "candidate" && role === "admin") {
          // Token belongs to admin
        } else {
          return session;
        }
      }
    } catch {
      // Fall through to database lookup
    }

    // 2. Direct Cookie + Database Session Lookup Fallback
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
