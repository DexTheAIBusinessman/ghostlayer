import Link from "next/link";

type ClientReport = {
  id: string;
  report_id: string;
  client_name: string;
  company: string | null;
  email: string;
  risk_score: number | null;
  estimated_loss: string | null;
  time_lost: string | null;
  bottlenecks_found: number | null;
  top_bottlenecks: string[] | null;
  recommended_fixes: string[] | null;
  next_steps: string[] | null;
  main_recommendation: string | null;
  status: string | null;
  email_sent: boolean | null;
  monitoring_active: boolean | null;
  monitoring_status: string | null;
  monitoring_cycle: string | null;
  last_monitoring_date: string | null;
  next_monitoring_date: string | null;
  monitoring_priority: string | null;
  monitoring_risk_change: string | null;
  monitoring_last_sent_at: string | null;
  report_access_enabled: boolean | null;
  report_access_code: string | null;
  last_client_viewed_at: string | null;
  client_view_count: number | null;
  created_at: string | null;
  updated_at: string | null;
};

async function getClientReports(): Promise<ClientReport[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase environment variables.");
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/client_reports?select=*&order=created_at.desc`,
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
    throw new Error(`Could not load client reports: ${errorText}`);
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

function StatusBadge({
  status,
  emailSent,
}: {
  status: string | null;
  emailSent: boolean | null;
}) {
  const label = emailSent || status === "Report Sent" ? "Report Sent" : status || "Draft";

  const className =
    emailSent || label === "Report Sent"
      ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.25)]"
      : "border-yellow-400/40 bg-yellow-400/10 text-yellow-200 shadow-[0_0_18px_rgba(250,204,21,0.15)]";

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${className}`}
    >
      {label}
    </span>
  );
}

function MonitoringBadge({
  active,
  status,
  nextDate,
  priority,
}: {
  active: boolean | null;
  status: string | null;
  nextDate: string | null;
  priority: string | null;
}) {
  if (!active) {
    return (
      <div>
        <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-gray-300">
          Not Active
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <span className="inline-flex rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200 shadow-[0_0_18px_rgba(16,185,129,0.2)]">
        {status || "Active"}
      </span>

      {nextDate ? (
        <div className="text-xs text-gray-400">Next: {nextDate}</div>
      ) : null}

      {priority ? (
        <div className="text-xs text-cyan-200">Priority: {priority}</div>
      ) : null}
    </div>
  );
}

function NightSkyBackground() {
  const stars = [
    { left: "6%", top: "10%", size: 2, delay: "0s", duration: "4.8s" },
    { left: "12%", top: "32%", size: 2, delay: "1.1s", duration: "5.4s" },
    { left: "25%", top: "18%", size: 3, delay: "1.6s", duration: "5.8s" },
    { left: "42%", top: "12%", size: 2, delay: "2.5s", duration: "5.6s" },
    { left: "51%", top: "38%", size: 3, delay: "1.3s", duration: "5.2s" },
    { left: "68%", top: "20%", size: 2, delay: "2.9s", duration: "5.3s" },
    { left: "77%", top: "50%", size: 3, delay: "1.8s", duration: "4.7s" },
    { left: "86%", top: "16%", size: 2, delay: "0.4s", duration: "5.7s" },
    { left: "94%", top: "70%", size: 2, delay: "2.2s", duration: "5.1s" },
    { left: "30%", top: "88%", size: 2, delay: "2.4s", duration: "5.2s" },
  ];

  return (
    <div className="adminReportsNightSky" aria-hidden="true">
      <div className="adminReportsMoon" />
      <div className="adminReportsFog adminReportsFogA" />
      <div className="adminReportsFog adminReportsFogB" />
      <div className="adminReportsOrb adminReportsOrbA" />
      <div className="adminReportsOrb adminReportsOrbB" />

      {stars.map((star, index) => (
        <span
          key={index}
          className="adminReportsStar"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: star.delay,
            animationDuration: star.duration,
          }}
        />
      ))}
    </div>
  );
}

export default async function AdminReportsPage() {
  const reports = await getClientReports();
  const sendReportSecret = process.env.SEND_REPORT_SECRET || "";

  const totalReports = reports.length;
  const draftReports = reports.filter(
    (report) => !report.email_sent && report.status !== "Report Sent"
  ).length;
  const sentReports = reports.filter(
    (report) => report.email_sent || report.status === "Report Sent"
  ).length;
  const activeMonitoring = reports.filter(
    (report) => report.monitoring_active
  ).length;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] text-white">
      <NightSkyBackground />

      <section className="relative z-10 mx-auto w-full max-w-7xl px-6 py-10">
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/"
                className="adminReportsLogoGlow inline-block text-lg font-bold tracking-[0.35em] text-white"
              >
                GHOSTLAYER
              </Link>

              <span className="adminReportsLogoGlow inline-block text-lg font-bold tracking-[0.35em] text-white">
                ADMIN
              </span>
            </div>

            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.45em] text-cyan-300">
              Client Reports
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Report Command Center
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-300">
              Manage workflow scan drafts, edit reports, preview client pages,
              send report emails, and track monthly monitoring status.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/analytics"
              className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:scale-[1.02] hover:bg-cyan-300/15"
            >
              Analytics
            </Link>

            <Link
              href="/admin/reports/builder"
              className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-black shadow-[0_0_30px_rgba(255,255,255,0.22)] transition hover:scale-[1.02] hover:opacity-90"
            >
              Create Report
            </Link>

            <Link
              href="/dashboard"
              className="rounded-2xl border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:scale-[1.02] hover:bg-white/[0.08]"
            >
              Sample Dashboard
            </Link>
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[1.5rem] border border-cyan-300/25 bg-cyan-300/10 p-5 backdrop-blur-xl shadow-[0_0_36px_rgba(34,211,238,0.1)]">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
              Total Reports
            </p>
            <p className="mt-4 text-3xl font-black tracking-tight text-white">
              {totalReports}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-yellow-300/25 bg-yellow-300/10 p-5 backdrop-blur-xl shadow-[0_0_36px_rgba(250,204,21,0.1)]">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-yellow-200">
              Drafts
            </p>
            <p className="mt-4 text-3xl font-black tracking-tight text-white">
              {draftReports}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-emerald-300/25 bg-emerald-300/10 p-5 backdrop-blur-xl shadow-[0_0_36px_rgba(16,185,129,0.1)]">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-200">
              Sent
            </p>
            <p className="mt-4 text-3xl font-black tracking-tight text-white">
              {sentReports}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-purple-300/25 bg-purple-300/10 p-5 backdrop-blur-xl shadow-[0_0_36px_rgba(168,85,247,0.1)]">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-purple-200">
              Monitoring
            </p>
            <p className="mt-4 text-3xl font-black tracking-tight text-white">
              {activeMonitoring}
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] shadow-[0_24px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="border-b border-white/10 px-6 py-5">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">
              Report Queue
            </p>
            <h2 className="mt-2 text-2xl font-bold">Client Reports</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px] text-left text-sm">
              <thead className="border-b border-white/10 bg-black/20 text-xs uppercase tracking-[0.18em] text-gray-400">
                <tr>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Report ID</th>
                  <th className="px-6 py-4">Risk</th>
                  <th className="px-6 py-4">Estimated Drag</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Monitoring</th>
                  <th className="px-6 py-4">Access</th>
                  <th className="px-6 py-4">Created</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {reports.map((report) => (
                  <tr
                    key={report.id}
                    className="align-top transition hover:bg-white/[0.035]"
                  >
                    <td className="px-6 py-5">
                      <div className="font-bold text-white">
                        {report.client_name || "Unnamed Client"}
                      </div>

                      <div className="mt-1 text-sm text-gray-400">
                        {report.company || "No company"}
                      </div>

                      <div className="mt-1 text-xs text-cyan-200">
                        {report.email}
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="font-mono text-xs text-gray-300">
                        {report.report_id}
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="text-lg font-bold text-white">
                        {report.risk_score ?? 0}/100
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="font-bold text-white">
                        {report.estimated_loss || "$0/mo"}
                      </div>

                      <div className="mt-1 text-xs text-gray-400">
                        {report.time_lost || "0 hrs/week"}
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <StatusBadge
                        status={report.status}
                        emailSent={report.email_sent}
                      />
                    </td>

                    <td className="px-6 py-5">
                      <MonitoringBadge
                        active={report.monitoring_active}
                        status={report.monitoring_status}
                        nextDate={report.next_monitoring_date}
                        priority={report.monitoring_priority}
                      />
                    </td>

                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                            report.report_access_enabled !== false
                              ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200"
                              : "border-white/10 bg-white/[0.04] text-gray-300"
                          }`}
                        >
                          {report.report_access_enabled !== false
                            ? "Protected"
                            : "Open"}
                        </span>

                        <div className="font-mono text-xs text-gray-400">
                          {report.report_access_code || "No code"}
                        </div>

                        <div className="text-xs text-gray-500">
                          Views: {report.client_view_count || 0}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-gray-400">
                      {formatDate(report.created_at)}
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/admin/reports/builder?reportId=${encodeURIComponent(
                            report.report_id
                          )}`}
                          className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-bold text-cyan-100 transition hover:bg-cyan-300/15"
                        >
                          Edit
                        </Link>

                        <Link
                          href={`/reports/${encodeURIComponent(report.report_id)}`}
                          className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-bold text-white transition hover:bg-white/[0.09]"
                        >
                          Preview
                        </Link>

                        {!report.email_sent ? (
                          <form action="/api/send-report" method="post">
                            <input
                              type="hidden"
                              name="secret"
                              value={sendReportSecret}
                            />

                            <input
                              type="hidden"
                              name="reportId"
                              value={report.report_id}
                            />

                            <button
                              type="submit"
                              className="rounded-xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-xs font-bold text-emerald-100 transition hover:bg-emerald-300/15"
                            >
                              Send Report
                            </button>
                          </form>
                        ) : (
                          <span className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold text-gray-400">
                            Sent
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {reports.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-6 py-16 text-center text-gray-400"
                    >
                      No client reports yet.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <style>{`
        .adminReportsNightSky {
          pointer-events: none;
          position: fixed;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          background:
            radial-gradient(circle at 20% 12%, rgba(59, 130, 246, 0.11), transparent 28%),
            radial-gradient(circle at 82% 18%, rgba(147, 51, 234, 0.08), transparent 26%),
            radial-gradient(circle at 50% 100%, rgba(6, 182, 212, 0.045), transparent 34%),
            #05070b;
        }

        .adminReportsMoon {
          position: absolute;
          right: 3%;
          top: 5%;
          width: min(34vw, 30rem);
          height: min(34vw, 30rem);
          border-radius: 9999px;
          background:
            radial-gradient(circle at 32% 28%, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.92) 12%, rgba(226, 232, 240, 0.76) 30%, rgba(148, 163, 184, 0.42) 54%, rgba(30, 41, 59, 0.18) 78%, rgba(15, 23, 42, 0.04) 100%),
            radial-gradient(circle at 62% 42%, rgba(71, 85, 105, 0.22) 0 5%, transparent 6%),
            radial-gradient(circle at 46% 62%, rgba(71, 85, 105, 0.18) 0 7%, transparent 8%),
            radial-gradient(circle at 72% 68%, rgba(71, 85, 105, 0.14) 0 4%, transparent 5%),
            radial-gradient(circle at 28% 58%, rgba(71, 85, 105, 0.13) 0 5%, transparent 6%);
          box-shadow:
            0 0 44px rgba(255, 255, 255, 0.42),
            0 0 95px rgba(191, 219, 254, 0.36),
            0 0 165px rgba(96, 165, 250, 0.26),
            inset -42px -34px 70px rgba(15, 23, 42, 0.42),
            inset 18px 14px 44px rgba(255, 255, 255, 0.32);
          opacity: 0.24;
          animation: adminReportsMoonGlow 4.8s ease-in-out infinite;
        }

        .adminReportsStar {
          position: absolute;
          display: block;
          border-radius: 9999px;
          background: #ffffff;
          box-shadow:
            0 0 8px rgba(255, 255, 255, 0.95),
            0 0 18px rgba(147, 197, 253, 0.62),
            0 0 30px rgba(59, 130, 246, 0.35);
          animation-name: adminReportsTwinkle;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        .adminReportsFog {
          position: absolute;
          left: -10%;
          right: -10%;
          height: 170px;
          border-radius: 9999px;
          filter: blur(92px);
          opacity: 0.075;
          mix-blend-mode: screen;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0),
            rgba(147, 197, 253, 0.12),
            rgba(96, 165, 250, 0.11),
            rgba(255, 255, 255, 0)
          );
        }

        .adminReportsFogA {
          top: 18%;
          animation: adminReportsFogDriftOne 42s ease-in-out infinite;
        }

        .adminReportsFogB {
          top: 58%;
          animation: adminReportsFogDriftTwo 46s ease-in-out infinite;
        }

        .adminReportsOrb {
          position: absolute;
          border-radius: 9999px;
          filter: blur(92px);
          opacity: 0.24;
        }

        .adminReportsOrbA {
          left: -10%;
          top: -8%;
          height: 26rem;
          width: 26rem;
          background: rgba(34, 211, 238, 0.07);
          animation: adminReportsFloatSlow 26s ease-in-out infinite;
        }

        .adminReportsOrbB {
          right: -10%;
          top: 18%;
          height: 22rem;
          width: 22rem;
          background: rgba(59, 130, 246, 0.07);
          animation: adminReportsFloatSlow 28s ease-in-out infinite;
        }

        .adminReportsLogoGlow {
          animation: adminReportsWordPulseGlow 2.8s ease-in-out infinite;
          color: #ffffff;
          text-shadow:
            0 0 8px rgba(255, 255, 255, 0.70),
            0 0 18px rgba(255, 255, 255, 0.45),
            0 0 34px rgba(96, 165, 250, 0.36),
            0 0 52px rgba(59, 130, 246, 0.24);
        }

        @keyframes adminReportsTwinkle {
          0%, 100% {
            transform: translateY(0px) scale(0.85);
            opacity: 0.22;
          }

          50% {
            transform: translateY(-4px) scale(1.18);
            opacity: 1;
          }
        }

        @keyframes adminReportsFloatSlow {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(0, 10px, 0);
          }
        }

        @keyframes adminReportsFogDriftOne {
          0%, 100% {
            transform: translateX(-2%) translateY(0px) scaleX(1);
          }

          50% {
            transform: translateX(3%) translateY(-4px) scaleX(1.04);
          }
        }

        @keyframes adminReportsFogDriftTwo {
          0%, 100% {
            transform: translateX(3%) translateY(0px) scaleX(1.02);
          }

          50% {
            transform: translateX(-2%) translateY(5px) scaleX(1.06);
          }
        }

        @keyframes adminReportsWordPulseGlow {
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

        @keyframes adminReportsMoonGlow {
          0%, 100% {
            opacity: 0.2;
            box-shadow:
              0 0 34px rgba(255, 255, 255, 0.28),
              0 0 75px rgba(191, 219, 254, 0.24),
              0 0 135px rgba(96, 165, 250, 0.16),
              inset -42px -34px 70px rgba(15, 23, 42, 0.42),
              inset 18px 14px 44px rgba(255, 255, 255, 0.24);
          }

          50% {
            opacity: 0.34;
            box-shadow:
              0 0 52px rgba(255, 255, 255, 0.52),
              0 0 115px rgba(191, 219, 254, 0.42),
              0 0 205px rgba(96, 165, 250, 0.30),
              inset -42px -34px 70px rgba(15, 23, 42, 0.40),
              inset 18px 14px 44px rgba(255, 255, 255, 0.38);
          }
        }
      `}</style>
    </main>
  );
}
