import Link from "next/link";

type ClientMessage = {
  id: string;
  client_email: string;
  report_id: string | null;
  sender: string;
  subject: string | null;
  message: string;
  status: string;
  created_at: string;
};

async function getMessages(): Promise<ClientMessage[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase environment variables.");
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/client_messages?select=*&order=created_at.desc&limit=200`,
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
    throw new Error(`Could not load messages: ${errorText}`);
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

function NightSkyBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#05070b]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(34,211,238,0.10),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(59,130,246,0.10),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.06),transparent_38%)]" />
      <div className="absolute left-[-18%] top-[12%] h-[260px] w-[140%] rounded-full bg-gradient-to-r from-transparent via-cyan-200/10 to-transparent blur-[105px]" />
      <div className="absolute left-[-18%] top-[52%] h-[260px] w-[140%] rounded-full bg-gradient-to-r from-transparent via-blue-300/10 to-transparent blur-[110px]" />

      {[
        ["6%", "10%", "2px"],
        ["12%", "32%", "2px"],
        ["25%", "18%", "3px"],
        ["42%", "12%", "2px"],
        ["51%", "38%", "3px"],
        ["68%", "20%", "2px"],
        ["77%", "50%", "3px"],
        ["86%", "16%", "2px"],
      ].map(([left, top, size], index) => (
        <span
          key={index}
          className="absolute block rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.95),0_0_18px_rgba(147,197,253,0.62),0_0_34px_rgba(34,211,238,0.25)]"
          style={{
            left,
            top,
            width: size,
            height: size,
          }}
        />
      ))}
    </div>
  );
}

export default async function AdminMessagesPage() {
  const messages = await getMessages();

  const openMessages = messages.filter((message) => message.status === "Open");
  const reportMessages = messages.filter((message) => message.report_id);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] text-white">
      <NightSkyBackground />

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link
              href="/"
              className="adminMessagesLogoGlow inline-block text-lg font-bold tracking-[0.35em] text-white"
            >
              GHOSTLAYER
            </Link>

            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.45em] text-cyan-300">
              Admin Messages
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Client message center
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-300">
              Review client questions, report-specific messages, and workflow
              follow-up notes submitted through the client portal.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/reports"
              className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-black shadow-[0_0_30px_rgba(255,255,255,0.18)] transition hover:scale-[1.02] hover:opacity-90"
            >
              Reports
            </Link>

            <Link
              href="/admin/uploads"
              className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:scale-[1.02] hover:bg-cyan-300/15"
            >
              Uploads
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
              Total Messages
            </p>
            <p className="mt-4 text-3xl font-black tracking-tight text-white">
              {messages.length}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-yellow-300/25 bg-yellow-300/10 p-5 backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-yellow-200">
              Open
            </p>
            <p className="mt-4 text-3xl font-black tracking-tight text-white">
              {openMessages.length}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-purple-300/25 bg-purple-300/10 p-5 backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-purple-200">
              Report Related
            </p>
            <p className="mt-4 text-3xl font-black tracking-tight text-white">
              {reportMessages.length}
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] shadow-[0_24px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="border-b border-white/10 px-6 py-5">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">
              Inbox
            </p>
            <h2 className="mt-2 text-2xl font-bold">Client Messages</h2>
          </div>

          <div className="divide-y divide-white/10">
            {messages.map((item) => (
              <div key={item.id} className="px-6 py-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-4xl">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-lg font-bold text-white">
                        {item.subject || "Client message"}
                      </p>

                      <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-bold text-cyan-100">
                        {item.status}
                      </span>

                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-bold text-gray-300">
                        {item.sender}
                      </span>
                    </div>

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
                        General message
                      </p>
                    )}

                    <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-gray-300">
                      {item.message}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    {item.report_id ? (
                      <Link
                        href={`/reports/${encodeURIComponent(item.report_id)}`}
                        className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-bold text-white transition hover:bg-white/[0.09]"
                      >
                        Preview Report
                      </Link>
                    ) : null}

                    <a
                      href={`mailto:${item.client_email}?subject=${encodeURIComponent(
                        `Re: ${item.subject || "Ghostlayer message"}`
                      )}`}
                      className="rounded-xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-xs font-bold text-emerald-100 transition hover:bg-emerald-300/15"
                    >
                      Reply by Email
                    </a>
                  </div>
                </div>
              </div>
            ))}

            {messages.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <p className="text-lg font-bold text-white">
                  No client messages yet.
                </p>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-gray-400">
                  Messages sent from the client portal will appear here.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <style>{`
        .adminMessagesLogoGlow {
          animation: adminMessagesLogoGlow 2.8s ease-in-out infinite;
          color: #ffffff;
          text-shadow:
            0 0 8px rgba(255, 255, 255, 0.70),
            0 0 18px rgba(255, 255, 255, 0.45),
            0 0 34px rgba(96, 165, 250, 0.36),
            0 0 52px rgba(59, 130, 246, 0.24);
        }

        @keyframes adminMessagesLogoGlow {
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
