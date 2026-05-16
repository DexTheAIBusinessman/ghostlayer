import { NextResponse } from "next/server";

type Report = Record<string, unknown> & {
  id?: string;
  report_id?: string;
  client_name?: string;
  email?: string;
};

type RequestBody = {
  secret: string;
  reportId: string;
  shouldRedirect: boolean;
};

function cleanReportId(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function makeAccessCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";

  for (let index = 0; index < 8; index++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  return code;
}

function makeDuplicateReportId(originalReportId: string) {
  const suffix = Math.random().toString(36).slice(2, 8);
  return cleanReportId(`${originalReportId}-copy-${suffix}`);
}

async function getRequestBody(request: Request): Promise<RequestBody> {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const body = await request.json();

    return {
      secret: String(body.secret || ""),
      reportId: String(body.reportId || ""),
      shouldRedirect: false,
    };
  }

  const formData = await request.formData();

  return {
    secret: String(formData.get("secret") || ""),
    reportId: String(formData.get("reportId") || ""),
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
    const { secret, reportId: rawReportId, shouldRedirect } =
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

    const reportResponse = await fetch(
      `${supabaseUrl}/rest/v1/client_reports?report_id=eq.${encodeURIComponent(
        reportId
      )}&select=*`,
      {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
        cache: "no-store",
      }
    );

    if (!reportResponse.ok) {
      const errorText = await reportResponse.text();

      return NextResponse.json(
        { error: `Could not load report: ${errorText}` },
        { status: 500 }
      );
    }

    const reports = await reportResponse.json();
    const original: Report | undefined = reports?.[0];

    if (!original) {
      return NextResponse.json({ error: "Report not found." }, { status: 404 });
    }

    const newReportId = makeDuplicateReportId(String(original.report_id || ""));

    const {
      id,
      created_at,
      updated_at,
      archived_at,
      last_client_viewed_at,
      client_view_count,
      ...copyable
    } = original;

    const duplicatedReport = {
      ...copyable,
      report_id: newReportId,
      client_name: `${String(original.client_name || "Client")} Copy`,
      status: "Draft",
      email_sent: false,
      report_access_enabled: true,
      report_access_code: makeAccessCode(),
      last_client_viewed_at: null,
      client_view_count: 0,
      archived: false,
      archived_at: null,
      archived_reason: null,
      duplicated_from_report_id: original.report_id || reportId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const createResponse = await fetch(`${supabaseUrl}/rest/v1/client_reports`, {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(duplicatedReport),
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();

      return NextResponse.json(
        { error: `Could not duplicate report: ${errorText}` },
        { status: 500 }
      );
    }

    const created = await createResponse.json();

    await logActivity({
      action: "duplicated_report",
      reportId: newReportId,
      clientName: String(original.client_name || ""),
      clientEmail: String(original.email || ""),
      details: `Duplicated from ${reportId}`,
    });

    if (shouldRedirect) {
      return NextResponse.redirect(
        new URL(`/admin/reports?duplicated=1`, request.url),
        303
      );
    }

    return NextResponse.json({
      ok: true,
      originalReportId: reportId,
      newReportId,
      createdReport: created?.[0] ?? null,
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
