import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function getSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return {
      supabaseUrl: null,
      serviceRoleKey: null,
      error: "Missing Supabase environment variables.",
    };
  }

  return { supabaseUrl, serviceRoleKey, error: null };
}

async function insertRow(table: string, payload: Record<string, unknown>) {
  const { supabaseUrl, serviceRoleKey, error } = getSupabaseConfig();

  if (error || !supabaseUrl || !serviceRoleKey) {
    return { ok: false, error };
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    return {
      ok: false,
      error: data || `Could not insert into ${table}.`,
    };
  }

  return { ok: true, data };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input =
      body && typeof body === "object" && body.payload && typeof body.payload === "object"
        ? body.payload
        : body;

    const name = String(input.name || "").trim();
    const email = String(input.email || "").trim().toLowerCase();
    const company = String(input.company || "").trim();
    const phone = String(input.phone || "").trim();
    const message = String(input.message || "").trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const createdAt = new Date().toISOString();

    const leadResult = await insertRow("leads", {
      name,
      email,
      created_at: createdAt,
    });

    if (!leadResult.ok) {
      return NextResponse.json(
        { ok: false, error: "Lead insert failed.", details: leadResult.error },
        { status: 500 }
      );
    }

    const scanResult = await insertRow("scans", {
      company_name: company || name,
      team_size: "Not provided",
      bottleneck: message,
      saas_spend: "Not provided",
      analysis: `Workflow scan intake submitted by ${name}${phone ? `, phone ${phone}` : ""}.`,
      created_at: createdAt,
    });

    if (!scanResult.ok) {
      return NextResponse.json(
        { ok: false, error: "Scan insert failed.", details: scanResult.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      lead: leadResult.data,
      scan: scanResult.data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown intake error.",
      },
      { status: 500 }
    );
  }
}
