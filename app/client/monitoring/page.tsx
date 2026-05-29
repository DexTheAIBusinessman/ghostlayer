import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import ClientPortalNightSky from "../_components/ClientPortalNightSky";

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
    redirect("/login?error=login-required&next=/client/monitoring");
  }

  const history = await getMonitoringHistory(clientEmail);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] text-white">
      
      <ClientPortalNightSky />
<PortalBackground />

      <section className="relative z-10 mx-auto max-w-5xl px-6 py-10">
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/"
              className="clientPortalLogoGlow inline-block text-lg font-bold tracking-[0.35em] text-white"
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


        <section className="mt-8 rounded-[2rem] border border-cyan-300/20 bg-cyan-300/10 p-6 shadow-[0_24px_100px_rgba(0,0,0,0.25)] backdrop-blur-xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-200">
            Monitoring Guidance
          </p>

          <h2 className="mt-3 text-2xl font-black text-white">
            What monitoring means
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-300">
            Monitoring helps Ghostlayer review follow-up context, workflow changes, report updates,
            and ongoing bottlenecks after your original workflow review. Monitoring is review-focused;
            it does not automatically change your accounts, tools, payments, files, or business systems.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-5">
              <h3 className="text-lg font-black text-white">
                What gets reviewed
              </h3>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-gray-300">
                <li>• New uploads connected to your workflow.</li>
                <li>• Client messages and follow-up notes.</li>
                <li>• Report changes, open recommendations, or unresolved bottlenecks.</li>
                <li>• Monitoring status, priority, and next review timing.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-5">
              <h3 className="text-lg font-black text-white">
                What you may need to do
              </h3>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-gray-300">
                <li>• Upload new screenshots, files, or process notes when something changes.</li>
                <li>• Send a message if a recommendation no longer matches your workflow.</li>
                <li>• Review updated report notes when Ghostlayer posts them.</li>
                <li>• Contact support if access, billing, privacy, or report delivery looks wrong.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-red-300/20 bg-red-300/10 p-5">
              <h3 className="text-lg font-black text-white">
                What is not automatic
              </h3>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-gray-300">
                <li>• Ghostlayer does not log in to your tools for you.</li>
                <li>• Ghostlayer does not change your accounts, billing, passwords, or systems.</li>
                <li>• Ghostlayer does not publish reports or send messages without admin review.</li>
                <li>• Ghostlayer does not guarantee a specific business outcome.</li>
              </ul>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-5">
            <h3 className="text-lg font-black text-white">
              When to send an update
            </h3>

            <p className="mt-3 text-sm leading-7 text-gray-300">
              Send an update when your workflow changes, a tool is replaced, a bottleneck is resolved,
              a recommendation does not fit anymore, or you have new files that explain what is happening.
              Include the report name, file name, or workflow area when possible.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="/client/messages"
                className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/[0.08]"
              >
                Send Message
              </a>
              <a
                href="/client/uploads"
                className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/[0.08]"
              >
                Upload Files
              </a>
              <a
                href="/contact"
                className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/[0.08]"
              >
                Contact Support
              </a>
            </div>
          </div>
        </section>
        <div className="h-24" aria-hidden="true" />


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
