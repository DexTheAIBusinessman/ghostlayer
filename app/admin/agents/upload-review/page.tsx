import Link from "next/link";

export const metadata = {
  title: "Upload Review Agent | Ghostlayer Admin",
  description:
    "Read-only Ghostlayer Upload Review Agent for reviewing client uploads and flagging admin action items.",
};

type GenericRow = Record<string, string | number | boolean | null | undefined>;

type UploadReviewItem = {
  id: string;
  client: string;
  fileName: string;
  fileType: string;
  fileSize: number | null;
  reportId: string | null;
  date: string | null;
  category: string;
  priority: "High" | "Medium" | "Low";
  suggestedAction: string;
  approvalRule: string;
  raw: GenericRow;
};

const uploadTable = "client_uploads";

const allowedFileTypes = [
  "pdf",
  "png",
  "jpg",
  "jpeg",
  "webp",
  "txt",
  "csv",
  "doc",
  "docx",
  "xls",
  "xlsx",
];

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

async function getRecentUploads(limit = 25): Promise<{
  rows: GenericRow[];
  error?: string;
}> {
  const { supabaseUrl, serviceRoleKey, error } = getSupabaseConfig();

  if (error || !supabaseUrl || !serviceRoleKey) {
    return { rows: [], error: error || "Missing Supabase config." };
  }

  const baseUrl = `${supabaseUrl}/rest/v1/${uploadTable}?select=*&limit=${limit}`;

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
        error: errorText || `Could not read ${uploadTable}.`,
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

function asNumber(value: unknown) {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function getClient(row: GenericRow) {
  return (
    asText(row.client_email) ||
    asText(row.email) ||
    asText(row.uploaded_by) ||
    asText(row.client_name) ||
    "Unknown client"
  );
}

function getFileName(row: GenericRow) {
  return (
    asText(row.file_name) ||
    asText(row.filename) ||
    asText(row.name) ||
    asText(row.original_name) ||
    "Unknown file"
  );
}

function getFileType(row: GenericRow) {
  const explicit =
    asText(row.file_type) ||
    asText(row.mime_type) ||
    asText(row.type) ||
    "";

  const fileName = getFileName(row);
  const extension = fileName.includes(".")
    ? fileName.split(".").pop()?.toLowerCase() || ""
    : "";

  return explicit || extension || "Unknown type";
}

function getFileExtension(row: GenericRow) {
  const fileName = getFileName(row).toLowerCase();

  if (fileName.includes(".")) {
    return fileName.split(".").pop() || "";
  }

  const type = getFileType(row).toLowerCase();

  if (type.includes("pdf")) return "pdf";
  if (type.includes("png")) return "png";
  if (type.includes("jpeg")) return "jpg";
  if (type.includes("jpg")) return "jpg";
  if (type.includes("webp")) return "webp";
  if (type.includes("text")) return "txt";
  if (type.includes("csv")) return "csv";
  if (type.includes("word")) return "docx";
  if (type.includes("excel")) return "xlsx";
  if (type.includes("spreadsheet")) return "xlsx";

  return type;
}

function getFileSize(row: GenericRow) {
  return (
    asNumber(row.file_size) ||
    asNumber(row.size) ||
    asNumber(row.size_bytes) ||
    asNumber(row.bytes) ||
    null
  );
}

function getReportId(row: GenericRow) {
  const value =
    asText(row.report_id) ||
    asText(row.client_report_id) ||
    asText(row.scan_id) ||
    "";

  return value || null;
}

function getDate(row: GenericRow) {
  const value =
    row.created_at ||
    row.updated_at ||
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

function formatFileSize(bytes: number | null) {
  if (!bytes || bytes <= 0) return "Unknown size";

  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  return `${size.toFixed(size >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function classifyUpload(row: GenericRow): Omit<
  UploadReviewItem,
  "id" | "client" | "fileName" | "fileType" | "fileSize" | "reportId" | "date" | "raw"
> {
  const fileName = getFileName(row);
  const extension = getFileExtension(row).toLowerCase();
  const size = getFileSize(row);
  const reportId = getReportId(row);
  const fileType = getFileType(row).toLowerCase();

  const isAllowedExtension = allowedFileTypes.includes(extension);
  const looksUnknown = !extension || extension === "unknown type" || fileType === "unknown type";
  const isLarge = typeof size === "number" && size > 10 * 1024 * 1024;
  const isUnlinked = !reportId;

  if (!isAllowedExtension || looksUnknown) {
    return {
      category: "Unknown / Needs Type Review",
      priority: "High",
      suggestedAction:
        "Review the upload metadata before opening or using the file. Confirm the file type is allowed and expected.",
      approvalRule:
        "Admin must approve whether to keep, delete, or request a replacement file.",
    };
  }

  if (isLarge) {
    return {
      category: "Large Upload",
      priority: "High",
      suggestedAction:
        "Review file size, client context, and whether the upload is needed for the report before downloading.",
      approvalRule:
        "Admin must approve downloading, deleting, or attaching large files to reports.",
    };
  }

  if (isUnlinked) {
    return {
      category: "General / Unlinked Upload",
      priority: "Medium",
      suggestedAction:
        "Check whether this upload should be linked to a report, scan, or client record.",
      approvalRule:
        "Admin must confirm ownership before attaching the file to any report.",
    };
  }

  if (
    extension === "pdf" ||
    extension === "doc" ||
    extension === "docx" ||
    extension === "xls" ||
    extension === "xlsx" ||
    extension === "csv"
  ) {
    return {
      category: "Document Upload",
      priority: "Medium",
      suggestedAction:
        "Review the document if needed for workflow context, SOPs, spreadsheets, or report preparation.",
      approvalRule:
        "Admin approves whether content should be used in a report.",
    };
  }

  return {
    category: "Standard Upload",
    priority: "Low",
    suggestedAction:
      "Review if needed. Confirm it belongs to the correct client and report.",
    approvalRule:
      "Admin approves any report usage, deletion, or client-facing mention.",
  };
}

function reviewUploads(rows: GenericRow[]): UploadReviewItem[] {
  return rows
    .map((row, index) => {
      const classification = classifyUpload(row);

      return {
        id: asText(row.id) || `upload-${index}`,
        client: getClient(row),
        fileName: getFileName(row),
        fileType: getFileType(row),
        fileSize: getFileSize(row),
        reportId: getReportId(row),
        date: getDate(row),
        raw: row,
        ...classification,
      };
    })
    .sort((a, b) => {
      const order = { High: 0, Medium: 1, Low: 2 };
      return order[a.priority] - order[b.priority];
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

export default async function UploadReviewAgentPage() {
  const result = await getRecentUploads(25);
  const reviewItems = reviewUploads(result.rows);

  const highPriority = reviewItems.filter((item) => item.priority === "High").length;
  const mediumPriority = reviewItems.filter((item) => item.priority === "Medium").length;
  const lowPriority = reviewItems.filter((item) => item.priority === "Low").length;
  const unlinked = reviewItems.filter((item) => !item.reportId).length;

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

        <p className="mt-10 text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">
          Agent 03 · Flag-Only
        </p>

        <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl">
          Upload Review Agent
        </h1>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-300">
          This agent reads recent client uploads, classifies upload status, flags risk,
          and suggests next admin actions. It does not delete, download, attach, or publish files automatically.
        </p>

        <div className="mt-6 flex flex-wrap gap-3 text-xs font-bold">
          <Link href="/admin/agents" className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-cyan-100">
            Agents
          </Link>
          <Link href="/admin/agents/daily-summary" className="rounded-full border border-purple-300/20 bg-purple-300/10 px-4 py-2 text-purple-100">
            Daily Summary
          </Link>
          <Link href="/admin/agents/message-triage" className="rounded-full border border-blue-300/20 bg-blue-300/10 px-4 py-2 text-blue-100">
            Message Triage
          </Link>
          <Link href="/admin/uploads" className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-cyan-100">
            Uploads
          </Link>
          <Link href="/admin/agent-rules" className="rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-amber-100">
            Agent Rules
          </Link>
        </div>

        <div className="mt-4 flex flex-wrap gap-3 text-xs font-bold">
          <Link href="/admin/agents/daily-summary" className="rounded-full border border-purple-300/20 bg-purple-300/10 px-4 py-2 text-purple-100">
            Daily Summary
          </Link>
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
          <Link href="/admin/agents/data-request" className="rounded-full border border-sky-300/20 bg-sky-300/10 px-4 py-2 text-sky-100">
            Data Request
          </Link>
          <Link href="/admin/agents/incident-response" className="rounded-full border border-red-300/20 bg-red-300/10 px-4 py-2 text-red-100">
            Incident
          </Link>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-5">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-gray-300">
              Uploads Read
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

          <div className="rounded-[2rem] border border-cyan-300/20 bg-cyan-300/10 p-5 backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
              Low
            </p>
            <p className="mt-4 text-3xl font-black text-white">{lowPriority}</p>
          </div>

          <div className="rounded-[2rem] border border-purple-300/20 bg-purple-300/10 p-5 backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-purple-200">
              Unlinked
            </p>
            <p className="mt-4 text-3xl font-black text-white">{unlinked}</p>
          </div>
        </div>

        {result.error ? (
          <section className="mt-8 rounded-[2rem] border border-red-300/20 bg-red-300/10 p-6 backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-red-200">
              Read Error
            </p>
            <h2 className="mt-3 text-2xl font-black text-white">
              Could not read client uploads
            </h2>
            <p className="mt-3 text-sm leading-7 text-red-100">{result.error}</p>
            <p className="mt-3 text-sm leading-7 text-gray-300">
              If the table name is wrong, update <span className="font-mono text-white">uploadTable</span> in this page.
            </p>
          </section>
        ) : null}

        <section className="mt-8 rounded-[2rem] border border-cyan-300/20 bg-cyan-300/10 p-6 shadow-[0_24px_100px_rgba(0,0,0,0.25)] backdrop-blur-xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-200">
                Upload Review Queue
              </p>
              <h2 className="mt-3 text-2xl font-black text-white">
                Uploads needing admin review
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-300">
                Review high-priority uploads first. The agent flags upload status and suggests next steps,
                but you approve all downloads, deletions, report usage, or client-facing actions.
              </p>
            </div>

            <Link
              href="/admin/uploads"
              className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/[0.08]"
            >
              Open Uploads
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
                    key={item.id}
                    className={`rounded-2xl border p-4 ${priorityClass}`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em]">
                          {item.priority} Priority · {item.category}
                        </p>
                        <h3 className="mt-2 break-all text-lg font-black text-white">
                          {item.fileName}
                        </h3>
                      </div>

                      <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-bold text-white">
                        Flag-only
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
                          Type
                        </p>
                        <p className="mt-2 break-all text-sm text-gray-300">{item.fileType}</p>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-white">
                          Size
                        </p>
                        <p className="mt-2 text-sm text-gray-300">{formatFileSize(item.fileSize)}</p>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-white">
                          Association
                        </p>
                        <p className="mt-2 break-all text-sm text-gray-300">
                          {item.reportId ? `Report linked: ${item.reportId}` : "General upload"}
                        </p>
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-gray-400">
                      Uploaded: {formatDate(item.date)}
                    </p>

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
                <p className="text-lg font-black text-white">No recent uploads found.</p>
                <p className="mt-2 text-sm text-gray-400">
                  The agent did not find recent client upload records to review.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-amber-300/20 bg-amber-300/10 p-6 backdrop-blur-xl">
          <h2 className="text-2xl font-black text-white">Approval rules for this agent</h2>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-gray-300">
            <li>• The Upload Review Agent may read upload metadata, classify uploads, and flag issues.</li>
            <li>• It may not download files automatically.</li>
            <li>• It may not delete uploads automatically.</li>
            <li>• It may not attach files to reports automatically.</li>
            <li>• It may not expose private storage URLs publicly.</li>
            <li>• It may not decide that a file belongs to a report without admin confirmation.</li>
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
