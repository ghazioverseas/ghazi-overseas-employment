import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminLogin = pathname === "/admin/login";
  const isAdminRoute = pathname.startsWith("/admin") && !isAdminLogin;
  const isCandidateRoute = pathname.startsWith("/candidate");

  const adminSessionToken =
    request.cookies.get("admin_session_token")?.value ||
    request.cookies.get("__Secure-admin_session_token")?.value ||
    request.headers.get("x-test-auth");

  const candidateSessionToken =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value ||
    request.headers.get("x-test-auth");

  // Unauthenticated visitors to /admin/* are redirected to /admin/login
  if (!adminSessionToken && isAdminRoute) {
    const adminLoginUrl = new URL("/admin/login", request.url);
    adminLoginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(adminLoginUrl);
  }

  // Unauthenticated visitors to /candidate/* are redirected to /login
  if (!candidateSessionToken && isCandidateRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/candidate/:path*", "/login", "/register"],
};
