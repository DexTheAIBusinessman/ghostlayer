import { NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

type CountResult = {
  table: string;
  label: string;
  count: number | null;
  error?: string;
};

type RecentResult = {
  table: string;
  label: string;
  rows: Record<string, unknown>[];
  error?: string;
};

const tableChecks = [
  { table: "leads", label: "Leads" },
  { table: "scans", label: "Scans" },
  { table: "feedback", label: "Feedback" },
  { table: "cta_clicks", label: "CTA Clicks" },
  { table: "client_uploads", label: "Client Uploads" },
  { table: "client_messages", label: "Client Messages" },
  { table: "client_reports", label: "Client Reports" },
  { table: "client_monitoring_history", label: "Monitoring History" },
  { table: "admin_activity", label: "Activity Log" },
];

const recentTables = [
  { table: "client_messages", label: "Recent Messages" },
  { table: "client_uploads", label: "Recent Uploads" },
  { table: "client_reports", label: "Recent Reports" },
  { table: "client_monitoring_history", label: "Recent Monitoring" },
  { table: "admin_activity", label: "Recent Activity" },
];

function getSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return {
      supabaseUrl: null,
      serviceRoleKey: null,
      error: "Missing Supabase environment variables.",
    };
  }

  return { supabaseUrl, serviceRoleKey, error: null };
}

function isAuthorized(request: Request) {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return {
      ok: false,
      error: "Missing CRON_SECRET environment variable.",
    };
  }

  const authHeader = request.headers.get("authorization");
  const internalHeader = request.headers.get("x-ghostlayer-internal-cron");
  const expected = `Bearer ${cronSecret}`;

  if (authHeader !== expected && internalHeader !== cronSecret) {
    return {
      ok: false,
      error: "Unauthorized cron request.",
    };
  }

  return { ok: true, error: null };
}

async function getTableCount(table: string): Promise<{ count: number | null; error?: string }> {
  const { supabaseUrl, serviceRoleKey, error } = getSupabaseConfig();

  if (error || !supabaseUrl || !serviceRoleKey) {
    return { count: null, error: error || "Missing Supabase config." };
  }

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/${table}?select=id`, {
      method: "HEAD",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        Prefer: "count=exact",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      return {
        count: null,
        error: errorText || `Could not read ${table}.`,
      };
    }

    const contentRange = response.headers.get("content-range");
    const countText = contentRange?.split("/")?.[1];
    const count = countText && countText !== "*" ? Number(countText) : null;

    return {
      count: Number.isFinite(count) ? count : null,
    };
  } catch (err) {
    return {
      count: null,
      error: err instanceof Error ? err.message : "Unknown count error.",
    };
  }
}

async function getRecentRows(
  table: string,
  limit = 5
): Promise<{ rows: Record<string, unknown>[]; error?: string }> {
  const { supabaseUrl, serviceRoleKey, error } = getSupabaseConfig();

  if (error || !supabaseUrl || !serviceRoleKey) {
    return { rows: [], error: error || "Missing Supabase config." };
  }

  const baseUrl = `${supabaseUrl}/rest/v1/${table}?select=*&limit=${limit}`;

  try {
    const orderedResponse = await fetch(`${baseUrl}&order=created_at.desc`, {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      cache: "no-store",
    });

    if (orderedResponse.ok) {
      return { rows: await orderedResponse.json() };
    }

    const fallbackResponse = await fetch(baseUrl, {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      cache: "no-store",
    });

    if (!fallbackResponse.ok) {
      const errorText = await fallbackResponse.text().catch(() => "");
      return {
        rows: [],
        error: errorText || `Could not read recent rows from ${table}.`,
      };
    }

    return { rows: await fallbackResponse.json() };
  } catch (err) {
    return {
      rows: [],
      error: err instanceof Error ? err.message : "Unknown recent-row error.",
    };
  }
}

function rowSummary(row: Record<string, unknown>) {
  const primary =
    row.client_email ||
    row.email ||
    row.file_name ||
    row.subject ||
    row.title ||
    row.event_type ||
    row.action ||
    row.status ||
    row.id ||
    "Record";

  const date =
    row.created_at ||
    row.updated_at ||
    row.sent_at ||
    row.uploaded_at ||
    row.timestamp ||
    null;

  return {
    primary: String(primary),
    date: date ? String(date) : null,
  };
}

async function sendAdminSummaryEmail(summary: {
  agent: string;
  startedAt: string;
  finishedAt: string;
  totals: Record<string, unknown>;
  recommendedActions: string[];
  guardrails: string[];
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ADMIN_NOTIFICATION_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    return {
      ok: false,
      skipped: true,
      error:
        "Missing RESEND_API_KEY, ADMIN_NOTIFICATION_EMAIL, or RESEND_FROM_EMAIL.",
    };
  }

  const resend = new Resend(apiKey);

  const knownRecords =
    typeof summary.totals.knownRecords === "number"
      ? summary.totals.knownRecords
      : "—";

  const readErrors =
    typeof summary.totals.readErrors === "number"
      ? summary.totals.readErrors
      : "—";

  const tablesChecked =
    typeof summary.totals.tablesChecked === "number"
      ? summary.totals.tablesChecked
      : "—";

  const actionsHtml = summary.recommendedActions.length
    ? summary.recommendedActions
        .map((action) => `<li>${escapeHtml(action)}</li>`)
        .join("")
    : "<li>No recommended actions were generated.</li>";

  const guardrailsHtml = summary.guardrails.length
    ? summary.guardrails.map((item) => `<li>${escapeHtml(item)}</li>`).join("")
    : "<li>No guardrails listed.</li>";

  try {
    const result = await resend.emails.send({
      from,
      to,
      subject: "Ghostlayer Daily Admin Summary",
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;">
          <h1>Ghostlayer Daily Admin Summary</h1>
          <p><strong>Agent:</strong> ${escapeHtml(summary.agent)}</p>
          <p><strong>Finished:</strong> ${escapeHtml(summary.finishedAt)}</p>

          <h2>Run Totals</h2>
          <ul>
            <li><strong>Known records:</strong> ${knownRecords}</li>
            <li><strong>Read errors:</strong> ${readErrors}</li>
            <li><strong>Tables checked:</strong> ${tablesChecked}</li>
          </ul>

          <h2>Recommended Actions</h2>
          <ul>${actionsHtml}</ul>

          <h2>Guardrails</h2>
          <ul>${guardrailsHtml}</ul>

          <p style="margin-top:24px;color:#6b7280;font-size:13px;">
            This email is admin-only. The agent did not send client messages, delete records,
            issue refunds, merge clients, or publish reports.
          </p>
        </div>
      `,
    });

    if (result.error) {
      return {
        ok: false,
        skipped: false,
        error: result.error.message,
      };
    }

    return {
      ok: true,
      skipped: false,
      id: result.data?.id || null,
    };
  } catch (err) {
    return {
      ok: false,
      skipped: false,
      error: err instanceof Error ? err.message : "Unknown Resend error.",
    };
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function cleanupCronSummaries(agent = "Daily Summary Cron Agent", keepLatest = 90) {
  const { supabaseUrl, serviceRoleKey, error } = getSupabaseConfig();

  if (error || !supabaseUrl || !serviceRoleKey) {
    return {
      ok: false,
      deleted: 0,
      error: error || "Missing Supabase config.",
    };
  }

  try {
    const listResponse = await fetch(
      `${supabaseUrl}/rest/v1/admin_agent_cron_summaries?select=id,created_at&agent=eq.${encodeURIComponent(
        agent
      )}&order=created_at.desc&offset=${keepLatest}`,
      {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
        cache: "no-store",
      }
    );

    if (!listResponse.ok) {
      const errorText = await listResponse.text().catch(() => "");
      return {
        ok: false,
        deleted: 0,
        error: errorText || "Could not list old cron summaries.",
      };
    }

    const oldRows = await listResponse.json().catch(() => []);

    if (!Array.isArray(oldRows) || oldRows.length === 0) {
      return {
        ok: true,
        deleted: 0,
      };
    }

    const oldIds = oldRows
      .map((row) => row?.id)
      .filter((id): id is string => typeof id === "string" && id.length > 0);

    if (!oldIds.length) {
      return {
        ok: true,
        deleted: 0,
      };
    }

    const deleteResponse = await fetch(
      `${supabaseUrl}/rest/v1/admin_agent_cron_summaries?id=in.(${oldIds.join(",")})`,
      {
        method: "DELETE",
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
          Prefer: "return=minimal",
        },
        cache: "no-store",
      }
    );

    if (!deleteResponse.ok) {
      const errorText = await deleteResponse.text().catch(() => "");
      return {
        ok: false,
        deleted: 0,
        error: errorText || "Could not delete old cron summaries.",
      };
    }

    return {
      ok: true,
      deleted: oldIds.length,
    };
  } catch (err) {
    return {
      ok: false,
      deleted: 0,
      error: err instanceof Error ? err.message : "Unknown cron cleanup error.",
    };
  }
}

async function storeCronSummary(summary: {
  agent: string;
  mode: string;
  startedAt: string;
  finishedAt: string;
  totals: Record<string, unknown>;
  counts: CountResult[];
  recent: unknown[];
  recommendedActions: string[];
  guardrails: string[];
}) {
  const { supabaseUrl, serviceRoleKey, error } = getSupabaseConfig();

  if (error || !supabaseUrl || !serviceRoleKey) {
    return {
      ok: false,
      error: error || "Missing Supabase config.",
    };
  }

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/admin_agent_cron_summaries`, {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        agent: summary.agent,
        mode: summary.mode,
        started_at: summary.startedAt,
        finished_at: summary.finishedAt,
        totals: summary.totals,
        counts: summary.counts,
        recent: summary.recent,
        recommended_actions: summary.recommendedActions,
        guardrails: summary.guardrails,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      return {
        ok: false,
        error: errorText || "Could not store cron summary.",
      };
    }

    const rows = await response.json().catch(() => []);
    const saved = Array.isArray(rows) ? rows[0] : null;

    return {
      ok: true,
      id: saved?.id || null,
    };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Unknown storage error.",
    };
  }
}

function buildRecommendedActions(counts: CountResult[], recent: RecentResult[]) {
  const actions: string[] = [];

  const readErrors = [...counts, ...recent].filter((item) => item.error);

  if (readErrors.length) {
    actions.push(
      `Review ${readErrors.length} data source read error(s). Check table names or Supabase permissions.`
    );
  }

  const messages = recent.find((item) => item.table === "client_messages");
  if (messages?.rows.length) {
    actions.push("Open Message Triage Agent and review recent client messages.");
  }

  const uploads = recent.find((item) => item.table === "client_uploads");
  if (uploads?.rows.length) {
    actions.push("Open Upload Review Agent and review recent client uploads.");
  }

  const reports = recent.find((item) => item.table === "client_reports");
  if (reports?.rows.length) {
    actions.push("Open Report Prep Agent and review recent report records.");
  }

  const monitoring = recent.find((item) => item.table === "client_monitoring_history");
  if (monitoring?.rows.length) {
    actions.push("Open Monitoring Agent and review follow-up needs.");
  }

  const activity = recent.find((item) => item.table === "admin_activity");
  if (activity?.rows.length) {
    actions.push("Open Incident Response Agent if recent activity looks unusual.");
  }

  actions.push("Review Billing / Bookkeeping Agent if payments, refunds, or payouts changed.");
  actions.push("Review Trust & Compliance Agent for pending business setup items.");

  return actions;
}

export async function GET(request: Request) {
  const auth = isAuthorized(request);

  if (!auth.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: auth.error,
      },
      { status: auth.error?.includes("Missing") ? 500 : 401 }
    );
  }

  const startedAt = new Date().toISOString();

  const counts: CountResult[] = await Promise.all(
    tableChecks.map(async (item) => {
      const result = await getTableCount(item.table);

      return {
        ...item,
        count: result.count,
        error: result.error,
      };
    })
  );

  const recent: RecentResult[] = await Promise.all(
    recentTables.map(async (item) => {
      const result = await getRecentRows(item.table, 5);

      return {
        ...item,
        rows: result.rows,
        error: result.error,
      };
    })
  );

  const recommendedActions = buildRecommendedActions(counts, recent);

  const summary = {
    ok: true,
    agent: "Daily Summary Cron Agent",
    mode: "read-only",
    startedAt,
    finishedAt: new Date().toISOString(),
    totals: {
      tablesChecked: counts.length,
      recentGroupsChecked: recent.length,
      readErrors: [...counts, ...recent].filter((item) => item.error).length,
      knownRecords: counts.reduce((sum, item) => sum + (item.count || 0), 0),
    },
    counts,
    recent: recent.map((group) => ({
      table: group.table,
      label: group.label,
      error: group.error,
      rows: group.rows.map(rowSummary),
    })),
    recommendedActions,
    guardrails: [
      "No client messages sent.",
      "No reports published.",
      "No uploads deleted.",
      "No clients merged.",
      "No refunds issued.",
      "No billing records changed.",
      "No real-world business tasks marked complete.",
    ],
  };

  const storage = await storeCronSummary(summary);
  const retention = await cleanupCronSummaries("Daily Summary Cron Agent", 90);
  const email = await sendAdminSummaryEmail(summary);

  const responseSummary = {
    ...summary,
    storage,
    retention: {
      ...retention,
      keepLatest: 90,
    },
    email,
  };

  console.log("[Daily Summary Cron Agent]", JSON.stringify(responseSummary, null, 2));

  return NextResponse.json(responseSummary);
}
