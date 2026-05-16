import { NextResponse } from "next/server";

type Report = {
  id: string;
  report_id: string;
  client_name: string;
  company: string | null;
  email: string;
  risk_score: number | null;
  estimated_loss: string | null;
  time_lost: string | null;
  bottlenecks_found: number | null;
  top_bottlenecks: string[] | null;
  recommended_fixes: string[] | null;
  next_steps: string[] | null;
  main_recommendation: string | null;
  status: string | null;
  email_sent: boolean | null;
  report_access_enabled: boolean | null;
  report_access_code: string | null;
};

function jsonResponse(body: unknown, status = 200) {
  return NextResponse.json(body, { status });
}

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

function formatList(items: string[] | null | undefined) {
  if (!Array.isArray(items) || items.length === 0) {
    return "";
  }

  return items
    .map(
      (item) =>
        `<li style="margin:0 0 10px 0;color:#d1d5db;font-size:14px;line-height:1.6;">${escapeHtml(
          item
        )}</li>`
    )
    .join("");
}

function escapeHtml(value: string | number | null | undefined) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function getRequestBody(request: Request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const body = await request.json();

    return {
      secret: String(body.secret || ""),
      reportId: String(body.reportId || ""),
    };
  }

  const formData = await request.formData();

  return {
    secret: String(formData.get("secret") || ""),
    reportId: String(formData.get("reportId") || ""),
  };
}

async function getReport(reportId: string): Promise<Report | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase environment variables.");
  }

  const response = await fetch(
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

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Could not load report: ${errorText}`);
  }

  const data = await response.json();

  return data?.[0] ?? null;
}

async function ensureReportAccessCode(report: Report) {
  if (report.report_access_code) {
    return report.report_access_code;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase environment variables.");
  }

  const accessCode = makeAccessCode();

  const response = await fetch(
    `${supabaseUrl}/rest/v1/client_reports?report_id=eq.${encodeURIComponent(
      report.report_id
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
    throw new Error(`Could not create report access code: ${errorText}`);
  }

  return accessCode;
}

async function markEmailSent(reportId: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase environment variables.");
  }

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
        status: "Report Sent",
        email_sent: true,
        updated_at: new Date().toISOString(),
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Could not mark email sent: ${errorText}`);
  }

  return response.json();
}

function buildReportEmail({
  report,
  reportUrl,
  accessCode,
}: {
  report: Report;
  reportUrl: string;
  accessCode: string;
}) {
  const clientName = escapeHtml(report.client_name || "there");
  const companyOrName = escapeHtml(report.company || report.client_name);
  const mainRecommendation = escapeHtml(
    report.main_recommendation ||
      "Review the workflow scan and prioritize the highest-friction workflow bottleneck first."
  );

  return `
<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#05070b;font-family:Arial,Helvetica,sans-serif;color:#ffffff;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#05070b;padding:42px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;border:1px solid rgba(255,255,255,0.12);border-radius:28px;background:linear-gradient(145deg,rgba(15,23,42,0.98),rgba(8,13,22,0.98));box-shadow:0 24px 90px rgba(0,0,0,0.45);overflow:hidden;">
            <tr>
              <td style="padding:42px 36px;">
                <p style="margin:0 0 22px 0;color:#67e8f9;font-size:12px;font-weight:700;letter-spacing:0.36em;text-transform:uppercase;">
                  GHOSTLAYER
                </p>

                <h1 style="margin:0;color:#ffffff;font-size:34px;line-height:1.12;font-weight:800;letter-spacing:-0.04em;">
                  Your Workflow Scan is ready
                </h1>

                <p style="margin:24px 0 0 0;color:#d1d5db;font-size:15px;line-height:1.8;">
                  Hi ${clientName},
                </p>

                <p style="margin:16px 0 0 0;color:#d1d5db;font-size:15px;line-height:1.8;">
                  Your Ghostlayer Workflow Scan for <strong style="color:#ffffff;">${companyOrName}</strong> is ready. I reviewed your workflow details and prepared a report showing the main friction points, bottlenecks, and recommended fixes.
                </p>

                <div style="margin:26px 0;padding:22px;border:1px solid rgba(34,211,238,0.24);border-radius:20px;background:rgba(34,211,238,0.08);">
                  <p style="margin:0 0 8px 0;color:#67e8f9;font-size:12px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;">
                    Access Code
                  </p>

                  <p style="margin:0;color:#ffffff;font-size:28px;line-height:1.2;font-weight:800;letter-spacing:0.18em;">
                    ${escapeHtml(accessCode)}
                  </p>

                  <p style="margin:12px 0 0 0;color:#9ca3af;font-size:13px;line-height:1.6;">
                    You will need this code to unlock your private report.
                  </p>
                </div>

                <p style="margin:0;color:#d1d5db;font-size:15px;line-height:1.8;">
                  <strong style="color:#ffffff;">Main priority:</strong> ${mainRecommendation}
                </p>

                ${
                  formatList(report.top_bottlenecks)
                    ? `
                <div style="margin:26px 0 0 0;">
                  <p style="margin:0 0 12px 0;color:#ffffff;font-size:16px;font-weight:700;">
                    Top bottlenecks
                  </p>
                  <ul style="margin:0;padding-left:18px;">
                    ${formatList(report.top_bottlenecks)}
                  </ul>
                </div>
                `
                    : ""
                }

                <div style="margin:30px 0 0 0;">
                  <a href="${escapeHtml(
                    reportUrl
                  )}" style="display:inline-block;background:#ffffff;color:#000000;text-decoration:none;font-size:14px;font-weight:800;padding:15px 22px;border-radius:14px;">
                    View Your Workflow Scan
                  </a>
                </div>

                <p style="margin:28px 0 0 0;color:#9ca3af;font-size:13px;line-height:1.8;">
                  If the button does not work, copy and paste this link into your browser:
                  <br />
                  <span style="color:#67e8f9;">${escapeHtml(reportUrl)}</span>
                </p>

                <p style="margin:30px 0 0 0;color:#d1d5db;font-size:14px;line-height:1.8;">
                  If you have questions, reply to this email.
                </p>

                <p style="margin:28px 0 0 0;color:#d1d5db;font-size:14px;line-height:1.8;">
                  Dexter<br />
                  <span style="color:#9ca3af;">Ghostlayer</span>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
}

export async function POST(request: Request) {
  try {
    const { secret, reportId: rawReportId } = await getRequestBody(request);

    const expectedSecret = process.env.SEND_REPORT_SECRET;

    if (!expectedSecret) {
      return jsonResponse({ error: "Missing SEND_REPORT_SECRET." }, 500);
    }

    if (secret !== expectedSecret) {
      return jsonResponse({ error: "Unauthorized." }, 401);
    }

    const reportId = cleanReportId(rawReportId);

    if (!reportId) {
      return jsonResponse({ error: "Missing reportId." }, 400);
    }

    const report = await getReport(reportId);

    if (!report) {
      return jsonResponse({ error: "Report not found." }, 404);
    }

    if (!report.email) {
      return jsonResponse({ error: "Report is missing recipient email." }, 400);
    }

    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      return jsonResponse({ error: "Missing RESEND_API_KEY." }, 500);
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://ghostlayerhq.com";

    const reportUrl = `${siteUrl.replace(/\/$/, "")}/reports/${encodeURIComponent(
      report.report_id
    )}`;

    const accessCode = await ensureReportAccessCode(report);

    const fromEmail =
      process.env.GHOSTLAYER_FROM_EMAIL ||
      "Ghostlayer <hello@ghostlayerhq.com>";

    const replyToEmail =
      process.env.GHOSTLAYER_REPLY_TO_EMAIL || "ghostlayerbusiness@gmail.com";

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [report.email],
        reply_to: replyToEmail,
        subject: "Your Ghostlayer Workflow Scan is ready",
        html: buildReportEmail({
          report,
          reportUrl,
          accessCode,
        }),
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      throw new Error(`Resend failed: ${errorText}`);
    }

    await markEmailSent(report.report_id);

    return jsonResponse({
      ok: true,
      sentTo: report.email,
      reportUrl,
      accessCodeIncluded: true,
    });
  } catch (error) {
    return jsonResponse(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500
    );
  }
}
