import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function getConfig() {
  return {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    cronSecret: process.env.CRON_SECRET || "",
  };
}

function headers(serviceKey: string) {
  return {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    "Content-Type": "application/json",
  };
}

async function countTable(supabaseUrl: string, serviceKey: string, table: string) {
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/${table}?select=id&limit=1000`, {
      headers: headers(serviceKey),
      cache: "no-store",
    });

    if (!res.ok) {
      return { table, count: 0, ok: false, error: `${table} ${res.status}` };
    }

    const rows = await res.json().catch(() => []);
    return { table, count: Array.isArray(rows) ? rows.length : 0, ok: true, error: null };
  } catch (err) {
    return {
      table,
      count: 0,
      ok: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

export async function GET(request: Request) {
  const startedAt = new Date().toISOString();
  const { supabaseUrl, serviceKey, cronSecret } = getConfig();

  if (!cronSecret) {
    return NextResponse.json({ ok: false, error: "Missing CRON_SECRET." }, { status: 500 });
  }

  const authHeader = request.headers.get("authorization");
  const internalHeader = request.headers.get("x-ghostlayer-internal-cron");

  if (authHeader !== `Bearer ${cronSecret}` && internalHeader !== cronSecret) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ ok: false, error: "Missing Supabase config." }, { status: 500 });
  }

  const results = await Promise.all([
    countTable(supabaseUrl, serviceKey, "leads"),
    countTable(supabaseUrl, serviceKey, "scans"),
    countTable(supabaseUrl, serviceKey, "client_messages"),
    countTable(supabaseUrl, serviceKey, "client_uploads"),
    countTable(supabaseUrl, serviceKey, "client_reports"),
    countTable(supabaseUrl, serviceKey, "client_monitoring_history"),
    countTable(supabaseUrl, serviceKey, "admin_activity_log"),
    countTable(supabaseUrl, serviceKey, "feedback"),
    countTable(supabaseUrl, serviceKey, "cta_clicks"),
  ]);

  const readErrors = results.filter((r) => !r.ok).map((r) => r.error);
  const totalRecords = results.reduce((sum, r) => sum + r.count, 0);

  const risk = readErrors.length > 0 ? "yellow" : "green";
  const healthScore = readErrors.length > 0 ? 85 : 100;

  const totals = {
    healthScore,
    risk,
    riskLabel: risk === "green" ? "Green" : "Yellow",
    totalRecords,
    readErrors,
  };

  const counts = results.map((r) => ({
    table: r.table,
    label: r.table,
    count: r.count,
  }));

  const recommendedActions =
    readErrors.length > 0
      ? ["Check Business Health Agent data access because one or more tables could not be read."]
      : ["No urgent operational action found. Continue daily analytics, messages, uploads, and reports review."];

  const finishedAt = new Date().toISOString();

  const storageRes = await fetch(`${supabaseUrl}/rest/v1/admin_agent_cron_summaries`, {
    method: "POST",
    headers: {
      ...headers(serviceKey),
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      agent: "Business Health Agent",
      mode: "read-only",
      started_at: startedAt,
      finished_at: finishedAt,
      totals,
      counts,
      recommended_actions: recommendedActions,
    }),
  });

  const inserted = await storageRes.json().catch(() => null);

  return NextResponse.json({
    ok: true,
    agent: "Business Health Agent",
    mode: "read-only",
    startedAt,
    finishedAt,
    healthScore,
    risk,
    totals,
    counts,
    recommendedActions,
    storage: {
      ok: storageRes.ok,
      inserted: storageRes.ok,
      id: Array.isArray(inserted) ? inserted[0]?.id || null : inserted?.id || null,
    },
  });
}
