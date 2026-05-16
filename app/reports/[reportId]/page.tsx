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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_12%,rgba(34,211,238,0.10),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(59,130,246,0.10),transparent_28%),radial-gradient(circle_at_50%_100%,rgba(147,197,253,0.045),transparent_34%)]" />
      <div className="absolute left-[-10%] top-[18%] h-[170px] w-[120%] rounded-full bg-gradient-to-r from-transparent via-cyan-200/10 to-transparent blur-[92px] animate-[reportFogOne_42s_ease-in-out_infinite]" />
      <div className="absolute left-[-10%] top-[58%] h-[170px] w-[120%] rounded-full bg-gradient-to-r from-transparent via-blue-300/10 to-transparent blur-[92px] animate-[reportFogTwo_46s_ease-in-out_infinite]" />
      {[
        ["6%", "10%"],
        ["12%", "32%"],
        ["25%", "18%"],
        ["42%", "12%"],
        ["51%", "38%"],
        ["68%", "20%"],
        ["77%", "50%"],
        ["86%", "16%"],
        ["94%", "70%"],
        ["30%", "88%"],
        ["59%", "74%"],
        ["90%", "40%"],
      ].map(([left, top], index) => (
        <span
          key={index}
          className="absolute block h-[2px] w-[2px] rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.95),0_0_18px_rgba(147,197,253,0.62)] animate-[reportTwinkle_5s_ease-in-out_infinite]"
          style={{ left, top, animationDelay: `${index * 0.35}s` }}
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
              <span className="text-cyan-100">ghostlayerbusiness@gmail.com</span>.
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
        0%, 100% { transform: translateY(0px) scale(0.85); opacity: 0.22; }
        25% { transform: translateY(-4px) scale(1.18); opacity: 1; }
        50% { transform: translateY(0px) scale(0.95); opacity: 0.42; }
        75% { transform: translateY(3px) scale(1.08); opacity: 0.78; }
      }
      @keyframes reportFogOne {
        0%, 100% { transform: translateX(-2%) translateY(0px) scaleX(1); }
        50% { transform: translateX(3%) translateY(-4px) scaleX(1.04); }
      }
      @keyframes reportFogTwo {
        0%, 100% { transform: translateX(3%) translateY(0px) scaleX(1.02); }
        50% { transform: translateX(-2%) translateY(5px) scaleX(1.06); }
      }
    `}</style>
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
        <a
          href="/"
          className="homepageLogoGlow inline-block text-lg font-bold tracking-[0.35em] text-white"
        >
          GHOSTLAYER
        </a>

        <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_24px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-10">
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">
            Workflow Scan Report
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            {report.company || report.client_name}
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-8 text-gray-300">
            Ghostlayer reviewed the workflow details submitted for this scan and
            identified the highest-priority sources of workflow friction,
            operational drag, and missed execution risk.
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
