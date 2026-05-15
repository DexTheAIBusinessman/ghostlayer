import Link from "next/link";
import { redirect } from "next/navigation";

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
  monitoring_notes: string | null;
  monitoring_priority: string | null;
  monitoring_risk_change: string | null;
  monitoring_last_sent_at: string | null;
};

type ReportFormValues = {
  report_id: string;
  client_name: string;
  company: string | null;
  email: string;
  risk_score: number | null;
  estimated_loss: string | null;
  time_lost: string | null;
  bottlenecks_found: number | null;
  top_bottlenecks: string[];
  recommended_fixes: string[];
  next_steps: string[];
  main_recommendation: string | null;
  status: string;
  email_sent: boolean;
  monitoring_active: boolean;
  monitoring_status: string;
  monitoring_cycle: string;
  last_monitoring_date: string | null;
  next_monitoring_date: string | null;
  monitoring_notes: string | null;
  monitoring_priority: string | null;
  monitoring_risk_change: string | null;
  monitoring_last_sent_at: string | null;
};

function cleanReportId(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseList(value: FormDataEntryValue | null) {
  if (!value) return [];

  return String(value)
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseNumber(value: FormDataEntryValue | null) {
  if (!value) return null;

  const parsed = Number(value);

  if (Number.isNaN(parsed)) return null;

  return parsed;
}

function listToText(items: string[] | null | undefined) {
  return Array.isArray(items) ? items.join("\n") : "";
}

function parseDate(value: FormDataEntryValue | null) {
  const date = String(value || "").trim();
  return date || null;
}

function parseCheckbox(value: FormDataEntryValue | null) {
  return value === "on" || value === "true";
}

async function getReport(reportId: string): Promise<ClientReport | null> {
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

async function saveReport(formData: FormData) {
  "use server";

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase environment variables.");
  }

  const rawReportId = String(formData.get("report_id") || "");
  const reportId = cleanReportId(rawReportId);

  if (!reportId) {
    throw new Error("Report ID is required.");
  }

  const clientName = String(formData.get("client_name") || "").trim();
  const email = String(formData.get("email") || "").trim();

  if (!clientName) {
    throw new Error("Client name is required.");
  }

  if (!email) {
    throw new Error("Client email is required.");
  }

  const existingEmailSent =
    String(formData.get("existing_email_sent") || "false") === "true";

  const report: ReportFormValues = {
    report_id: reportId,
    client_name: clientName,
    company: String(formData.get("company") || "").trim() || null,
    email,
    risk_score: parseNumber(formData.get("risk_score")),
    estimated_loss: String(formData.get("estimated_loss") || "").trim() || null,
    time_lost: String(formData.get("time_lost") || "").trim() || null,
    bottlenecks_found: parseNumber(formData.get("bottlenecks_found")),
    top_bottlenecks: parseList(formData.get("top_bottlenecks")),
    recommended_fixes: parseList(formData.get("recommended_fixes")),
    next_steps: parseList(formData.get("next_steps")),
    main_recommendation:
      String(formData.get("main_recommendation") || "").trim() || null,
    status: String(formData.get("status") || "Draft").trim() || "Draft",
    email_sent: existingEmailSent,
    monitoring_active: parseCheckbox(formData.get("monitoring_active")),
    monitoring_status:
      String(formData.get("monitoring_status") || "Not Started").trim() ||
      "Not Started",
    monitoring_cycle:
      String(formData.get("monitoring_cycle") || "Monthly").trim() || "Monthly",
    last_monitoring_date: parseDate(formData.get("last_monitoring_date")),
    next_monitoring_date: parseDate(formData.get("next_monitoring_date")),
    monitoring_notes:
      String(formData.get("monitoring_notes") || "").trim() || null,
    monitoring_priority:
      String(formData.get("monitoring_priority") || "").trim() || null,
    monitoring_risk_change:
      String(formData.get("monitoring_risk_change") || "").trim() || null,
    monitoring_last_sent_at: null,
  };

  const originalReportId = cleanReportId(
    String(formData.get("original_report_id") || reportId)
  );

  const checkResponse = await fetch(
    `${supabaseUrl}/rest/v1/client_reports?report_id=eq.${encodeURIComponent(
      originalReportId
    )}&select=id`,
    {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      cache: "no-store",
    }
  );

  if (!checkResponse.ok) {
    throw new Error("Could not check existing report.");
  }

  const existing = await checkResponse.json();

  if (existing?.length > 0) {
    const updateResponse = await fetch(
      `${supabaseUrl}/rest/v1/client_reports?report_id=eq.${encodeURIComponent(
        originalReportId
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
          ...report,
          updated_at: new Date().toISOString(),
        }),
      }
    );

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      throw new Error(`Could not update report: ${errorText}`);
    }
  } else {
    const createResponse = await fetch(`${supabaseUrl}/rest/v1/client_reports`, {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(report),
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      throw new Error(`Could not create report: ${errorText}`);
    }
  }

  redirect("/admin/reports");
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
    <div className="builderNightSky" aria-hidden="true">
      <div className="builderMoon" />
      <div className="builderFog builderFogA" />
      <div className="builderFog builderFogB" />
      <div className="builderOrb builderOrbA" />
      <div className="builderOrb builderOrbB" />

      {stars.map((star, index) => (
        <span
          key={index}
          className="builderStar"
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

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
  defaultValue = "",
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string | number;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
        {label}
      </span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        defaultValue={defaultValue}
        className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-300/50 focus:bg-black/40 focus:shadow-[0_0_28px_rgba(34,211,238,0.12)]"
      />
    </label>
  );
}

function TextArea({
  label,
  name,
  placeholder,
  rows = 5,
  required = false,
  defaultValue = "",
}: {
  label: string;
  name: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
        {label}
      </span>
      <textarea
        name={name}
        rows={rows}
        placeholder={placeholder}
        required={required}
        defaultValue={defaultValue}
        className="w-full resize-y rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-300/50 focus:bg-black/40 focus:shadow-[0_0_28px_rgba(34,211,238,0.12)]"
      />
      <p className="mt-2 text-xs text-gray-500">
        Put each item on its own line.
      </p>
    </label>
  );
}

export default async function ReportBuilderPage({
  searchParams,
}: {
  searchParams?: Promise<{ reportId?: string }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const reportId = resolvedSearchParams.reportId
    ? cleanReportId(resolvedSearchParams.reportId)
    : "";

  const report = reportId ? await getReport(reportId) : null;
  const isEditing = Boolean(report);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] text-white">
      <NightSkyBackground />

      <section className="relative z-10 mx-auto w-full max-w-6xl px-6 py-10">
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/"
                className="builderLogoGlow inline-block text-lg font-bold tracking-[0.35em] text-white"
              >
                GHOSTLAYER
              </Link>

              <span className="builderLogoGlow inline-block text-lg font-bold tracking-[0.35em] text-white">
                ADMIN
              </span>
            </div>

            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.45em] text-cyan-300">
              Report Builder
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              {isEditing ? "Edit Client Report" : "Create Client Report"}
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-300">
              {isEditing
                ? "Edit the saved workflow scan report. Changes update the private client report page immediately."
                : "Fill this out after your workflow review. Ghostlayer will save the report into Supabase and create the private client report page."}
            </p>
          </div>

          <Link
            href="/admin/reports"
            className="rounded-2xl border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:scale-[1.02] hover:bg-white/[0.08]"
          >
            Back to Reports
          </Link>
        </div>

        <form
          action={saveReport}
          className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_24px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8"
        >
          <input
            type="hidden"
            name="original_report_id"
            value={report?.report_id || ""}
          />
          <input
            type="hidden"
            name="existing_email_sent"
            value={report?.email_sent ? "true" : "false"}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <Field
              label="Client Name"
              name="client_name"
              placeholder="Example: Dexter Test"
              required
              defaultValue={report?.client_name || ""}
            />

            <Field
              label="Company"
              name="company"
              placeholder="Example: Ghostlayer"
              defaultValue={report?.company || ""}
            />

            <Field
              label="Client Email"
              name="email"
              type="email"
              placeholder="client@example.com"
              required
              defaultValue={report?.email || ""}
            />

            <Field
              label="Report ID"
              name="report_id"
              placeholder="example-company-workflow-scan"
              required
              defaultValue={report?.report_id || ""}
            />

            <Field
              label="Risk Score"
              name="risk_score"
              type="number"
              placeholder="72"
              defaultValue={report?.risk_score ?? ""}
            />

            <Field
              label="Estimated Loss"
              name="estimated_loss"
              placeholder="$3,300/mo"
              defaultValue={report?.estimated_loss || ""}
            />

            <Field
              label="Time Lost"
              name="time_lost"
              placeholder="11 hrs/week"
              defaultValue={report?.time_lost || ""}
            />

            <Field
              label="Bottlenecks Found"
              name="bottlenecks_found"
              type="number"
              placeholder="7"
              defaultValue={report?.bottlenecks_found ?? ""}
            />
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <TextArea
              label="Top Bottlenecks"
              name="top_bottlenecks"
              placeholder={"Missed follow-ups\nApproval delays\nRepeated manual updates"}
              defaultValue={listToText(report?.top_bottlenecks)}
            />

            <TextArea
              label="Recommended Fixes"
              name="recommended_fixes"
              placeholder={"Assign one owner for each follow-up\nCreate one status tracker\nReduce duplicate reporting"}
              defaultValue={listToText(report?.recommended_fixes)}
            />

            <TextArea
              label="Next Steps"
              name="next_steps"
              placeholder={"Review the main bottleneck\nPrioritize follow-up ownership\nStart monthly monitoring if needed"}
              defaultValue={listToText(report?.next_steps)}
            />

            <TextArea
              label="Main Recommendation"
              name="main_recommendation"
              rows={7}
              placeholder="Fix missed follow-ups first by assigning one clear owner and one follow-up status for every active client."
              required
              defaultValue={report?.main_recommendation || ""}
            />
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
                Status
              </span>
              <select
                name="status"
                defaultValue={report?.status || "Draft"}
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/50 focus:bg-black/40"
              >
                <option value="Draft">Draft</option>
                <option value="Ready">Ready</option>
                <option value="Report Sent">Report Sent</option>
              </select>
            </label>

            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
                Private Report URL
              </p>
              <p className="mt-3 text-sm leading-6 text-gray-300">
                This report lives at:
              </p>
              <p className="mt-2 font-mono text-xs text-cyan-100">
                /reports/{report?.report_id || "YOUR-REPORT-ID"}
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-[2rem] border border-emerald-400/20 bg-emerald-400/10 p-6">
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-200">
                Monthly Monitoring
              </p>
              <h2 className="mt-3 text-2xl font-bold text-white">
                Monitoring Status
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-300">
                Use this section for clients on monthly monitoring. Workflow Scan
                clients can stay inactive until they upgrade.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-4">
                <input
                  name="monitoring_active"
                  type="checkbox"
                  defaultChecked={Boolean(report?.monitoring_active)}
                  className="h-5 w-5 accent-emerald-300"
                />
                <span>
                  <span className="block text-sm font-bold text-white">
                    Monitoring Active
                  </span>
                  <span className="mt-1 block text-xs text-gray-400">
                    Turn this on for monthly monitoring clients.
                  </span>
                </span>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
                  Monitoring Status
                </span>
                <select
                  name="monitoring_status"
                  defaultValue={report?.monitoring_status || "Not Started"}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/50 focus:bg-black/40"
                >
                  <option value="Not Started">Not Started</option>
                  <option value="Active">Active</option>
                  <option value="Needs Review">Needs Review</option>
                  <option value="Paused">Paused</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
                  Monitoring Cycle
                </span>
                <select
                  name="monitoring_cycle"
                  defaultValue={report?.monitoring_cycle || "Monthly"}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/50 focus:bg-black/40"
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Biweekly">Biweekly</option>
                  <option value="Quarterly">Quarterly</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
                  Monitoring Priority
                </span>
                <select
                  name="monitoring_priority"
                  defaultValue={report?.monitoring_priority || ""}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/50 focus:bg-black/40"
                >
                  <option value="">None</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </label>

              <Field
                label="Last Monitoring Date"
                name="last_monitoring_date"
                type="date"
                defaultValue={report?.last_monitoring_date || ""}
              />

              <Field
                label="Next Monitoring Date"
                name="next_monitoring_date"
                type="date"
                defaultValue={report?.next_monitoring_date || ""}
              />

              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
                  Risk Change
                </span>
                <select
                  name="monitoring_risk_change"
                  defaultValue={report?.monitoring_risk_change || ""}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/50 focus:bg-black/40"
                >
                  <option value="">None</option>
                  <option value="Improved">Improved</option>
                  <option value="No Change">No Change</option>
                  <option value="Worsened">Worsened</option>
                </select>
              </label>

              <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
                  Last Monitoring Sent
                </p>
                <p className="mt-3 text-sm text-gray-300">
                  {report?.monitoring_last_sent_at || "No monitoring update sent yet."}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <TextArea
                label="Monitoring Notes"
                name="monitoring_notes"
                rows={5}
                placeholder="Add internal monitoring notes, monthly changes, risks, and what to check next."
                defaultValue={report?.monitoring_notes || ""}
              />
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <button
              type="submit"
              className="rounded-2xl bg-white px-6 py-3 text-sm font-bold text-black shadow-[0_0_30px_rgba(255,255,255,0.22)] transition hover:scale-[1.02] hover:opacity-90"
            >
              {isEditing ? "Save Changes" : "Save Report"}
            </button>

            {report?.report_id ? (
              <Link
                href={`/reports/${report.report_id}`}
                className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-6 py-3 text-sm font-semibold text-cyan-100 transition hover:scale-[1.02] hover:bg-cyan-300/15"
              >
                Preview Report
              </Link>
            ) : null}

            <Link
              href="/admin/reports"
              className="rounded-2xl border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white transition hover:scale-[1.02] hover:bg-white/[0.08]"
            >
              Cancel
            </Link>
          </div>
        </form>
      </section>

      <style>{`
        .builderNightSky {
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

        .builderMoon {
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
          animation: builderMoonGlow 4.8s ease-in-out infinite;
        }

        .builderStar {
          position: absolute;
          display: block;
          border-radius: 9999px;
          background: #ffffff;
          box-shadow:
            0 0 8px rgba(255, 255, 255, 0.95),
            0 0 18px rgba(147, 197, 253, 0.62),
            0 0 30px rgba(59, 130, 246, 0.35);
          animation-name: builderTwinkle;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        .builderFog {
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

        .builderFogA {
          top: 18%;
          animation: builderFogDriftOne 42s ease-in-out infinite;
        }

        .builderFogB {
          top: 58%;
          animation: builderFogDriftTwo 46s ease-in-out infinite;
        }

        .builderOrb {
          position: absolute;
          border-radius: 9999px;
          filter: blur(92px);
          opacity: 0.24;
        }

        .builderOrbA {
          left: -10%;
          top: -8%;
          height: 26rem;
          width: 26rem;
          background: rgba(34, 211, 238, 0.07);
          animation: builderFloatSlow 26s ease-in-out infinite;
        }

        .builderOrbB {
          right: -10%;
          top: 18%;
          height: 22rem;
          width: 22rem;
          background: rgba(59, 130, 246, 0.07);
          animation: builderFloatSlow 28s ease-in-out infinite;
        }

        .builderLogoGlow {
          animation: builderWordPulseGlow 2.8s ease-in-out infinite;
          color: #ffffff;
          text-shadow:
            0 0 8px rgba(255, 255, 255, 0.70),
            0 0 18px rgba(255, 255, 255, 0.45),
            0 0 34px rgba(96, 165, 250, 0.36),
            0 0 52px rgba(59, 130, 246, 0.24);
        }

        @keyframes builderTwinkle {
          0%, 100% {
            transform: translateY(0px) scale(0.85);
            opacity: 0.22;
          }

          50% {
            transform: translateY(-4px) scale(1.18);
            opacity: 1;
          }
        }

        @keyframes builderFloatSlow {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(0, 10px, 0);
          }
        }

        @keyframes builderFogDriftOne {
          0%, 100% {
            transform: translateX(-2%) translateY(0px) scaleX(1);
          }

          50% {
            transform: translateX(3%) translateY(-4px) scaleX(1.04);
          }
        }

        @keyframes builderFogDriftTwo {
          0%, 100% {
            transform: translateX(3%) translateY(0px) scaleX(1.02);
          }

          50% {
            transform: translateX(-2%) translateY(5px) scaleX(1.06);
          }
        }

        @keyframes builderWordPulseGlow {
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

        @keyframes builderMoonGlow {
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
