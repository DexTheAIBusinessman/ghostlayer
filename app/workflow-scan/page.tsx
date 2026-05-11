"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const WEBHOOK_URL =
  "https://mdwvqkdwlfczkdrwikfm.supabase.co/functions/v1/calendly-webhook";

type FormState = {
  name: string;
  email: string;
  company: string;
  phone: string;
  message: string;
};

type SubmitStatus = "idle" | "loading" | "success" | "error";

type Sparkle = {
  left: string;
  top: string;
  size: number;
  delay: string;
  duration: string;
  opacity: number;
};

function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  return (
    <span>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}

export default function WorkflowScanPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: "",
  });

  const [status, setStatus] = useState<SubmitStatus>("idle");

  const [workflowRisk, setWorkflowRisk] = useState(68);
  const [estimatedLoss, setEstimatedLoss] = useState(3247);
  const [timeLost, setTimeLost] = useState(12.4);

  const sparkles = useMemo<Sparkle[]>(
    () => [
      { left: "7%", top: "12%", size: 2, delay: "0s", duration: "6.1s", opacity: 0.4 },
      { left: "13%", top: "30%", size: 2, delay: "1.2s", duration: "6.6s", opacity: 0.5 },
      { left: "19%", top: "63%", size: 2, delay: "2.1s", duration: "5.9s", opacity: 0.38 },
      { left: "28%", top: "16%", size: 2, delay: "1.7s", duration: "6.4s", opacity: 0.44 },
      { left: "36%", top: "48%", size: 3, delay: "2.4s", duration: "6.8s", opacity: 0.54 },
      { left: "45%", top: "9%", size: 2, delay: "0.8s", duration: "6s", opacity: 0.36 },
      { left: "54%", top: "36%", size: 2, delay: "2.6s", duration: "6.3s", opacity: 0.44 },
      { left: "62%", top: "68%", size: 2, delay: "1.1s", duration: "5.9s", opacity: 0.38 },
      { left: "70%", top: "18%", size: 2, delay: "2.8s", duration: "6.7s", opacity: 0.48 },
      { left: "79%", top: "44%", size: 3, delay: "1.6s", duration: "6.2s", opacity: 0.52 },
      { left: "88%", top: "14%", size: 2, delay: "0.5s", duration: "5.8s", opacity: 0.4 },
      { left: "93%", top: "70%", size: 2, delay: "2s", duration: "6.4s", opacity: 0.44 },
      { left: "11%", top: "52%", size: 2, delay: "1.4s", duration: "6.5s", opacity: 0.34 },
      { left: "24%", top: "82%", size: 2, delay: "2.3s", duration: "6.1s", opacity: 0.32 },
      { left: "41%", top: "72%", size: 2, delay: "0.9s", duration: "6.2s", opacity: 0.38 },
      { left: "57%", top: "20%", size: 2, delay: "2.7s", duration: "6.4s", opacity: 0.4 },
      { left: "67%", top: "56%", size: 2, delay: "1.9s", duration: "6.3s", opacity: 0.37 },
      { left: "84%", top: "78%", size: 2, delay: "0.7s", duration: "6.1s", opacity: 0.35 },
    ],
    []
  );

  useEffect(() => {
    const interval = window.setInterval(() => {
      setWorkflowRisk((current) => {
        const next = current + Math.floor(Math.random() * 7) - 3;
        return Math.min(82, Math.max(58, next));
      });

      setEstimatedLoss((current) => {
        const next = current + Math.floor(Math.random() * 421) - 210;
        return Math.min(5200, Math.max(2600, next));
      });

      setTimeLost((current) => {
        const next = current + (Math.random() * 1.1 - 0.55);
        return Number(Math.min(17.8, Math.max(8.6, next)).toFixed(1));
      });
    }, 2600);

    return () => window.clearInterval(interval);
  }, []);

  const updateField = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source: "Website Form",
          payload: form,
        }),
      });

      if (!response.ok) {
        throw new Error("Form submission failed");
      }

      setStatus("success");
      router.push("/start-workflow-scan");
      setForm({
        name: "",
        email: "",
        company: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#05070b] text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.07),transparent_28%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.055),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(6,182,212,0.03),transparent_24%)]" />
        <div className="fog fog-a" />
        <div className="fog fog-b" />
        <div className="orb orb-a" />
        <div className="orb orb-b" />

        {sparkles.map((sparkle, index) => (
          <span
            key={index}
            className="sparkle"
            style={{
              left: sparkle.left,
              top: sparkle.top,
              width: `${sparkle.size}px`,
              height: `${sparkle.size}px`,
              animationDelay: sparkle.delay,
              animationDuration: sparkle.duration,
              opacity: sparkle.opacity,
            }}
          />
        ))}
      </div>

      <header className="relative z-20 border-b border-white/8 bg-[#05070b]/82 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-4 py-4 sm:px-6 md:px-8 lg:px-10">
          <a
            href="/"
            className="ghostlayerLogoPulse inline-block text-[1.05rem] font-bold tracking-[0.16em] text-white sm:text-[1.16rem]"
          >
            GHOSTLAYER
          </a>

          <nav className="hidden items-center gap-6 text-sm text-gray-300 lg:flex">
            <a href="/#how-it-works" className="transition hover:text-white">
              How It Works
            </a>
            <a href="/#methodology" className="transition hover:text-white">
              Methodology
            </a>
            <a href="/dashboard" className="transition hover:text-white">
              Sample Dashboard
            </a>
            <a
              href="/"
              className="rounded-full border border-cyan-400/18 bg-cyan-400/8 px-4 py-2 font-semibold text-cyan-200 transition hover:bg-cyan-400/12 hover:text-white"
            >
              Back Home
            </a>
          </nav>
        </div>
      </header>

      <section className="relative z-10 px-4 pb-12 pt-14 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.02fr)_minmax(420px,520px)] lg:gap-12">
            <div className="max-w-4xl">
              <p className="text-[11px] uppercase tracking-[0.34em] text-cyan-300 sm:text-xs">
                Workflow Scan Intake
              </p>

              <h1 className="hero-glow mt-7 max-w-4xl text-4xl font-bold leading-[1.03] text-white sm:text-5xl md:text-[3.3rem] md:leading-[1.02] lg:text-[3.8rem]">
                Find workflow friction before it slows growth.
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-7 text-gray-300 sm:text-lg">
                Tell us where your business feels slow, messy, or hard to track.
                Ghostlayer reviews bottlenecks, broken handoffs, approval delays,
                repeated manual work, and hidden operational drag.
              </p>

              <div className="mt-6 flex flex-col gap-2 text-sm text-gray-400 sm:flex-row sm:flex-wrap sm:gap-4">
                <span>Reduce operational drag</span>
                <span>Improve accountability</span>
                <span>Recover execution time</span>
              </div>

              <div className="mt-8 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="metricCard metricBlue metricInteractive p-5">
                  <p className="metricLabel text-cyan-100">Time Lost</p>
                  <p className="metricValue">
                    <AnimatedNumber value={timeLost} decimals={1} suffix="h" />
                  </p>
                  <p className="metricText text-cyan-50/80">
                    Sample weekly execution drag.
                  </p>
                </div>

                <div className="metricCard metricBlue metricInteractive p-5">
                  <p className="metricLabel text-cyan-100">Workflow Risk</p>
                  <p className="metricValue">
                    <AnimatedNumber value={workflowRisk} suffix="/100" />
                  </p>
                  <p className="metricText text-cyan-50/80">
                    Live sample risk signal from workflow drag.
                  </p>
                </div>

                <div className="metricCard metricRed metricInteractive p-5">
                  <p className="metricLabel text-red-100">Estimated Loss</p>
                  <p className="metricValue">
                    <AnimatedNumber value={estimatedLoss} prefix="$" suffix="/mo" />
                  </p>
                  <p className="metricText text-red-50/80">
                    Sample productivity drag estimate.
                  </p>
                </div>
              </div>
            </div>

            <div className="workflowSignalCard rounded-[28px] border border-white/10 p-4 sm:p-5">
              <div className="signalHeader rounded-[20px] border border-white/8 px-4 py-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.26em] text-gray-500">
                    Workflow Signal
                  </p>
                  <p className="mt-1 text-sm font-medium text-white">
                    Intake request
                  </p>
                </div>
                <span className="signalLivePill">READY</span>
              </div>

              <form onSubmit={submitForm} className="mt-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-gray-300">
                      Name
                    </span>
                    <input
                      required
                      name="name"
                      value={form.name}
                      onChange={updateField}
                      className="inputField"
                      placeholder="Your name"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-gray-300">
                      Email
                    </span>
                    <input
                      required
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={updateField}
                      className="inputField"
                      placeholder="you@company.com"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-gray-300">
                      Company
                    </span>
                    <input
                      name="company"
                      value={form.company}
                      onChange={updateField}
                      className="inputField"
                      placeholder="Company name"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-gray-300">
                      Phone
                    </span>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={updateField}
                      className="inputField"
                      placeholder="Optional"
                    />
                  </label>
                </div>

                <label className="mt-4 block">
                  <span className="mb-2 block text-sm font-semibold text-gray-300">
                    What feels slow, messy, or hard to track?
                  </span>
                  <textarea
                    required
                    name="message"
                    value={form.message}
                    onChange={updateField}
                    rows={6}
                    className="inputField resize-none"
                    placeholder="Example: Follow-ups get missed, approvals take too long, work is spread across too many tools..."
                  />
                </label>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="mt-5 w-full rounded-2xl bg-white px-7 py-3.5 text-base font-semibold text-black shadow-[0_10px_28px_rgba(255,255,255,0.12)] transition duration-150 ease-out hover:-translate-y-0.5 hover:opacity-90 hover:shadow-[0_14px_34px_rgba(255,255,255,0.16)] active:translate-y-0.5 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "loading" ? "Submitting..." : "Request Workflow Scan"}
                </button>

                {status === "success" && (
                  <p className="mt-4 rounded-2xl border border-green-400/20 bg-green-400/10 px-4 py-3 text-sm font-semibold text-green-200">
                    Request received. Your lead was added to Ghostlayer Clients.
                  </p>
                )}

                {status === "error" && (
                  <p className="mt-4 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm font-semibold text-red-200">
                    Something went wrong. Please try again.
                  </p>
                )}
              </form>

              <div className="mt-5 rounded-[22px] border border-white/8 bg-black/28 px-4 py-4 hoverCard">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-gray-300">
                    What Ghostlayer Finds
                  </p>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-gray-500">
                    Proof Panel
                  </span>
                </div>

                <ul className="mt-3.5 space-y-3 text-sm leading-7 text-gray-200">
                  <li>Approval delays that stall delivery</li>
                  <li>Handoffs losing client or operational context</li>
                  <li>Duplicate reporting and repeated manual updates</li>
                  <li>Missed revenue caused by broken execution flow</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .ghostlayerLogoPulse {
          animation: logoPulseGlow 3.2s ease-in-out infinite;
          color: #ffffff;
          text-shadow:
            0 0 8px rgba(255, 255, 255, 0.95),
            0 0 18px rgba(255, 255, 255, 0.82),
            0 0 34px rgba(96, 165, 250, 0.62),
            0 0 50px rgba(59, 130, 246, 0.48);
        }

        .hero-glow {
          animation: headlineGlowPulse 3.2s ease-in-out infinite;
          text-shadow:
            0 0 10px rgba(255, 255, 255, 0.38),
            0 0 22px rgba(96, 165, 250, 0.28),
            0 0 44px rgba(59, 130, 246, 0.22);
        }

        .workflowSignalCard {
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.042), rgba(255, 255, 255, 0.018)),
            rgba(10, 13, 20, 0.92);
          box-shadow:
            0 20px 60px rgba(0, 0, 0, 0.36),
            inset 0 0 0 1px rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(20px);
          animation: cardFloat 7s ease-in-out infinite;
        }

        .signalHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(7, 10, 16, 0.78);
          box-shadow:
            inset 0 0 0 1px rgba(255, 255, 255, 0.02),
            0 8px 24px rgba(0, 0, 0, 0.18);
        }

        .signalLivePill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 50px;
          border-radius: 9999px;
          border: 1px solid rgba(34, 197, 94, 0.26);
          background: rgba(34, 197, 94, 0.12);
          padding: 6px 12px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.18em;
          color: #bbf7d0;
          animation: livePulseGreen 2.1s ease-in-out infinite;
          box-shadow:
            0 0 0 1px rgba(34, 197, 94, 0.08) inset,
            0 0 12px rgba(34, 197, 94, 0.18);
        }

        .metricCard {
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: #0a0d14;
          border-radius: 24px;
          transition:
            transform 220ms ease,
            border-color 220ms ease,
            box-shadow 220ms ease,
            background 220ms ease;
        }

        .metricBlue {
          border-color: rgba(34, 211, 238, 0.2);
          background: rgba(34, 211, 238, 0.1);
        }

        .metricRed {
          border-color: rgba(239, 68, 68, 0.2);
          background: rgba(239, 68, 68, 0.1);
        }

        .metricInteractive:hover {
          transform: translateY(-3px);
          box-shadow:
            0 18px 38px rgba(0, 0, 0, 0.28),
            0 0 0 1px rgba(255, 255, 255, 0.03) inset,
            0 0 22px rgba(103, 232, 249, 0.08);
        }

        .metricLabel {
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgb(156 163 175);
        }

        .metricValue {
          margin-top: 10px;
          font-size: 2.05rem;
          font-weight: 700;
          line-height: 1.05;
          word-break: break-word;
          transition: all 500ms ease;
        }

        .metricText {
          margin-top: 7px;
          font-size: 0.875rem;
          color: rgb(156 163 175);
          line-height: 1.65;
        }

        .inputField {
          width: 100%;
          border-radius: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(2, 8, 20, 0.72);
          padding: 0.75rem 1rem;
          color: white;
          outline: none;
          transition:
            border-color 180ms ease,
            box-shadow 180ms ease,
            background 180ms ease;
        }

        .inputField::placeholder {
          color: rgb(75 85 99);
        }

        .inputField:focus {
          border-color: rgba(34, 211, 238, 0.55);
          background: rgba(2, 8, 20, 0.86);
          box-shadow: 0 0 22px rgba(34, 211, 238, 0.12);
        }

        .hoverCard {
          transition:
            transform 220ms ease,
            border-color 220ms ease,
            box-shadow 220ms ease,
            background 220ms ease;
        }

        .hoverCard:hover {
          transform: translateY(-2px);
          border-color: rgba(255, 255, 255, 0.14);
          box-shadow:
            0 14px 38px rgba(0, 0, 0, 0.24),
            0 0 0 1px rgba(255, 255, 255, 0.02) inset;
        }

        .sparkle {
          position: absolute;
          border-radius: 9999px;
          background: white;
          box-shadow:
            0 0 8px rgba(255, 255, 255, 0.88),
            0 0 16px rgba(96, 165, 250, 0.34);
          animation-name: twinkle;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        .orb {
          position: absolute;
          border-radius: 9999px;
          filter: blur(92px);
          opacity: 0.2;
        }

        .orb-a {
          left: -10%;
          top: -8%;
          height: 26rem;
          width: 26rem;
          background: rgba(34, 211, 238, 0.045);
          animation: floatSlow 26s ease-in-out infinite;
        }

        .orb-b {
          right: -10%;
          top: 18%;
          height: 22rem;
          width: 22rem;
          background: rgba(59, 130, 246, 0.04);
          animation: floatSlow 28s ease-in-out infinite;
        }

        .fog {
          position: absolute;
          left: -10%;
          right: -10%;
          height: 160px;
          border-radius: 9999px;
          filter: blur(100px);
          opacity: 0.028;
          mix-blend-mode: screen;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0),
            rgba(255, 255, 255, 0.018),
            rgba(96, 165, 250, 0.024),
            rgba(255, 255, 255, 0.008)
          );
        }

        .fog-a {
          top: 18%;
          animation: fogDriftOne 42s ease-in-out infinite;
        }

        .fog-b {
          top: 58%;
          animation: fogDriftTwo 46s ease-in-out infinite;
        }

        @keyframes headlineGlowPulse {
          0%,
          100% {
            opacity: 0.86;
            text-shadow:
              0 0 8px rgba(255, 255, 255, 0.28),
              0 0 18px rgba(96, 165, 250, 0.20),
              0 0 38px rgba(59, 130, 246, 0.16);
          }

          50% {
            opacity: 1;
            text-shadow:
              0 0 14px rgba(255, 255, 255, 0.82),
              0 0 30px rgba(147, 197, 253, 0.58),
              0 0 58px rgba(96, 165, 250, 0.44),
              0 0 92px rgba(59, 130, 246, 0.32);
          }
        }

        @keyframes logoPulseGlow {
          0%,
          100% {
            opacity: 0.82;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes livePulseGreen {
          0%,
          100% {
            transform: scale(0.98);
          }
          50% {
            transform: scale(1.03);
          }
        }

        @keyframes twinkle {
          0%,
          100% {
            transform: translateY(0px) scale(0.9);
            opacity: 0.18;
          }
          25% {
            transform: translateY(-3px) scale(1.03);
            opacity: 0.78;
          }
          50% {
            transform: translateY(0px) scale(0.95);
            opacity: 0.34;
          }
          75% {
            transform: translateY(2px) scale(1.01);
            opacity: 0.56;
          }
        }

        @keyframes floatSlow {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(0, 8px, 0);
          }
        }

        @keyframes fogDriftOne {
          0%,
          100% {
            transform: translateX(-2%) translateY(0px) scaleX(1);
          }
          50% {
            transform: translateX(2.5%) translateY(-3px) scaleX(1.03);
          }
        }

        @keyframes fogDriftTwo {
          0%,
          100% {
            transform: translateX(2.5%) translateY(0px) scaleX(1.02);
          }
          50% {
            transform: translateX(-2%) translateY(4px) scaleX(1.05);
          }
        }

        @keyframes cardFloat {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-4px);
          }
        }
      `}</style>
    </main>
  );
}
