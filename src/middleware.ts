import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected route prefixes
  const isAdminRoute = pathname.startsWith("/admin");
  const isCandidateRoute = pathname.startsWith("/candidate");

  // Read Better Auth session token cookie
  const sessionToken = request.cookies.get("better-auth.session_token")?.value;

  if (!sessionToken && (isAdminRoute || isCandidateRoute)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/candidate/:path*",
    "/login",
    "/register",
  ],
};
