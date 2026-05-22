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

  const adminUsername = process.env.ADMIN_USERNAME?.trim();
  const adminPassword = process.env.ADMIN_PASSWORD?.trim();

  if (!adminUsername || !adminPassword) {
    return new NextResponse("Admin authentication is not configured.", {
      status: 500,
    });
  }

  const authorization = request.headers.get("authorization");

  if (request.nextUrl.searchParams.get("debugAuth") === "1") {
    let decoded = "";
    let requestUsername = "";
    let requestPassword = "";

    if (authorization?.startsWith("Basic ")) {
      try {
        decoded = atob(authorization.replace("Basic ", ""));
        const separatorIndex = decoded.indexOf(":");
        if (separatorIndex !== -1) {
          requestUsername = decoded.slice(0, separatorIndex).trim();
          requestPassword = decoded.slice(separatorIndex + 1).trim();
        }
      } catch {
        decoded = "";
      }
    }

    return NextResponse.json({
      adminUsernameExists: Boolean(adminUsername),
      adminPasswordExists: Boolean(adminPassword),
      adminUsernameLength: adminUsername?.length ?? 0,
      adminPasswordLength: adminPassword?.length ?? 0,
      authorizationExists: Boolean(authorization),
      authorizationStartsBasic: Boolean(authorization?.startsWith("Basic ")),
      decodedHasColon: decoded.includes(":"),
      requestUsernameLength: requestUsername.length,
      requestPasswordLength: requestPassword.length,
      usernameMatches: requestUsername === adminUsername,
      passwordMatches: requestPassword === adminPassword,
    });
  }

  if (!authorization || !authorization.startsWith("Basic ")) {
    return unauthorized();
  }

  const base64Credentials = authorization.replace("Basic ", "");
  const credentials = atob(base64Credentials);
  const separatorIndex = credentials.indexOf(":");

  if (separatorIndex === -1) {
    return unauthorized();
  }

  const username = credentials.slice(0, separatorIndex).trim();
  const password = credentials.slice(separatorIndex + 1).trim();

  if (username !== adminUsername || password !== adminPassword) {
    return unauthorized();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
