export const metadata = {
  title: "Terms of Service | Ghostlayer",
  description: "Ghostlayer Terms of Service for workflow scan and business operations review services.",
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

export default function TermsPage() {
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
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">Legal</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Terms of Service</h1>
          <p className="mt-4 text-sm text-gray-400">Last Updated: {lastUpdated}</p>

          <div className="mt-10 space-y-9 text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold text-white">1. Agreement to Terms</h2>
              <p className="mt-3 leading-7">
                By accessing Ghostlayer, submitting a Workflow Scan request, purchasing a service, or using any Ghostlayer website, form, report, dashboard, or communication, you agree to these Terms of Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">2. Services</h2>
              <p className="mt-3 leading-7">
                Ghostlayer provides workflow scan, business process review, operational analysis, and workflow improvement recommendation services for service-based businesses.
              </p>
              <p className="mt-3 leading-7">
                Ghostlayer may review information submitted by clients and provide summaries, observations, recommendations, reports, follow-up questions, or next-step suggestions related to workflow friction and operational bottlenecks.
              </p>
            </section>

            <section className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-5">
              <h2 className="text-2xl font-semibold text-white">3. No Licensed Professional Advice</h2>
              <p className="mt-3 leading-7">
                Ghostlayer is not a law firm, accounting firm, financial advisory firm, tax advisory firm, medical provider, cybersecurity audit firm, HR compliance firm, or regulated professional services provider.
              </p>
              <p className="mt-3 leading-7">
                Ghostlayer does not provide legal, tax, accounting, financial, investment, medical, employment, cybersecurity, regulatory, or compliance advice. If you need advice in those areas, you should consult an appropriately licensed professional.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">4. No Certification Representation</h2>
              <p className="mt-3 leading-7">
                Unless expressly stated in writing, Ghostlayer does not represent that its services are certified, licensed, accredited, or approved by any government agency, professional board, industry regulator, or certification authority.
              </p>
              <p className="mt-3 leading-7">
                Ghostlayer workflow scans are business operations reviews. They are not certified audits, regulated compliance assessments, financial audits, legal reviews, cybersecurity audits, or professional certifications.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">5. No Guaranteed Outcomes</h2>
              <p className="mt-3 leading-7">
                Ghostlayer does not guarantee revenue increases, profit increases, cost savings, recovered time, employee performance improvement, compliance outcomes, business growth, or any specific result.
              </p>
              <p className="mt-3 leading-7">
                Results depend on your business, team, implementation, market conditions, available information, and other factors outside Ghostlayer’s control.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">6. Client Responsibilities</h2>
              <p className="mt-3 leading-7">
                You are responsible for the accuracy of information you submit, business decisions made after receiving Ghostlayer recommendations, implementation of any recommendations, and compliance with applicable laws and regulations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">7. Payments and Refunds</h2>
              <p className="mt-3 leading-7">
                Payments are processed through third-party payment providers such as Stripe. Refunds are handled according to Ghostlayer’s Refund Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">8. AI and Automation</h2>
              <p className="mt-3 leading-7">
                Ghostlayer may use software, automation, and AI-assisted tools to help organize information, summarize workflow details, identify patterns, draft reports, and support service delivery.
              </p>
              <p className="mt-3 leading-7">
                AI-assisted content may require human review and should not be treated as legal, financial, tax, medical, employment, compliance, or professional advice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">9. Limitation of Liability</h2>
              <p className="mt-3 leading-7">
                To the fullest extent allowed by law, Ghostlayer is not liable for indirect, incidental, special, consequential, or punitive damages, including lost profits, lost revenue, lost business opportunities, operational losses, or data loss.
              </p>
              <p className="mt-3 leading-7">
                Ghostlayer’s total liability for any claim related to a service will not exceed the amount paid for that specific service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">10. Changes to These Terms</h2>
              <p className="mt-3 leading-7">
                Ghostlayer may update these Terms from time to time. The version posted on the website will apply to use of the website and services after the update.
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
