import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function getBaseUrl(request: Request) {
  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
}

function isAdminAuthorized(request: Request) {
  const adminUser = process.env.ADMIN_USERNAME?.trim();
  const adminPassword = process.env.ADMIN_PASSWORD?.trim();

  if (!adminUser || !adminPassword) {
    return {
      ok: false,
      status: 500,
      error: "Missing admin auth environment variables.",
    };
  }

  const authHeader = request.headers.get("authorization");

  if (!authHeader?.startsWith("Basic ")) {
    return {
      ok: false,
      status: 401,
      error: "Unauthorized.",
    };
  }

  const encoded = authHeader.slice("Basic ".length);

  let decoded = "";

  try {
    decoded = Buffer.from(encoded, "base64").toString("utf8");
  } catch {
    return {
      ok: false,
      status: 401,
      error: "Unauthorized.",
    };
  }

  const separatorIndex = decoded.indexOf(":");

  if (separatorIndex === -1) {
    return {
      ok: false,
      status: 401,
      error: "Unauthorized.",
    };
  }

  const username = decoded.slice(0, separatorIndex);
  const password = decoded.slice(separatorIndex + 1);

  if (username !== adminUser || password !== adminPassword) {
    return {
      ok: false,
      status: 401,
      error: "Unauthorized.",
    };
  }

  return {
    ok: true,
    status: 200,
    error: null,
  };
}

export async function POST(request: Request) {
  const adminAuth = isAdminAuthorized(request);

  if (!adminAuth.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: adminAuth.error,
      },
      {
        status: adminAuth.status,
        headers:
          adminAuth.status === 401
            ? { "WWW-Authenticate": 'Basic realm="Ghostlayer Admin"' }
            : undefined,
      }
    );
  }

  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return NextResponse.json(
      {
        ok: false,
        error: "Missing CRON_SECRET environment variable.",
      },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `${getBaseUrl(request)}/api/admin/agents/daily-summary/run`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${cronSecret}`,
        },
        cache: "no-store",
      }
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: "Daily Summary Cron Agent run failed.",
          status: response.status,
          details: data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Daily Summary Cron Agent ran successfully.",
      summary: data,
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Unknown manual run error.",
      },
      { status: 500 }
    );
  }
}
