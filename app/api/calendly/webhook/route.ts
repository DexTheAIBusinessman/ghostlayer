import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export async function POST(req: Request) {
 try {
   const body = await req.json();

   console.log("Webhook received:", JSON.stringify(body, null, 2));

   const payload = body.payload || {};

   const calendlyEventUri =
     payload.event || payload.scheduled_event?.uri || null;

   const calendlyInviteeUri =
     payload.invitee?.uri || payload.invitee || null;

   const eventTypeName =
     payload.event_type?.name ||
     payload.scheduled_event?.event_type ||
     "30 Minute Meeting";

   const inviteeName =
     payload.name || payload.invitee?.name || "Unknown";

   const inviteeEmail =
     payload.email || payload.invitee?.email || "No email";

   const scheduledAt =
     payload.scheduled_event?.start_time ||
     payload.start_time ||
     null;

   const source =
     payload.tracking?.utm_source ||
     payload.questions_and_answers?.find(
       (q: any) => q.question?.toLowerCase() === "source"
     )?.answer ||
     "calendly";

   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
   const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

   if (!supabaseUrl || !supabaseServiceRoleKey) {
     console.error("Missing Supabase environment variables.");
     return NextResponse.json(
       { error: "Missing Supabase environment variables." },
       { status: 500 }
     );
   }

   const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

   const { error: insertError } = await supabase.from("bookings").insert([
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

   if (insertError) {
     console.error("Supabase insert error:", insertError);
     return NextResponse.json(
       { error: insertError.message },
       { status: 500 }
     );
   }

   console.log("Booking inserted successfully.");

   const resendApiKey = process.env.RESEND_API_KEY;

   if (resendApiKey) {
     try {
       const resend = new Resend(resendApiKey);

       const emailResult = await resend.emails.send({
         from: "onboarding@resend.dev",
         to: ["stevensdexter17@gmail.com"],
         replyTo: "dexterstevens801@gmail.com",
         subject: "New Calendly Booking",
         html: `
           <h2>New Booking</h2>
           <p><strong>Name:</strong> ${inviteeName}</p>
           <p><strong>Email:</strong> ${inviteeEmail}</p>
           <p><strong>Event Type:</strong> ${eventTypeName}</p>
           <p><strong>Scheduled At:</strong> ${scheduledAt ?? "Not provided"}</p>
           <p><strong>Source:</strong> ${source}</p>
         `,
       });

       console.log("EMAIL RESULT:", emailResult);
     } catch (emailError: any) {
       console.error("Resend email error:", emailError);
     }
   } else {
     console.log("RESEND_API_KEY missing. Skipping email send.");
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
