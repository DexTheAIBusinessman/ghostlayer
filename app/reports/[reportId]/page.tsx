import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

export const metadata = {
  title: "Workflow Scan Report | Ghostlayer",
  description: "Private Ghostlayer Workflow Scan report.",
};

type Report = {
  report_id: string;
  client_name: string;
  company: string | null;
  email: string;
  risk_score: number;
  estimated_loss: string;
  time_lost: string;
  bottlenecks_found: number;
  top_bottlenecks: string[];
  recommended_fixes: string[];
  next_steps: string[];
  main_recommendation: string | null;
  status: string;
  report_access_enabled: boolean | null;
  report_access_code: string | null;
  last_client_viewed_at: string | null;
  client_view_count: number | null;
};

async function getReport(reportId: string): Promise<Report | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase environment variables.");
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/client_reports?report_id=eq.${encodeURIComponent(
      reportId
    )}&select=*`,
    {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Could not load report.");
  }

  const data = await response.json();
  return data?.[0] ?? null;
}

async function trackClientView(reportId: string, currentCount: number | null) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) return;

  await fetch(
    `${supabaseUrl}/rest/v1/client_reports?report_id=eq.${encodeURIComponent(
      reportId
    )}`,
    {
      method: "PATCH",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        last_client_viewed_at: new Date().toISOString(),
        client_view_count: (currentCount || 0) + 1,
      }),
    }
  );
}

async function unlockReport(formData: FormData) {
  "use server";

  const reportId = String(formData.get("reportId") || "").trim();
  const accessCode = String(formData.get("accessCode") || "")
    .trim()
    .toUpperCase();

  if (!reportId || !accessCode) {
    redirect(`/reports/${reportId}?error=missing`);
  }

  const report = await getReport(reportId);

  if (!report) {
    redirect(`/reports/${reportId}?error=not-found`);
  }

  const expectedCode = String(report.report_access_code || "")
    .trim()
    .toUpperCase();

  if (!expectedCode || accessCode !== expectedCode) {
    redirect(`/reports/${reportId}?error=invalid`);
  }

  const cookieStore = await cookies();

  cookieStore.set(`ghostlayer_report_${reportId}`, expectedCode, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: `/reports/${reportId}`,
    maxAge: 60 * 60 * 24 * 30,
  });

  await trackClientView(reportId, report.client_view_count);

  redirect(`/reports/${reportId}`);
}

function NightSkyBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#05070b]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(34,211,238,0.10),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(59,130,246,0.10),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.06),transparent_38%)]" />

      <div className="absolute left-[-18%] top-[12%] h-[260px] w-[140%] rounded-full bg-gradient-to-r from-transparent via-cyan-200/10 to-transparent blur-[105px] animate-[reportFogOne_42s_ease-in-out_infinite]" />

      <div className="absolute left-[-18%] top-[52%] h-[260px] w-[140%] rounded-full bg-gradient-to-r from-transparent via-blue-300/10 to-transparent blur-[110px] animate-[reportFogTwo_48s_ease-in-out_infinite]" />

      <div className="absolute bottom-[-16%] left-[-10%] h-[22rem] w-[52rem] rounded-full bg-emerald-300/10 blur-[120px] animate-[reportLowGlow_12s_ease-in-out_infinite]" />

      <div className="absolute right-[-12%] top-[8%] h-[28rem] w-[28rem] rounded-full bg-blue-400/8 blur-[120px]" />

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
        ["59%", "74%", "2px", "1.7s"],
        ["90%", "40%", "2px", "0.9s"],
        ["18%", "74%", "3px", "2.8s"],
        ["73%", "82%", "2px", "1.4s"],
        ["38%", "64%", "2px", "3.1s"],
      ].map(([left, top, size, delay], index) => (
        <span
          key={index}
          className="absolute block rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.95),0_0_18px_rgba(147,197,253,0.62),0_0_34px_rgba(34,211,238,0.25)] animate-[reportTwinkle_5.5s_ease-in-out_infinite]"
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

function LockedReport({
  report,
  error,
}: {
  report: Report;
  error?: string;
}) {
  const errorMessage =
    error === "invalid"
      ? "That access code was incorrect. Try again."
      : error === "missing"
      ? "Enter your report access code to continue."
      : "";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] text-white">
      <NightSkyBackground />

      <section className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-16">
        <a
          href="/"
          className="homepageLogoGlow mb-10 inline-block text-lg font-bold tracking-[0.35em] text-white"
        >
          GHOSTLAYER
        </a>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_24px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-10">
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">
            Private Report
          </p>

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Unlock your Ghostlayer workflow scan.
          </h1>

          <p className="mt-5 text-sm leading-7 text-gray-300">
            This report is protected. Enter the access code from your Ghostlayer
            email to view the workflow scan for{" "}
            <span className="font-semibold text-white">
              {report.company || report.client_name}
            </span>
            .
          </p>

          <form action={unlockReport} className="mt-8 space-y-4">
            <input type="hidden" name="reportId" value={report.report_id} />

            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
                Access Code
              </span>
              <input
                name="accessCode"
                placeholder="Example: A1B2C3D4"
                autoComplete="one-time-code"
                required
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-300/50 focus:bg-black/40 focus:shadow-[0_0_28px_rgba(34,211,238,0.12)]"
              />
            </label>

            {errorMessage ? (
              <p className="text-sm font-semibold text-red-300">
                {errorMessage}
              </p>
            ) : null}

            <button
              type="submit"
              className="rounded-2xl bg-white px-6 py-3 text-sm font-bold text-black shadow-[0_0_30px_rgba(255,255,255,0.18)] transition hover:scale-[1.02] hover:opacity-90"
            >
              Unlock Report
            </button>
          </form>

          <div className="mt-8 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-5">
            <p className="text-sm leading-6 text-gray-300">
              Need help? Reply to your Ghostlayer email or contact{" "}
              <span className="text-cyan-100">
                ghostlayerbusiness@gmail.com
              </span>
              .
            </p>
          </div>
        </div>
      </section>

      <ReportStyles />
    </main>
  );
}

function ReportStyles() {
  return (
    <style>{`
      @keyframes reportTwinkle {
        0%, 100% {
          transform: translateY(0px) scale(0.75);
          opacity: 0.18;
        }

        25% {
          transform: translateY(-4px) scale(1.2);
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

      @keyframes reportFogOne {
        0%, 100% {
          transform: translateX(-3%) translateY(0px) scaleX(1);
          opacity: 0.62;
        }

        50% {
          transform: translateX(4%) translateY(-10px) scaleX(1.08);
          opacity: 0.9;
        }
      }

      @keyframes reportFogTwo {
        0%, 100% {
          transform: translateX(4%) translateY(0px) scaleX(1.02);
          opacity: 0.52;
        }

        50% {
          transform: translateX(-3%) translateY(9px) scaleX(1.1);
          opacity: 0.88;
        }
      }

      @keyframes reportLowGlow {
        0%, 100% {
          opacity: 0.34;
          transform: translateY(0px) scale(1);
        }

        50% {
          opacity: 0.7;
          transform: translateY(-12px) scale(1.04);
        }
      }

      .homepageLogoGlow {
        animation: reportLogoGlow 2.8s ease-in-out infinite;
        color: #ffffff;
        text-shadow:
          0 0 8px rgba(255, 255, 255, 0.70),
          0 0 18px rgba(255, 255, 255, 0.45),
          0 0 34px rgba(96, 165, 250, 0.36),
          0 0 52px rgba(59, 130, 246, 0.24);
      }

      @keyframes reportLogoGlow {
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


function hasCompletedReportContent(report: Report) {
  const hasRisk = Number(report.risk_score || 0) > 0;
  const hasDrag =
    Boolean(report.estimated_loss) &&
    !["$0/mo", "$0", "0", "0/mo"].includes(
      String(report.estimated_loss || "").trim().toLowerCase()
    );
  const hasTime =
    Boolean(report.time_lost) &&
    !["0 hrs/week", "0 hours/week", "0", ""].includes(
      String(report.time_lost || "").trim().toLowerCase()
    );
  const hasBottlenecks = Number(report.bottlenecks_found || 0) > 0;
  const hasRecommendation = Boolean(
    String(report.main_recommendation || "").trim()
  );

  return (
    report.status === "Report Sent" ||
    (hasRisk && hasDrag && hasTime && hasBottlenecks && hasRecommendation)
  );
}

export default async function ClientReportPage({
  params,
  searchParams,
}: {
  params: Promise<{ reportId: string }>;
  searchParams?: Promise<{ error?: string }>;
}) {
  const { reportId } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const report = await getReport(reportId);

  if (!report) {
    notFound();
  }

  const accessEnabled = report.report_access_enabled !== false;
  const expectedCode = String(report.report_access_code || "").trim();

  if (accessEnabled && expectedCode) {
    const cookieStore = await cookies();
    const unlockCookie = cookieStore.get(`ghostlayer_report_${reportId}`)?.value;

    if (unlockCookie !== expectedCode) {
      return (
        <LockedReport report={report} error={resolvedSearchParams.error} />
      );
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] text-white">
      <NightSkyBackground />

      <section className="relative z-10 mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <a
            href="/"
            className="homepageLogoGlow inline-block text-lg font-bold tracking-[0.35em] text-white"
          >
            GHOSTLAYER
          </a>

          <a
            href="/client/reports"
            className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-white/[0.08]"
          >
            My Reports
          </a>
        </div>

        <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_24px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-10">
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">
            Workflow Scan Report
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            {report.company || report.client_name}
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-8 text-gray-300">
            {hasCompletedReportContent(report)
              ? "Ghostlayer reviewed the workflow details submitted for this scan and identified the highest-priority sources of workflow friction, operational drag, and missed execution risk."
              : "This workflow scan report is still being prepared. Once reviewed, it will show the highest-priority workflow friction, operational drag, missed execution risk, and recommended fixes."}
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">
                Risk Score
              </p>
              <p className="mt-3 text-4xl font-bold">
                {report.risk_score}/100
              </p>
            </div>

            <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-red-200">
                Estimated Drag
              </p>
              <p className="mt-3 text-4xl font-bold">
                {report.estimated_loss}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-gray-300">
                Time Lost
              </p>
              <p className="mt-3 text-3xl font-bold">{report.time_lost}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-gray-300">
                Bottlenecks
              </p>
              <p className="mt-3 text-4xl font-bold">
                {report.bottlenecks_found}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
              <h2 className="text-xl font-bold">Top Bottlenecks</h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-300">
                {(report.top_bottlenecks || []).map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
              <h2 className="text-xl font-bold">Recommended Fixes</h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-300">
                {(report.recommended_fixes || []).map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-6">
            <h2 className="text-xl font-bold">Main Priority</h2>
            <p className="mt-3 text-sm leading-7 text-gray-300">
              {report.main_recommendation ||
                "Prioritize the workflow issue creating the most delay, missed follow-up risk, or repeated manual work."}
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-6">
            <h2 className="text-xl font-bold">Next Steps</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-300">
              {(report.next_steps || []).map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <ReportStyles />
    </main>
  );
}
