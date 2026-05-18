import { NextResponse } from "next/server";


function encodeStoragePath(path: string) {
  return path
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
}


type UploadRecord = {
  file_path: string;
};

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
      )}&select=file_path&limit=1`,
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
        { error: `Could not load upload: ${errorText}` },
        { status: 500 }
      );
    }

    const records = (await lookupResponse.json()) as UploadRecord[];
    const filePath = records?.[0]?.file_path;

    if (!filePath) {
      return NextResponse.json({ error: "Upload not found." }, { status: 404 });
    }

    const signedResponse = await fetch(
      `${supabaseUrl}/storage/v1/object/sign/client-uploads/${encodeStoragePath(
        filePath
      )}`,
      {
        method: "POST",
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expiresIn: 60 * 10,
        }),
      }
    );

    if (!signedResponse.ok) {
      const errorText = await signedResponse.text();

      return NextResponse.json(
        { error: `Could not create signed download link: ${errorText}` },
        { status: 500 }
      );
    }

    const data = await signedResponse.json();
    const signedUrl = data.signedURL || data.signedUrl;

    if (!signedUrl) {
      return NextResponse.json(
        { error: "Signed URL was not returned." },
        { status: 500 }
      );
    }

    return NextResponse.redirect(new URL(signedUrl, supabaseUrl), 303);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
