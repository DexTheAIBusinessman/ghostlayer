import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Billing | Ghostlayer",
  description: "Manage your Ghostlayer billing.",
};

type Report = {
  id: string;
  report_id: string;
  company: string | null;
  client_name: string;
  email: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  status: string | null;
  monitoring_active: boolean | null;
  monitoring_status: string | null;
  created_at: string | null;
};

async function getReports(email: string): Promise<Report[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase environment variables.");
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/client_reports?email=eq.${encodeURIComponent(
      email
    )}&archived=eq.false&select=*&order=created_at.desc`,
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
    throw new Error(`Could not load billing records: ${errorText}`);
  }

  return response.json();
}

function PortalBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#05070b]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(34,211,238,0.10),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(59,130,246,0.10),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.06),transparent_38%)]" />
      <div className="absolute left-[-18%] top-[12%] h-[260px] w-[140%] rounded-full bg-gradient-to-r from-transparent via-cyan-200/10 to-transparent blur-[105px]" />
      <div className="absolute left-[-18%] top-[52%] h-[260px] w-[140%] rounded-full bg-gradient-to-r from-transparent via-blue-300/10 to-transparent blur-[110px]" />
      {["6%", "18%", "31%", "46%", "67%", "81%", "92%"].map((left, index) => (
        <span
          key={left}
          className="absolute h-[2px] w-[2px] rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)]"
          style={{ left, top: `${12 + index * 10}%` }}
        />
      ))}
    </div>
  );
}

export default async function ClientBillingPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const cookieStore = await cookies();
  const clientEmail = cookieStore.get("ghostlayer_client_email")?.value;

  if (!clientEmail) {
    redirect("/login?error=login-required");
  }

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const reports = await getReports(clientEmail);
  const hasStripeCustomer = reports.some((report) => report.stripe_customer_id);
  const hasActiveMonitoring = reports.some((report) => report.monitoring_active);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] text-white">
      <PortalBackground />

      <section className="relative z-10 mx-auto max-w-5xl px-6 py-10">
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/"
              className="inline-block text-lg font-bold tracking-[0.35em] text-white"
            >
              GHOSTLAYER
            </Link>

            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.45em] text-cyan-300">
              Client Billing
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Billing and subscription
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-300">
              Manage billing for the Ghostlayer account connected to{" "}
              <span className="text-cyan-100">{clientEmail}</span>.
            </p>
          </div>

          <Link
            href="/client/dashboard"
            className="rounded-2xl border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
          >
            Dashboard
          </Link>
        </div>

        {resolvedSearchParams.error === "no-customer" ? (
          <div className="mb-6 rounded-2xl border border-yellow-300/25 bg-yellow-300/10 p-5 text-yellow-100">
            Billing portal is not available yet for this account. This usually means the Stripe customer ID has not been attached to your Ghostlayer record yet.
          </div>
        ) : null}

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_24px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
                Billing Account
              </p>
              <p className="mt-3 text-2xl font-bold">
                {hasStripeCustomer ? "Connected" : "Not Connected"}
              </p>
            </div>

            <div className="rounded-2xl border border-purple-300/20 bg-purple-300/10 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-purple-200">
                Monitoring
              </p>
              <p className="mt-3 text-2xl font-bold">
                {hasActiveMonitoring ? "Active" : "Not Active"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-gray-300">
                Records
              </p>
              <p className="mt-3 text-2xl font-bold">{reports.length}</p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-6">
            <h2 className="text-xl font-bold text-white">Manage billing</h2>
            <p className="mt-3 text-sm leading-7 text-gray-300">
              Use the secure Stripe billing portal to update payment details, view billing information, or manage your subscription when available.
            </p>

            <form action="/api/create-billing-portal-session" method="post" className="mt-6">
              <button
                type="submit"
                className="rounded-2xl bg-white px-6 py-3 text-sm font-bold text-black shadow-[0_0_30px_rgba(255,255,255,0.18)] transition hover:scale-[1.02] hover:opacity-90"
              >
                Open Billing Portal
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
