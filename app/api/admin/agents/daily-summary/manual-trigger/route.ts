import { NextResponse } from "next/server";
import { GET as runDailySummary } from "../run/route";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (request.headers.get("x-debug-manual-run") === "1") {
    return NextResponse.json({ ok: true, marker: "manual-run-current-code" });
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
    const runRequest = new Request(request.url.replace("/manual-run", "/run"), {
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
