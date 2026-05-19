import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

type ClientMessage = {
  id: string;
  client_email: string;
  report_id: string | null;
  subject: string | null;
  message: string | null;
  status: string | null;
  sender_type: string | null;
  created_at: string;
};

type ClientReport = {
  report_id: string;
  client_name: string;
  company: string | null;
  email: string;
  status: string | null;
};

export const metadata = {
  title: "Messages | Ghostlayer",
  description: "Send and review Ghostlayer client portal messages.",
};

async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server component cookie writes can be ignored here.
          }
        },
      },
    }
  );
}

async function getCurrentUserEmail() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect("/login?next=/client/messages");
  }

  return user.email.toLowerCase();
}

async function getClientReports(email: string): Promise<ClientReport[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase environment variables.");
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/client_reports?email=eq.${encodeURIComponent(
      email
    )}&archived=eq.false&select=report_id,client_name,company,email,status&order=created_at.desc`,
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
    throw new Error(`Could not load reports: ${errorText}`);
  }

  return response.json();
}

async function getClientMessages(email: string): Promise<ClientMessage[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase environment variables.");
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/client_messages?client_email=eq.${encodeURIComponent(
      email
    )}&select=*&order=created_at.desc&limit=100`,
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

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function statusTone(status: string | null) {
  const normalized = String(status || "").toLowerCase();

  if (normalized.includes("answered") || normalized.includes("closed")) {
    return "border-emerald-300/20 bg-emerald-300/10 text-emerald-100";
  }

  if (normalized.includes("open") || normalized.includes("awaiting")) {
    return "border-yellow-300/20 bg-yellow-300/10 text-yellow-100";
  }

  return "border-cyan-300/20 bg-cyan-300/10 text-cyan-100";
}

function senderTone(senderType: string | null) {
  const normalized = String(senderType || "").toLowerCase();

  if (normalized.includes("admin")) {
    return "border-purple-300/20 bg-purple-300/10 text-purple-100";
  }

  return "border-cyan-300/20 bg-cyan-300/10 text-cyan-100";
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
    <div className="clientMessagesNightSky" aria-hidden="true">
      <div className="clientMessagesMoon" />
      <div className="clientMessagesFog clientMessagesFogA" />
      <div className="clientMessagesFog clientMessagesFogB" />
      <div className="clientMessagesOrb clientMessagesOrbA" />
      <div className="clientMessagesOrb clientMessagesOrbB" />

      {stars.map((star, index) => (
        <span
          key={index}
          className="clientMessagesStar"
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

export default async function ClientMessagesPage({
  searchParams,
}: {
  searchParams?: Promise<{ sent?: string; error?: string }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const email = await getCurrentUserEmail();

  const [reports, messages] = await Promise.all([
    getClientReports(email),
    getClientMessages(email),
  ]);

  const openMessages = messages.filter((message) => {
    const status = String(message.status || "").toLowerCase();
    return !status.includes("answered") && !status.includes("closed");
  });

  const answeredMessages = messages.filter((message) => {
    const status = String(message.status || "").toLowerCase();
    return status.includes("answered") || status.includes("closed");
  });

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] text-white">
      <NightSkyBackground />

      <section className="relative z-10 mx-auto max-w-6xl px-6 py-10">
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link
              href="/"
              className="clientMessagesLogoGlow inline-block text-lg font-bold tracking-[0.35em] text-white"
            >
              GHOSTLAYER
            </Link>

            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.45em] text-cyan-300">
              Client Messages
            </p>

            <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
              Message Ghostlayer
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-300">
              Send questions, workflow updates, or follow-up notes connected to
              your Ghostlayer reports.
            </p>

            <p className="mt-3 text-sm text-gray-400">
              Signed in as <span className="text-cyan-100">{email}</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/client/dashboard"
              className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-black shadow-[0_0_30px_rgba(255,255,255,0.18)] transition hover:scale-[1.02] hover:opacity-90"
            >
              Dashboard
            </Link>

            <Link
              href="/client/uploads"
              className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:scale-[1.02] hover:bg-cyan-300/15"
            >
              Uploads
            </Link>

            <Link
              href="/client/monitoring"
              className="rounded-2xl border border-purple-300/20 bg-purple-300/10 px-5 py-3 text-sm font-semibold text-purple-100 transition hover:scale-[1.02] hover:bg-purple-300/15"
            >
              Monitoring
            </Link>

            <Link
              href="/client/billing"
              className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-5 py-3 text-sm font-semibold text-emerald-100 transition hover:scale-[1.02] hover:bg-emerald-300/15"
            >
              Billing
            </Link>
          </div>
        </div>

        {resolvedSearchParams.sent === "1" ? (
          <div className="mb-6 rounded-2xl border border-emerald-300/25 bg-emerald-300/10 p-5 text-emerald-100">
            Your message was sent. Ghostlayer will review it and reply as soon
            as possible.
          </div>
        ) : null}

        {resolvedSearchParams.error ? (
          <div className="mb-6 rounded-2xl border border-red-300/25 bg-red-300/10 p-5 text-red-100">
            Something needs attention: {resolvedSearchParams.error}
          </div>
        ) : null}

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

          <div className="rounded-[1.5rem] border border-emerald-300/25 bg-emerald-300/10 p-5 backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-200">
              Answered
            </p>
            <p className="mt-4 text-3xl font-black tracking-tight text-white">
              {answeredMessages.length}
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <form
            action="/api/send-client-message"
            method="post"
            className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_24px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8"
          >
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">
              New Message
            </p>

            <h2 className="mt-4 text-2xl font-black tracking-tight text-white">
              Send a message
            </h2>

            <p className="mt-3 text-sm leading-7 text-gray-300">
              Send report questions, uploaded-file context, monitoring notes, or
              workflow follow-up requests.
            </p>

            <input type="hidden" name="client_email" value={email} />

            <div className="mt-6 space-y-5">
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
                  Related Report
                </span>
                <select
                  name="report_id"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-sm text-white outline-none transition focus:border-cyan-300/50 focus:bg-black/40"
                  defaultValue={reports[0]?.report_id || ""}
                >
                  <option value="">General message</option>
                  {reports.map((report) => (
                    <option key={report.report_id} value={report.report_id}>
                      {(report.company || report.client_name || "Report") +
                        " — " +
                        report.report_id}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
                  Subject
                </span>
                <input
                  name="subject"
                  type="text"
                  required
                  placeholder="Example: Question about my workflow report"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-300/50 focus:bg-black/40"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
                  Message
                </span>
                <textarea
                  name="message"
                  rows={8}
                  required
                  placeholder="Write your message here..."
                  className="w-full resize-y rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-sm leading-7 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-300/50 focus:bg-black/40"
                />
              </label>
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-2xl bg-white px-6 py-4 text-sm font-bold text-black shadow-[0_0_30px_rgba(255,255,255,0.18)] transition hover:scale-[1.02] hover:opacity-90"
            >
              Send Message
            </button>
          </form>

          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] shadow-[0_24px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div className="border-b border-white/10 px-6 py-5">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">
                Inbox
              </p>
              <h2 className="mt-2 text-2xl font-bold">Message history</h2>
            </div>

            <div className="divide-y divide-white/10">
              {messages.map((message) => (
                <article key={message.id} className="px-6 py-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-bold text-white">
                          {message.subject || "Message"}
                        </h3>

                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-bold ${statusTone(
                            message.status
                          )}`}
                        >
                          {message.status || "Open"}
                        </span>

                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-bold ${senderTone(
                            message.sender_type
                          )}`}
                        >
                          {message.sender_type || "client"}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-gray-400">
                        {formatDateTime(message.created_at)}
                      </p>

                      {message.report_id ? (
                        <Link
                          href={`/reports/${encodeURIComponent(
                            message.report_id
                          )}`}
                          className="mt-2 inline-block font-mono text-xs text-cyan-200 transition hover:text-cyan-100"
                        >
                          {message.report_id}
                        </Link>
                      ) : null}
                    </div>
                  </div>

                  {message.message ? (
                    <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-gray-300">
                      {message.message}
                    </p>
                  ) : null}
                </article>
              ))}

              {messages.length === 0 ? (
                <div className="px-6 py-14 text-center">
                  <p className="text-lg font-bold text-white">
                    No messages yet.
                  </p>
                  <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-gray-400">
                    Send your first message to Ghostlayer using the form on this
                    page.
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .clientMessagesNightSky {
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

        .clientMessagesMoon {
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
          animation: clientMessagesMoonGlow 4.8s ease-in-out infinite;
        }

        .clientMessagesStar {
          position: absolute;
          display: block;
          border-radius: 9999px;
          background: #ffffff;
          box-shadow:
            0 0 8px rgba(255, 255, 255, 0.95),
            0 0 18px rgba(147, 197, 253, 0.62),
            0 0 30px rgba(59, 130, 246, 0.35);
          animation-name: clientMessagesTwinkle;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        .clientMessagesFog {
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

        .clientMessagesFogA {
          top: 18%;
          animation: clientMessagesFogDriftOne 42s ease-in-out infinite;
        }

        .clientMessagesFogB {
          top: 58%;
          animation: clientMessagesFogDriftTwo 46s ease-in-out infinite;
        }

        .clientMessagesOrb {
          position: absolute;
          border-radius: 9999px;
          filter: blur(92px);
          opacity: 0.24;
        }

        .clientMessagesOrbA {
          left: -10%;
          top: -8%;
          height: 26rem;
          width: 26rem;
          background: rgba(34, 211, 238, 0.07);
          animation: clientMessagesFloatSlow 26s ease-in-out infinite;
        }

        .clientMessagesOrbB {
          right: -10%;
          top: 18%;
          height: 22rem;
          width: 22rem;
          background: rgba(59, 130, 246, 0.07);
          animation: clientMessagesFloatSlow 28s ease-in-out infinite;
        }

        .clientMessagesLogoGlow {
          animation: clientMessagesLogoGlow 2.8s ease-in-out infinite;
          color: #ffffff;
          text-shadow:
            0 0 8px rgba(255, 255, 255, 0.70),
            0 0 18px rgba(255, 255, 255, 0.45),
            0 0 34px rgba(96, 165, 250, 0.36),
            0 0 52px rgba(59, 130, 246, 0.24);
        }

        @keyframes clientMessagesTwinkle {
          0%, 100% {
            transform: translateY(0px) scale(0.85);
            opacity: 0.22;
          }

          50% {
            transform: translateY(-4px) scale(1.18);
            opacity: 1;
          }
        }

        @keyframes clientMessagesFloatSlow {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(0, 10px, 0);
          }
        }

        @keyframes clientMessagesFogDriftOne {
          0%, 100% {
            transform: translateX(-2%) translateY(0px) scaleX(1);
          }

          50% {
            transform: translateX(3%) translateY(-4px) scaleX(1.04);
          }
        }

        @keyframes clientMessagesFogDriftTwo {
          0%, 100% {
            transform: translateX(3%) translateY(0px) scaleX(1.02);
          }

          50% {
            transform: translateX(-2%) translateY(5px) scaleX(1.06);
          }
        }

        @keyframes clientMessagesMoonGlow {
          0%, 100% {
            opacity: 0.2;
          }

          50% {
            opacity: 0.34;
          }
        }

        @keyframes clientMessagesLogoGlow {
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
