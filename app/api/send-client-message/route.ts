import { cookies } from "next/headers";
import { NextResponse } from "next/server";

function cleanText(value: FormDataEntryValue | null) {
  return String(value || "").trim();
}

async function logAdminActivity({
  action,
  clientEmail,
  reportId,
  details,
}: {
  action: string;
  clientEmail: string;
  reportId?: string | null;
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
      report_id: reportId || null,
      client_name: null,
      client_email: clientEmail,
      details: details || null,
    }),
  });
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const clientEmail = cookieStore.get("ghostlayer_client_email")?.value;

    if (!clientEmail) {
      return NextResponse.redirect(
        new URL("/login?error=login-required", request.url),
        303
      );
    }

    const formData = await request.formData();

    const subject = cleanText(formData.get("subject"));
    const message = cleanText(formData.get("message"));
    const reportId = cleanText(formData.get("reportId"));

    if (!message) {
      return NextResponse.redirect(
        new URL("/client/messages?error=missing", request.url),
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

    const response = await fetch(`${supabaseUrl}/rest/v1/client_messages`, {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        client_email: clientEmail,
        report_id: reportId || null,
        sender: "client",
        subject: subject || "Client message",
        message,
        status: "Open",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Could not send message: ${errorText}`);
    }

    await logAdminActivity({
      action: "client_message_sent",
      clientEmail,
      reportId: reportId || null,
      details: subject || "Client message",
    });

    return NextResponse.redirect(
      new URL("/client/messages?sent=1", request.url),
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
