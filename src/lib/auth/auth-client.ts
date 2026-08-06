import { createAuthClient } from "better-auth/react";

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

const getBaseUrl = () => {
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  const envUrl =
    sanitizeUrl(process.env.NEXT_PUBLIC_BASE_URL) ||
    sanitizeUrl(process.env.VERCEL_URL);

  if (envUrl) {
    return envUrl;
  }

  return "http://localhost:3000";
};

export const authClient = createAuthClient({
  baseURL: getBaseUrl(),
});

export const { useSession, signIn, signUp, signOut } = authClient;


