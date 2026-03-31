import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const event = body?.event;
    const payload = body?.payload;

    if (event !== "invitee.created") {
      return NextResponse.json({ received: true, ignored: true });
    }

    const invitee = payload?.invitee;
    const scheduledEvent = payload?.scheduled_event;
    const tracking = invitee?.tracking;

    const { error } = await supabase.from("bookings").insert([
      {
        calendly_event_uri: scheduledEvent?.uri ?? null,
        calendly_invitee_uri: invitee?.uri ?? null,
        event_type_name: scheduledEvent?.name ?? null,
        invitee_name: invitee?.name ?? null,
        invitee_email: invitee?.email ?? null,
        scheduled_at: invitee?.created_at ?? null,
        source: tracking?.utm_source ?? null,
      },
    ]);

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
