export const metadata = {
  title: "Service Agreement / Scope of Work | Ghostlayer",
  description:
    "Ghostlayer Service Agreement and Scope of Work for Workflow Scan services.",
};


function NightSkyBackground() {
  const stars = [
    { left: "6%", top: "10%", size: 2, delay: "0s", duration: "4.8s", opacity: 0.75 },
    { left: "12%", top: "32%", size: 2, delay: "1.1s", duration: "5.4s", opacity: 0.7 },
    { left: "18%", top: "66%", size: 2, delay: "2.1s", duration: "5.1s", opacity: 0.62 },
    { left: "25%", top: "18%", size: 3, delay: "1.6s", duration: "5.8s", opacity: 0.78 },
    { left: "34%", top: "45%", size: 2, delay: "0.7s", duration: "4.9s", opacity: 0.66 },
    { left: "42%", top: "12%", size: 2, delay: "2.5s", duration: "5.6s", opacity: 0.72 },
    { left: "51%", top: "38%", size: 3, delay: "1.3s", duration: "5.2s", opacity: 0.82 },
    { left: "59%", top: "74%", size: 2, delay: "0.9s", duration: "5.5s", opacity: 0.6 },
    { left: "68%", top: "20%", size: 2, delay: "2.9s", duration: "5.3s", opacity: 0.76 },
    { left: "77%", top: "50%", size: 3, delay: "1.8s", duration: "4.7s", opacity: 0.85 },
    { left: "86%", top: "16%", size: 2, delay: "0.4s", duration: "5.7s", opacity: 0.72 },
    { left: "94%", top: "70%", size: 2, delay: "2.2s", duration: "5.1s", opacity: 0.7 },
    { left: "10%", top: "80%", size: 2, delay: "1.5s", duration: "5.8s", opacity: 0.55 },
    { left: "30%", top: "88%", size: 2, delay: "2.4s", duration: "5.2s", opacity: 0.58 },
    { left: "46%", top: "68%", size: 2, delay: "0.8s", duration: "4.8s", opacity: 0.62 },
    { left: "64%", top: "8%", size: 2, delay: "2.7s", duration: "5.4s", opacity: 0.74 },
    { left: "73%", top: "82%", size: 2, delay: "1.9s", duration: "5.6s", opacity: 0.58 },
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

const lastUpdated = "May 10, 2026";

export default function ServiceAgreementPage() {
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
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">
            Agreement
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Service Agreement / Scope of Work
          </h1>

          <p className="mt-4 text-sm text-gray-400">
            Last Updated: {lastUpdated}
          </p>

          <div className="mt-10 space-y-9 text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold text-white">1. Parties</h2>
              <p className="mt-3 leading-7">
                This Service Agreement / Scope of Work is between Ghostlayer,
                the service provider, and the individual or business purchasing,
                requesting, or using Ghostlayer services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">
                2. Service Description
              </h2>
              <p className="mt-3 leading-7">
                Ghostlayer provides workflow scan and business operations review
                services for service-based businesses. Ghostlayer’s services may
                include reviewing client-submitted workflow details, identifying
                possible bottlenecks, highlighting approval delays, identifying
                unclear handoffs, reviewing missed follow-up risks, identifying
                repeated manual work, reviewing operational friction points, and
                preparing workflow improvement recommendations.
              </p>
              <p className="mt-3 leading-7">
                Ghostlayer’s services are intended to provide operational insight
                and practical recommendations. They are not a substitute for
                professional legal, financial, tax, accounting, cybersecurity,
                medical, employment, or compliance advice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">
                3. Scope of Work
              </h2>
              <p className="mt-3 leading-7">
                Unless otherwise agreed in writing, a standard Ghostlayer
                Workflow Scan may include review of the client’s submitted intake
                information, identification of likely workflow friction points,
                summary of operational risks or bottlenecks, suggested workflow
                improvements, recommended next steps, optional follow-up
                questions, and delivery of a written scan summary, report, or
                recommendation document.
              </p>
              <p className="mt-3 leading-7">
                The exact format of the deliverable may vary based on the
                client’s business, submitted information, and purchased service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">
                4. What Is Not Included
              </h2>
              <p className="mt-3 leading-7">
                Unless separately agreed in writing, Ghostlayer does not provide
                legal advice, tax advice, accounting advice, financial advisory
                services, investment advice, medical advice, employment law
                advice, licensed engineering services, licensed cybersecurity
                audit services, certified compliance audit services, software
                implementation, custom software development, guaranteed business
                outcomes, guaranteed revenue increase, guaranteed cost savings,
                guaranteed time savings, or ongoing managed operations support.
              </p>
              <p className="mt-3 leading-7">
                Ghostlayer may identify workflow issues or opportunities, but the
                client is responsible for deciding whether and how to implement
                any recommendations.
              </p>
            </section>

            <section className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-5">
              <h2 className="text-2xl font-semibold text-white">
                5. No Professional Certification or Licensed Advice
              </h2>
              <p className="mt-3 leading-7">
                Ghostlayer is a workflow analysis and business operations support
                service. The client understands and agrees that Ghostlayer is not
                acting as a licensed attorney, CPA, financial advisor, tax
                advisor, medical professional, HR compliance advisor,
                cybersecurity auditor, or any other licensed professional.
              </p>
              <p className="mt-3 leading-7">
                Ghostlayer’s recommendations are based on the information
                provided by the client and are intended for general business
                operations improvement.
              </p>
              <p className="mt-3 leading-7">
                If the client requires legal, financial, tax, accounting,
                employment, healthcare, cybersecurity, regulatory, or compliance
                advice, the client should consult an appropriately licensed
                professional.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">
                6. Client Responsibilities
              </h2>
              <p className="mt-3 leading-7">
                The client is responsible for providing accurate and complete
                information, responding to reasonable follow-up questions,
                reviewing Ghostlayer’s findings, deciding whether to implement
                recommendations, ensuring recommendations are appropriate for the
                client’s business, consulting licensed professionals when needed,
                maintaining legal and regulatory compliance, and protecting
                sensitive business, customer, employee, and financial
                information.
              </p>
              <p className="mt-3 leading-7">
                Ghostlayer is not responsible for inaccurate recommendations
                caused by incomplete, outdated, misleading, or inaccurate
                information provided by the client.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">
                7. Information Submitted by the Client
              </h2>
              <p className="mt-3 leading-7">
                The client may submit information about business processes,
                tools, handoffs, delays, customer follow-up, team operations, and
                related workflow details.
              </p>
              <p className="mt-3 leading-7">
                The client agrees not to submit sensitive information unless
                necessary, including Social Security numbers, bank account
                numbers, full payment card numbers, medical records, legal case
                details, passwords, private employee records, or highly
                confidential third-party information.
              </p>
              <p className="mt-3 leading-7">
                If sensitive information is required, the client should notify
                Ghostlayer in advance so appropriate handling expectations can be
                discussed.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">
                8. Deliverables
              </h2>
              <p className="mt-3 leading-7">
                Ghostlayer may provide deliverables such as a Workflow Scan
                report, operational friction summary, bottleneck analysis,
                suggested process improvements, follow-up questions, recommended
                next steps, or executive summary. Deliverables are based on the
                information available at the time of review.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">9. Timeline</h2>
              <p className="mt-3 leading-7">
                Ghostlayer will make reasonable efforts to deliver services
                within the estimated timeline provided at purchase or during
                client communication. Timelines may be extended if the client
                delays submitting information, additional clarification is
                needed, the scope changes, technical issues occur, or unexpected
                business interruptions occur.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">
                10. Revisions
              </h2>
              <p className="mt-3 leading-7">
                Unless otherwise agreed in writing, one reasonable clarification
                or revision request may be included if submitted within 7
                calendar days after delivery.
              </p>
              <p className="mt-3 leading-7">
                A revision does not include a new workflow scan, a different
                business review, a full rewrite based on new information, or
                additional services outside the original scope. Additional work
                may require a separate fee.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">
                11. Fees and Payment
              </h2>
              <p className="mt-3 leading-7">
                Fees must be paid according to the payment terms shown at
                checkout, invoice, or written agreement. Ghostlayer may pause or
                decline service if payment is not completed.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">12. Refunds</h2>
              <p className="mt-3 leading-7">
                Refunds are handled according to Ghostlayer’s Refund Policy. The
                client understands that once Ghostlayer begins reviewing
                submitted information or preparing a deliverable, payment may
                become non-refundable.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">
                13. No Guarantees
              </h2>
              <p className="mt-3 leading-7">
                Ghostlayer does not guarantee revenue increases, profit
                increases, customer growth, time savings, cost reductions,
                operational improvements, employee performance improvements,
                software performance, compliance outcomes, or business success.
              </p>
              <p className="mt-3 leading-7">
                Ghostlayer provides analysis and recommendations. Results depend
                on the client’s business, team, implementation, market
                conditions, and other factors outside Ghostlayer’s control.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">
                14. Client Implementation
              </h2>
              <p className="mt-3 leading-7">
                The client is solely responsible for implementing any
                recommendations. Ghostlayer is not liable for decisions, changes,
                expenses, losses, or outcomes resulting from the client’s
                implementation or non-implementation of recommendations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">
                15. Use of AI and Automation
              </h2>
              <p className="mt-3 leading-7">
                Ghostlayer may use software, automation, and AI-assisted tools to
                help organize information, summarize workflow details, identify
                patterns, draft reports, or support service delivery.
              </p>
              <p className="mt-3 leading-7">
                AI-assisted outputs may require human review and judgment. The
                client should not treat AI-assisted content as legal, financial,
                tax, medical, employment, compliance, or professional advice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">
                16. Confidentiality
              </h2>
              <p className="mt-3 leading-7">
                Ghostlayer will make reasonable efforts to protect
                client-submitted information and use it only to provide services,
                improve internal workflows, communicate with the client, or
                comply with legal obligations. Ghostlayer will not knowingly sell
                client-submitted workflow information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">
                17. Testimonials and Marketing Use
              </h2>
              <p className="mt-3 leading-7">
                Ghostlayer may ask clients for testimonials after services are
                completed. Ghostlayer will not publish a client’s name, company
                name, testimonial, or identifying details without permission. Any
                testimonial should reflect the client’s honest opinion and
                experience.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">
                18. Limitation of Liability
              </h2>
              <p className="mt-3 leading-7">
                To the fullest extent allowed by law, Ghostlayer is not liable
                for indirect, incidental, special, consequential, or punitive
                damages, including lost profits, lost revenue, lost business
                opportunities, operational losses, or data loss. Ghostlayer’s
                total liability for any claim related to a service will not
                exceed the amount the client paid for that specific service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">
                19. No Employment, Partnership, or Agency Relationship
              </h2>
              <p className="mt-3 leading-7">
                Ghostlayer is an independent service provider. Nothing in this
                agreement creates an employment, partnership, joint venture,
                franchise, or agency relationship between Ghostlayer and the
                client.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">
                20. Termination
              </h2>
              <p className="mt-3 leading-7">
                Ghostlayer may decline, pause, or terminate services if the
                client fails to provide required information, fails to pay,
                requests work outside the agreed scope, behaves abusively or
                unlawfully, or requests work that creates legal, ethical, or
                operational concerns.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">
                21. Governing Law
              </h2>
              <p className="mt-3 leading-7">
                This agreement is governed by the laws of the state where
                Ghostlayer is legally registered, unless otherwise required by
                law.
              </p>
            </section>

            <section className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-5">
              <h2 className="text-xl font-semibold text-white">Contact</h2>
              <p className="mt-3 leading-7">
                Questions about this agreement may be sent to Ghostlayer through
                the contact method listed on the website.
              </p>
            </section>
          </div>
        </div>
      </section>
    <style>{`
.legalLogoGlow {
          animation: legalLogoPulseGlow 2.8s ease-in-out infinite;
          color: #ffffff;
          text-shadow:
            0 0 8px rgba(255, 255, 255, 0.70),
            0 0 18px rgba(255, 255, 255, 0.45),
            0 0 34px rgba(96, 165, 250, 0.36),
            0 0 52px rgba(59, 130, 246, 0.24);
        }

        @keyframes legalLogoPulseGlow {
          0%,
          100% {
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

      
        .legalNightSky {
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

        .legalSkyGradient {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(2, 6, 23, 0.15), rgba(0, 0, 0, 0.38)),
            radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.32) 78%);
        }

        .legalStar {
          position: absolute;
          display: block;
          border-radius: 9999px;
          background: #ffffff;
          box-shadow:
            0 0 8px rgba(255, 255, 255, 0.95),
            0 0 18px rgba(147, 197, 253, 0.62),
            0 0 30px rgba(59, 130, 246, 0.35);
          animation-name: legalTwinkle;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        .legalOrb {
          position: absolute;
          border-radius: 9999px;
          filter: blur(92px);
          opacity: 0.24;
        }

        .legalOrbA {
          left: -10%;
          top: -8%;
          height: 26rem;
          width: 26rem;
          background: rgba(34, 211, 238, 0.07);
          animation: legalFloatSlow 26s ease-in-out infinite;
        }

        .legalOrbB {
          right: -10%;
          top: 18%;
          height: 22rem;
          width: 22rem;
          background: rgba(59, 130, 246, 0.07);
          animation: legalFloatSlow 28s ease-in-out infinite;
        }

        .legalFog {
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

        .legalFogA {
          top: 18%;
          animation: legalFogDriftOne 42s ease-in-out infinite;
        }

        .legalFogB {
          top: 58%;
          animation: legalFogDriftTwo 46s ease-in-out infinite;
        }

        @keyframes legalTwinkle {
          0%,
          100% {
            transform: translateY(0px) scale(0.85);
            opacity: 0.22;
          }
          25% {
            transform: translateY(-4px) scale(1.18);
            opacity: 1;
          }
          50% {
            transform: translateY(0px) scale(0.95);
            opacity: 0.42;
          }
          75% {
            transform: translateY(3px) scale(1.08);
            opacity: 0.78;
          }
        }

        @keyframes legalFloatSlow {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(0, 10px, 0);
          }
        }

        @keyframes legalFogDriftOne {
          0%,
          100% {
            transform: translateX(-2%) translateY(0px) scaleX(1);
          }
          50% {
            transform: translateX(3%) translateY(-4px) scaleX(1.04);
          }
        }

        @keyframes legalFogDriftTwo {
          0%,
          100% {
            transform: translateX(3%) translateY(0px) scaleX(1.02);
          }
          50% {
            transform: translateX(-2%) translateY(5px) scaleX(1.06);
          }
        }
      `}</style>
    </main>
  );
}
