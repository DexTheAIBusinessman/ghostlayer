import Link from "next/link";

export const metadata = {
  title: "Incident Response Agent | Ghostlayer Admin",
  description:
    "Read-only Ghostlayer Incident Response Agent for flagging possible security, billing, upload, report, access, and credential incidents.",
};

type GenericRow = Record<string, string | number | boolean | null | undefined>;

type IncidentItem = {
  id: string;
  source: "Activity" | "Message" | "Upload" | "Report" | "Monitoring";
  client: string;
  title: string;
  preview: string;
  date: string | null;
  severity: "Critical" | "High" | "Medium" | "Low";
  category: string;
  suggestedContainment: string;
  approvalRule: string;
  raw: GenericRow;
};

const activityTable = "admin_activity";
const messageTable = "client_messages";
const uploadTable = "client_uploads";
const reportTable = "client_reports";
const monitoringTable = "client_monitoring_history";

function getSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return {
      supabaseUrl: null,
      serviceRoleKey: null,
      error: "Missing Supabase environment variables.",
    };
  }

  return { supabaseUrl, serviceRoleKey, error: null };
}

async function getRecentRows(
  table: string,
  limit = 25
): Promise<{ rows: GenericRow[]; error?: string }> {
  const { supabaseUrl, serviceRoleKey, error } = getSupabaseConfig();

  if (error || !supabaseUrl || !serviceRoleKey) {
    return { rows: [], error: error || "Missing Supabase config." };
  }

  const baseUrl = `${supabaseUrl}/rest/v1/${table}?select=*&limit=${limit}`;

  try {
    const orderedResponse = await fetch(`${baseUrl}&order=created_at.desc`, {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      cache: "no-store",
    });

    if (orderedResponse.ok) {
      return { rows: await orderedResponse.json() };
    }

    const fallbackResponse = await fetch(baseUrl, {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      cache: "no-store",
    });

    if (!fallbackResponse.ok) {
      const errorText = await fallbackResponse.text().catch(() => "");
      return {
        rows: [],
        error: errorText || `Could not read ${table}.`,
      };
    }

    return { rows: await fallbackResponse.json() };
  } catch (err) {
    return {
      rows: [],
      error: err instanceof Error ? err.message : "Unknown error.",
    };
  }
}

function asText(value: unknown) {
  if (value === null || value === undefined) return "";
  return String(value);
}

function getClient(row: GenericRow) {
  return (
    asText(row.client_email) ||
    asText(row.email) ||
    asText(row.from_email) ||
    asText(row.sender_email) ||
    asText(row.customer_email) ||
    asText(row.uploaded_by) ||
    asText(row.client_name) ||
    asText(row.business_name) ||
    "Unknown / internal"
  );
}

function getTitle(row: GenericRow, source: IncidentItem["source"]) {
  return (
    asText(row.subject) ||
    asText(row.title) ||
    asText(row.event_type) ||
    asText(row.action) ||
    asText(row.file_name) ||
    asText(row.filename) ||
    asText(row.status) ||
    `${source} record`
  );
}

function getPreview(row: GenericRow) {
  return (
    asText(row.message) ||
    asText(row.body) ||
    asText(row.content) ||
    asText(row.note) ||
    asText(row.notes) ||
    asText(row.description) ||
    asText(row.summary) ||
    asText(row.action) ||
    asText(row.status) ||
    asText(row.file_name) ||
    "No preview available."
  );
}

function getDate(row: GenericRow) {
  const value =
    row.created_at ||
    row.updated_at ||
    row.sent_at ||
    row.uploaded_at ||
    row.timestamp ||
    row.createdAt ||
    null;

  return typeof value === "string" ? value : null;
}

function formatDate(value?: string | null) {
  if (!value) return "Unknown date";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function classifyIncident(
  row: GenericRow,
  source: IncidentItem["source"]
): Omit<IncidentItem, "id" | "source" | "client" | "title" | "preview" | "date" | "raw"> {
  const text = `${getTitle(row, source)} ${getPreview(row)} ${asText(row.status)} ${asText(row.type)}`.toLowerCase();

  if (
    text.includes("secret") ||
    text.includes("credential") ||
    text.includes("password") ||
    text.includes("key leaked") ||
    text.includes("exposed key") ||
    text.includes("admin password") ||
    text.includes("service role")
  ) {
    return {
      severity: "Critical",
      category: "Credential / Secret Exposure",
      suggestedContainment:
        "Stop and contain immediately. Do not paste secrets anywhere. Rotate affected credentials in Vercel/Supabase/Stripe if confirmed, redeploy, and document the timeline.",
      approvalRule:
        "Admin must approve credential rotation, incident notes, and any client notification.",
    };
  }

  if (
    text.includes("wrong client") ||
    text.includes("someone else") ||
    text.includes("not mine") ||
    text.includes("wrong report") ||
    text.includes("wrong email") ||
    text.includes("access to another")
  ) {
    return {
      severity: "Critical",
      category: "Wrong Client Access / Data Exposure",
      suggestedContainment:
        "Pause affected workflow. Check reports, uploads, messages, merge history, and activity. Use Incident Response before contacting the client.",
      approvalRule:
        "Admin must approve containment, client notice, corrections, and documentation.",
    };
  }

  if (
    text.includes("refund") ||
    text.includes("chargeback") ||
    text.includes("dispute") ||
    text.includes("billing failed") ||
    text.includes("stripe error") ||
    text.includes("payment failed") ||
    text.includes("billing portal")
  ) {
    return {
      severity: "High",
      category: "Billing / Stripe Incident",
      suggestedContainment:
        "Review Stripe and billing portal status. Do not promise refunds until verified. Sanitize any client-facing billing errors.",
      approvalRule:
        "Admin must approve billing responses, refunds, and any Stripe changes.",
    };
  }

  if (
    text.includes("upload failed") ||
    text.includes("download failed") ||
    text.includes("file missing") ||
    text.includes("file not found") ||
    text.includes("private url") ||
    text.includes("public url") ||
    text.includes("storage")
  ) {
    return {
      severity: "High",
      category: "Upload / Storage Incident",
      suggestedContainment:
        "Check upload ownership, storage privacy, protected download route, file type, and report association before taking action.",
      approvalRule:
        "Admin must approve file deletion, recovery, client response, or report attachment changes.",
    };
  }

  if (
    text.includes("report sent") ||
    text.includes("delivered") ||
    text.includes("report issue") ||
    text.includes("incorrect report") ||
    text.includes("bad report") ||
    text.includes("missing report")
  ) {
    return {
      severity: "Medium",
      category: "Report Delivery / Quality Issue",
      suggestedContainment:
        "Review the report record, client email, uploads, and activity before editing or sending any replacement.",
      approvalRule:
        "Admin must approve report correction, resend, or client explanation.",
    };
  }

  if (
    text.includes("error") ||
    text.includes("failed") ||
    text.includes("problem") ||
    text.includes("issue") ||
    text.includes("blocked")
  ) {
    return {
      severity: "Medium",
      category: "General Operational Issue",
      suggestedContainment:
        "Review the affected admin area and decide whether this should become a formal incident.",
      approvalRule:
        "Admin approves escalation, client-facing response, and process changes.",
    };
  }

  return {
    severity: "Low",
    category: "Low-Signal Review Item",
    suggestedContainment:
      "No obvious incident keyword was found. Review only if context suggests client impact or security risk.",
    approvalRule:
      "Admin decides whether to ignore, monitor, or escalate.",
  };
}

function looksLikeIncident(row: GenericRow, source: IncidentItem["source"]) {
  const text = `${getTitle(row, source)} ${getPreview(row)} ${asText(row.status)} ${asText(row.type)}`.toLowerCase();

  return (
    text.includes("secret") ||
    text.includes("credential") ||
    text.includes("password") ||
    text.includes("wrong client") ||
    text.includes("someone else") ||
    text.includes("not mine") ||
    text.includes("wrong report") ||
    text.includes("wrong email") ||
    text.includes("refund") ||
    text.includes("chargeback") ||
    text.includes("dispute") ||
    text.includes("stripe error") ||
    text.includes("billing portal") ||
    text.includes("payment failed") ||
    text.includes("upload failed") ||
    text.includes("download failed") ||
    text.includes("file missing") ||
    text.includes("file not found") ||
    text.includes("storage") ||
    text.includes("report issue") ||
    text.includes("incorrect report") ||
    text.includes("missing report") ||
    text.includes("error") ||
    text.includes("failed") ||
    text.includes("problem") ||
    text.includes("issue") ||
    text.includes("blocked") ||
    source === "Activity"
  );
}

function incidentItemsFromRows(
  rows: GenericRow[],
  source: IncidentItem["source"]
): IncidentItem[] {
  return rows
    .filter((row) => looksLikeIncident(row, source))
    .map((row, index) => {
      const classification = classifyIncident(row, source);

      return {
        id: asText(row.id) || `${source.toLowerCase()}-${index}`,
        source,
        client: getClient(row),
        title: getTitle(row, source),
        preview: getPreview(row).slice(0, 260),
        date: getDate(row),
        raw: row,
        ...classification,
      };
    });
}

function AgentNightSkyBackground() {
  const stars = [
    { left: "5%", top: "9%", size: 2, delay: "0s", duration: "4.8s" },
    { left: "9%", top: "24%", size: 2, delay: "0.7s", duration: "5.2s" },
    { left: "12%", top: "42%", size: 2, delay: "1.1s", duration: "5.4s" },
    { left: "18%", top: "16%", size: 2, delay: "1.4s", duration: "5.7s" },
    { left: "23%", top: "62%", size: 3, delay: "1.9s", duration: "5.1s" },
    { left: "28%", top: "31%", size: 2, delay: "2.2s", duration: "5.8s" },
    { left: "33%", top: "84%", size: 2, delay: "2.7s", duration: "5.3s" },
    { left: "38%", top: "19%", size: 3, delay: "0.9s", duration: "5.5s" },
    { left: "43%", top: "48%", size: 2, delay: "1.6s", duration: "4.9s" },
    { left: "49%", top: "72%", size: 2, delay: "2.4s", duration: "5.6s" },
    { left: "54%", top: "12%", size: 2, delay: "0.4s", duration: "5.7s" },
    { left: "59%", top: "38%", size: 3, delay: "1.3s", duration: "5.2s" },
    { left: "64%", top: "81%", size: 2, delay: "2.1s", duration: "5.4s" },
    { left: "69%", top: "22%", size: 2, delay: "2.9s", duration: "5.3s" },
    { left: "74%", top: "55%", size: 3, delay: "1.8s", duration: "4.7s" },
    { left: "79%", top: "34%", size: 2, delay: "0.8s", duration: "5.6s" },
    { left: "84%", top: "15%", size: 2, delay: "0.4s", duration: "5.7s" },
    { left: "88%", top: "76%", size: 2, delay: "2.5s", duration: "5.2s" },
    { left: "93%", top: "66%", size: 2, delay: "2.2s", duration: "5.1s" },
    { left: "96%", top: "39%", size: 2, delay: "0.6s", duration: "4.9s" },
  ];

  return (
    <div className="agentNightSky" aria-hidden="true">
      <div className="agentMoon" />
      <div className="agentFog agentFogA" />
      <div className="agentFog agentFogB" />
      <div className="agentOrb agentOrbA" />
      <div className="agentOrb agentOrbB" />

      {stars.map((star, index) => (
        <span
          key={index}
          className="agentStar"
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

export default async function IncidentResponseAgentPage() {
  const [activityResult, messageResult, uploadResult, reportResult, monitoringResult] =
    await Promise.all([
      getRecentRows(activityTable, 25),
      getRecentRows(messageTable, 25),
      getRecentRows(uploadTable, 25),
      getRecentRows(reportTable, 25),
      getRecentRows(monitoringTable, 25),
    ]);

  const incidentItems = [
    ...incidentItemsFromRows(activityResult.rows, "Activity"),
    ...incidentItemsFromRows(messageResult.rows, "Message"),
    ...incidentItemsFromRows(uploadResult.rows, "Upload"),
    ...incidentItemsFromRows(reportResult.rows, "Report"),
    ...incidentItemsFromRows(monitoringResult.rows, "Monitoring"),
  ].sort((a, b) => {
    const order = { Critical: 0, High: 1, Medium: 2, Low: 3 };
    return order[a.severity] - order[b.severity];
  });

  const critical = incidentItems.filter((item) => item.severity === "Critical").length;
  const high = incidentItems.filter((item) => item.severity === "High").length;
  const medium = incidentItems.filter((item) => item.severity === "Medium").length;

  const errors = [
    activityResult.error ? `Activity: ${activityResult.error}` : null,
    messageResult.error ? `Messages: ${messageResult.error}` : null,
    uploadResult.error ? `Uploads: ${uploadResult.error}` : null,
    reportResult.error ? `Reports: ${reportResult.error}` : null,
    monitoringResult.error ? `Monitoring: ${monitoringResult.error}` : null,
  ].filter(Boolean);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] px-6 py-10 text-white sm:px-8 lg:px-10">
      <AgentNightSkyBackground />

      <section className="relative z-10 mx-auto max-w-7xl">
        <Link
          href="/admin/analytics"
          className="agentLogoGlow inline-block text-lg font-bold tracking-[0.35em] text-white transition hover:text-white"
        >
          GHOSTLAYER
        </Link>

        <p className="mt-10 text-xs font-semibold uppercase tracking-[0.35em] text-red-300">
          Agent 09 · Alert-Only
        </p>

        <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl">
          Incident Response Agent
        </h1>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-300">
          This agent reviews recent admin activity, messages, uploads, reports, and monitoring records
          for possible incidents. It only flags and suggests containment. It does not notify clients,
          delete evidence, rotate credentials, issue refunds, or admit fault automatically.
        </p>

        <div className="mt-6 flex flex-wrap gap-3 text-xs font-bold">
          <Link href="/admin/agents" className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-cyan-100">
            Agent Home
          </Link>
          <Link href="/admin/agents/daily-summary" className="rounded-full border border-purple-300/20 bg-purple-300/10 px-4 py-2 text-purple-100">
            Daily Summary
          </Link>
          <Link href="/admin/agents/data-request" className="rounded-full border border-sky-300/20 bg-sky-300/10 px-4 py-2 text-sky-100">
            Data Request
          </Link>
          <Link href="/admin/incident-response" className="rounded-full border border-red-300/20 bg-red-300/10 px-4 py-2 text-red-100">
            Incident Process
          </Link>
          <Link href="/admin/activity" className="rounded-full border border-purple-300/20 bg-purple-300/10 px-4 py-2 text-purple-100">
            Activity
          </Link>
          <Link href="/admin/agent-rules" className="rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-amber-100">
            Agent Rules
          </Link>
        </div>

        <div className="mt-4 flex flex-wrap gap-3 text-xs font-bold">
          <Link href="/admin/agents/message-triage" className="rounded-full border border-blue-300/20 bg-blue-300/10 px-4 py-2 text-blue-100">
            Message Triage
          </Link>
          <Link href="/admin/agents/upload-review" className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-cyan-100">
            Upload Review
          </Link>
          <Link href="/admin/agents/report-prep" className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-emerald-100">
            Report Prep
          </Link>
          <Link href="/admin/agents/monitoring" className="rounded-full border border-purple-300/20 bg-purple-300/10 px-4 py-2 text-purple-100">
            Monitoring
          </Link>
          <Link href="/admin/agents/billing-bookkeeping" className="rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-amber-100">
            Billing
          </Link>
          <Link href="/admin/agents/trust-compliance" className="rounded-full border border-lime-300/20 bg-lime-300/10 px-4 py-2 text-lime-100">
            Trust
          </Link>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-4">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-gray-300">
              Items Flagged
            </p>
            <p className="mt-4 text-3xl font-black text-white">{incidentItems.length}</p>
          </div>

          <div className="rounded-[2rem] border border-red-400/25 bg-red-400/10 p-5 backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-200">
              Critical
            </p>
            <p className="mt-4 text-3xl font-black text-white">{critical}</p>
          </div>

          <div className="rounded-[2rem] border border-orange-300/20 bg-orange-300/10 p-5 backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-200">
              High
            </p>
            <p className="mt-4 text-3xl font-black text-white">{high}</p>
          </div>

          <div className="rounded-[2rem] border border-amber-300/20 bg-amber-300/10 p-5 backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-200">
              Medium
            </p>
            <p className="mt-4 text-3xl font-black text-white">{medium}</p>
          </div>
        </div>

        {errors.length ? (
          <section className="mt-8 rounded-[2rem] border border-red-300/20 bg-red-300/10 p-6 backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-red-200">
              Read Error
            </p>
            <h2 className="mt-3 text-2xl font-black text-white">
              Could not read one or more incident data sources
            </h2>
            <div className="mt-4 space-y-2 text-sm leading-7 text-red-100">
              {errors.map((error) => (
                <p key={error}>{error}</p>
              ))}
            </div>
            <p className="mt-3 text-sm leading-7 text-gray-300">
              If a table name is wrong, update the table constants near the top of this page.
            </p>
          </section>
        ) : null}

        <section className="mt-8 rounded-[2rem] border border-red-300/20 bg-red-300/10 p-6 shadow-[0_24px_100px_rgba(0,0,0,0.25)] backdrop-blur-xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-red-200">
                Incident Alert Queue
              </p>
              <h2 className="mt-3 text-2xl font-black text-white">
                Possible incidents needing admin review
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-300">
                Review critical and high-severity items first. The agent suggests containment steps,
                but you approve escalation, credential rotation, refunds, client notices, and documentation.
              </p>
            </div>

            <Link
              href="/admin/incident-response"
              className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/[0.08]"
            >
              Open Incident Process
            </Link>
          </div>

          <div className="mt-6 grid gap-4">
            {incidentItems.length ? (
              incidentItems.map((item) => {
                const severityClass =
                  item.severity === "Critical"
                    ? "border-red-500/30 bg-red-500/15 text-red-100"
                    : item.severity === "High"
                      ? "border-orange-300/25 bg-orange-300/10 text-orange-100"
                      : item.severity === "Medium"
                        ? "border-amber-300/25 bg-amber-300/10 text-amber-100"
                        : "border-cyan-300/20 bg-cyan-300/10 text-cyan-100";

                return (
                  <div
                    key={`${item.source}-${item.id}`}
                    className={`rounded-2xl border p-4 ${severityClass}`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em]">
                          {item.severity} · {item.category}
                        </p>
                        <h3 className="mt-2 break-all text-lg font-black text-white">
                          {item.title}
                        </h3>
                      </div>

                      <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-bold text-white">
                        {item.source}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-white">
                          Client / Context
                        </p>
                        <p className="mt-2 break-all text-sm text-gray-300">{item.client}</p>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-white">
                          Source
                        </p>
                        <p className="mt-2 text-sm text-gray-300">{item.source}</p>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-white">
                          Severity
                        </p>
                        <p className="mt-2 text-sm text-gray-300">{item.severity}</p>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-white">
                          Date
                        </p>
                        <p className="mt-2 text-sm text-gray-300">{formatDate(item.date)}</p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-white">
                        Preview
                      </p>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-300">
                        {item.preview}
                      </p>
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-white">
                          Suggested containment
                        </p>
                        <p className="mt-2 text-sm leading-6 text-gray-300">
                          {item.suggestedContainment}
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-white">
                          Approval rule
                        </p>
                        <p className="mt-2 text-sm leading-6 text-gray-300">
                          {item.approvalRule}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-center">
                <p className="text-lg font-black text-white">No obvious incidents found.</p>
                <p className="mt-2 text-sm text-gray-400">
                  The agent did not find strong incident keywords in recent records. Continue normal monitoring.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-red-400/25 bg-red-400/10 p-6 backdrop-blur-xl">
          <h2 className="text-2xl font-black text-white">Hard limits for this agent</h2>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-gray-300">
            <li>• It may not notify clients automatically.</li>
            <li>• It may not admit fault, liability, breach, or wrongdoing automatically.</li>
            <li>• It may not delete evidence, activity logs, uploads, messages, or reports.</li>
            <li>• It may not rotate credentials automatically.</li>
            <li>• It may not issue refunds or change billing automatically.</li>
            <li>• It may not publish or send corrected reports automatically.</li>
          </ul>
        </section>
      </section>

      <style>{`
        .agentNightSky {
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

        .agentMoon {
          position: absolute;
          right: 3%;
          top: 5%;
          width: min(34vw, 30rem);
          height: min(34vw, 30rem);
          border-radius: 9999px;
          background:
            radial-gradient(circle at 32% 28%, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.92) 12%, rgba(226,232,240,0.76) 30%, rgba(148,163,184,0.42) 54%, rgba(30,41,59,0.18) 78%, rgba(15,23,42,0.04) 100%);
          opacity: 0.24;
          animation: agentMoonGlow 4.8s ease-in-out infinite;
        }

        .agentStar {
          position: absolute;
          display: block;
          border-radius: 9999px;
          background: #ffffff;
          box-shadow:
            0 0 8px rgba(255,255,255,0.95),
            0 0 18px rgba(147,197,253,0.62),
            0 0 30px rgba(59,130,246,0.35);
          animation-name: agentTwinkle;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        .agentFog {
          position: absolute;
          left: -10%;
          right: -10%;
          height: 170px;
          border-radius: 9999px;
          filter: blur(92px);
          opacity: 0.075;
          mix-blend-mode: screen;
        }

        .agentFogA {
          top: 18%;
          background: linear-gradient(90deg, rgba(59,130,246,0), rgba(59,130,246,0.36), rgba(147,51,234,0.18), rgba(59,130,246,0));
          animation: agentFogDriftOne 42s ease-in-out infinite;
        }

        .agentFogB {
          top: 58%;
          background: linear-gradient(90deg, rgba(16,185,129,0), rgba(6,182,212,0.32), rgba(96,165,250,0.2), rgba(16,185,129,0));
          animation: agentFogDriftTwo 46s ease-in-out infinite;
        }

        .agentOrb {
          position: absolute;
          border-radius: 9999px;
          filter: blur(38px);
          opacity: 0.22;
        }

        .agentOrbA {
          left: -10%;
          top: 18%;
          height: 22rem;
          width: 22rem;
          background: rgba(59,130,246,0.16);
          animation: agentFloatSlow 28s ease-in-out infinite;
        }

        .agentOrbB {
          right: -10%;
          top: 30%;
          height: 26rem;
          width: 26rem;
          background: rgba(6,182,212,0.12);
          animation: agentFloatSlow 34s ease-in-out infinite reverse;
        }

        .agentLogoGlow {
          text-shadow:
            0 0 8px rgba(255,255,255,0.70),
            0 0 18px rgba(96,165,250,0.24),
            0 0 34px rgba(6,182,212,0.18);
          animation: agentLogoPulse 3.4s ease-in-out infinite;
        }

        @keyframes agentTwinkle {
          0%, 100% { transform: translateZ(0) scale(0.85); opacity: 0.42; }
          50% { transform: translateZ(0) scale(1.35); opacity: 1; }
        }

        @keyframes agentMoonGlow {
          0%, 100% { opacity: 0.22; }
          50% { opacity: 0.34; }
        }

        @keyframes agentLogoPulse {
          0%, 100% {
            opacity: 0.78;
            text-shadow:
              0 0 8px rgba(255,255,255,0.62),
              0 0 18px rgba(96,165,250,0.22),
              0 0 34px rgba(6,182,212,0.14);
          }
          50% {
            opacity: 1;
            text-shadow:
              0 0 10px rgba(255,255,255,0.92),
              0 0 26px rgba(147,197,253,0.42),
              0 0 48px rgba(6,182,212,0.28);
          }
        }

        @keyframes agentFogDriftOne {
          0%, 100% { transform: translateX(-2%) translateY(0px) scaleX(1); }
          50% { transform: translateX(4%) translateY(-4px) scaleX(1.04); }
        }

        @keyframes agentFogDriftTwo {
          0%, 100% { transform: translateX(3%) translateY(0px) scaleX(1.06); }
          50% { transform: translateX(-4%) translateY(5px) scaleX(1); }
        }

        @keyframes agentFloatSlow {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, 18px, 0); }
        }
      `}</style>
    </main>
  );
}
