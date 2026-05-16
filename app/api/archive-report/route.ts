import { NextResponse } from "next/server";

type RequestBody = {
  secret: string;
  reportId: string;
  reason: string;
  shouldRedirect: boolean;
};

function cleanReportId(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function getRequestBody(request: Request): Promise<RequestBody> {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const body = await request.json();

    return {
      secret: String(body.secret || ""),
      reportId: String(body.reportId || ""),
      reason: String(body.reason || "Archived from admin reports."),
      shouldRedirect: false,
    };
  }

  const formData = await request.formData();

  return {
    secret: String(formData.get("secret") || ""),
    reportId: String(formData.get("reportId") || ""),
    reason: String(formData.get("reason") || "Archived from admin reports."),
    shouldRedirect: true,
  };
}

async function logActivity({
  action,
  reportId,
  clientName,
  clientEmail,
  details,
}: {
  action: string;
  reportId: string;
  clientName?: string | null;
  clientEmail?: string | null;
  details?: string | null;
}) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) return;

  await fetch(`${supabaseUrl}/rest/v1/admin_activity_log`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      action,
      report_id: reportId,
      client_name: clientName || null,
      client_email: clientEmail || null,
      details: details || null,
    }),
  });
}

export async function POST(request: Request) {
  try {
    const { secret, reportId: rawReportId, reason, shouldRedirect } =
      await getRequestBody(request);

    const expectedSecret = process.env.SEND_REPORT_SECRET;

    if (!expectedSecret) {
      return NextResponse.json(
        { error: "Missing SEND_REPORT_SECRET." },
        { status: 500 }
      );
    }

    if (secret !== expectedSecret) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const reportId = cleanReportId(rawReportId);

    if (!reportId) {
      return NextResponse.json({ error: "Missing reportId." }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Missing Supabase environment variables." },
        { status: 500 }
      );
    }

    const lookupResponse = await fetch(
      `${supabaseUrl}/rest/v1/client_reports?report_id=eq.${encodeURIComponent(
        reportId
      )}&select=report_id,client_name,email`,
      {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
        cache: "no-store",
      }
    );

    if (!lookupResponse.ok) {
      const errorText = await lookupResponse.text();

      return NextResponse.json(
        { error: `Could not load report: ${errorText}` },
        { status: 500 }
      );
    }

    const lookupData = await lookupResponse.json();
    const report = lookupData?.[0];

    if (!report) {
      return NextResponse.json({ error: "Report not found." }, { status: 404 });
    }

    const archiveResponse = await fetch(
      `${supabaseUrl}/rest/v1/client_reports?report_id=eq.${encodeURIComponent(
        reportId
      )}`,
      {
        method: "PATCH",
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          archived: true,
          archived_at: new Date().toISOString(),
          archived_reason: reason || "Archived from admin reports.",
          updated_at: new Date().toISOString(),
        }),
      }
    );

    if (!archiveResponse.ok) {
      const errorText = await archiveResponse.text();

      return NextResponse.json(
        { error: `Could not archive report: ${errorText}` },
        { status: 500 }
      );
    }

    const updated = await archiveResponse.json();

    await logActivity({
      action: "archived_report",
      reportId,
      clientName: report.client_name,
      clientEmail: report.email,
      details: reason || "Archived from admin reports.",
    });

    if (shouldRedirect) {
      return NextResponse.redirect(
        new URL("/admin/reports?archived=1", request.url),
        303
      );
    }

    return NextResponse.json({
      ok: true,
      reportId,
      updatedReport: updated?.[0] ?? null,
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
