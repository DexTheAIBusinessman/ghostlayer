import { NextResponse } from "next/server";
import { GET as runBusinessHealth } from "../admin/agents/business-health/run/route";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (request.headers.get("x-debug-business-health") === "1") {
    return NextResponse.json({
      ok: true,
      marker: "business-health-manual-trigger-current-code",
    });
  }

  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return NextResponse.json(
      { ok: false, error: "Missing CRON_SECRET environment variable." },
      { status: 500 }
    );
  }

  const runUrl = new URL("/api/admin/agents/business-health/run", request.url).toString();

  const runRequest = new Request(runUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${cronSecret}`,
      "x-ghostlayer-internal-cron": cronSecret,
    },
  });

  const response = await runBusinessHealth(runRequest);
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: "Business Health Agent run failed.",
        status: response.status,
        details: data,
      },
      { status: response.status }
    );
  }

  return NextResponse.json({
    ok: true,
    message: "Business Health Agent ran successfully.",
    summary: data,
  });
}
