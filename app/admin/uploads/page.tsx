import Link from "next/link";

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

async function getUploads(): Promise<UploadRecord[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing Supabase environment variables.");
    return [];
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/client_uploads?select=*&order=created_at.desc&limit=200`,
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
    console.error("Could not load uploads:", errorText);
    return [];
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
    <div className="adminUploadsNightSky" aria-hidden="true">
      <div className="adminUploadsMoon" />
      <div className="adminUploadsFog adminUploadsFogA" />
      <div className="adminUploadsFog adminUploadsFogB" />
      <div className="adminUploadsOrb adminUploadsOrbA" />
      <div className="adminUploadsOrb adminUploadsOrbB" />

      {stars.map((star, index) => (
        <span
          key={index}
          className="adminUploadsStar"
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

export default async function AdminUploadsPage() {
  const uploads = await getUploads();

  const reportUploads = uploads.filter((upload) => upload.report_id);
  const totalBytes = uploads.reduce((sum, upload) => sum + (upload.file_size || 0), 0);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] text-white">
      <NightSkyBackground />

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link
              href="/"
              className="adminUploadsLogoGlow inline-block text-lg font-bold tracking-[0.35em] text-white"
            >
              GHOSTLAYER
            </Link>

            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.45em] text-cyan-300">
              Admin Uploads
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Client uploaded files
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-300">
              Review workflow files, screenshots, spreadsheets, SOPs, and notes
              clients upload through the client portal.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 text-xs font-bold">
          <Link
            href="/admin/analytics"
            className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-white transition hover:bg-white/[0.08]"
          >
            Admin Home
          </Link>
          <Link
            href="/admin/reports"
            className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-emerald-100 transition hover:bg-emerald-300/15"
          >
            Reports
          </Link>
          <Link
            href="/admin/messages"
            className="rounded-full border border-blue-300/20 bg-blue-300/10 px-4 py-2 text-blue-100 transition hover:bg-blue-300/15"
          >
            Messages
          </Link>
          <Link
            href="/admin/activity"
            className="rounded-full border border-purple-300/20 bg-purple-300/10 px-4 py-2 text-purple-100 transition hover:bg-purple-300/15"
          >
            Activity
          </Link>
          <Link
            href="/admin/trust-compliance"
            className="rounded-full border border-lime-300/20 bg-lime-300/10 px-4 py-2 text-lime-100 transition hover:bg-lime-300/15"
          >
            Trust & Compliance
          </Link>

          <Link
            href="/admin/bookkeeping"
            className="rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-amber-100 transition hover:bg-amber-300/15"
          >
            Bookkeeping
          </Link>
        </div>

        <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/reports"
              className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-black shadow-[0_0_30px_rgba(255,255,255,0.18)] transition hover:scale-[1.02] hover:opacity-90"
            >
              Reports
            </Link>

            <Link
              href="/admin/messages"
              className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:scale-[1.02] hover:bg-cyan-300/15"
            >
              Messages
            </Link>

            <Link
              href="/admin/activity"
              className="rounded-2xl border border-purple-300/20 bg-purple-300/10 px-5 py-3 text-sm font-semibold text-purple-100 transition hover:scale-[1.02] hover:bg-purple-300/15"
            >
              Activity
            </Link>
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] border border-cyan-300/25 bg-cyan-300/10 p-5 backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
              Total Uploads
            </p>
            <p className="mt-4 text-3xl font-black tracking-tight text-white">
              {uploads.length}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-purple-300/25 bg-purple-300/10 p-5 backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-purple-200">
              Report Related
            </p>
            <p className="mt-4 text-3xl font-black tracking-tight text-white">
              {reportUploads.length}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-emerald-300/25 bg-emerald-300/10 p-5 backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-200">
              Storage Used
            </p>
            <p className="mt-4 text-3xl font-black tracking-tight text-white">
              {formatFileSize(totalBytes)}
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] shadow-[0_24px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="border-b border-white/10 px-6 py-5">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">
              Upload Queue
            </p>
            <h2 className="mt-2 text-2xl font-bold">Client Files</h2>
          </div>

          <div className="divide-y divide-white/10">
            {uploads.map((item) => (
              <div key={item.id} className="px-6 py-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-4xl">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-lg font-bold text-white">
                        {item.file_name}
                      </p>

                      <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-bold text-cyan-100">
                        {formatFileSize(item.file_size)}
                      </span>

                      {item.file_type ? (
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-bold text-gray-300">
                          {item.file_type}
                        </span>
                      ) : null}
                    </div>

                <span
                  className={
                    item.report_id
                      ? "rounded-full border border-purple-300/20 bg-purple-300/10 px-3 py-1 text-xs font-bold text-purple-100"
                      : "rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1 text-xs font-bold text-sky-100"
                  }
                >
                  {item.report_id ? "Report Linked" : "General Upload"}
                </span>

                    <p className="mt-2 text-sm text-gray-400">
                      {item.client_email} · {formatDate(item.created_at)}
                    </p>

                    {item.report_id ? (
                      <Link
                        href={`/admin/reports/builder?reportId=${encodeURIComponent(
                          item.report_id
                        )}`}
                        className="mt-3 inline-block font-mono text-xs text-cyan-200 transition hover:text-cyan-100"
                      >
                        {item.report_id}
                      </Link>
                    ) : (
                      <p className="mt-3 text-xs text-gray-500">
                        General upload
                      </p>
                    )}

                    {item.notes ? (
                      <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-gray-300">
                        {item.notes}
                      </p>
                    ) : null}

                    <p className="mt-4 break-all font-mono text-xs text-gray-600">
                      {item.file_path}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    <a
                      href={`/api/admin-download-client-upload?id=${encodeURIComponent(
                        item.id
                      )}`}
                      className="rounded-xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-xs font-bold text-emerald-100 transition hover:bg-emerald-300/15"
                    >
                      Download
                    </a>

                    {item.report_id ? (
                      <Link
                        href={`/reports/${encodeURIComponent(item.report_id)}`}
                        className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-bold text-white transition hover:bg-white/[0.09]"
                      >
                        Preview Report
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}

            {uploads.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <p className="text-lg font-bold text-white">
                  No uploads yet.
                </p>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-gray-400">
                  Client uploads will appear here after they submit files through
                  the client portal.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <style>{`

        .adminUploadsNightSky {
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

        .adminUploadsMoon {
          position: absolute;
          right: 3%;
          top: 5%;
          width: min(34vw, 30rem);
          height: min(34vw, 30rem);
          border-radius: 9999px;
          background:
            radial-gradient(circle at 32% 28%, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.92) 12%, rgba(226, 232, 240, 0.76) 30%, rgba(148, 163, 184, 0.42) 54%, rgba(30, 41, 59, 0.18) 78%, rgba(15, 23, 42, 0.04) 100%);
          box-shadow:
            0 0 44px rgba(255, 255, 255, 0.42),
            0 0 95px rgba(191, 219, 254, 0.36),
            0 0 165px rgba(96, 165, 250, 0.26),
            inset -42px -34px 70px rgba(15, 23, 42, 0.42),
            inset 18px 14px 44px rgba(255, 255, 255, 0.32);
          opacity: 0.24;
          animation: adminUploadsMoonGlow 4.8s ease-in-out infinite;
        }

        .adminUploadsStar {
          position: absolute;
          display: block;
          border-radius: 9999px;
          background: #ffffff;
          box-shadow:
            0 0 8px rgba(255, 255, 255, 0.95),
            0 0 18px rgba(147, 197, 253, 0.62),
            0 0 30px rgba(59, 130, 246, 0.35);
          animation-name: adminUploadsTwinkle;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        .adminUploadsFog {
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

        .adminUploadsFogA {
          top: 18%;
          animation: adminUploadsFogDriftOne 42s ease-in-out infinite;
        }

        .adminUploadsFogB {
          top: 58%;
          animation: adminUploadsFogDriftTwo 46s ease-in-out infinite;
        }

        .adminUploadsOrb {
          position: absolute;
          border-radius: 9999px;
          filter: blur(92px);
          opacity: 0.24;
        }

        .adminUploadsOrbA {
          left: -10%;
          top: -8%;
          height: 26rem;
          width: 26rem;
          background: rgba(34, 211, 238, 0.07);
          animation: adminUploadsFloatSlow 26s ease-in-out infinite;
        }

        .adminUploadsOrbB {
          right: -10%;
          top: 18%;
          height: 22rem;
          width: 22rem;
          background: rgba(59, 130, 246, 0.07);
          animation: adminUploadsFloatSlow 28s ease-in-out infinite;
        }

        @keyframes adminUploadsTwinkle {
          0%, 100% {
            transform: translateY(0px) scale(0.85);
            opacity: 0.22;
          }

          50% {
            transform: translateY(-4px) scale(1.18);
            opacity: 1;
          }
        }

        @keyframes adminUploadsFloatSlow {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(0, 10px, 0);
          }
        }

        @keyframes adminUploadsFogDriftOne {
          0%, 100% {
            transform: translateX(-2%) translateY(0px) scaleX(1);
          }

          50% {
            transform: translateX(3%) translateY(-4px) scaleX(1.04);
          }
        }

        @keyframes adminUploadsFogDriftTwo {
          0%, 100% {
            transform: translateX(3%) translateY(0px) scaleX(1.02);
          }

          50% {
            transform: translateX(-2%) translateY(5px) scaleX(1.06);
          }
        }

        @keyframes adminUploadsMoonGlow {
          0%, 100% {
            opacity: 0.2;
          }

          50% {
            opacity: 0.34;
          }
        }

        .adminUploadsLogoGlow {
          animation: adminUploadsLogoGlow 2.8s ease-in-out infinite;
          color: #ffffff;
          text-shadow:
            0 0 8px rgba(255, 255, 255, 0.70),
            0 0 18px rgba(255, 255, 255, 0.45),
            0 0 34px rgba(96, 165, 250, 0.36),
            0 0 52px rgba(59, 130, 246, 0.24);
        }

        @keyframes adminUploadsLogoGlow {
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
    </main>
  );
}
