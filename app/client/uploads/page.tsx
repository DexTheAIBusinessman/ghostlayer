import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import ClientPortalNightSky from "../_components/ClientPortalNightSky";

export const metadata = {
  title: "Uploads | Ghostlayer",
  description: "Upload files to Ghostlayer.",
};

type UploadRecord = {
  id: string;
  client_email: string;
  report_id: string | null;
  file_name: string;
  file_path: string;
  file_type: string | null;
  file_size: number | null;
  notes: string | null;
  created_at: string;
};

type ReportOption = {
  report_id: string;
  company: string | null;
  client_name: string;
};

async function getUploads(email: string): Promise<UploadRecord[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase environment variables.");
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/client_uploads?client_email=eq.${encodeURIComponent(
      email
    )}&select=*&order=created_at.desc`,
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
    throw new Error(`Could not load uploads: ${errorText}`);
  }

  return response.json();
}

async function getReportOptions(email: string): Promise<ReportOption[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase environment variables.");
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/client_reports?email=eq.${encodeURIComponent(
      email
    )}&archived=eq.false&select=report_id,company,client_name&order=created_at.desc`,
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
    throw new Error(`Could not load report options: ${errorText}`);
  }

  return response.json();
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatFileSize(value: number | null) {
  if (!value) return "—";

  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${Math.round(value / 1024)} KB`;

  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function PortalBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#05070b]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(34,211,238,0.10),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(59,130,246,0.10),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.06),transparent_38%)]" />
      <div className="absolute left-[-18%] top-[12%] h-[260px] w-[140%] rounded-full bg-gradient-to-r from-transparent via-cyan-200/10 to-transparent blur-[105px]" />
      <div className="absolute left-[-18%] top-[52%] h-[260px] w-[140%] rounded-full bg-gradient-to-r from-transparent via-blue-300/10 to-transparent blur-[110px]" />
    </div>
  );
}

function NavLinks() {
  return (
    <div className="flex flex-wrap gap-3">
      <Link
        href="/client/dashboard"
        className="rounded-2xl border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
      >
        Dashboard
      </Link>

      <Link
        href="/client/messages"
        className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/15"
      >
        Messages
      </Link>

      <Link
        href="/client/monitoring"
        className="rounded-2xl border border-purple-300/20 bg-purple-300/10 px-5 py-3 text-sm font-semibold text-purple-100 transition hover:bg-purple-300/15"
      >
        Monitoring
      </Link>
    </div>
  );
}

export default async function ClientUploadsPage({
  searchParams,
}: {
  searchParams?: Promise<{ uploaded?: string; error?: string }>;
}) {
  const cookieStore = await cookies();
  const clientEmail = cookieStore.get("ghostlayer_client_email")?.value;

  if (!clientEmail) {
    redirect("/login?error=login-required&next=/client/uploads");
  }

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const uploads = await getUploads(clientEmail);
  const reportOptions = await getReportOptions(clientEmail);

  const errorMessage =
    resolvedSearchParams.error === "missing-file"
      ? "Choose a file before uploading."
      : resolvedSearchParams.error === "empty-file"
      ? "The selected file is empty."
      : resolvedSearchParams.error === "file-too-large"
      ? "File is too large. Maximum size is 10 MB."
      : "";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] text-white">
      
      <ClientPortalNightSky />
<PortalBackground />

      <section className="relative z-10 mx-auto max-w-6xl px-6 py-10">
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link
              href="/"
              className="clientPortalLogoGlow inline-block text-lg font-bold tracking-[0.35em] text-white"
            >
              GHOSTLAYER
            </Link>

            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.45em] text-cyan-300">
              Client Uploads
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Upload workflow files
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-300">
              Upload screenshots, process notes, spreadsheets, SOPs, or files
              that help Ghostlayer understand your workflow. Signed in as{" "}
              <span className="text-cyan-100">{clientEmail}</span>.
            </p>
          </div>

          <NavLinks />
        </div>

        {resolvedSearchParams.uploaded === "1" ? (
          <div className="mb-6 rounded-2xl border border-emerald-300/25 bg-emerald-300/10 p-5 text-emerald-100">
            File uploaded successfully.
          </div>
        ) : null}

        {errorMessage ? (
          <div className="mb-6 rounded-2xl border border-red-300/25 bg-red-300/10 p-5 text-red-100">
            {errorMessage}
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_24px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">
              New Upload
            </p>

    
        <section className="mt-8 rounded-[2rem] border border-cyan-300/20 bg-cyan-300/10 p-6 shadow-[0_24px_100px_rgba(0,0,0,0.25)] backdrop-blur-xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-200">
            Upload Guidance
          </p>

          <h2 className="mt-3 text-2xl font-black text-white">
            What to upload
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-300">
            Upload files that help Ghostlayer understand your workflow, tools, bottlenecks,
            reports, handoffs, or business process. Clear screenshots and short documents are usually more useful than large unrelated files.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-5">
              <h3 className="text-lg font-black text-white">
                Good files to upload
              </h3>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-gray-300">
                <li>• Workflow screenshots or screen recordings exported as files.</li>
                <li>• SOPs, process notes, checklists, or handoff instructions.</li>
                <li>• Tool screenshots from CRMs, spreadsheets, project boards, or dashboards.</li>
                <li>• Reports, spreadsheets, forms, intake details, or operational documents.</li>
                <li>• Images or documents that show where work slows down or gets confusing.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-red-300/20 bg-red-300/10 p-5">
              <h3 className="text-lg font-black text-white">
                What not to upload
              </h3>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-gray-300">
                <li>• Passwords, API keys, private tokens, or login credentials.</li>
                <li>• Full bank account numbers, full card numbers, or unnecessary financial records.</li>
                <li>• Private personal information that is not needed for the workflow review.</li>
                <li>• Files you do not own or do not have permission to share.</li>
                <li>• Extremely large unrelated files that do not explain your workflow.</li>
              </ul>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-5">
            <h3 className="text-lg font-black text-white">
              Upload tips
            </h3>
            <p className="mt-3 text-sm leading-7 text-gray-300">
              Use clear file names like <span className="font-mono text-cyan-100">sales-intake-screenshot.png</span>,
              <span className="font-mono text-cyan-100"> booking-workflow-notes.pdf</span>, or
              <span className="font-mono text-cyan-100"> monthly-report-example.xlsx</span>.
              If you upload the wrong file, contact support and include the file name.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="/contact"
                className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/[0.08]"
              >
                Contact Support
              </a>
              <a
                href="/privacy"
                className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/[0.08]"
              >
                Privacy Policy
              </a>
            </div>
          </div>
        </section>

        <form
              action="/api/upload-client-file"
              method="post"
              encType="multipart/form-data"
              className="mt-6 space-y-4"
            >
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
                  Related Report
                </span>
                <select
                  name="reportId"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/50 focus:bg-black/40"
                >
                  <option value="">General upload</option>
                  {reportOptions.map((report) => (
                    <option key={report.report_id} value={report.report_id}>
                      {report.company || report.client_name} — {report.report_id}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
                  File
                </span>
                <input
                  name="file"
                  type="file"
                  required
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-sm text-white outline-none file:mr-4 file:rounded-xl file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-bold file:text-black"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Maximum file size: 10 MB.
                </p>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
                  Notes
                </span>
                <textarea
                  name="notes"
                  rows={5}
                  placeholder="Add context about this file..."
                  className="w-full resize-y rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-300/50 focus:bg-black/40"
                />
              </label>

              <button
                type="submit"
                className="w-full rounded-2xl bg-white px-6 py-4 text-sm font-bold text-black shadow-[0_0_30px_rgba(255,255,255,0.18)] transition hover:scale-[1.02] hover:opacity-90"
              >
                Upload File
              </button>
            </form>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] shadow-[0_24px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div className="border-b border-white/10 px-6 py-5">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">
                Upload History
              </p>
              <p className="mt-2 text-sm text-gray-400">
                {uploads.length} upload{uploads.length === 1 ? "" : "s"}.
              </p>
            </div>

            <div className="divide-y divide-white/10">
              {uploads.map((item) => (
                <div key={item.id} className="px-6 py-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-bold text-white">{item.file_name}</p>

                      <p className="mt-1 text-xs text-gray-500">
                        {formatDate(item.created_at)} ·{" "}
                        {formatFileSize(item.file_size)}
                      </p>

                      {item.report_id ? (
                        <p className="mt-2 font-mono text-xs text-cyan-200">
                          {item.report_id}
                        </p>
                      ) : null}
                    </div>

                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-bold text-gray-200">
                      Uploaded
                    </span>
                  </div>

                  {item.notes ? (
                    <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-gray-300">
                      {item.notes}
                    </p>
                  ) : null}
                </div>
              ))}

              {uploads.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <p className="text-lg font-bold text-white">
                    No uploads yet.
                  </p>
                  <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-gray-400">
                    Upload workflow files when Ghostlayer needs more context.
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
