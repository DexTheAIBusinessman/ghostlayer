import { NextResponse } from "next/server";

function cleanEmail(value: FormDataEntryValue | null) {
  return String(value || "").trim().toLowerCase();
}

async function patchTableEmail({
  supabaseUrl,
  serviceRoleKey,
  table,
  column,
  fromEmail,
  toEmail,
}: {
  supabaseUrl: string;
  serviceRoleKey: string;
  table: string;
  column: string;
  fromEmail: string;
  toEmail: string;
}) {
  const response = await fetch(
    `${supabaseUrl}/rest/v1/${table}?${column}=eq.${encodeURIComponent(fromEmail)}`,
    {
      method: "PATCH",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        [column]: toEmail,
        ...(table === "client_reports" ? { updated_at: new Date().toISOString() } : {}),
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Could not update ${table}: ${errorText}`);
  }
}

async function logAdminActivity({
  supabaseUrl,
  serviceRoleKey,
  fromEmail,
  toEmail,
}: {
  supabaseUrl: string;
  serviceRoleKey: string;
  fromEmail: string;
  toEmail: string;
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
      action: "admin_merged_client_email",
      client_email: toEmail,
      details: `Merged client portal records from ${fromEmail} to ${toEmail}`,
    }),
  });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const fromEmail = cleanEmail(formData.get("fromEmail"));
    const toEmail = cleanEmail(formData.get("toEmail"));

    if (!fromEmail || !toEmail || fromEmail === toEmail) {
      return NextResponse.redirect(
        new URL("/admin/merge-client?error=invalid", request.url),
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

    await Promise.all([
      patchTableEmail({
        supabaseUrl,
        serviceRoleKey,
        table: "client_reports",
        column: "email",
        fromEmail,
        toEmail,
      }),
      patchTableEmail({
        supabaseUrl,
        serviceRoleKey,
        table: "client_messages",
        column: "client_email",
        fromEmail,
        toEmail,
      }),
      patchTableEmail({
        supabaseUrl,
        serviceRoleKey,
        table: "client_uploads",
        column: "client_email",
        fromEmail,
        toEmail,
      }),
      patchTableEmail({
        supabaseUrl,
        serviceRoleKey,
        table: "client_monitoring_history",
        column: "client_email",
        fromEmail,
        toEmail,
      }),
    ]);

    await logAdminActivity({
      supabaseUrl,
      serviceRoleKey,
      fromEmail,
      toEmail,
    });

    return NextResponse.redirect(
      new URL(
        `/admin/merge-client?success=1&from=${encodeURIComponent(fromEmail)}&to=${encodeURIComponent(toEmail)}`,
        request.url
      ),
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
