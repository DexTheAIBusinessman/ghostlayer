import { NextResponse, type NextRequest } from "next/server";

const ADMIN_COOKIE = "ghostlayer_admin_session";

const PROTECTED_ADMIN_API_PATHS = new Set([
  "/api/send-report",
  "/api/duplicate-report",
  "/api/archive-report",
  "/api/regenerate-report-access-code",
  "/api/admin-download-client-upload",
  "/api/admin-reply-client-message",
  "/api/admin-update-message-status",
  "/api/admin-create-monitoring-drafts",
  "/api/admin-send-monitoring-update",
]);

function isProtectedAdminPath(pathname: string) {
  if (pathname === "/admin/login") return false;
  if (pathname.startsWith("/admin/")) return true;
  if (pathname === "/admin") return true;
  if (pathname.startsWith("/api/admin/")) return true;
  if (pathname.startsWith("/api/admin-")) return true;
  return PROTECTED_ADMIN_API_PATHS.has(pathname);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isProtectedAdminPath(pathname)) {
    return NextResponse.next();
  }

  const expectedSession = process.env.ADMIN_SESSION_SECRET?.trim();
  const adminSession = request.cookies.get(ADMIN_COOKIE)?.value;

  if (!expectedSession || adminSession !== expectedSession) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.searchParams.set("error", "admin-login-required");
    loginUrl.searchParams.set("next", pathname);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
