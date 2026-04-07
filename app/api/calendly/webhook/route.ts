import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("Webhook received:", body);

    const payload = body.payload || {};

    const inviteeName = payload?.name || "N/A";
    const inviteeEmail = payload?.email || "N/A";
    const eventTypeName = payload?.event_type?.name || "N/A";
    const scheduledAt = payload?.scheduled_event?.start_time || "N/A";

    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.log("RESEND_API_KEY is missing. Skipping email send.");
      return NextResponse.json({ success: true, emailSkipped: true });
    }

    const resend = new Resend(resendApiKey);

    const result = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "stevensdexter17@gmail.com",
      replyTo: "dexterstevens801@gmail.com",
      subject: "New Calendly Booking",
      html: `
        <h2>New Booking</h2>
        <p><strong>Name:</strong> ${inviteeName}</p>
        <p><strong>Email:</strong> ${inviteeEmail}</p>
        <p><strong>Event Type:</strong> ${eventTypeName}</p>
        <p><strong>Scheduled At:</strong> ${scheduledAt}</p>
      `,
    });

    console.log("EMAIL RESULT:", result);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Webhook route error:", error);

    return NextResponse.json(
      { error: error.message || "Webhook failed" },
      { status: 500 }
    );
  }
}
