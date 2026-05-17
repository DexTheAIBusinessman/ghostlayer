import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Monitoring History | Ghostlayer",
  description: "View your Ghostlayer monitoring history.",
};

type MonitoringItem = {
  id: string;
  report_id: string;
  client_email: string;
  title: string;
  status: string;
  summary: string | null;
  risk_change: string | null;
  priority: string | null;
  monitoring_period_start: string | null;
  monitoring_period_end: string | null;
  sent_at: string | null;
  created_at: string;
};

async function getMonitoringHistory(email: string): Promise<MonitoringItem[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase environment variables.");
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/client_monitoring_history?client_email=eq.${encodeURIComponent(
      email
    )}&select=*&order=created_at.desc`,
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
    throw new Error(`Could not load monitoring history: ${errorText}`);
  }

  return response.json();
}

function formatDate(value: string | null) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function PortalBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#05070b]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(34,211,238,0.10),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(59,130,246,0.10),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.06),transparent_38%)]" />
      <div className="absolute left-[-18%] top-[12%] h-[260px] w-[140%] rounded-full bg-gradient-to-r from-transparent via-cyan-200/10 to-transparent blur-[105px]" />
      <div className="absolute left-[-18%] top-[52%] h-[260px] w-[140%] rounded-full bg-gradient-to-r from-transparent via-blue-300/10 to-transparent blur-[110px]" />
    </div>
  );
}

export default async function ClientMonitoringPage() {
  const cookieStore = await cookies();
  const clientEmail = cookieStore.get("ghostlayer_client_email")?.value;

  if (!clientEmail) {
    redirect("/login?error=login-required");
  }

  const history = await getMonitoringHistory(clientEmail);

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
              Monitoring History
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Monthly monitoring updates
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-300">
              View monitoring updates and review notes connected to{" "}
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

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] shadow-[0_24px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="border-b border-white/10 px-6 py-5">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">
              History
            </p>
            <p className="mt-2 text-sm text-gray-400">
              {history.length} monitoring update{history.length === 1 ? "" : "s"} found.
            </p>
          </div>

          <div className="divide-y divide-white/10">
            {history.map((item) => (
              <div key={item.id} className="px-6 py-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">{item.title}</h2>
                    <p className="mt-2 font-mono text-xs text-cyan-200">
                      {item.report_id}
                    </p>
                    <p className="mt-2 text-sm text-gray-400">
                      Period: {formatDate(item.monitoring_period_start)} –{" "}
                      {formatDate(item.monitoring_period_end)}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-bold text-cyan-100">
                      {item.status}
                    </span>

                    {item.priority ? (
                      <span className="rounded-full border border-purple-300/20 bg-purple-300/10 px-3 py-1 text-xs font-bold text-purple-100">
                        {item.priority}
                      </span>
                    ) : null}

                    {item.risk_change ? (
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-bold text-gray-200">
                        Risk: {item.risk_change}
                      </span>
                    ) : null}
                  </div>
                </div>

                {item.summary ? (
                  <p className="mt-4 text-sm leading-7 text-gray-300">
                    {item.summary}
                  </p>
                ) : (
                  <p className="mt-4 text-sm leading-7 text-gray-500">
                    No summary added yet.
                  </p>
                )}
              </div>
            ))}

            {history.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <p className="text-lg font-bold text-white">
                  No monitoring history yet.
                </p>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-gray-400">
                  Monthly monitoring updates will appear here after they are created.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
