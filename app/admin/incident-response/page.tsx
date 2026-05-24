import Link from "next/link";

export const metadata = {
  title: "Incident Response | Ghostlayer Admin",
  description:
    "Internal incident response checklist for Ghostlayer security, upload, payment, report, and access issues.",
};

const incidentSteps = [
  "Identify what happened: access issue, payment problem, upload problem, report delivery issue, exposed credential, or mistaken client data access.",
  "Contain the issue immediately. Disable exposed credentials, pause affected workflow, remove bad links, or restrict access if needed.",
  "Check affected systems: Vercel, Supabase, Stripe, email, client portal, admin routes, uploads, reports, and activity logs.",
  "Document timeline, affected client emails, affected records, action taken, and current status.",
  "Rotate any exposed or suspicious credentials. Redeploy if environment variables were changed.",
  "Notify affected clients if the issue materially affected their account, report, upload, billing, or privacy.",
  "Add a prevention note so the same issue is less likely to happen again.",
];

const incidentTypes = [
  "Admin credential exposure",
  "Wrong client access or client merge mistake",
  "Upload/download failure",
  "Report delivered to wrong client",
  "Stripe checkout or billing portal failure",
  "Refund, dispute, or chargeback issue",
  "Supabase or storage permission issue",
  "Email delivery or client message issue",
];


function AdminNightSkyBackground() {
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
    <div className="adminProcessNightSky" aria-hidden="true">
      <div className="adminProcessMoon" />
      <div className="adminProcessFog adminProcessFogA" />
      <div className="adminProcessFog adminProcessFogB" />
      <div className="adminProcessOrb adminProcessOrbA" />
      <div className="adminProcessOrb adminProcessOrbB" />

      {stars.map((star, index) => (
        <span
          key={index}
          className="adminProcessStar"
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

function AdminNav() {
  return (
    <div className="mt-6 flex flex-wrap gap-3 text-xs font-bold">
      <Link
        href="/admin/analytics"
        className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-white transition hover:bg-white/[0.08]"
      >
        Admin Home
      </Link>

      <Link
        href="/admin/trust-compliance"
        className="rounded-full border border-lime-300/20 bg-lime-300/10 px-4 py-2 text-lime-100 transition hover:bg-lime-300/15"
      >
        Trust & Compliance
      </Link>

      <Link
        href="/admin/activity"
        className="rounded-full border border-purple-300/20 bg-purple-300/10 px-4 py-2 text-purple-100 transition hover:bg-purple-300/15"
      >
        Activity
      </Link>

      <Link
        href="/admin/bookkeeping"
        className="rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-amber-100 transition hover:bg-amber-300/15"
      >
        Bookkeeping
      </Link>
    </div>
  );
}

export default function AdminIncidentResponsePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] text-white">
      <AdminNightSkyBackground />
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:px-10">
        <Link
          href="/admin/analytics"
          className="adminProcessLogoGlow inline-block text-lg font-bold tracking-[0.35em] text-white transition hover:text-white"
        >
          GHOSTLAYER
        </Link>

        <p className="mt-10 text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">
          Internal Admin
        </p>

        <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
          Incident Response Note
        </h1>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-300">
          Use this internal checklist for security incidents, mistaken access,
          payment disputes, upload issues, report delivery mistakes, or credential
          problems. This is an operational checklist, not legal advice.
        </p>

        <AdminNav />

        <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_24px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">
            Response Steps
          </p>

          <ol className="mt-5 space-y-4 text-sm leading-7 text-gray-300">
            {incidentSteps.map((step, index) => (
              <li key={step} className="flex gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                <span className="font-mono text-cyan-300">{index + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-6 rounded-[2rem] border border-red-300/20 bg-red-300/10 p-6 backdrop-blur-xl">
          <h2 className="text-xl font-black text-white">Incident types to track</h2>
          <ul className="mt-5 grid gap-3 text-sm leading-6 text-gray-300 sm:grid-cols-2">
            {incidentTypes.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </section>

      <style>{`
        .adminProcessNightSky {
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

        .adminProcessMoon {
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
          animation: adminProcessMoonGlow 4.8s ease-in-out infinite;
        }

        .adminProcessStar {
          position: absolute;
          display: block;
          border-radius: 9999px;
          background: #ffffff;
          box-shadow:
            0 0 8px rgba(255,255,255,0.95),
            0 0 18px rgba(147,197,253,0.62),
            0 0 30px rgba(59,130,246,0.35);
          animation-name: adminProcessTwinkle;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        .adminProcessFog {
          position: absolute;
          left: -10%;
          right: -10%;
          height: 170px;
          border-radius: 9999px;
          filter: blur(92px);
          opacity: 0.075;
          mix-blend-mode: screen;
        }

        .adminProcessFogA {
          top: 18%;
          background: linear-gradient(90deg, rgba(59,130,246,0), rgba(59,130,246,0.36), rgba(147,51,234,0.18), rgba(59,130,246,0));
          animation: adminProcessFogDriftOne 42s ease-in-out infinite;
        }

        .adminProcessFogB {
          top: 58%;
          background: linear-gradient(90deg, rgba(16,185,129,0), rgba(6,182,212,0.32), rgba(96,165,250,0.2), rgba(16,185,129,0));
          animation: adminProcessFogDriftTwo 46s ease-in-out infinite;
        }

        .adminProcessOrb {
          position: absolute;
          border-radius: 9999px;
          filter: blur(38px);
          opacity: 0.22;
        }

        .adminProcessOrbA {
          left: -10%;
          top: 18%;
          height: 22rem;
          width: 22rem;
          background: rgba(59,130,246,0.16);
          animation: adminProcessFloatSlow 28s ease-in-out infinite;
        }

        .adminProcessOrbB {
          right: -10%;
          top: 30%;
          height: 26rem;
          width: 26rem;
          background: rgba(6,182,212,0.12);
          animation: adminProcessFloatSlow 34s ease-in-out infinite reverse;
        }

        .adminProcessLogoGlow {
          text-shadow:
            0 0 8px rgba(255,255,255,0.70),
            0 0 18px rgba(96,165,250,0.24),
            0 0 34px rgba(6,182,212,0.18);
          animation: adminProcessLogoPulse 3.4s ease-in-out infinite;
        }

        @keyframes adminProcessTwinkle {
          0%, 100% { transform: translateZ(0) scale(0.85); opacity: 0.42; }
          50% { transform: translateZ(0) scale(1.35); opacity: 1; }
        }

        @keyframes adminProcessMoonGlow {
          0%, 100% { opacity: 0.22; }
          50% { opacity: 0.34; }
        }

        @keyframes adminProcessLogoPulse {
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

        @keyframes adminProcessFogDriftOne {
          0%, 100% { transform: translateX(-2%) translateY(0px) scaleX(1); }
          50% { transform: translateX(4%) translateY(-4px) scaleX(1.04); }
        }

        @keyframes adminProcessFogDriftTwo {
          0%, 100% { transform: translateX(3%) translateY(0px) scaleX(1.06); }
          50% { transform: translateX(-4%) translateY(5px) scaleX(1); }
        }

        @keyframes adminProcessFloatSlow {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, 18px, 0); }
        }
      `}</style>

    </main>
  );
}
