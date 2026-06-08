import Link from "next/link";

export const metadata = {
  title: "Data Request Agent | Ghostlayer Admin",
  description:
    "Read-only Ghostlayer Data Request Agent for reviewing client deletion, correction, privacy, and data review requests.",
};

type GenericRow = Record<string, string | number | boolean | null | undefined>;

type DataRequestItem = {
  id: string;
  source: "Message" | "Upload" | "Activity";
  client: string;
  title: string;
  preview: string;
  date: string | null;
  category: string;
  priority: "High" | "Medium" | "Low";
  suggestedAction: string;
  approvalRule: string;
  raw: GenericRow;
};

const messageTable = "client_messages";
const uploadTable = "client_uploads";
const activityTable = "admin_activity";

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
    asText(row.uploaded_by) ||
    asText(row.client_name) ||
    asText(row.business_name) ||
    "Unknown client"
  );
}

function getTitle(row: GenericRow, source: "Message" | "Upload" | "Activity") {
  return (
    asText(row.subject) ||
    asText(row.title) ||
    asText(row.file_name) ||
    asText(row.filename) ||
    asText(row.event_type) ||
    asText(row.action) ||
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
    asText(row.file_name) ||
    asText(row.action) ||
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

function looksLikeDataRequest(row: GenericRow) {
  const text = `${getTitle(row, "Message")} ${getPreview(row)} ${asText(row.status)} ${asText(row.type)}`.toLowerCase();

  return (
    text.includes("delete") ||
    text.includes("remove my data") ||
    text.includes("remove data") ||
    text.includes("erase") ||
    text.includes("privacy") ||
    text.includes("personal information") ||
    text.includes("personal data") ||
    text.includes("data request") ||
    text.includes("data deletion") ||
    text.includes("data correction") ||
    text.includes("correct my") ||
    text.includes("correction") ||
    text.includes("wrong email") ||
    text.includes("wrong name") ||
    text.includes("wrong business") ||
    text.includes("update my information") ||
    text.includes("access request") ||
    text.includes("what data") ||
    text.includes("gdpr") ||
    text.includes("ccpa")
  );
}

function classifyDataRequest(
  row: GenericRow,
  source: "Message" | "Upload" | "Activity"
): Omit<DataRequestItem, "id" | "source" | "client" | "title" | "preview" | "date" | "raw"> {
  const text = `${getTitle(row, source)} ${getPreview(row)} ${asText(row.status)} ${asText(row.type)}`.toLowerCase();

  if (
    text.includes("delete") ||
    text.includes("remove my data") ||
    text.includes("erase") ||
    text.includes("data deletion")
  ) {
    return {
      category: "Deletion Request",
      priority: "High",
      suggestedAction:
        "Open the Data Requests process. Verify requester identity, identify affected records, and decide what can be deleted versus retained.",
      approvalRule:
        "Admin must approve all deletion, retention, and client response decisions.",
    };
  }

  if (
    text.includes("correct") ||
    text.includes("correction") ||
    text.includes("wrong email") ||
    text.includes("wrong name") ||
    text.includes("wrong business") ||
    text.includes("update my information")
  ) {
    return {
      category: "Correction Request",
      priority: "High",
      suggestedAction:
        "Verify the requester and review client-facing records before correcting email, business name, report details, uploads, or messages.",
      approvalRule:
        "Admin must approve record corrections and preserve audit context.",
    };
  }

  if (
    text.includes("privacy") ||
    text.includes("personal data") ||
    text.includes("personal information") ||
    text.includes("what data") ||
    text.includes("access request")
  ) {
    return {
      category: "Privacy / Access Request",
      priority: "High",
      suggestedAction:
        "Use the Data Requests process to identify records and prepare a careful response.",
      approvalRule:
        "Admin must approve privacy-related responses and any data export/review decision.",
    };
  }

  if (source === "Upload") {
    return {
      category: "Upload Data Review",
      priority: "Medium",
      suggestedAction:
        "Review whether the upload contains client-sensitive data and whether it is linked to the correct client/report.",
      approvalRule:
        "Admin must approve deletion, retention, or report association changes.",
    };
  }

  if (source === "Activity") {
    return {
      category: "Activity / Audit Review",
      priority: "Medium",
      suggestedAction:
        "Review activity history for client data changes, access issues, or records affected by a data request.",
      approvalRule:
        "Admin must preserve audit records unless there is a clear approved reason.",
    };
  }

  return {
    category: "Possible Data Request",
    priority: "Medium",
    suggestedAction:
      "Review this item and decide whether it should become a formal Data Request case.",
    approvalRule:
      "Admin approves all data handling decisions.",
  };
}

function dataItemsFromRows(
  rows: GenericRow[],
  source: "Message" | "Upload" | "Activity"
): DataRequestItem[] {
  return rows
    .filter((row) => source !== "Message" || looksLikeDataRequest(row))
    .map((row, index) => {
      const classification = classifyDataRequest(row, source);

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

export default async function DataRequestAgentPage() {
  const [messageResult, uploadResult, activityResult] = await Promise.all([
    getRecentRows(messageTable, 25),
    getRecentRows(uploadTable, 25),
    getRecentRows(activityTable, 25),
  ]);

  const reviewItems = [
    ...dataItemsFromRows(messageResult.rows, "Message"),
    ...dataItemsFromRows(uploadResult.rows, "Upload"),
    ...dataItemsFromRows(activityResult.rows, "Activity"),
  ].sort((a, b) => {
    const order = { High: 0, Medium: 1, Low: 2 };
    return order[a.priority] - order[b.priority];
  });

  const highPriority = reviewItems.filter((item) => item.priority === "High").length;
  const mediumPriority = reviewItems.filter((item) => item.priority === "Medium").length;
  const messageMatches = reviewItems.filter((item) => item.source === "Message").length;
  const uploadReviews = reviewItems.filter((item) => item.source === "Upload").length;

  const errors = [
    messageResult.error ? `Messages: ${messageResult.error}` : null,
    uploadResult.error ? `Uploads: ${uploadResult.error}` : null,
    activityResult.error ? `Activity: ${activityResult.error}` : null,
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

        <p className="mt-10 text-xs font-semibold uppercase tracking-[0.35em] text-sky-300">
          Agent 08 · Assist-Only
        </p>

        <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl">
          Data Request Agent
        </h1>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-300">
          This agent reviews recent messages, uploads, and activity for possible client data
          deletion, correction, privacy, or access requests. It only flags and recommends.
          It does not delete, modify, export, or send client data automatically.
        </p>

        <div className="mt-6 flex flex-wrap gap-3 text-xs font-bold">
          <Link href="/admin/agents" className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-cyan-100">
            Agent Home
          </Link>
          <Link href="/admin/agents/daily-summary" className="rounded-full border border-purple-300/20 bg-purple-300/10 px-4 py-2 text-purple-100">
            Daily Summary
          </Link>
          <Link href="/admin/agents/message-triage" className="rounded-full border border-blue-300/20 bg-blue-300/10 px-4 py-2 text-blue-100">
            Message Triage
          </Link>
          <Link href="/admin/data-requests" className="rounded-full border border-sky-300/20 bg-sky-300/10 px-4 py-2 text-sky-100">
            Data Requests
          </Link>
          <Link href="/admin/incident-response" className="rounded-full border border-red-300/20 bg-red-300/10 px-4 py-2 text-red-100">
            Incident Response
          </Link>
          <Link href="/admin/agent-rules" className="rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-amber-100">
            Agent Rules
          </Link>
        </div>

        <div className="mt-4 flex flex-wrap gap-3 text-xs font-bold">
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
          <Link href="/admin/agents/incident-response" className="rounded-full border border-red-300/20 bg-red-300/10 px-4 py-2 text-red-100">
            Incident
          </Link>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-4">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-gray-300">
              Items Flagged
            </p>
            <p className="mt-4 text-3xl font-black text-white">{reviewItems.length}</p>
          </div>

          <div className="rounded-[2rem] border border-red-300/20 bg-red-300/10 p-5 backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-200">
              High
            </p>
            <p className="mt-4 text-3xl font-black text-white">{highPriority}</p>
          </div>

          <div className="rounded-[2rem] border border-amber-300/20 bg-amber-300/10 p-5 backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-200">
              Medium
            </p>
            <p className="mt-4 text-3xl font-black text-white">{mediumPriority}</p>
          </div>

          <div className="rounded-[2rem] border border-sky-300/20 bg-sky-300/10 p-5 backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-200">
              Message Matches
            </p>
            <p className="mt-4 text-3xl font-black text-white">{messageMatches}</p>
          </div>
        </div>

        {errors.length ? (
          <section className="mt-8 rounded-[2rem] border border-red-300/20 bg-red-300/10 p-6 backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-red-200">
              Read Error
            </p>
            <h2 className="mt-3 text-2xl font-black text-white">
              Could not read one or more data sources
            </h2>
            <div className="mt-4 space-y-2 text-sm leading-7 text-red-100">
              {errors.map((error) => (
                <p key={error}>{error}</p>
              ))}
            </div>
            <p className="mt-3 text-sm leading-7 text-gray-300">
              If a table name is wrong, update <span className="font-mono text-white">messageTable</span>, <span className="font-mono text-white">uploadTable</span>, or <span className="font-mono text-white">activityTable</span> in this page.
            </p>
          </section>
        ) : null}

        <section className="mt-8 rounded-[2rem] border border-sky-300/20 bg-sky-300/10 p-6 shadow-[0_24px_100px_rgba(0,0,0,0.25)] backdrop-blur-xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-sky-200">
                Data Request Queue
              </p>
              <h2 className="mt-3 text-2xl font-black text-white">
                Possible privacy/data items needing review
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-300">
                Review high-priority items first. The agent suggests process steps,
                but you approve identity checks, deletion, correction, retention, export,
                and client replies.
              </p>
            </div>

            <Link
              href="/admin/data-requests"
              className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/[0.08]"
            >
              Open Data Requests
            </Link>
          </div>

          <div className="mt-6 grid gap-4">
            {reviewItems.length ? (
              reviewItems.map((item) => {
                const priorityClass =
                  item.priority === "High"
                    ? "border-red-300/25 bg-red-300/10 text-red-100"
                    : item.priority === "Medium"
                      ? "border-amber-300/25 bg-amber-300/10 text-amber-100"
                      : "border-cyan-300/20 bg-cyan-300/10 text-cyan-100";

                return (
                  <div
                    key={`${item.source}-${item.id}`}
                    className={`rounded-2xl border p-4 ${priorityClass}`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em]">
                          {item.priority} Priority · {item.category}
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
                          Client
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
                          Date
                        </p>
                        <p className="mt-2 text-sm text-gray-300">{formatDate(item.date)}</p>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-white">
                          Action Type
                        </p>
                        <p className="mt-2 text-sm text-gray-300">{item.category}</p>
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
                          Suggested next action
                        </p>
                        <p className="mt-2 text-sm leading-6 text-gray-300">
                          {item.suggestedAction}
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
                <p className="text-lg font-black text-white">No possible data requests found.</p>
                <p className="mt-2 text-sm text-gray-400">
                  The agent did not find obvious deletion, correction, privacy, or access requests in recent records.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-red-300/20 bg-red-300/10 p-6 backdrop-blur-xl">
          <h2 className="text-2xl font-black text-white">Hard limits for this agent</h2>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-gray-300">
            <li>• It may not delete client records automatically.</li>
            <li>• It may not edit client data automatically.</li>
            <li>• It may not export client data automatically.</li>
            <li>• It may not erase audit history.</li>
            <li>• It may not send privacy, deletion, or correction replies without admin approval.</li>
            <li>• It may not provide legal advice or determine legal obligations.</li>
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
