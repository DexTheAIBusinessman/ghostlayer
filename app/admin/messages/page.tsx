import Link from "next/link";
import AdminMessageReplyForm from "./_components/AdminMessageReplyForm";

type ClientMessage = {
  id: string;
  client_email: string;
  report_id: string | null;
  sender: string;
  subject: string | null;
  message: string;
  status: string;
  admin_reply?: string | null;
  admin_replied_at?: string | null;
  admin_reply_email_id?: string | null;
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
    <div className="adminMessagesNightSky" aria-hidden="true">
      <div className="adminMessagesMoon" />
      <div className="adminMessagesFog adminMessagesFogA" />
      <div className="adminMessagesFog adminMessagesFogB" />
      <div className="adminMessagesOrb adminMessagesOrbA" />
      <div className="adminMessagesOrb adminMessagesOrbB" />

      {stars.map((star, index) => (
        <span
          key={index}
          className="adminMessagesStar"
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


function MessageFilterTabs({
  activeFilter,
  counts,
}: {
  activeFilter: string;
  counts: {
    all: number;
    open: number;
    answered: number;
    report: number;
    general: number;
  };
}) {
  const filters = [
    { key: "all", label: "All", count: counts.all, href: "/admin/messages" },
    { key: "open", label: "Open", count: counts.open, href: "/admin/messages?filter=open" },
    { key: "answered", label: "Answered", count: counts.answered, href: "/admin/messages?filter=answered" },
    { key: "report", label: "Report Related", count: counts.report, href: "/admin/messages?filter=report" },
    { key: "general", label: "General", count: counts.general, href: "/admin/messages?filter=general" },
  ];

  return (
    <div className="mb-6 flex flex-wrap gap-3">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.key;

        return (
          <Link
            key={filter.key}
            href={filter.href}
            className={
              isActive
                ? "rounded-2xl border border-cyan-300/35 bg-cyan-300/15 px-4 py-3 text-sm font-bold text-cyan-100 shadow-[0_0_28px_rgba(34,211,238,0.12)] transition hover:bg-cyan-300/20"
                : "rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-gray-300 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
            }
          >
            <span>{filter.label}</span>
            <span className="ml-2 rounded-full border border-white/10 bg-black/25 px-2 py-0.5 text-xs">
              {filter.count}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams?: Promise<{ filter?: string }>;
}) {
  const messages = await getMessages();
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const activeFilter = resolvedSearchParams.filter || "all";

  const openMessages = messages.filter((message) => message.status === "Open");
  const answeredMessages = messages.filter((message) => message.status === "Answered");
  const reportMessages = messages.filter((message) => message.report_id);
  const generalMessages = messages.filter((message) => !message.report_id);

  const filteredMessages =
    activeFilter === "open"
      ? openMessages
      : activeFilter === "answered"
        ? answeredMessages
        : activeFilter === "report"
          ? reportMessages
          : activeFilter === "general"
            ? generalMessages
            : messages;

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

        <MessageFilterTabs
        activeFilter={activeFilter}
        counts={{
          all: messages.length,
          open: openMessages.length,
          answered: answeredMessages.length,
          report: reportMessages.length,
          general: generalMessages.length,
        }}
      />

      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] shadow-[0_24px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="border-b border-white/10 px-6 py-5">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">
              Inbox
            </p>
            <h2 className="mt-2 text-2xl font-bold">Client Messages</h2>
          </div>

          <div className="divide-y divide-white/10">
            {filteredMessages.map((item) => (
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

                  {item.admin_reply ? (
                    <div className="mt-5 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-200">
                        Ghostlayer Reply Sent
                      </p>

                      <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-emerald-50">
                        {item.admin_reply}
                      </p>

                      {item.admin_replied_at ? (
                        <p className="mt-3 text-xs text-emerald-100/60">
                          Sent {formatDate(item.admin_replied_at)}
                        </p>
                      ) : null}
                    </div>
                  ) : (
                    <AdminMessageReplyForm
                      messageId={item.id}
                      clientEmail={item.client_email}
                      subject={item.subject || "Ghostlayer message"}
                    />
                  )}
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

                    
                  </div>
                </div>
              </div>
            ))}

            {filteredMessages.length === 0 ? (
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

        .adminMessagesNightSky {
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

        .adminMessagesMoon {
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
          animation: adminMessagesMoonGlow 4.8s ease-in-out infinite;
        }

        .adminMessagesStar {
          position: absolute;
          display: block;
          border-radius: 9999px;
          background: #ffffff;
          box-shadow:
            0 0 8px rgba(255, 255, 255, 0.95),
            0 0 18px rgba(147, 197, 253, 0.62),
            0 0 30px rgba(59, 130, 246, 0.35);
          animation-name: adminMessagesTwinkle;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        .adminMessagesFog {
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

        .adminMessagesFogA {
          top: 18%;
          animation: adminMessagesFogDriftOne 42s ease-in-out infinite;
        }

        .adminMessagesFogB {
          top: 58%;
          animation: adminMessagesFogDriftTwo 46s ease-in-out infinite;
        }

        .adminMessagesOrb {
          position: absolute;
          border-radius: 9999px;
          filter: blur(92px);
          opacity: 0.24;
        }

        .adminMessagesOrbA {
          left: -10%;
          top: -8%;
          height: 26rem;
          width: 26rem;
          background: rgba(34, 211, 238, 0.07);
          animation: adminMessagesFloatSlow 26s ease-in-out infinite;
        }

        .adminMessagesOrbB {
          right: -10%;
          top: 18%;
          height: 22rem;
          width: 22rem;
          background: rgba(59, 130, 246, 0.07);
          animation: adminMessagesFloatSlow 28s ease-in-out infinite;
        }

        @keyframes adminMessagesTwinkle {
          0%, 100% {
            transform: translateY(0px) scale(0.85);
            opacity: 0.22;
          }

          50% {
            transform: translateY(-4px) scale(1.18);
            opacity: 1;
          }
        }

        @keyframes adminMessagesFloatSlow {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(0, 10px, 0);
          }
        }

        @keyframes adminMessagesFogDriftOne {
          0%, 100% {
            transform: translateX(-2%) translateY(0px) scaleX(1);
          }

          50% {
            transform: translateX(3%) translateY(-4px) scaleX(1.04);
          }
        }

        @keyframes adminMessagesFogDriftTwo {
          0%, 100% {
            transform: translateX(3%) translateY(0px) scaleX(1.02);
          }

          50% {
            transform: translateX(-2%) translateY(5px) scaleX(1.06);
          }
        }

        @keyframes adminMessagesMoonGlow {
          0%, 100% {
            opacity: 0.2;
          }

          50% {
            opacity: 0.34;
          }
        }

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
