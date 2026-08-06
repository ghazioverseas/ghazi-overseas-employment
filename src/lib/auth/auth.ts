import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import * as schema from "@/db/schema";

const sanitizeUrl = (rawUrl?: string): string | null => {
  if (!rawUrl) return null;
  let cleaned = rawUrl.trim().replace(/\s+/g, "");
  if (!cleaned) return null;
  if (!cleaned.startsWith("http://") && !cleaned.startsWith("https://")) {
    cleaned = `https://${cleaned}`;
  }
  try {
    const parsed = new URL(cleaned);
    return parsed.origin;
  } catch {
    return null;
  }
};

const getAuthBaseUrl = () => {
  const envUrl =
    sanitizeUrl(process.env.BETTER_AUTH_URL) ||
    sanitizeUrl(process.env.NEXT_PUBLIC_BASE_URL) ||
    sanitizeUrl(process.env.VERCEL_URL);

  if (envUrl) {
    return envUrl;
  }

  return "http://localhost:3000";
};

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "candidate",
      },
    },
  },
  secret: process.env.BETTER_AUTH_SECRET || "fallback_secret_for_build_time_only_32chars",
  baseURL: getAuthBaseUrl(),
  trustedOrigins: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://*.vercel.app",
    "https://ghazi-overseas-employment.vercel.app",
  ],
});


