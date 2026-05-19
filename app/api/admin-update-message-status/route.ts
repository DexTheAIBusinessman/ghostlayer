import { NextResponse } from "next/server";

type StatusRequestBody = {
  messageId?: string;
  status?: "Open" | "Answered";
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function jsonResponse(body: unknown, status = 200) {
  return NextResponse.json(body, { status });
}

export async function POST(request: Request) {
  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return jsonResponse(
        { error: "Missing Supabase environment variables." },
        500
      );
    }

    const body = (await request.json()) as StatusRequestBody;

    const messageId = body.messageId?.trim();
    const status = body.status;

    if (!messageId) {
      return jsonResponse({ error: "Missing messageId." }, 400);
    }

    if (status !== "Open" && status !== "Answered") {
      return jsonResponse({ error: "Invalid status." }, 400);
    }

    const updateBody =
      status === "Open"
        ? {
            status: "Open",
          }
        : {
            status: "Answered",
          };

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/client_messages?id=eq.${encodeURIComponent(
        messageId
      )}`,
      {
        method: "PATCH",
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify(updateBody),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return jsonResponse(
        { error: `Could not update message status: ${errorText}` },
        500
      );
    }

    const updated = await response.json();

    return jsonResponse({
      ok: true,
      status,
      message: `Message marked ${status}.`,
      updated,
    });
  } catch (error) {
    return jsonResponse(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unknown message status update error.",
      },
      500
    );
  }
}
