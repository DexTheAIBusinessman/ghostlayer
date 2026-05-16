import { NextResponse } from "next/server";

function makeAccessCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";

  for (let index = 0; index < 8; index++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  return code;
}

function cleanReportId(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function getRequestBody(request: Request) {
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

    const accessCode = makeAccessCode();

    const response = await fetch(
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
          report_access_enabled: true,
          report_access_code: accessCode,
          updated_at: new Date().toISOString(),
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      return NextResponse.json(
        { error: `Could not regenerate access code: ${errorText}` },
        { status: 500 }
      );
    }

    const updated = await response.json();

    if (shouldRedirect) {
      return NextResponse.redirect(
        new URL("/admin/reports?access=regenerated", request.url),
        303
      );
    }

    return NextResponse.json({
      ok: true,
      reportId,
      accessCode,
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
