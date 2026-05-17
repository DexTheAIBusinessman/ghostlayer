import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Client Dashboard | Ghostlayer",
  description: "Your Ghostlayer client dashboard.",
};

type Report = {
  id: string;
  report_id: string;
  client_name: string;
  company: string | null;
  email: string;
  risk_score: number | null;
  estimated_loss: string | null;
  time_lost: string | null;
  bottlenecks_found: number | null;
  status: string | null;
  email_sent: boolean | null;
  monitoring_active: boolean | null;
  monitoring_status: string | null;
  monitoring_cycle: string | null;
  last_monitoring_date: string | null;
  next_monitoring_date: string | null;
  monitoring_priority: string | null;
  monitoring_risk_change: string | null;
  report_access_enabled: boolean | null;
  report_access_code: string | null;
  last_client_viewed_at: string | null;
  client_view_count: number | null;
  created_at: string | null;
};

async function getClientReports(email: string): Promise<Report[]> {
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
    throw new Error(`Could not load reports: ${errorText}`);
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

function NightSkyBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#05070b]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(34,211,238,0.10),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(59,130,246,0.10),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.06),transparent_38%)]" />
      <div className="absolute left-[-18%] top-[12%] h-[260px] w-[140%] rounded-full bg-gradient-to-r from-transparent via-cyan-200/10 to-transparent blur-[105px] animate-[dashboardFogOne_42s_ease-in-out_infinite]" />
      <div className="absolute left-[-18%] top-[52%] h-[260px] w-[140%] rounded-full bg-gradient-to-r from-transparent via-blue-300/10 to-transparent blur-[110px] animate-[dashboardFogTwo_48s_ease-in-out_infinite]" />
      <div className="absolute bottom-[-16%] left-[-10%] h-[22rem] w-[52rem] rounded-full bg-emerald-300/10 blur-[120px] animate-[dashboardLowGlow_12s_ease-in-out_infinite]" />

      {[
        ["6%", "10%", "2px", "0s"],
        ["12%", "32%", "2px", "1.1s"],
        ["25%", "18%", "3px", "1.6s"],
        ["42%", "12%", "2px", "2.5s"],
        ["51%", "38%", "2px", "1.3s"],
        ["68%", "20%", "2px", "2.9s"],
        ["77%", "50%", "3px", "1.8s"],
        ["86%", "16%", "2px", "0.4s"],
        ["94%", "70%", "2px", "2.2s"],
        ["30%", "88%", "2px", "2.4s"],
      ].map(([left, top, size, delay], index) => (
        <span
          key={index}
          className="absolute block rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.95),0_0_18px_rgba(147,197,253,0.62),0_0_34px_rgba(34,211,238,0.25)] animate-[dashboardTwinkle_5.5s_ease-in-out_infinite]"
          style={{
            left,
            top,
            width: size,
            height: size,
            animationDelay: delay,
          }}
        />
      ))}
    </div>
  );
}

function DashboardStyles() {
  return (
    <style>{`
      .dashboardLogoGlow {
        animation: dashboardLogoGlow 2.8s ease-in-out infinite;
        color: #ffffff;
        text-shadow:
          0 0 8px rgba(255, 255, 255, 0.70),
          0 0 18px rgba(255, 255, 255, 0.45),
          0 0 34px rgba(96, 165, 250, 0.36),
          0 0 52px rgba(59, 130, 246, 0.24);
      }

      @keyframes dashboardLogoGlow {
        0%, 100% {
          opacity: 0.82;
          text-shadow:
            0 0 7px rgba(255, 255, 255, 0.46),
            0 0 16px rgba(96, 165, 250, 0.24),
            0 0 34px rgba(59, 130, 246, 0.16);
        }

        50% {
          opacity: 1;
          text-shadow:
            0 0 12px rgba(255, 255, 255, 0.95),
            0 0 26px rgba(255, 255, 255, 0.58),
            0 0 48px rgba(147, 197, 253, 0.42),
            0 0 76px rgba(59, 130, 246, 0.30);
        }
      }

      @keyframes dashboardTwinkle {
        0%, 100% { transform: translateY(0px) scale(0.75); opacity: 0.18; }
        25% { transform: translateY(-4px) scale(1.2); opacity: 1; }
        50% { transform: translateY(0px) scale(0.95); opacity: 0.42; }
        75% { transform: translateY(3px) scale(1.08); opacity: 0.78; }
      }

      @keyframes dashboardFogOne {
        0%, 100% { transform: translateX(-3%) translateY(0px) scaleX(1); opacity: 0.62; }
        50% { transform: translateX(4%) translateY(-10px) scaleX(1.08); opacity: 0.9; }
      }

      @keyframes dashboardFogTwo {
        0%, 100% { transform: translateX(4%) translateY(0px) scaleX(1.02); opacity: 0.52; }
        50% { transform: translateX(-3%) translateY(9px) scaleX(1.1); opacity: 0.88; }
      }

      @keyframes dashboardLowGlow {
        0%, 100% { opacity: 0.34; transform: translateY(0px) scale(1); }
        50% { opacity: 0.7; transform: translateY(-12px) scale(1.04); }
      }
    `}</style>
  );
}

export default async function ClientDashboardPage() {
  const cookieStore = await cookies();
  const clientEmail = cookieStore.get("ghostlayer_client_email")?.value;

  if (!clientEmail) {
    redirect("/login?error=login-required");
  }

  const reports = await getClientReports(clientEmail);

  const sentReports = reports.filter(
    (report) => report.email_sent || report.status === "Report Sent"
  );

  const draftReports = reports.filter(
    (report) => !report.email_sent && report.status !== "Report Sent"
  );

  const monitoringReports = reports.filter((report) => report.monitoring_active);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] text-white">
      <NightSkyBackground />

      <section className="relative z-10 mx-auto max-w-6xl px-6 py-10">
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/"
              className="dashboardLogoGlow inline-block text-lg font-bold tracking-[0.35em] text-white"
            >
              GHOSTLAYER
            </Link>

            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.45em] text-cyan-300">
              Client Dashboard
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Your Ghostlayer reports
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-300">
              Signed in as <span className="text-cyan-100">{clientEmail}</span>.
              This dashboard shows reports connected to your email.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/client/reports"
              className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:scale-[1.02] hover:bg-cyan-300/15"
            >
              Unlocked Reports
            </Link>

            <Link
              href="/logout"
              className="rounded-2xl border border-red-300/20 bg-red-300/10 px-5 py-3 text-sm font-semibold text-red-100 transition hover:scale-[1.02] hover:bg-red-300/15"
            >
              Logout
            </Link>
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] border border-cyan-300/25 bg-cyan-300/10 p-5 backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
              Total Reports
            </p>
            <p className="mt-4 text-3xl font-black tracking-tight text-white">
              {reports.length}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-emerald-300/25 bg-emerald-300/10 p-5 backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-200">
              Delivered
            </p>
            <p className="mt-4 text-3xl font-black tracking-tight text-white">
              {sentReports.length}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-purple-300/25 bg-purple-300/10 p-5 backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-purple-200">
              Monitoring
            </p>
            <p className="mt-4 text-3xl font-black tracking-tight text-white">
              {monitoringReports.length}
            </p>
          </div>
        </div>

        {draftReports.length > 0 ? (
          <div className="mb-8 rounded-[1.5rem] border border-yellow-300/25 bg-yellow-300/10 p-5">
            <p className="text-sm font-bold text-yellow-100">
              {draftReports.length} report
              {draftReports.length === 1 ? " is" : "s are"} being prepared.
            </p>
            <p className="mt-2 text-sm leading-6 text-yellow-100/80">
              Draft reports appear here so you know your scan was received. You
              will receive an email once the final report is ready.
            </p>
          </div>
        ) : null}

        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] shadow-[0_24px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="border-b border-white/10 px-6 py-5">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">
              Reports
            </p>
            <h2 className="mt-2 text-2xl font-bold">Workflow Scan Reports</h2>
          </div>

          <div className="divide-y divide-white/10">
            {reports.map((report) => {
              const delivered =
                report.email_sent || report.status === "Report Sent";

              return (
                <div
                  key={report.id}
                  className="flex flex-col gap-5 px-6 py-6 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-bold text-white">
                        {report.company || report.client_name}
                      </h3>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-bold ${
                          delivered
                            ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-100"
                            : "border-yellow-400/30 bg-yellow-400/10 text-yellow-100"
                        }`}
                      >
                        {delivered ? "Ready" : "Being Prepared"}
                      </span>
                    </div>

                    <p className="mt-2 font-mono text-xs text-cyan-200">
                      {report.report_id}
                    </p>

                    <p className="mt-2 text-sm text-gray-400">
                      Created {formatDate(report.created_at)}
                    </p>

                    {report.monitoring_active ? (
                      <p className="mt-2 text-sm text-purple-100">
                        Monthly monitoring:{" "}
                        {report.monitoring_status || "Active"}
                        {report.next_monitoring_date
                          ? ` · Next review ${report.next_monitoring_date}`
                          : ""}
                      </p>
                    ) : null}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[420px]">
                    <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-cyan-200">
                        Risk
                      </p>
                      <p className="mt-2 text-xl font-bold">
                        {report.risk_score ?? 0}/100
                      </p>
                    </div>

                    <div className="rounded-2xl border border-red-300/20 bg-red-300/10 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-red-200">
                        Drag
                      </p>
                      <p className="mt-2 text-xl font-bold">
                        {report.estimated_loss || "$0/mo"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-gray-300">
                        Time
                      </p>
                      <p className="mt-2 text-xl font-bold">
                        {report.time_lost || "0 hrs/week"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {delivered ? (
                      <Link
                        href={`/reports/${report.report_id}`}
                        className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-black shadow-[0_0_30px_rgba(255,255,255,0.18)] transition hover:scale-[1.02] hover:opacity-90"
                      >
                        View Report
                      </Link>
                    ) : (
                      <span className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-gray-400">
                        Not Ready Yet
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {reports.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <p className="text-lg font-bold text-white">
                  No reports found for this email yet.
                </p>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-gray-400">
                  Make sure you are using the same email address connected to
                  your Ghostlayer workflow scan or payment.
                </p>

                <Link
                  href="/workflow-scan"
                  className="mt-6 inline-block rounded-2xl bg-white px-6 py-3 text-sm font-bold text-black shadow-[0_0_30px_rgba(255,255,255,0.18)] transition hover:scale-[1.02] hover:opacity-90"
                >
                  Start Workflow Scan
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <DashboardStyles />
    </main>
  );
}
