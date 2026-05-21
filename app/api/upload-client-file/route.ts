import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_FILE_TYPES = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "text/plain",
  "text/csv",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);

const ALLOWED_FILE_EXTENSIONS = new Set([
  ".pdf",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".txt",
  ".csv",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
]);

function safeFileName(value: string) {
  return value
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 120);
}

async function logAdminActivity({
  clientEmail,
  reportId,
  details,
}: {
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
      action: "client_file_uploaded",
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

    const file = formData.get("file");
    const reportId = String(formData.get("reportId") || "").trim();
    const notes = String(formData.get("notes") || "").trim();

    if (!(file instanceof File)) {
      return NextResponse.redirect(
        new URL("/client/uploads?error=missing-file", request.url),
        303
      );
    }

    if (file.size <= 0) {
      return NextResponse.redirect(
        new URL("/client/uploads?error=empty-file", request.url),
        303
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.redirect(
        new URL("/client/uploads?error=file-too-large", request.url),
        303
      );
    }

    const fileType = file.type || "application/octet-stream";
    const lowerFileName = file.name.toLowerCase();
    const hasAllowedExtension = Array.from(ALLOWED_FILE_EXTENSIONS).some(
      (extension) => lowerFileName.endsWith(extension)
    );

    if (!ALLOWED_FILE_TYPES.has(fileType) && !hasAllowedExtension) {
      return NextResponse.redirect(
        new URL("/client/uploads?error=file-type-not-allowed", request.url),
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

    const timestamp = Date.now();
    const originalName = safeFileName(file.name || "upload");
    const emailFolder = clientEmail.replace(/[^a-zA-Z0-9._-]+/g, "-");
    const filePath = `${emailFolder}/${timestamp}-${originalName}`;

    const uploadResponse = await fetch(
      `${supabaseUrl}/storage/v1/object/client-uploads/${encodeURIComponent(
        filePath
      )}`,
      {
        method: "POST",
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
          "Content-Type": file.type || "application/octet-stream",
          "x-upsert": "false",
        },
        body: await file.arrayBuffer(),
      }
    );

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      throw new Error(`File upload failed: ${errorText}`);
    }

    const recordResponse = await fetch(`${supabaseUrl}/rest/v1/client_uploads`, {
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
        file_name: file.name || originalName,
        file_path: filePath,
        file_type: file.type || null,
        file_size: file.size,
        notes: notes || null,
      }),
    });

    if (!recordResponse.ok) {
      const errorText = await recordResponse.text();
      throw new Error(`Could not save upload record: ${errorText}`);
    }

    await logAdminActivity({
      clientEmail,
      reportId: reportId || null,
      details: file.name || originalName,
    });

    return NextResponse.redirect(
      new URL("/client/uploads?uploaded=1", request.url),
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
