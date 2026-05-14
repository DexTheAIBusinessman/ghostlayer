import { NextResponse } from "next/server";

type Report = {
  report_id: string;
  client_name: string;
  company: string | null;
  email: string;
  main_recommendation: string | null;
};

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
    throw new Error("Could not load report.");
  }

  const data = await response.json();
  return data?.[0] ?? null;
}

async function markEmailSent(reportId: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) return;

  await fetch(
    `${supabaseUrl}/rest/v1/client_reports?report_id=eq.${encodeURIComponent(
      reportId
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
        email_sent: true,
        status: "Report Sent",
        updated_at: new Date().toISOString(),
      }),
    }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.secret !== process.env.SEND_REPORT_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const reportId = body.reportId;

    if (!reportId) {
      return NextResponse.json({ error: "Missing reportId" }, { status: 400 });
    }

    const report = await getReport(reportId);

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.GHOSTLAYER_FROM_EMAIL;
    const replyTo =
      process.env.GHOSTLAYER_REPLY_TO_EMAIL || "ghostlayerbusiness@gmail.com";
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://ghostlayerhq.com";

    if (!resendApiKey || !fromEmail) {
      throw new Error("Missing Resend environment variables.");
    }

    const reportUrl = `${siteUrl}/reports/${report.report_id}`;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: report.email,
        reply_to: replyTo,
        subject: "Your Ghostlayer Workflow Scan is ready",
        html: `
          <div style="font-family: Arial, sans-serif; background:#05070b; color:#ffffff; padding:32px;">
            <div style="max-width:640px; margin:0 auto; background:#0b1018; border:1px solid rgba(255,255,255,0.12); border-radius:24px; padding:32px;">
              <p style="letter-spacing:0.28em; color:#67e8f9; font-size:12px; text-transform:uppercase;">Ghostlayer</p>

              <h1 style="font-size:28px; line-height:1.2; color:#ffffff;">
                Your Workflow Scan is ready
              </h1>

              <p style="color:#cbd5e1; line-height:1.7;">
                Hi ${report.client_name},
              </p>

              <p style="color:#cbd5e1; line-height:1.7;">
                Your Ghostlayer Workflow Scan is ready. I reviewed your workflow details and prepared a report showing the main friction points, bottlenecks, and recommended fixes.
              </p>

              <p style="color:#cbd5e1; line-height:1.7;">
                Main priority:
                <strong style="color:#ffffff;">
                  ${
                    report.main_recommendation ||
                    "Review the highest-priority workflow bottleneck first."
                  }
                </strong>
              </p>

              <p style="margin:28px 0;">
                <a href="${reportUrl}" style="background:#ffffff; color:#000000; padding:14px 20px; border-radius:14px; text-decoration:none; font-weight:700;">
                  View Your Workflow Scan
                </a>
              </p>

              <p style="color:#94a3b8; font-size:14px; line-height:1.7;">
                If you have questions, reply to this email.
              </p>

              <p style="color:#cbd5e1; line-height:1.7;">
                Dexter<br />
                Ghostlayer
              </p>
            </div>
          </div>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      throw new Error(`Resend failed: ${errorText}`);
    }

    await markEmailSent(reportId);

    return NextResponse.json({
      ok: true,
      sentTo: report.email,
      reportUrl,
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
