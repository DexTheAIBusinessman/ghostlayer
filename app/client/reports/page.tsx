import { cookies } from "next/headers";
import Link from "next/link";

export const metadata = {
  title: "My Reports | Ghostlayer",
  description: "View unlocked Ghostlayer reports.",
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
  report_access_enabled: boolean | null;
  report_access_code: string | null;
  last_client_viewed_at: string | null;
  client_view_count: number | null;
  created_at: string | null;
};

async function getReports(): Promise<Report[]> {
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
    throw new Error("Could not load reports.");
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
      <div className="absolute left-[-18%] top-[12%] h-[260px] w-[140%] rounded-full bg-gradient-to-r from-transparent via-cyan-200/10 to-transparent blur-[105px] animate-[portalFogOne_42s_ease-in-out_infinite]" />
      <div className="absolute left-[-18%] top-[52%] h-[260px] w-[140%] rounded-full bg-gradient-to-r from-transparent via-blue-300/10 to-transparent blur-[110px] animate-[portalFogTwo_48s_ease-in-out_infinite]" />
      <div className="absolute bottom-[-16%] left-[-10%] h-[22rem] w-[52rem] rounded-full bg-emerald-300/10 blur-[120px] animate-[portalLowGlow_12s_ease-in-out_infinite]" />

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
          className="absolute block rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.95),0_0_18px_rgba(147,197,253,0.62),0_0_34px_rgba(34,211,238,0.25)] animate-[portalTwinkle_5.5s_ease-in-out_infinite]"
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

function PortalStyles() {
  return (
    <style>{`
      @keyframes portalTwinkle {
        0%, 100% { transform: translateY(0px) scale(0.75); opacity: 0.18; }
        25% { transform: translateY(-4px) scale(1.2); opacity: 1; }
        50% { transform: translateY(0px) scale(0.95); opacity: 0.42; }
        75% { transform: translateY(3px) scale(1.08); opacity: 0.78; }
      }

      @keyframes portalFogOne {
        0%, 100% { transform: translateX(-3%) translateY(0px) scaleX(1); opacity: 0.62; }
        50% { transform: translateX(4%) translateY(-10px) scaleX(1.08); opacity: 0.9; }
      }

      @keyframes portalFogTwo {
        0%, 100% { transform: translateX(4%) translateY(0px) scaleX(1.02); opacity: 0.52; }
        50% { transform: translateX(-3%) translateY(9px) scaleX(1.1); opacity: 0.88; }
      }

      @keyframes portalLowGlow {
        0%, 100% { opacity: 0.34; transform: translateY(0px) scale(1); }
        50% { opacity: 0.7; transform: translateY(-12px) scale(1.04); }
      }

      .portalLogoGlow {
        animation: portalLogoGlow 2.8s ease-in-out infinite;
        color: #ffffff;
        text-shadow:
          0 0 8px rgba(255, 255, 255, 0.70),
          0 0 18px rgba(255, 255, 255, 0.45),
          0 0 34px rgba(96, 165, 250, 0.36),
          0 0 52px rgba(59, 130, 246, 0.24);
      }

      @keyframes portalLogoGlow {
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
    `}</style>
  );
}

export default async function ClientReportsPortalPage() {
  const allReports = await getReports();
  const cookieStore = await cookies();

  const unlockedReports = allReports.filter((report) => {
    const expectedCode = String(report.report_access_code || "").trim();

    if (!expectedCode) return false;

    const cookieValue = cookieStore.get(
      `ghostlayer_report_${report.report_id}`
    )?.value;

    return cookieValue === expectedCode;
  });

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] text-white">
      <NightSkyBackground />

      <section className="relative z-10 mx-auto max-w-5xl px-6 py-12">
        <Link
          href="/"
          className="portalLogoGlow inline-block text-lg font-bold tracking-[0.35em] text-white"
        >
          GHOSTLAYER
        </Link>

        <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_24px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-10">
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">
            Client Portal
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Your unlocked reports
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-300">
            This page shows Ghostlayer reports that have already been unlocked on
            this browser. To add another report, open its report link and enter
            the access code from your email.
          </p>

          <div className="mt-8 space-y-4">
            {unlockedReports.map((report) => (
              <Link
                key={report.id}
                href={`/reports/${report.report_id}`}
                className="block rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:scale-[1.01] hover:border-cyan-300/30 hover:bg-cyan-300/10"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-lg font-bold text-white">
                      {report.company || report.client_name}
                    </p>

                    <p className="mt-1 text-sm text-gray-400">
                      Workflow Scan Report · Created {formatDate(report.created_at)}
                    </p>

                    <p className="mt-2 font-mono text-xs text-cyan-200">
                      {report.report_id}
                    </p>
                  </div>

                  <div className="grid gap-2 text-sm md:text-right">
                    <p className="font-bold text-white">
                      Risk Score: {report.risk_score ?? 0}/100
                    </p>
                    <p className="text-gray-400">
                      Estimated Drag: {report.estimated_loss || "$0/mo"}
                    </p>
                    <p className="text-gray-400">
                      Views: {report.client_view_count || 0}
                    </p>
                  </div>
                </div>
              </Link>
            ))}

            {unlockedReports.length === 0 ? (
              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-6">
                <p className="font-bold text-white">No unlocked reports yet.</p>
                <p className="mt-2 text-sm leading-7 text-gray-300">
                  Open the report link from your Ghostlayer email and enter your
                  access code. After that, the report will appear here on this
                  browser.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <PortalStyles />
    </main>
  );
}
