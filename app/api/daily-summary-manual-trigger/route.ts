import { NextResponse } from "next/server";
import { GET as runDailySummary } from "../admin/agents/daily-summary/run/route";

export const dynamic = "force-dynamic";

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
    const runUrl = new URL("/api/admin/agents/daily-summary/run", request.url).toString();

    const runRequest = new Request(runUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cronSecret}`,
        "x-ghostlayer-internal-cron": cronSecret,
      },
    });

    const response = await runDailySummary(runRequest);
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
