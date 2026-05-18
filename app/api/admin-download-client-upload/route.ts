import { NextResponse } from "next/server";

type UploadRecord = {
  file_name: string;
  file_path: string;
  file_type: string | null;
};

function encodeStoragePath(path: string) {
  return path
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
}

function safeDownloadName(value: string) {
  return value.replace(/["\\]/g, "").trim() || "ghostlayer-upload";
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const uploadId = String(url.searchParams.get("id") || "").trim();

    if (!uploadId) {
      return NextResponse.json({ error: "Missing upload id." }, { status: 400 });
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
      `${supabaseUrl}/rest/v1/client_uploads?id=eq.${encodeURIComponent(
        uploadId
      )}&select=file_name,file_path,file_type&limit=1`,
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
        { error: `Could not load upload record: ${errorText}` },
        { status: 500 }
      );
    }

    const records = (await lookupResponse.json()) as UploadRecord[];
    const upload = records?.[0];

    if (!upload?.file_path) {
      return NextResponse.json({ error: "Upload not found." }, { status: 404 });
    }

    const storageResponse = await fetch(
      `${supabaseUrl}/storage/v1/object/client-uploads/${encodeStoragePath(
        upload.file_path
      )}`,
      {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
        cache: "no-store",
      }
    );

    if (!storageResponse.ok) {
      const errorText = await storageResponse.text();

      return NextResponse.json(
        { error: `Could not download file: ${errorText}` },
        { status: 500 }
      );
    }

    const fileBuffer = await storageResponse.arrayBuffer();

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": upload.file_type || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${safeDownloadName(
          upload.file_name
        )}"`,
        "Cache-Control": "no-store",
      },
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
