import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("Calendly webhook received:", JSON.stringify(body, null, 2));

    const payload = body.payload || {};

    // 🔥 Robust extraction (handles ALL payload variations)
    const calendlyEventUri =
      payload.event ||
      payload.scheduled_event?.uri ||
      null;

    const calendlyInviteeUri =
      payload.invitee?.uri ||
      payload.invitee ||
      payload.uri ||
      null;

    const eventTypeName =
      payload.event_type?.name ||
      payload.scheduled_event?.event_type?.name ||
      payload.scheduled_event?.event_type ||
      null;

    const inviteeName =
      payload.name ||
      payload.invitee?.name ||
      null;

    const inviteeEmail =
      payload.email ||
      payload.invitee?.email ||
      null;

    const scheduledAt =
      payload.scheduled_event?.start_time ||
      payload.start_time ||
      null;

    const source =
      payload.tracking?.utm_source ||
      payload.questions_and_answers?.find(
        (q: any) => q.question === "source"
      )?.answer ||
      null;

    const { error } = await supabase.from("bookings").insert([
      {
        calendly_event_uri: calendlyEventUri,
        calendly_invitee_uri: calendlyInviteeUri,
        event_type_name: eventTypeName,
        invitee_name: inviteeName,
        invitee_email: inviteeEmail,
        scheduled_at: scheduledAt,
        source: source,
      },
    ]);

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Webhook route error:", error);
    return NextResponse.json(
      { error: error.message || "Webhook failed" },
      { status: 500 }
    );
  }
}
