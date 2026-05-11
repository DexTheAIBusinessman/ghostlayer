export const metadata = {
  title: "Privacy Policy | Ghostlayer",
  description: "Ghostlayer Privacy Policy for workflow scan and business operations review services.",
};

function NightSkyBackground() {
  const stars = [
    { left: "6%", top: "10%", size: 2, delay: "0s", duration: "4.8s", opacity: 0.75 },
    { left: "12%", top: "32%", size: 2, delay: "1.1s", duration: "5.4s", opacity: 0.7 },
    { left: "25%", top: "18%", size: 3, delay: "1.6s", duration: "5.8s", opacity: 0.78 },
    { left: "42%", top: "12%", size: 2, delay: "2.5s", duration: "5.6s", opacity: 0.72 },
    { left: "51%", top: "38%", size: 3, delay: "1.3s", duration: "5.2s", opacity: 0.82 },
    { left: "68%", top: "20%", size: 2, delay: "2.9s", duration: "5.3s", opacity: 0.76 },
    { left: "77%", top: "50%", size: 3, delay: "1.8s", duration: "4.7s", opacity: 0.85 },
    { left: "86%", top: "16%", size: 2, delay: "0.4s", duration: "5.7s", opacity: 0.72 },
    { left: "94%", top: "70%", size: 2, delay: "2.2s", duration: "5.1s", opacity: 0.7 },
    { left: "30%", top: "88%", size: 2, delay: "2.4s", duration: "5.2s", opacity: 0.58 },
    { left: "59%", top: "74%", size: 2, delay: "0.9s", duration: "5.5s", opacity: 0.6 },
    { left: "90%", top: "40%", size: 2, delay: "0.6s", duration: "4.9s", opacity: 0.68 },
  ];

  return (
    <div className="legalNightSky" aria-hidden="true">
      <div className="legalSkyGradient" />
      <div className="legalFog legalFogA" />
      <div className="legalFog legalFogB" />
      <div className="legalOrb legalOrbA" />
      <div className="legalOrb legalOrbB" />
      {stars.map((star, index) => (
        <span
          key={index}
          className="legalStar"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: star.delay,
            animationDuration: star.duration,
            opacity: star.opacity,
          }}
        />
      ))}
    </div>
  );
}

const lastUpdated = "May 11, 2026";

export default function PrivacyPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] text-white">
      <NightSkyBackground />

      <section className="relative z-10 mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:px-10">
        <a
          href="/"
          className="legalLogoGlow mb-10 inline-block text-sm font-semibold tracking-[0.22em] transition hover:text-white"
        >
          GHOSTLAYER
        </a>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur sm:p-10">
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">Policy</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Privacy Policy</h1>
          <p className="mt-4 text-sm text-gray-400">Last Updated: {lastUpdated}</p>

          <div className="mt-10 space-y-9 text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold text-white">1. Overview</h2>
              <p className="mt-3 leading-7">
                This Privacy Policy explains how Ghostlayer collects, uses, stores, and protects information submitted through the website, Workflow Scan intake forms, payment flows, and related communications.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">2. Information We Collect</h2>
              <p className="mt-3 leading-7">
                Ghostlayer may collect your name, email address, company name, business website, workflow details, operational challenges, payment status, communications, and information you voluntarily submit through forms or messages.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">3. Business Workflow Information</h2>
              <p className="mt-3 leading-7">
                Ghostlayer may collect business workflow information, including operational challenges, workflow descriptions, bottlenecks, follow-up issues, handoff issues, approval delays, tool usage, and related business process details.
              </p>
              <p className="mt-3 leading-7">
                This information is used to provide workflow scan services, create reports, communicate with users, process payments, manage client records, and improve internal service delivery.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">4. Sensitive Information</h2>
              <p className="mt-3 leading-7">
                Users should avoid submitting sensitive personal information, financial account numbers, health information, legal case information, passwords, private employee records, or other highly confidential data unless specifically requested and appropriate safeguards have been discussed.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">5. How We Use Information</h2>
              <p className="mt-3 leading-7">
                Ghostlayer uses information to respond to requests, create and manage client records, provide workflow scan services, prepare recommendations, process payments, communicate with clients, improve services, and comply with legal obligations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">6. Payments</h2>
              <p className="mt-3 leading-7">
                Payments may be processed through third-party providers such as Stripe. Ghostlayer does not store full payment card numbers on its website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">7. Third-Party Tools</h2>
              <p className="mt-3 leading-7">
                Ghostlayer may use third-party services such as hosting providers, payment processors, database tools, form tools, analytics tools, automation services, and AI-assisted tools to operate the business and deliver services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">8. AI and Automation</h2>
              <p className="mt-3 leading-7">
                Ghostlayer may use software, automation, and AI-assisted tools to organize submitted information, summarize workflow details, identify patterns, draft reports, and support service delivery.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">9. Information Sharing</h2>
              <p className="mt-3 leading-7">
                Ghostlayer does not knowingly sell client-submitted workflow information. Information may be shared with service providers only as needed to operate the website, process payments, provide services, maintain records, or comply with legal obligations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">10. Data Security</h2>
              <p className="mt-3 leading-7">
                Ghostlayer uses reasonable administrative, technical, and operational measures to protect information. No system can be guaranteed completely secure, and users should avoid submitting unnecessary sensitive information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">11. Contact</h2>
              <p className="mt-3 leading-7">
                Questions about this Privacy Policy may be sent to Ghostlayer through the contact method listed on the website.
              </p>
            </section>
          </div>
        </div>
      </section>

      <style>{`
        .legalNightSky { pointer-events: none; position: fixed; inset: 0; z-index: 0; overflow: hidden; background: radial-gradient(circle at 20% 12%, rgba(59,130,246,0.11), transparent 28%), radial-gradient(circle at 82% 18%, rgba(147,51,234,0.08), transparent 26%), radial-gradient(circle at 50% 100%, rgba(6,182,212,0.045), transparent 34%), #05070b; }
        .legalSkyGradient { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(2,6,23,0.15), rgba(0,0,0,0.38)), radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.32) 78%); }
        .legalStar { position: absolute; display: block; border-radius: 9999px; background: #fff; box-shadow: 0 0 8px rgba(255,255,255,0.95), 0 0 18px rgba(147,197,253,0.62), 0 0 30px rgba(59,130,246,0.35); animation-name: legalTwinkle; animation-timing-function: ease-in-out; animation-iteration-count: infinite; }
        .legalOrb { position: absolute; border-radius: 9999px; filter: blur(92px); opacity: 0.24; }
        .legalOrbA { left: -10%; top: -8%; height: 26rem; width: 26rem; background: rgba(34,211,238,0.07); animation: legalFloatSlow 26s ease-in-out infinite; }
        .legalOrbB { right: -10%; top: 18%; height: 22rem; width: 22rem; background: rgba(59,130,246,0.07); animation: legalFloatSlow 28s ease-in-out infinite; }
        .legalFog { position: absolute; left: -10%; right: -10%; height: 170px; border-radius: 9999px; filter: blur(92px); opacity: 0.075; mix-blend-mode: screen; background: linear-gradient(90deg, rgba(255,255,255,0), rgba(147,197,253,0.12), rgba(96,165,250,0.11), rgba(255,255,255,0)); }
        .legalFogA { top: 18%; animation: legalFogDriftOne 42s ease-in-out infinite; }
        .legalFogB { top: 58%; animation: legalFogDriftTwo 46s ease-in-out infinite; }
        .legalLogoGlow { animation: legalLogoPulseGlow 2.8s ease-in-out infinite; color: #ffffff; text-shadow: 0 0 8px rgba(255,255,255,0.70), 0 0 18px rgba(255,255,255,0.45), 0 0 34px rgba(96,165,250,0.36), 0 0 52px rgba(59,130,246,0.24); }
        @keyframes legalTwinkle { 0%,100% { transform: translateY(0px) scale(0.85); opacity: 0.22; } 25% { transform: translateY(-4px) scale(1.18); opacity: 1; } 50% { transform: translateY(0px) scale(0.95); opacity: 0.42; } 75% { transform: translateY(3px) scale(1.08); opacity: 0.78; } }
        @keyframes legalFloatSlow { 0%,100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(0,10px,0); } }
        @keyframes legalFogDriftOne { 0%,100% { transform: translateX(-2%) translateY(0px) scaleX(1); } 50% { transform: translateX(3%) translateY(-4px) scaleX(1.04); } }
        @keyframes legalFogDriftTwo { 0%,100% { transform: translateX(3%) translateY(0px) scaleX(1.02); } 50% { transform: translateX(-2%) translateY(5px) scaleX(1.06); } }
        @keyframes legalLogoPulseGlow { 0%,100% { opacity: 0.82; text-shadow: 0 0 7px rgba(255,255,255,0.46), 0 0 16px rgba(96,165,250,0.24), 0 0 34px rgba(59,130,246,0.16); } 50% { opacity: 1; text-shadow: 0 0 12px rgba(255,255,255,0.95), 0 0 26px rgba(255,255,255,0.58), 0 0 48px rgba(147,197,253,0.42), 0 0 76px rgba(59,130,246,0.30); } }
      `}</style>
    </main>
  );
}
