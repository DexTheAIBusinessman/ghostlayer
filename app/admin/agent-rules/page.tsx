import Link from "next/link";

export const metadata = {
  title: "Agent Rules | Ghostlayer Admin",
  description: "Internal rules for Ghostlayer admin automation and agent permissions.",
};

const allowed = [
  "Read internal admin records.",
  "Summarize activity, uploads, messages, reports, monitoring, billing, and compliance status.",
  "Flag issues that need review.",
  "Draft client replies for admin approval.",
  "Draft report sections for admin approval.",
  "Create internal recommendations and next steps.",
  "Mark low-risk internal items as needing review.",
];

const approvalRequired = [
  "Sending client-facing messages.",
  "Sending or publishing reports.",
  "Deleting client uploads or records.",
  "Merging client records.",
  "Issuing refunds or changing billing.",
  "Changing admin credentials, environment variables, or secrets.",
  "Marking real-world business tasks complete.",
  "Notifying clients about incidents.",
];

const neverAllowed = [
  "Expose secret keys or credentials.",
  "Bypass admin authentication.",
  "Use one client's data for another client's report.",
  "Promise guaranteed revenue, savings, legal outcomes, tax results, or compliance results.",
  "Delete audit history to hide a mistake.",
  "Make legal, tax, accounting, medical, cybersecurity, or financial-advisory claims.",
];

function RuleSection({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "green" | "yellow" | "red";
}) {
  const classes = {
    green: "border-emerald-300/20 bg-emerald-300/10 text-emerald-100",
    yellow: "border-amber-300/20 bg-amber-300/10 text-amber-100",
    red: "border-red-300/20 bg-red-300/10 text-red-100",
  };

  return (
    <section className={`rounded-[2rem] border p-6 backdrop-blur-xl ${classes[tone]}`}>
      <h2 className="text-2xl font-black text-white">{title}</h2>
      <ul className="mt-5 space-y-3 text-sm leading-6 text-gray-200">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </section>
  );
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

export default function AgentRulesPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] px-6 py-10 text-white sm:px-8 lg:px-10">\n      <AgentNightSkyBackground />
      <section className="relative z-10 mx-auto max-w-6xl">
        <Link
          href="/admin/analytics"
          className="agentLogoGlow inline-block text-lg font-bold tracking-[0.35em] text-white transition hover:text-white"
        >
          GHOSTLAYER
        </Link>

        <p className="mt-10 text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">
          Internal Admin
        </p>

        <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl">
          Agent Rules & Automation Guardrails
        </h1>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-300">
          These rules define what Ghostlayer agents may do, what requires admin approval,
          and what agents should never do. The goal is to reduce admin workload without
          risking client trust, privacy, billing accuracy, or business control.
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
          <Link href="/admin/incident-response" className="rounded-full border border-red-300/20 bg-red-300/10 px-4 py-2 text-red-100">
            Incident Response
          </Link>
        </div>

        <div className="mt-8 grid gap-5">
          <RuleSection title="Agents May Do" items={allowed} tone="green" />
          <RuleSection title="Admin Approval Required" items={approvalRequired} tone="yellow" />
          <RuleSection title="Agents May Never Do" items={neverAllowed} tone="red" />
        </div>
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
          box-shadow:
            0 0 44px rgba(255,255,255,0.42),
            0 0 95px rgba(191,219,254,0.36),
            0 0 165px rgba(96,165,250,0.26),
            inset -42px -34px 70px rgba(15,23,42,0.42),
            inset 18px 14px 44px rgba(255,255,255,0.32);
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
          0%, 100% {
            opacity: 0.22;
            box-shadow:
              0 0 44px rgba(255,255,255,0.34),
              0 0 95px rgba(191,219,254,0.28),
              0 0 165px rgba(96,165,250,0.20),
              inset -42px -34px 70px rgba(15,23,42,0.42),
              inset 18px 14px 44px rgba(255,255,255,0.28);
          }
          50% {
            opacity: 0.34;
            box-shadow:
              0 0 58px rgba(255,255,255,0.48),
              0 0 120px rgba(191,219,254,0.42),
              0 0 190px rgba(96,165,250,0.30),
              inset -42px -34px 70px rgba(15,23,42,0.38),
              inset 18px 14px 44px rgba(255,255,255,0.36);
          }
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
