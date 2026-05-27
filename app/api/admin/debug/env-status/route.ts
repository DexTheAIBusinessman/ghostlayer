import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function isAdminAuthorized(request: Request) {
  const adminUser = process.env.ADMIN_USERNAME?.trim();
  const adminPassword = process.env.ADMIN_PASSWORD?.trim();

  if (!adminUser || !adminPassword) {
    return { ok: false, status: 500, error: "Missing admin auth environment variables." };
  }

  const authHeader = request.headers.get("authorization");

  if (!authHeader?.startsWith("Basic ")) {
    return { ok: false, status: 401, error: "Unauthorized." };
  }

  try {
    const decoded = Buffer.from(authHeader.slice("Basic ".length), "base64").toString("utf8");
    const separatorIndex = decoded.indexOf(":");

    if (separatorIndex === -1) {
      return { ok: false, status: 401, error: "Unauthorized." };
    }

    const username = decoded.slice(0, separatorIndex);
    const password = decoded.slice(separatorIndex + 1);

    if (username !== adminUser || password !== adminPassword) {
      return { ok: false, status: 401, error: "Unauthorized." };
    }

    return { ok: true, status: 200, error: null };
  } catch {
    return { ok: false, status: 401, error: "Unauthorized." };
  }
}

export async function GET(request: Request) {
  const adminAuth = isAdminAuthorized(request);

  if (!adminAuth.ok) {
    return NextResponse.json(
      { ok: false, error: adminAuth.error },
      {
        status: adminAuth.status,
        headers:
          adminAuth.status === 401
            ? { "WWW-Authenticate": 'Basic realm="Ghostlayer Admin"' }
            : undefined,
      }
    );
  }

  return NextResponse.json({
    ok: true,
    resend: {
      RESEND_API_KEY: Boolean(process.env.RESEND_API_KEY),
      ADMIN_NOTIFICATION_EMAIL: Boolean(process.env.ADMIN_NOTIFICATION_EMAIL),
      RESEND_FROM_EMAIL: Boolean(process.env.RESEND_FROM_EMAIL),
    },
  });
}
