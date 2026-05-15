import Link from "next/link";

type ClientReport = {
  id: string;
  report_id: string;
  client_name: string;
  company: string | null;
  email: string;
  risk_score: number | null;
  estimated_loss: string | null;
  status: string | null;
  email_sent: boolean | null;
  created_at: string | null;
  updated_at: string | null;
};

async function getReports(): Promise<ClientReport[]> {
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
    throw new Error("Could not load client reports.");
  }

  return response.json();
}

function NightSkyBackground() {
  const stars = [
    { left: "6%", top: "10%", size: 2, delay: "0s", duration: "4.8s", opacity: 0.75 },
    { left: "12%", top: "32%", size: 2, delay: "1.1s", duration: "5.4s", opacity: 0.7 },
    { left: "25%", top: "18%", size: 3, delay: "1.6s", duration: "5.8s", opacity: 0.78 },
    { left: "42%", top: "12%", size: 2, delay: "2.5s", duration: "5.6s", opacity: 0.72 },
    { left: "51%", top: "38%", size: 3, delay: "1.3s", duration: "5.2s", opacity: 0.82 },
    { left: "68%", top: "20%", size: 2, delay: "2.9s", duration: "5.3s", opacity: 0.76 },
    { left: "77%", top: "50%", size: 3, delay: "1.8s", duration: "4.7s", opacity: 0.85 },
    { left: "86%", top: "16%", size: 2, delay: "0.4s", duration: "5.7s", opacity: 0.72 },
    { left: "94%", top: "70%", size: 2, delay: "2.2s", duration: "5.1s", opacity: 0.7 },
    { left: "30%", top: "88%", size: 2, delay: "2.4s", duration: "5.2s", opacity: 0.58 },
    { left: "59%", top: "74%", size: 2, delay: "0.9s", duration: "5.5s", opacity: 0.6 },
    { left: "90%", top: "40%", size: 2, delay: "0.6s", duration: "4.9s", opacity: 0.68 },
    { left: "18%", top: "76%", size: 2, delay: "1.9s", duration: "5.7s", opacity: 0.54 },
    { left: "36%", top: "62%", size: 2, delay: "2.8s", duration: "5.1s", opacity: 0.62 },
    { left: "74%", top: "84%", size: 2, delay: "1.2s", duration: "5.9s", opacity: 0.56 },
  ];

  return (
    <div className="adminNightSky" aria-hidden="true">
      <div className="adminSkyGradient" />
      <div className="adminMoon" />
      <div className="adminFog adminFogA" />
      <div className="adminFog adminFogB" />
      <div className="adminOrb adminOrbA" />
      <div className="adminOrb adminOrbB" />

      {stars.map((star, index) => (
        <span
          key={index}
          className="adminStar"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: star.delay,
            animationDuration: star.duration,
            opacity: star.opacity,
          }}
        />
      ))}
    </div>
  );
}

function StatusBadge({
  status,
  emailSent,
}: {
  status: string | null;
  emailSent: boolean | null;
}) {
  const label = status || "Draft";

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

export default async function AdminReportsPage() {
  const reports = await getReports();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] text-white">
      <NightSkyBackground />

      <section className="relative z-10 mx-auto w-full max-w-7xl px-6 py-10">
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/"
                className="homepageLogoGlow inline-block text-lg font-bold tracking-[0.35em] text-white"
              >
                GHOSTLAYER
              </Link>

              <span className="adminWordGlow inline-block text-lg font-bold tracking-[0.35em] text-white">
                ADMIN
              </span>
            </div>

            <h1 className="mt-8 text-4xl font-bold tracking-tight sm:text-5xl">
              Client Reports
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-300">
              Manage workflow scan reports, create new report drafts, edit existing
              reports, open private report pages, and send finished report emails.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
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

            <Link
              href="/"
              className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:scale-[1.02] hover:bg-cyan-300/15"
            >
              Back Home
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] shadow-[0_24px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-6 py-5">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">
                Report Queue
              </p>
              <p className="mt-2 text-sm text-gray-400">
                {reports.length} report{reports.length === 1 ? "" : "s"} found
              </p>
            </div>

            <div className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-100">
              Founder Control
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="border-b border-white/10 bg-white/[0.03] text-xs uppercase tracking-[0.22em] text-gray-400">
                <tr>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Report ID</th>
                  <th className="px-6 py-4">Risk</th>
                  <th className="px-6 py-4">Loss</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {reports.map((report) => (
                  <tr
                    key={report.id}
                    className="border-b border-white/10 text-gray-200 transition hover:bg-white/[0.025] last:border-b-0"
                  >
                    <td className="px-6 py-5">
                      <div className="font-semibold text-white">
                        {report.client_name}
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        {report.company || "No company"}
                      </div>
                    </td>

                    <td className="px-6 py-5 text-gray-300">{report.email}</td>

                    <td className="px-6 py-5 font-mono text-xs text-cyan-200">
                      {report.report_id}
                    </td>

                    <td className="px-6 py-5">
                      {report.risk_score ? `${report.risk_score}/100` : "—"}
                    </td>

                    <td className="px-6 py-5">
                      {report.estimated_loss || "—"}
                    </td>

                    <td className="px-6 py-5">
                      <StatusBadge
                        status={report.status}
                        emailSent={report.email_sent}
                      />
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/reports/${report.report_id}`}
                          className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-semibold text-white transition hover:scale-[1.02] hover:bg-white/[0.09]"
                        >
                          View
                        </Link>

                        <Link
                          href={`/admin/reports/builder?reportId=${encodeURIComponent(
                            report.report_id
                          )}`}
                          className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-bold text-cyan-100 transition hover:scale-[1.02] hover:bg-cyan-300/15"
                        >
                          Edit
                        </Link>

                        <form action="/api/send-report" method="post">
                          <input
                            type="hidden"
                            name="reportId"
                            value={report.report_id}
                          />
                          <button
                            type="submit"
                            className="rounded-xl bg-white px-4 py-2 text-xs font-bold text-black shadow-[0_0_24px_rgba(255,255,255,0.18)] transition hover:scale-[1.02] hover:opacity-90"
                          >
                            Send Report
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}

                {reports.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-16 text-center text-gray-400"
                    >
                      No client reports yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 rounded-[2rem] border border-cyan-400/20 bg-cyan-400/10 p-6 shadow-[0_24px_100px_rgba(0,0,0,0.25)] backdrop-blur-xl">
          <h2 className="text-lg font-bold text-white">Founder note</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-300">
            This page is your internal Ghostlayer operating console. Use it to
            create reports, edit drafts, review client reports, open private report
            links, and send completed scan emails after your manual review is finished.
          </p>
        </div>
      </section>

      <style>{`
        .adminNightSky {
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

        .adminSkyGradient {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(2, 6, 23, 0.15), rgba(0, 0, 0, 0.38)),
            radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.32) 78%);
        }

        .adminMoon {
          position: absolute;
          right: 4%;
          top: 6%;
          width: min(36vw, 31rem);
          height: min(36vw, 31rem);
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
          opacity: 0.32;
          filter: saturate(0.9) contrast(1.08);
          animation: adminMoonGlow 4.8s ease-in-out infinite;
        }

        .adminStar {
          position: absolute;
          display: block;
          border-radius: 9999px;
          background: #ffffff;
          box-shadow:
            0 0 8px rgba(255, 255, 255, 0.95),
            0 0 18px rgba(147, 197, 253, 0.62),
            0 0 30px rgba(59, 130, 246, 0.35);
          animation-name: adminTwinkle;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        .adminOrb {
          position: absolute;
          border-radius: 9999px;
          filter: blur(92px);
          opacity: 0.24;
        }

        .adminOrbA {
          left: -10%;
          top: -8%;
          height: 26rem;
          width: 26rem;
          background: rgba(34, 211, 238, 0.07);
          animation: adminFloatSlow 26s ease-in-out infinite;
        }

        .adminOrbB {
          right: -10%;
          top: 18%;
          height: 22rem;
          width: 22rem;
          background: rgba(59, 130, 246, 0.07);
          animation: adminFloatSlow 28s ease-in-out infinite;
        }

        .adminFog {
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

        .adminFogA {
          top: 18%;
          animation: adminFogDriftOne 42s ease-in-out infinite;
        }

        .adminFogB {
          top: 58%;
          animation: adminFogDriftTwo 46s ease-in-out infinite;
        }

        .adminWordGlow {
          animation: adminWordPulseGlow 2.8s ease-in-out infinite;
          color: #ffffff;
          text-shadow:
            0 0 8px rgba(255, 255, 255, 0.70),
            0 0 18px rgba(255, 255, 255, 0.45),
            0 0 34px rgba(96, 165, 250, 0.36),
            0 0 52px rgba(59, 130, 246, 0.24);
        }

        @keyframes adminTwinkle {
          0%, 100% {
            transform: translateY(0px) scale(0.85);
            opacity: 0.22;
          }

          25% {
            transform: translateY(-4px) scale(1.18);
            opacity: 1;
          }

          50% {
            transform: translateY(0px) scale(0.95);
            opacity: 0.42;
          }

          75% {
            transform: translateY(3px) scale(1.08);
            opacity: 0.78;
          }
        }

        @keyframes adminFloatSlow {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(0, 10px, 0);
          }
        }

        @keyframes adminFogDriftOne {
          0%, 100% {
            transform: translateX(-2%) translateY(0px) scaleX(1);
          }

          50% {
            transform: translateX(3%) translateY(-4px) scaleX(1.04);
          }
        }

        @keyframes adminFogDriftTwo {
          0%, 100% {
            transform: translateX(3%) translateY(0px) scaleX(1.02);
          }

          50% {
            transform: translateX(-2%) translateY(5px) scaleX(1.06);
          }
        }

        @keyframes adminWordPulseGlow {
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

        @keyframes adminMoonGlow {
          0%, 100% {
            opacity: 0.24;
            box-shadow:
              0 0 34px rgba(255, 255, 255, 0.28),
              0 0 75px rgba(191, 219, 254, 0.24),
              0 0 135px rgba(96, 165, 250, 0.16),
              inset -42px -34px 70px rgba(15, 23, 42, 0.42),
              inset 18px 14px 44px rgba(255, 255, 255, 0.24);
          }

          50% {
            opacity: 0.42;
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
