export const metadata = {
  title: "Refund Policy | Ghostlayer",
  description: "Ghostlayer refund policy for Workflow Scan and related services.",
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

export default function RefundPolicyPage() {
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
            Policy
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Refund Policy
          </h1>

          <p className="mt-4 text-sm text-gray-400">
            Last Updated: {lastUpdated}
          </p>

          <div className="mt-10 space-y-9 text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold text-white">1. Overview</h2>
              <p className="mt-3 leading-7">
                Ghostlayer provides workflow scan, operational review, and
                business process analysis services designed to help service
                businesses identify workflow friction, bottlenecks, missed
                follow-ups, approval delays, unclear handoffs, and other
                operational inefficiencies.
              </p>
              <p className="mt-3 leading-7">
                Because Ghostlayer services involve time, review, analysis,
                preparation, and custom recommendations, refunds are limited as
                described in this policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">2. Payments</h2>
              <p className="mt-3 leading-7">
                Payment may be collected before Ghostlayer begins work on a
                Workflow Scan, report, consultation, or related service. By
                submitting payment, the client agrees to this Refund Policy and
                understands that payment reserves time and resources for the
                service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">
                3. Refund Eligibility
              </h2>
              <p className="mt-3 leading-7">
                A client may request a refund if the request is made before
                Ghostlayer begins reviewing the client’s submitted materials, if
                a duplicate payment was made by mistake, or if Ghostlayer is
                unable to provide the purchased service for reasons within
                Ghostlayer’s control.
              </p>
              <p className="mt-3 leading-7">
                Refunds are not guaranteed and are reviewed on a case-by-case
                basis.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">
                4. Non-Refundable Situations
              </h2>
              <p className="mt-3 leading-7">
                Refunds are generally not available once Ghostlayer has started
                reviewing submitted information, begun preparing a workflow scan,
                report, recommendation, or analysis, or sent a deliverable to the
                client.
              </p>
              <p className="mt-3 leading-7">
                Refunds are also generally not available if the client fails to
                provide requested information, changes their mind after work has
                started, does not agree with Ghostlayer’s findings, does not
                implement the recommendations, or expected guaranteed business
                results.
              </p>
              <p className="mt-3 leading-7">
                Ghostlayer does not guarantee specific business outcomes,
                revenue increases, operational savings, time savings, or growth
                results.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">
                5. Service Satisfaction
              </h2>
              <p className="mt-3 leading-7">
                If a client is dissatisfied with a completed Workflow Scan, the
                client may contact Ghostlayer within 7 calendar days of receiving
                the deliverable. Ghostlayer may, at its discretion, offer
                clarification, a reasonable revision, additional explanation,
                partial refund, or full refund.
              </p>
              <p className="mt-3 leading-7">
                The availability of any revision or refund is determined solely
                by Ghostlayer based on the circumstances.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">
                6. Duplicate Payments
              </h2>
              <p className="mt-3 leading-7">
                If a client accidentally submits a duplicate payment, Ghostlayer
                will refund the duplicate charge after verification.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">
                7. Missed or Incomplete Client Information
              </h2>
              <p className="mt-3 leading-7">
                If the client does not provide enough information for Ghostlayer
                to complete the service, Ghostlayer may request additional
                details. If the client does not respond within 14 calendar days,
                the service may be considered inactive or completed based on the
                information already provided. In that situation, the payment may
                not be refundable.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">
                8. Chargebacks
              </h2>
              <p className="mt-3 leading-7">
                Clients agree to contact Ghostlayer first before initiating a
                chargeback or payment dispute. If a chargeback is filed after
                Ghostlayer has started or completed the service, Ghostlayer may
                provide the payment processor with records of the transaction,
                service description, intake submission, communications, and
                deliverables.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">
                9. How to Request a Refund
              </h2>
              <p className="mt-3 leading-7">
                To request a refund, contact Ghostlayer with the subject line
                “Refund Request — Workflow Scan.” Include your name, the email
                used at purchase, the payment date, and the reason for the
                request.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">
                10. Changes to This Policy
              </h2>
              <p className="mt-3 leading-7">
                Ghostlayer may update this Refund Policy from time to time. The
                version posted on the Ghostlayer website at the time of purchase
                will apply to that purchase.
              </p>
            </section>

            <section className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-5">
              <h2 className="text-xl font-semibold text-white">Contact</h2>
              <p className="mt-3 leading-7">
                Questions about this Refund Policy may be sent to Ghostlayer
                through the contact method listed on the website.
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
