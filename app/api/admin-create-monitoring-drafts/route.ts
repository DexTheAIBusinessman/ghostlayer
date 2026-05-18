import { NextResponse } from "next/server";

type ClientReport = {
  id?: string;
  report_id: string;
  client_name: string;
  company: string | null;
  email: string;
  status: string | null;
  monitoring_active: boolean | null;
  monitoring_status: string | null;
  monitoring_cycle: string | null;
  last_monitoring_date: string | null;
  next_monitoring_date: string | null;
  monitoring_notes: string | null;
  monitoring_priority: string | null;
  monitoring_risk_change: string | null;
  top_bottlenecks: string[] | null;
  recommended_fixes: string[] | null;
  next_steps: string[] | null;
  main_recommendation: string | null;
};

type MonitoringDraft = {
  report_id: string;
};

function todayDateOnly() {
  return new Date().toISOString().slice(0, 10);
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function addMonths(date: Date, months: number) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

function getNextMonitoringDate(cycle: string | null) {
  const now = new Date();

  if (cycle === "Biweekly") {
    return addDays(now, 14).toISOString().slice(0, 10);
  }

  if (cycle === "Weekly") {
    return addDays(now, 7).toISOString().slice(0, 10);
  }

  if (cycle === "Quarterly") {
    return addMonths(now, 3).toISOString().slice(0, 10);
  }

  return addMonths(now, 1).toISOString().slice(0, 10);
}

function getPeriodStart(report: ClientReport) {
  if (report.last_monitoring_date) return report.last_monitoring_date;
  return todayDateOnly();
}

function getDraftSubject(report: ClientReport) {
  const company = report.company || report.client_name || "your business";
  return `Ghostlayer monitoring update for ${company}`;
}

function getDraftSummary(report: ClientReport) {
  const company = report.company || report.client_name || "the client";

  return [
    `Ghostlayer prepared a monthly monitoring draft for ${company}.`,
    `This draft should be reviewed before sending to the client.`,
    report.monitoring_notes
      ? `Current admin notes: ${report.monitoring_notes}`
      : `Review recent workflow activity, uploaded files, client messages, and prior report recommendations before sending.`,
  ].join(" ");
}

function fallbackList(items: string[] | null, fallback: string[]) {
  if (Array.isArray(items) && items.length > 0) return items;
  return fallback;
}

async function sendAdminNotification({
  createdCount,
  skippedCount,
}: {
  createdCount: number;
  skippedCount: number;
}) {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) return;

  const to =
    process.env.ADMIN_NOTIFY_EMAIL ||
    process.env.GHOSTLAYER_REPLY_TO_EMAIL ||
    "ghostlayerbusiness@gmail.com";

  const from =
    process.env.RESEND_FROM_EMAIL || "Ghostlayer <hello@ghostlayerhq.com>";

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ghostlayerhq.com";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject: `Ghostlayer monitoring drafts created: ${createdCount}`,
      html: `
        <div style="font-family:Arial,Helvetica,sans-serif;background:#05070b;color:#e5e7eb;padding:32px;">
          <div style="max-width:640px;margin:0 auto;border:1px solid rgba(255,255,255,0.12);background:#0b111a;border-radius:24px;padding:28px;">
            <p style="margin:0 0 16px;color:#67e8f9;font-size:12px;font-weight:700;letter-spacing:0.28em;text-transform:uppercase;">Ghostlayer</p>
            <h1 style="margin:0 0 16px;color:#fff;">Monitoring drafts are ready</h1>
            <p style="line-height:1.7;color:#cbd5e1;">${createdCount} monitoring draft(s) were created.</p>
            <p style="line-height:1.7;color:#94a3b8;">${skippedCount} due client(s) were skipped because a draft already exists.</p>
            <a href="${siteUrl}/admin/monitoring" style="display:inline-block;margin-top:18px;background:#fff;color:#05070b;text-decoration:none;font-weight:700;padding:12px 16px;border-radius:14px;">Review Monitoring Drafts</a>
          </div>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Monitoring notification failed:", errorText);
  }
}

async function logAdminActivity({
  supabaseUrl,
  serviceRoleKey,
  details,
}: {
  supabaseUrl: string;
  serviceRoleKey: string;
  details: string;
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
      action: "monitoring_drafts_created",
      client_email: null,
      report_id: null,
      details,
    }),
  });
}

async function getDueReports({
  supabaseUrl,
  serviceRoleKey,
}: {
  supabaseUrl: string;
  serviceRoleKey: string;
}): Promise<ClientReport[]> {
  const today = todayDateOnly();

  const response = await fetch(
    `${supabaseUrl}/rest/v1/client_reports?monitoring_active=eq.true&archived=eq.false&next_monitoring_date=lte.${today}&select=*&order=next_monitoring_date.asc`,
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
    throw new Error(`Could not load due monitoring reports: ${errorText}`);
  }

  return response.json();
}

async function hasExistingDraft({
  supabaseUrl,
  serviceRoleKey,
  reportId,
}: {
  supabaseUrl: string;
  serviceRoleKey: string;
  reportId: string;
}) {
  const response = await fetch(
    `${supabaseUrl}/rest/v1/client_monitoring_history?report_id=eq.${encodeURIComponent(
      reportId
    )}&status=eq.Draft&select=report_id&limit=1`,
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
    throw new Error(`Could not check existing monitoring draft: ${errorText}`);
  }

  const drafts = (await response.json()) as MonitoringDraft[];
  return drafts.length > 0;
}

async function createMonitoringDraft({
  supabaseUrl,
  serviceRoleKey,
  report,
}: {
  supabaseUrl: string;
  serviceRoleKey: string;
  report: ClientReport;
}) {
  const periodStart = getPeriodStart(report);
  const periodEnd = todayDateOnly();
  const nextMonitoringDate = getNextMonitoringDate(report.monitoring_cycle);

  const draftSubject = getDraftSubject(report);

  const draftPayload = {
    title: draftSubject,
    report_id: report.report_id,
    client_email: report.email,
    client_name: report.client_name,
    company: report.company,
    status: "Draft",
    monitoring_cycle: report.monitoring_cycle || "Monthly",
    period_start: periodStart,
    period_end: periodEnd,
    draft_subject: draftSubject,
    draft_summary: getDraftSummary(report),
    draft_bottlenecks: fallbackList(report.top_bottlenecks, [
      "Review recent client messages and uploaded workflow files.",
      "Confirm whether the original workflow bottlenecks have improved.",
      "Check for new operational drag since the last review.",
    ]),
    draft_fixes: fallbackList(report.recommended_fixes, [
      "Review the prior report recommendations.",
      "Update the client on completed and pending workflow improvements.",
      "Identify the next highest-priority operational fix.",
    ]),
    draft_next_steps: fallbackList(report.next_steps, [
      "Review client portal activity.",
      "Review uploads and messages.",
      "Approve or edit this monitoring draft before sending.",
    ]),
    draft_recommendation:
      report.main_recommendation ||
      "Review current workflow activity and send the client a concise monitoring update.",
    updated_at: new Date().toISOString(),
  };

  const insertResponse = await fetch(
    `${supabaseUrl}/rest/v1/client_monitoring_history`,
    {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(draftPayload),
    }
  );

  if (!insertResponse.ok) {
    const errorText = await insertResponse.text();
    throw new Error(`Could not create monitoring draft: ${errorText}`);
  }

  const updateResponse = await fetch(
    `${supabaseUrl}/rest/v1/client_reports?report_id=eq.${encodeURIComponent(
      report.report_id
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
        monitoring_status: "Needs Review",
        last_monitoring_date: periodEnd,
        next_monitoring_date: nextMonitoringDate,
        updated_at: new Date().toISOString(),
      }),
    }
  );

  if (!updateResponse.ok) {
    const errorText = await updateResponse.text();
    throw new Error(`Could not update monitoring dates: ${errorText}`);
  }
}

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Missing Supabase environment variables." },
        { status: 500 }
      );
    }

    const dueReports = await getDueReports({ supabaseUrl, serviceRoleKey });

    let createdCount = 0;
    let skippedCount = 0;

    for (const report of dueReports) {
      const existingDraft = await hasExistingDraft({
        supabaseUrl,
        serviceRoleKey,
        reportId: report.report_id,
      });

      if (existingDraft) {
        skippedCount += 1;
        continue;
      }

      await createMonitoringDraft({
        supabaseUrl,
        serviceRoleKey,
        report,
      });

      createdCount += 1;
    }

    await logAdminActivity({
      supabaseUrl,
      serviceRoleKey,
      details: `Created ${createdCount} monitoring draft(s). Skipped ${skippedCount}.`,
    });

    await sendAdminNotification({
      createdCount,
      skippedCount,
    });

    return NextResponse.json({
      ok: true,
      dueReports: dueReports.length,
      createdCount,
      skippedCount,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
