import { NextResponse } from "next/server";

type ReplyRequestBody = {
  messageId?: string;
  clientEmail?: string;
  subject?: string;
  reply?: string;
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL =
  process.env.GHOSTLAYER_FROM_EMAIL || "Ghostlayer <support@ghostlayerhq.com>";

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

    if (!RESEND_API_KEY) {
      return jsonResponse({ error: "Missing RESEND_API_KEY." }, 500);
    }

    const body = (await request.json()) as ReplyRequestBody;

    const messageId = body.messageId?.trim();
    const clientEmail = body.clientEmail?.trim();
    const subject = body.subject?.trim() || "Client message";
    const reply = body.reply?.trim();

    if (!messageId) {
      return jsonResponse({ error: "Missing messageId." }, 400);
    }

    if (!clientEmail) {
      return jsonResponse({ error: "Missing clientEmail." }, 400);
    }

    if (!reply) {
      return jsonResponse({ error: "Reply message is required." }, 400);
    }

    const supabaseHeaders = {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    };

    const messageLookupResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/client_messages?id=eq.${encodeURIComponent(
        messageId
      )}&select=*`,
      {
        headers: supabaseHeaders,
        cache: "no-store",
      }
    );

    if (!messageLookupResponse.ok) {
      const errorText = await messageLookupResponse.text();
      return jsonResponse(
        { error: `Could not load client message: ${errorText}` },
        500
      );
    }

    const messages = await messageLookupResponse.json();
    const originalMessage = messages?.[0];

    if (!originalMessage) {
      return jsonResponse({ error: "Client message not found." }, 404);
    }

    const html = `
      <div style="font-family: Arial, sans-serif; background:#05070b; color:#ffffff; padding:32px;">
        <div style="max-width:680px; margin:0 auto; background:#111827; border:1px solid rgba(255,255,255,0.12); border-radius:24px; padding:28px;">
          <p style="letter-spacing:0.35em; font-size:13px; font-weight:700; color:#ffffff; text-shadow:0 0 16px rgba(255,255,255,0.55);">
            GHOSTLAYER
          </p>

          <h1 style="font-size:28px; margin:24px 0 12px;">
            Reply from Ghostlayer
          </h1>

          <p style="line-height:1.7; color:#d1d5db; white-space:pre-wrap;">${escapeHtml(
            reply
          )}</p>

          <div style="margin-top:28px; padding-top:20px; border-top:1px solid rgba(255,255,255,0.12); color:#9ca3af; font-size:14px;">
            <p><strong>Original subject:</strong> ${escapeHtml(subject)}</p>
            <p><strong>Original message:</strong></p>
            <p style="white-space:pre-wrap;">${escapeHtml(
              originalMessage.message || ""
            )}</p>
          </div>
        </div>
      </div>
    `;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: clientEmail,
        subject: `Re: ${subject}`,
        html,
        text: `Reply from Ghostlayer\n\n${reply}\n\nOriginal subject: ${subject}\nOriginal message:\n${
          originalMessage.message || ""
        }`,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      return jsonResponse(
        { error: `Resend email failed: ${errorText}` },
        500
      );
    }

    const emailData = await emailResponse.json();

    const updateResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/client_messages?id=eq.${encodeURIComponent(
        messageId
      )}`,
      {
        method: "PATCH",
        headers: {
          ...supabaseHeaders,
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          status: "Answered",
          admin_reply: reply,
          admin_replied_at: new Date().toISOString(),
          admin_reply_email_id: emailData?.id || null,
        }),
      }
    );

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      return jsonResponse(
        { error: `Reply email sent, but message update failed: ${errorText}` },
        500
      );
    }

    return jsonResponse({
      ok: true,
      emailId: emailData?.id || null,
      message: "Reply sent and message marked Answered.",
    });
  } catch (error) {
    return jsonResponse(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unknown admin reply error.",
      },
      500
    );
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
