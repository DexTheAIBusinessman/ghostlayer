import { cookies } from "next/headers";
import { NextResponse } from "next/server";

type ClientReport = {
  stripe_customer_id: string | null;
};

async function getClientStripeCustomerId(email: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase environment variables.");
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/client_reports?email=eq.${encodeURIComponent(
      email
    )}&stripe_customer_id=not.is.null&select=stripe_customer_id&order=created_at.desc&limit=1`,
    {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Could not load billing customer: ${errorText}`);
  }

  const data = (await response.json()) as ClientReport[];

  return data?.[0]?.stripe_customer_id || null;
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const clientEmail = cookieStore.get("ghostlayer_client_email")?.value;

    if (!clientEmail) {
      return NextResponse.redirect(new URL("/login?error=login-required", request.url), 303);
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: "Missing STRIPE_SECRET_KEY." },
        { status: 500 }
      );
    }

    const customerId = await getClientStripeCustomerId(clientEmail);

    if (!customerId) {
      return NextResponse.redirect(
        new URL("/client/billing?error=no-customer", request.url),
        303
      );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ghostlayerhq.com";

    const params = new URLSearchParams();
    params.set("customer", customerId);
    params.set("return_url", `${siteUrl.replace(/\/$/, "")}/client/billing`);

    const response = await fetch("https://api.stripe.com/v1/billing_portal/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Stripe billing portal failed: ${errorText}`);
    }

    const data = await response.json();

    return NextResponse.redirect(data.url, 303);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
