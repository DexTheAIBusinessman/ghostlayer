import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import ClientMessageFlash from "./_components/ClientMessageFlash";

export const metadata = {
  title: "Messages | Ghostlayer",
  description: "Message Ghostlayer about your workflow reports.",
};

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
  created_at: string;
};

type ReportOption = {
  report_id: string;
  company: string | null;
  client_name: string;
  status: string | null;
  email_sent: boolean | null;
};

async function getMessages(email: string): Promise<ClientMessage[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing Supabase environment variables.");
    return [];
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/client_messages?client_email=eq.${encodeURIComponent(
      email
    )}&select=id,client_email,report_id,sender,subject,message,status,admin_reply,admin_replied_at,created_at&order=created_at.desc`,
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
    console.error("Could not load messages:", errorText);
    return [];
  }

  return response.json();
}

async function getReportOptions(email: string): Promise<ReportOption[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing Supabase environment variables.");
    return [];
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/client_reports?email=eq.${encodeURIComponent(
      email
    )}&archived=eq.false&select=report_id,company,client_name,status,email_sent&order=created_at.desc`,
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
    console.error("Could not load report options:", errorText);
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

function PortalBackground() {
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
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#05070b]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(34,211,238,0.10),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(59,130,246,0.10),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.06),transparent_38%)]" />

      <div className="clientMessagesFog clientMessagesFogA" />
      <div className="clientMessagesFog clientMessagesFogB" />

      <div className="absolute left-[-18%] top-[12%] h-[260px] w-[140%] rounded-full bg-gradient-to-r from-transparent via-cyan-200/10 to-transparent blur-[105px]" />
      <div className="absolute left-[-18%] top-[52%] h-[260px] w-[140%] rounded-full bg-gradient-to-r from-transparent via-blue-300/10 to-transparent blur-[110px]" />

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

      <style>{`
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


        .clientMessagesLogoGlow {
          animation: clientMessagesLogoGlow 2.8s ease-in-out infinite;
          color: #ffffff;
          text-shadow:
            0 0 8px rgba(255, 255, 255, 0.70),
            0 0 18px rgba(255, 255, 255, 0.45),
            0 0 34px rgba(96, 165, 250, 0.36),
            0 0 52px rgba(59, 130, 246, 0.24);
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
        href="/client/uploads"
        className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/15"
      >
        Uploads
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

export default async function ClientMessagesPage({
  searchParams,
}: {
  searchParams?: Promise<{ sent?: string; error?: string }>;
}) {
  const cookieStore = await cookies();
  const clientEmail = cookieStore.get("ghostlayer_client_email")?.value;

  if (!clientEmail) {
    redirect("/login?error=login-required&next=/client/messages");
  }

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const messages = await getMessages(clientEmail);
  const reportOptions = await getReportOptions(clientEmail);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] text-white">
      <PortalBackground />

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
              Message Center
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Contact Ghostlayer
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-300">
              Send questions, context, or clarifications about your workflow scan
              and monitoring updates. Signed in as{" "}
              <span className="text-cyan-100">{clientEmail}</span>.
            </p>
          </div>

          <NavLinks />
        </div>
      <ClientMessageFlash />

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_24px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">
              New Message
            </p>

    
        <section className="mt-8 rounded-[2rem] border border-cyan-300/20 bg-cyan-300/10 p-6 shadow-[0_24px_100px_rgba(0,0,0,0.25)] backdrop-blur-xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-200">
            Message Guidance
          </p>

          <h2 className="mt-3 text-2xl font-black text-white">
            How to send a useful message
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-300">
            Use messages to send follow-up details, answer Ghostlayer questions, clarify uploaded files,
            or explain what changed in your workflow. Clear, specific messages help Ghostlayer review your request faster.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-5">
              <h3 className="text-lg font-black text-white">
                Good message details
              </h3>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-gray-300">
                <li>• What changed since your original request.</li>
                <li>• Which upload, report, process, or tool your message is about.</li>
                <li>• What outcome you want Ghostlayer to review or clarify.</li>
                <li>• Any missing context that would help explain the issue.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-5">
              <h3 className="text-lg font-black text-white">
                Response timing
              </h3>
              <p className="mt-4 text-sm leading-7 text-gray-300">
                Messages are reviewed during normal Ghostlayer admin review windows. For urgent billing,
                access, privacy, or security issues, use Contact Support and clearly mark the issue as urgent.
              </p>
            </div>

            <div className="rounded-2xl border border-red-300/20 bg-red-300/10 p-5">
              <h3 className="text-lg font-black text-white">
                Do not send
              </h3>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-gray-300">
                <li>• Passwords or login credentials.</li>
                <li>• API keys, private tokens, or secret keys.</li>
                <li>• Full bank/card numbers or unnecessary sensitive personal data.</li>
                <li>• Files or information you do not have permission to share.</li>
              </ul>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-5">
            <h3 className="text-lg font-black text-white">
              Message template
            </h3>
            <p className="mt-3 text-sm leading-7 text-gray-300">
              A useful message usually includes: what this is about, what changed, what file/report it connects to,
              and what you need Ghostlayer to review next.
            </p>

            <div className="mt-4 rounded-2xl border border-cyan-300/15 bg-cyan-300/10 p-4 text-sm leading-7 text-cyan-100">
              Example: “This is about my uploaded sales intake screenshot. The issue is that new leads are being copied manually from email into the CRM. I uploaded the screenshot named sales-intake-flow.png. Please review whether this can be simplified.”
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="/contact"
                className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/[0.08]"
              >
                Contact Support
              </a>
              <a
                href="/client/uploads"
                className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/[0.08]"
              >
                Upload Files
              </a>
            </div>
          </div>
        </section>

        <form action="/api/send-client-message" className="mt-6 space-y-4" method="post">
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
                  Related Report
                </span>
                <select
                  name="reportId"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/50 focus:bg-black/40"
                >
                  <option value="">General question</option>
                  {reportOptions.map((report) => (
                    <option key={report.report_id} value={report.report_id}>
                      {report.company || report.client_name} — {report.report_id}
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
                  placeholder="Example: Question about my report"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-300/50 focus:bg-black/40"
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
                  className="w-full resize-y rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-300/50 focus:bg-black/40"
                />
              </label>

              <button
                type="submit"
                className="w-full rounded-2xl bg-white px-6 py-4 text-sm font-bold text-black shadow-[0_0_30px_rgba(255,255,255,0.18)] transition hover:scale-[1.02] hover:opacity-90"
              >
                Send Message
              </button>
            </form>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] shadow-[0_24px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div className="border-b border-white/10 px-6 py-5">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">
                Message History
              </p>
              <p className="mt-2 text-sm text-gray-400">
                {messages.length} message{messages.length === 1 ? "" : "s"}.
              </p>
            </div>

            <div className="divide-y divide-white/10">
              {messages.map((item) => (
                <div key={item.id} className="px-6 py-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-bold text-white">
                        {item.status === "Answered" ? "Answered by Ghostlayer" : item.subject || "Client message"}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {formatDate(item.created_at)}
                      </p>

                      {item.report_id ? (
                        <p className="mt-2 font-mono text-xs text-cyan-200">
                          {item.report_id}
                        </p>
                      ) : null}
                    </div>

                    <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-bold text-cyan-100">
                      {item.status}
                    </span>
                  </div>

                  <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-gray-300">
                    {item.message}
                  </p>

                    {item.admin_reply ? (
                      <div className="mt-5 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4">
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-200">
                          Ghostlayer Reply
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
                      <div className="mt-5 rounded-2xl border border-yellow-300/20 bg-yellow-300/10 p-4">
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-yellow-200">
                          Awaiting Ghostlayer Reply
                        </p>
                        <p className="mt-2 text-sm leading-6 text-yellow-100/70">
                          Your message has been received. A Ghostlayer reply will appear here once sent.
                        </p>
                      </div>
                    )}
                </div>
              ))}

              {messages.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <p className="text-lg font-bold text-white">
                    No messages yet.
                  </p>
                  <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-gray-400">
                    Send a message if you have questions about your report,
                    workflow scan, or monitoring.
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
