import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Ghostlayer Admin"',
    },
  });
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const isAdminPage = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAdminApi =
    pathname.startsWith("/api/admin-") ||
    pathname === "/api/archive-report" ||
    pathname === "/api/duplicate-report" ||
    pathname === "/api/regenerate-report-access-code" ||
    pathname === "/api/send-report";

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminUsername || !adminPassword) {
    return new NextResponse("Admin authentication is not configured.", {
      status: 500,
    });
  }

  const authorization = request.headers.get("authorization");

  if (!authorization || !authorization.startsWith("Basic ")) {
    return unauthorized();
  }

  const base64Credentials = authorization.replace("Basic ", "");
  const credentials = atob(base64Credentials);
  const [username, password] = credentials.split(":");

  if (username !== adminUsername || password !== adminPassword) {
    return unauthorized();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
