import Link from "next/link";

export const metadata = {
  title: "Trust & Compliance Agent | Ghostlayer Admin",
  description:
    "Read-only Ghostlayer Trust and Compliance Agent for reviewing business readiness, app-side trust items, and pending compliance tasks.",
};

type ComplianceQueueItem = {
  priority: "High" | "Medium" | "Low";
  category: string;
  title: string;
  detail: string;
  href: string;
  suggestedAction: string;
  approvalRule: string;
};

const queueItems: ComplianceQueueItem[] = [
  {
    priority: "High",
    category: "Admin Protection",
    title: "Confirm all admin pages are protected",
    detail:
      "All /admin routes, including agent pages, should require Basic Auth and return 401 without credentials.",
    href: "/admin/trust-compliance",
    suggestedAction:
      "Run unauthenticated curl checks against new admin agent pages and confirm they return HTTP 401.",
    approvalRule:
      "Admin confirms live security checks. Agent may not change auth or credentials.",
  },
  {
    priority: "High",
    category: "Billing Safety",
    title: "Confirm Stripe billing errors are sanitized",
    detail:
      "Billing portal errors should not expose raw Stripe errors, secret key fragments, or internal details to clients.",
    href: "/client/billing",
    suggestedAction:
      "Test the client billing portal and confirm users see a safe error message or successful redirect.",
    approvalRule:
      "Admin confirms Stripe configuration and client-facing billing behavior.",
  },
  {
    priority: "High",
    category: "Client Data Handling",
    title: "Review data deletion and correction process",
    detail:
      "Client data requests should be handled through the internal process page before any deletion, correction, or retention decision.",
    href: "/admin/data-requests",
    suggestedAction:
      "Use Data Requests for privacy, deletion, correction, and client data review requests.",
    approvalRule:
      "Admin approves all data deletion, correction, retention, and client response decisions.",
  },
  {
    priority: "High",
    category: "Incident Response",
    title: "Review incident response readiness",
    detail:
      "Wrong-client access, billing failures, upload problems, report delivery mistakes, and credential concerns should flow through Incident Response.",
    href: "/admin/incident-response",
    suggestedAction:
      "Use Incident Response when a security, access, billing, upload, report, or credential issue occurs.",
    approvalRule:
      "Admin approves client notices, credential rotation, and incident escalation.",
  },
  {
    priority: "Medium",
    category: "Public Trust",
    title: "Confirm public trust pages are reachable",
    detail:
      "Privacy, Terms, Refund Policy, Service Agreement, and Contact should be easy to find from the public site/footer.",
    href: "/contact",
    suggestedAction:
      "Open the public trust pages and confirm the footer/contact navigation is working.",
    approvalRule:
      "Admin confirms public-facing legal/support page availability.",
  },
  {
    priority: "Medium",
    category: "Checkout Acknowledgement",
    title: "Confirm legal/payment acknowledgement remains live",
    detail:
      "Checkout should still include legal/payment acknowledgement before purchase.",
    href: "/start-workflow-scan",
    suggestedAction:
      "Test the workflow scan / checkout path and confirm the acknowledgement appears before payment.",
    approvalRule:
      "Admin confirms checkout flow and public claims.",
  },
  {
    priority: "Medium",
    category: "Upload Privacy",
    title: "Confirm upload handling remains private",
    detail:
      "Client uploads should remain private, protected, size/type-limited, and downloaded only through protected routes.",
    href: "/admin/uploads",
    suggestedAction:
      "Review upload settings and confirm recent uploads are not exposed through public storage URLs.",
    approvalRule:
      "Admin approves upload deletion, access, report attachment, or client-facing file decisions.",
  },
  {
    priority: "Medium",
    category: "Business Setup",
    title: "Review real-world business setup items",
    detail:
      "Business bank account, bookkeeping software, insurance, NC license/permit confirmation, LLC/EIN/registered agent, and operating agreement are real-world tasks.",
    href: "/admin/trust-compliance",
    suggestedAction:
      "Keep real-world items pending or in progress until actually completed and verified.",
    approvalRule:
      "Agent may not mark real-world business items complete without admin confirmation.",
  },
  {
    priority: "Low",
    category: "Bookkeeping",
    title: "Review bookkeeping readiness",
    detail:
      "The admin bookkeeping page is a workflow aid, not the official accounting system.",
    href: "/admin/agents/billing-bookkeeping",
    suggestedAction:
      "Confirm QuickBooks, Wave, Xero, or another official bookkeeping system is set up before marking bookkeeping complete.",
    approvalRule:
      "Admin or bookkeeper confirms official bookkeeping setup.",
  },
  {
    priority: "Low",
    category: "Agent Governance",
    title: "Review agent rules",
    detail:
      "Agents should remain read-only, draft-only, flag-only, or approval-based until you intentionally expand permissions.",
    href: "/admin/agent-rules",
    suggestedAction:
      "Review agent guardrails before giving agents any new ability to write, send, delete, merge, or modify records.",
    approvalRule:
      "Admin approves any expansion of agent permissions.",
  },
];

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

export default function TrustComplianceAgentPage() {
  const highPriority = queueItems.filter((item) => item.priority === "High").length;
  const mediumPriority = queueItems.filter((item) => item.priority === "Medium").length;
  const lowPriority = queueItems.filter((item) => item.priority === "Low").length;

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

        <p className="mt-10 text-xs font-semibold uppercase tracking-[0.35em] text-lime-300">
          Agent 07 · Checklist Review
        </p>

        <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl">
          Trust & Compliance Agent
        </h1>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-300">
          This agent reviews Ghostlayer trust, compliance, privacy, billing safety,
          legal/support, upload privacy, incident response, and business setup readiness.
          It only flags and recommends. It does not mark real-world tasks complete automatically.
        </p>

        <div className="mt-6 flex flex-wrap gap-3 text-xs font-bold">
          <Link href="/admin/analytics" className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-white">
            Admin Home
          </Link>
          <Link href="/admin/agents" className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-cyan-100">
            Agents
          </Link>
          <Link href="/admin/agents/daily-summary" className="rounded-full border border-purple-300/20 bg-purple-300/10 px-4 py-2 text-purple-100">
            Daily Summary
          </Link>
          <Link href="/admin/trust-compliance" className="rounded-full border border-lime-300/20 bg-lime-300/10 px-4 py-2 text-lime-100">
            Trust & Compliance
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

        <div className="mt-8 grid gap-5 sm:grid-cols-4">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-gray-300">
              Queue Items
            </p>
            <p className="mt-4 text-3xl font-black text-white">{queueItems.length}</p>
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
        </div>

        <section className="mt-8 rounded-[2rem] border border-lime-300/20 bg-lime-300/10 p-6 shadow-[0_24px_100px_rgba(0,0,0,0.25)] backdrop-blur-xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-lime-200">
                Trust & Compliance Queue
              </p>
              <h2 className="mt-3 text-2xl font-black text-white">
                Readiness items needing admin review
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-300">
                Review high-priority items first. The agent highlights what to check,
                but you confirm security, legal, support, billing, and business setup status.
              </p>
            </div>

            <Link
              href="/admin/trust-compliance"
              className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/[0.08]"
            >
              Open Trust & Compliance
            </Link>
          </div>

          <div className="mt-6 grid gap-4">
            {queueItems.map((item) => {
              const priorityClass =
                item.priority === "High"
                  ? "border-red-300/25 bg-red-300/10 text-red-100"
                  : item.priority === "Medium"
                    ? "border-amber-300/25 bg-amber-300/10 text-amber-100"
                    : "border-cyan-300/20 bg-cyan-300/10 text-cyan-100";

              return (
                <Link
                  key={`${item.priority}-${item.title}`}
                  href={item.href}
                  className={`block rounded-2xl border p-4 transition hover:scale-[1.005] ${priorityClass}`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em]">
                        {item.priority} Priority · {item.category}
                      </p>
                      <h3 className="mt-2 text-lg font-black text-white">
                        {item.title}
                      </h3>
                    </div>

                    <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-bold text-white">
                      Review
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-gray-200">
                    {item.detail}
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
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-red-300/20 bg-red-300/10 p-6 backdrop-blur-xl">
          <h2 className="text-2xl font-black text-white">Hard limits for this agent</h2>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-gray-300">
            <li>• It may not mark real-world business setup items complete without admin confirmation.</li>
            <li>• It may not provide legal, tax, accounting, insurance, or compliance advice.</li>
            <li>• It may not change admin authentication, credentials, or environment variables.</li>
            <li>• It may not delete client data or alter privacy records automatically.</li>
            <li>• It may not notify clients about incidents without admin approval.</li>
            <li>• It may not weaken upload, billing, admin, or client data protections.</li>
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
