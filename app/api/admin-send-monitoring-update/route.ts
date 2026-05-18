import { NextResponse } from "next/server";

type MonitoringHistory = {
  id: string;
  report_id: string | null;
  client_email: string | null;
  client_name: string | null;
  company: string | null;
  status: string;
  monitoring_cycle: string | null;
  period_start: string | null;
  period_end: string | null;
  draft_subject: string | null;
  draft_summary: string | null;
  draft_bottlenecks: string[] | null;
  draft_fixes: string[] | null;
  draft_next_steps: string[] | null;
  draft_recommendation: string | null;
};

function cleanText(value: FormDataEntryValue | null) {
  return String(value || "").trim();
}

function formatDate(value: string | null) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function htmlList(items: string[] | null) {
  if (!items || items.length === 0) {
    return `<p style="margin:0;color:#94a3b8;font-size:14px;line-height:1.6;">No items listed.</p>`;
  }

  return `
    <ul style="margin:0;padding-left:18px;color:#cbd5e1;font-size:14px;line-height:1.8;">
      ${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
    </ul>
  `;
}

async function getMonitoringHistory({
  supabaseUrl,
  serviceRoleKey,
  historyId,
}: {
  supabaseUrl: string;
  serviceRoleKey: string;
  historyId: string;
}) {
  const response = await fetch(
    `${supabaseUrl}/rest/v1/client_monitoring_history?id=eq.${encodeURIComponent(
      historyId
    )}&select=*&limit=1`,
    {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Could not load monitoring history: ${errorText}`);
  }

  const records = (await response.json()) as MonitoringHistory[];
  return records[0] || null;
}

async function sendMonitoringEmail(history: MonitoringHistory) {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    throw new Error("Missing RESEND_API_KEY.");
  }

  if (!history.client_email) {
    throw new Error("Monitoring history is missing client email.");
  }

  const from =
    process.env.RESEND_FROM_EMAIL || "Ghostlayer <hello@ghostlayerhq.com>";

  const replyTo =
    process.env.GHOSTLAYER_REPLY_TO_EMAIL ||
    process.env.RESEND_REPLY_TO_EMAIL ||
    "ghostlayerbusiness@gmail.com";

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ghostlayerhq.com";

  const subject =
    history.draft_subject ||
    `Ghostlayer monitoring update for ${history.company || history.client_name || "your business"}`;

  const reportButton = history.report_id
    ? `
      <a href="${siteUrl}/reports/${encodeURIComponent(
        history.report_id
      )}" style="display:inline-block;background:#ffffff;color:#05070b;text-decoration:none;font-weight:700;font-size:14px;padding:13px 18px;border-radius:14px;">
        View Your Report
      </a>
    `
    : "";

  const html = `
    <div style="margin:0;padding:0;background:#05070b;color:#e5e7eb;font-family:Arial,Helvetica,sans-serif;">
      <div style="max-width:720px;margin:0 auto;padding:32px 20px;">
        <div style="border:1px solid rgba(255,255,255,0.12);background:#0b111a;border-radius:28px;padding:32px;">
          <p style="margin:0 0 18px;color:#67e8f9;font-size:12px;font-weight:700;letter-spacing:0.28em;text-transform:uppercase;">Ghostlayer</p>

          <h1 style="margin:0 0 16px;color:#ffffff;font-size:28px;line-height:1.2;">
            ${escapeHtml(subject)}
          </h1>

          <p style="margin:0 0 20px;color:#94a3b8;font-size:13px;line-height:1.6;">
            Monitoring period: ${formatDate(history.period_start)} – ${formatDate(history.period_end)}
          </p>

          <div style="margin:22px 0;padding:20px;border-radius:18px;background:rgba(34,211,238,0.08);border:1px solid rgba(34,211,238,0.18);">
            <p style="margin:0;color:#f8fafc;font-size:15px;line-height:1.7;">
              ${escapeHtml(
                history.draft_summary ||
                  "Ghostlayer reviewed your monitoring record and prepared this update."
              )}
            </p>
          </div>

          <h2 style="margin:28px 0 12px;color:#ffffff;font-size:18px;">Bottlenecks reviewed</h2>
          <div style="padding:16px;border-radius:16px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);">
            ${htmlList(history.draft_bottlenecks)}
          </div>

          <h2 style="margin:28px 0 12px;color:#ffffff;font-size:18px;">Recommended fixes</h2>
          <div style="padding:16px;border-radius:16px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);">
            ${htmlList(history.draft_fixes)}
          </div>

          <h2 style="margin:28px 0 12px;color:#ffffff;font-size:18px;">Next steps</h2>
          <div style="padding:16px;border-radius:16px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);">
            ${htmlList(history.draft_next_steps)}
          </div>

          <div style="margin:28px 0;padding:20px;border-radius:18px;background:rgba(16,185,129,0.10);border:1px solid rgba(16,185,129,0.20);">
            <p style="margin:0 0 8px;color:#a7f3d0;font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;">Main recommendation</p>
            <p style="margin:0;color:#ecfdf5;font-size:15px;line-height:1.7;">
              ${escapeHtml(
                history.draft_recommendation ||
                  "Continue reviewing workflow bottlenecks and prioritize the highest-impact operational fix."
              )}
            </p>
          </div>

          ${
            reportButton
              ? `<div style="margin-top:28px;">${reportButton}</div>`
              : ""
          }

          <p style="margin:28px 0 0;color:#94a3b8;font-size:13px;line-height:1.6;">
            Reply to this email if you have questions or want Ghostlayer to review a new workflow issue.
          </p>
        </div>
      </div>
    </div>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: history.client_email,
      subject,
      html,
      reply_to: replyTo,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Could not send monitoring email: ${errorText}`);
  }
}

async function markHistorySent({
  supabaseUrl,
  serviceRoleKey,
  historyId,
}: {
  supabaseUrl: string;
  serviceRoleKey: string;
  historyId: string;
}) {
  const now = new Date().toISOString();

  const response = await fetch(
    `${supabaseUrl}/rest/v1/client_monitoring_history?id=eq.${encodeURIComponent(
      historyId
    )}`,
    {
      method: "PATCH",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        status: "Sent",
        sent_at: now,
        updated_at: now,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Could not mark monitoring history sent: ${errorText}`);
  }
}

async function updateClientReport({
  supabaseUrl,
  serviceRoleKey,
  history,
}: {
  supabaseUrl: string;
  serviceRoleKey: string;
  history: MonitoringHistory;
}) {
  if (!history.report_id) return;

  const now = new Date().toISOString();

  const response = await fetch(
    `${supabaseUrl}/rest/v1/client_reports?report_id=eq.${encodeURIComponent(
      history.report_id
    )}`,
    {
      method: "PATCH",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        monitoring_status: "Active",
        monitoring_last_sent_at: now,
        updated_at: now,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Could not update client report monitoring status: ${errorText}`);
  }
}

async function logAdminActivity({
  supabaseUrl,
  serviceRoleKey,
  history,
}: {
  supabaseUrl: string;
  serviceRoleKey: string;
  history: MonitoringHistory;
}) {
  await fetch(`${supabaseUrl}/rest/v1/admin_activity_log`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      action: "monitoring_update_sent",
      report_id: history.report_id || null,
      client_email: history.client_email || null,
      client_name: history.client_name || null,
      details: history.draft_subject || "Monitoring update sent",
    }),
  });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const historyId = cleanText(formData.get("historyId"));

    if (!historyId) {
      return NextResponse.redirect(
        new URL("/admin/monitoring?error=missing-history-id", request.url),
        303
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Missing Supabase environment variables." },
        { status: 500 }
      );
    }

    const history = await getMonitoringHistory({
      supabaseUrl,
      serviceRoleKey,
      historyId,
    });

    if (!history) {
      return NextResponse.redirect(
        new URL("/admin/monitoring?error=history-not-found", request.url),
        303
      );
    }

    if (history.status === "Sent") {
      return NextResponse.redirect(
        new URL("/admin/monitoring?error=already-sent", request.url),
        303
      );
    }

    await sendMonitoringEmail(history);

    await markHistorySent({
      supabaseUrl,
      serviceRoleKey,
      historyId,
    });

    await updateClientReport({
      supabaseUrl,
      serviceRoleKey,
      history,
    });

    await logAdminActivity({
      supabaseUrl,
      serviceRoleKey,
      history,
    });

    return NextResponse.redirect(
      new URL("/admin/monitoring?sent=1", request.url),
      303
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
