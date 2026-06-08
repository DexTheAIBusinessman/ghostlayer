import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function getBaseUrl(request: Request) {
  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
}

export async function POST(request: Request) {
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
        method: "POST",
        headers: {
          Authorization: `Bearer ${cronSecret}`,
        "x-ghostlayer-internal-cron": cronSecret,
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
