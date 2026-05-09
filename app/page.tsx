'use client';

import React, { useEffect, useMemo, useRef, useState } from "react";

type Sparkle = {
  left: string;
  top: string;
  size: number;
  delay: string;
  duration: string;
  opacity: number;
};

const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/00w28refMasTcD678J4ko00";

function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 900,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
}) {
  const [display, setDisplay] = useState(value);
  const previousValueRef = useRef(value);

  useEffect(() => {
    let frame = 0;
    const start = previousValueRef.current;
    const end = value;
    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(start + (end - start) * eased);

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        previousValueRef.current = end;
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return (
    <span>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}

export default function GhostlayerHomepageLivePreview() {
  const currentYear = new Date().getFullYear();

  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);
  const [isCalendlyLoading, setIsCalendlyLoading] = useState(true);

  const [workflowHealth, setWorkflowHealth] = useState(82);
  const [riskScore, setRiskScore] = useState(68);
  const [monthlyLoss, setMonthlyLoss] = useState(3247);
  const [recoveryOpportunity, setRecoveryOpportunity] = useState(4200);

  const logoPulseGlow = "ghostlayerLogoPulse text-white";

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
    ],
    []
  );

  useEffect(() => {
    document.title = 'Ghostlayer Workflow Scan | Find Workflow Bottlenecks';

    const description =
      'Ghostlayer helps service businesses identify workflow bottlenecks, broken handoffs, approval delays, repeated manual work, and hidden operational drag through a structured Workflow Scan.';

    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', 'Ghostlayer Workflow Scan');

    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (!ogDescription) {
      ogDescription = document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescription);
    }
    ogDescription.setAttribute('content', description);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setWorkflowHealth((v) => Math.max(78, Math.min(90, v + (Math.random() > 0.5 ? 1 : -1))));
      setRiskScore((v) => Math.max(60, Math.min(74, v + (Math.random() > 0.5 ? 1 : -1))));
      setMonthlyLoss((v) => Math.max(2800, Math.min(3800, v + Math.round((Math.random() - 0.5) * 140))));
      setRecoveryOpportunity((v) => Math.max(3600, Math.min(5000, v + Math.round((Math.random() - 0.5) * 180))));
    }, 4200);

    return () => window.clearInterval(interval);
  }, []);

  function openCalendly() {
    window.location.href = "/workflow-scan";
  }

  function closeCalendly() {
    setIsCalendlyOpen(false);
  }

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
          <a href="/" className={`inline-block text-[1.05rem] font-bold tracking-[0.16em] sm:text-[1.16rem] ${logoPulseGlow}`}>
            GHOSTLAYER
          </a>

          <nav className="hidden items-center gap-6 text-sm text-gray-300 lg:flex">
            <a href="#how-it-works" className="transition hover:text-white">How It Works</a>
            <a href="#methodology" className="transition hover:text-white">Methodology</a>
            <a href="#who-it-helps" className="transition hover:text-white">Who It Helps</a>
            <a href="#results" className="transition hover:text-white">Results</a>
            <a href="#pricing" className="transition hover:text-white">Pricing</a>
            <a href="#next-step" className="transition hover:text-white">Next Step</a>
            <a href="/privacy" className="transition hover:text-white">Privacy</a>
            <a href="/terms" className="transition hover:text-white">Terms</a>
            <a href="/dashboard" className="rounded-full border border-cyan-400/18 bg-cyan-400/8 px-4 py-2 font-semibold text-cyan-200 transition hover:bg-cyan-400/12 hover:text-white">
              Sample Dashboard
            </a>
          </nav>

          <div className="flex items-center gap-2 lg:hidden">
            <a href="/dashboard" className="rounded-xl border border-cyan-400/20 bg-cyan-400/8 px-3 py-2 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-400/12 hover:text-white">
              Sample Dashboard
            </a>
          </div>
        </div>
      </header>

      <section className="relative z-10 px-4 pb-9 pt-14 sm:px-6 sm:pb-12 sm:pt-16 md:px-8 md:pt-16 lg:px-10 lg:pb-14 xl:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-start gap-7 md:gap-8 lg:gap-10 xl:grid-cols-[minmax(0,1.02fr)_minmax(420px,500px)] xl:gap-12">
            <div className="max-w-4xl md:max-w-3xl lg:max-w-4xl">
              <p className="text-[11px] uppercase tracking-[0.34em] text-cyan-300 sm:text-xs">
                Workflow Scans for Service Businesses
              </p>

              <h1 className="hero-glow mt-7 max-w-4xl text-4xl font-bold leading-[1.03] text-white sm:text-5xl md:max-w-3xl md:text-[3rem] md:leading-[1.02] lg:max-w-4xl lg:text-[3.55rem] xl:text-[3.9rem]">
                Find Workflow Friction
                <br />
                Before It Slows
                <br />
                Growth, Burns Time,
                <br />
                and Costs Revenue
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-7 text-gray-300 sm:text-lg">
                Ghostlayer surfaces broken handoffs, approval bottlenecks, repeated manual work,
                and hidden operational drag so businesses can see what is slowing execution and what to fix first.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={openCalendly} className="rounded-2xl bg-white px-7 py-3.5 text-base font-semibold text-black transition hover:opacity-90">
                  Book a Workflow Scan
                </button>

                <a href="/dashboard" className="rounded-2xl border border-white/12 bg-white/[0.04] px-7 py-3.5 text-center text-base font-semibold text-white transition hover:bg-white/[0.08]">
                  View Sample Dashboard
                </a>
              </div>

              <div className="mt-5 flex flex-col gap-2 text-sm text-gray-400 sm:flex-row sm:flex-wrap sm:gap-4">
                <span>Reduce operational drag</span>
                <span>Improve accountability</span>
                <span>Recover execution time</span>
              </div>
            </div>

            <div className="w-full md:justify-self-center xl:justify-self-auto">
              <div className="workflowSignalCard rounded-[28px] border border-white/10 p-4 sm:p-4.5">
                <div className="signalHeader rounded-[20px] border border-white/8 px-4 py-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.26em] text-gray-500">Workflow Signal</p>
                    <p className="mt-1 text-sm font-medium text-white">Sample operational scan</p>
                  </div>
                  <span className="signalLivePill">DEMO</span>
                </div>

                <div className="mt-3.5 grid grid-cols-2 gap-3">
                  <div className="signalMetric signalMetricCyan metricInteractive">
                    <p className="signalMetricLabel text-cyan-200">Workflow Risk</p>
                    <p className="signalMetricValue"><AnimatedNumber value={riskScore} suffix="/100" /></p>
                    <p className="signalMetricText text-cyan-50/80">Elevated due to repeated approvals, weak ownership, and broken handoffs.</p>
                  </div>

                  <div className="signalMetric signalMetricRed metricInteractive">
                    <p className="signalMetricLabel text-red-200">Estimated Loss</p>
                    <p className="signalMetricValue"><AnimatedNumber value={monthlyLoss} prefix="$" /><span className="signalMetricSuffix">/mo</span></p>
                    <p className="signalMetricText text-red-50/80">Estimated productivity drag from process friction and missed follow-through.</p>
                  </div>
                </div>

                <div className="mt-3.5 rounded-[22px] border border-white/8 bg-black/28 px-4 py-4 hoverCard">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-gray-300">What Ghostlayer Finds</p>
                    <span className="text-[10px] uppercase tracking-[0.18em] text-gray-500">Proof Panel</span>
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
        </div>
      </section>

      <section id="how-it-works" className="relative z-10 px-4 py-5 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <div className="mx-auto max-w-7xl rounded-[30px] border border-white/8 bg-white/[0.03] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.18)] backdrop-blur-sm sm:p-6">
          <div className="max-w-3xl">
            <p className="text-[11px] uppercase tracking-[0.34em] text-cyan-300 sm:text-xs">How It Works</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">A cleaner way to see what is slowing execution</h2>
            <p className="mt-3 text-base leading-7 text-gray-300">Ghostlayer helps you spot where execution is slowing down, where handoffs are breaking, and where repeated manual work is costing time and revenue.</p>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-3">
            <div className="rounded-3xl border border-white/8 bg-[#0a0d14] p-5 hoverCard">
              <p className="text-sm uppercase tracking-[0.22em] text-cyan-300">1. Capture</p>
              <h3 className="mt-2 text-xl font-semibold">Review the workflow inputs</h3>
              <p className="mt-2 text-sm leading-7 text-gray-400">Review workflow notes, tools, handoffs, approvals, follow-up steps, and process details in one structured scan.</p>
            </div>

            <div className="rounded-3xl border border-white/8 bg-[#0a0d14] p-5 hoverCard">
              <p className="text-sm uppercase tracking-[0.22em] text-cyan-300">2. Diagnose</p>
              <h3 className="mt-2 text-xl font-semibold">Identify bottlenecks and drag</h3>
              <p className="mt-2 text-sm leading-7 text-gray-400">Surface approval delays, broken handoffs, repeated updates, and execution friction.</p>
            </div>

            <div className="rounded-3xl border border-white/8 bg-[#0a0d14] p-5 hoverCard">
              <p className="text-sm uppercase tracking-[0.22em] text-cyan-300">3. Improve</p>
              <h3 className="mt-2 text-xl font-semibold">Turn visibility into action</h3>
              <p className="mt-2 text-sm leading-7 text-gray-400">Receive a clear dashboard/report with bottlenecks, impact areas, recommended fixes, and priority actions.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="methodology" className="relative z-10 px-4 py-5 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <div className="mx-auto max-w-7xl rounded-[30px] border border-white/8 bg-white/[0.03] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.18)] backdrop-blur-sm sm:p-6">
          <div className="max-w-3xl">
            <p className="text-[11px] uppercase tracking-[0.34em] text-cyan-300 sm:text-xs">Methodology</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">How Ghostlayer calculates workflow friction</h2>
            <p className="mt-3 text-base leading-7 text-gray-300">Ghostlayer reviews client-provided workflow information to identify patterns of operational drag. The scan is a consulting-style workflow diagnostic, not a regulated audit, certification, legal service, or financial advisory service.</p>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-3">
            <div className="rounded-3xl border border-white/8 bg-[#0a0d14] p-5 hoverCard">
              <p className="text-sm uppercase tracking-[0.22em] text-cyan-300">Inputs</p>
              <h3 className="mt-2 text-xl font-semibold">What gets reviewed</h3>
              <p className="mt-2 text-sm leading-7 text-gray-400">Workflow notes, tools used, task boards, CRM stages, handoff points, approval steps, and follow-up process.</p>
            </div>
            <div className="rounded-3xl border border-white/8 bg-[#0a0d14] p-5 hoverCard">
              <p className="text-sm uppercase tracking-[0.22em] text-cyan-300">Signals</p>
              <h3 className="mt-2 text-xl font-semibold">What Ghostlayer looks for</h3>
              <p className="mt-2 text-sm leading-7 text-gray-400">Delays, duplicate work, unclear ownership, missed follow-ups, broken handoffs, approval drag, and manual tracking.</p>
            </div>
            <div className="rounded-3xl border border-white/8 bg-[#0a0d14] p-5 hoverCard">
              <p className="text-sm uppercase tracking-[0.22em] text-cyan-300">Outputs</p>
              <h3 className="mt-2 text-xl font-semibold">What you receive</h3>
              <p className="mt-2 text-sm leading-7 text-gray-400">Bottlenecks, estimated impact areas, workflow scorecard, recommended fixes, and priority actions.</p>
            </div>
          </div>

          <div className="mt-5 rounded-[24px] border border-cyan-400/12 bg-cyan-400/[0.06] p-5">
            <p className="text-sm font-semibold text-white">Trust note</p>
            <p className="mt-2 text-sm leading-7 text-gray-300">Public dashboard examples should use sample/demo data only. Client-specific workflow details should not be shown publicly.</p>
          </div>
        </div>
      </section>

      <section id="who-it-helps" className="relative z-10 px-4 py-5 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <div className="mx-auto max-w-7xl rounded-[30px] border border-white/8 bg-white/[0.03] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.18)] backdrop-blur-sm sm:p-6">
          <div className="max-w-3xl">
            <p className="text-[11px] uppercase tracking-[0.34em] text-cyan-300 sm:text-xs">Who It Helps</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Built for businesses that need cleaner execution</h2>
            <p className="mt-3 text-base leading-7 text-gray-300">Best for service businesses, agencies, consultants, operators, and growing teams that need better handoffs, less manual waste, and stronger workflow visibility.</p>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl border border-white/8 bg-[#0a0d14] p-5 hoverCard"><h3 className="text-xl font-semibold">Agencies</h3><p className="mt-2 text-sm leading-7 text-gray-400">Reduce handoff chaos between sales, onboarding, delivery, and support.</p></div>
            <div className="rounded-3xl border border-white/8 bg-[#0a0d14] p-5 hoverCard"><h3 className="text-xl font-semibold">Consulting Firms</h3><p className="mt-2 text-sm leading-7 text-gray-400">Improve intake quality, client follow-through, and internal execution.</p></div>
            <div className="rounded-3xl border border-white/8 bg-[#0a0d14] p-5 hoverCard"><h3 className="text-xl font-semibold">Service Businesses</h3><p className="mt-2 text-sm leading-7 text-gray-400">Spot where delivery slows down and where repeated admin work hurts margin.</p></div>
            <div className="rounded-3xl border border-white/8 bg-[#0a0d14] p-5 hoverCard"><h3 className="text-xl font-semibold">Operations Leaders</h3><p className="mt-2 text-sm leading-7 text-gray-400">Get a simple operational signal without clutter or guesswork.</p></div>
          </div>
        </div>
      </section>

      <section id="results" className="relative z-10 px-4 py-5 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <div className="mx-auto max-w-7xl rounded-[30px] border border-white/8 bg-white/[0.03] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.18)] backdrop-blur-sm sm:p-6">
          <div className="max-w-3xl">
            <p className="text-[11px] uppercase tracking-[0.34em] text-cyan-300 sm:text-xs">Results</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">See the cost of friction before it compounds</h2>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="metricCard metricGreen hoverCard metricInteractive p-5"><p className="metricLabel text-green-200">Workflow Health</p><p className="metricValue"><AnimatedNumber value={workflowHealth} suffix="%" /></p><p className="metricText text-green-50/80">Visibility and operational consistency across core workflows.</p></div>
            <div className="metricCard metricBlue hoverCard metricInteractive p-5"><p className="metricLabel text-cyan-100">Risk Score</p><p className="metricValue"><AnimatedNumber value={riskScore} suffix="/100" /></p><p className="metricText text-cyan-50/80">Higher scores indicate delays, repeated effort, weak ownership, and broken handoffs.</p></div>
            <div className="metricCard metricRed hoverCard metricInteractive p-5"><p className="metricLabel text-red-100">Est. Monthly Loss</p><p className="metricValue"><AnimatedNumber value={monthlyLoss} prefix="$" suffix="/mo" /></p><p className="metricText text-red-50/80">Estimated monthly business cost caused by workflow drag and missed execution.</p></div>
            <div className="metricCard metricGreen hoverCard metricInteractive p-5"><p className="metricLabel text-green-100">Recovery Opportunity</p><p className="metricValue"><AnimatedNumber value={recoveryOpportunity} prefix="$" suffix="/mo" /></p><p className="metricText text-green-50/80">Potential monthly gain if friction and repeated effort are reduced.</p></div>
          </div>
        </div>
      </section>

      <section id="pricing" className="relative z-10 px-4 py-5 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[30px] border border-cyan-400/12 bg-white/[0.03] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.18)] backdrop-blur-sm sm:p-6">
          <div className="grid items-center gap-7 xl:grid-cols-[minmax(0,1fr)_minmax(360px,440px)]">
            <div className="max-w-4xl">
              <p className="text-[11px] uppercase tracking-[0.34em] text-cyan-300 sm:text-xs">Launch Pricing</p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Start with a Ghostlayer Workflow Scan</h2>
              <p className="mt-4 max-w-3xl text-base leading-7 text-gray-300">A focused workflow diagnostic for businesses that want to find hidden friction, broken handoffs, approval delays, and operational drag before those problems get more expensive.</p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a href={STRIPE_PAYMENT_LINK} className="rounded-2xl bg-white px-7 py-3.5 text-center text-base font-semibold text-black shadow-[0_10px_28px_rgba(255,255,255,0.12)] transition duration-150 ease-out hover:-translate-y-0.5 hover:opacity-90 hover:shadow-[0_14px_34px_rgba(255,255,255,0.16)] active:translate-y-0.5 active:scale-[0.98] active:shadow-[0_5px_16px_rgba(255,255,255,0.1)]">
                  Start Workflow Scan — $497
                </a>
                <button type="button" onClick={openCalendly} className="rounded-2xl border border-white/12 bg-white/[0.04] px-7 py-3.5 text-base font-semibold text-white transition hover:bg-white/[0.08]">Book a Workflow Scan</button>
                <a href="/dashboard" className="rounded-2xl border border-white/12 bg-white/[0.04] px-7 py-3.5 text-center text-base font-semibold text-white transition hover:bg-white/[0.08]">View Sample Dashboard</a>
              </div>

              <p className="mt-4 text-sm leading-7 text-gray-500">Payments are processed securely through Stripe. The Workflow Scan is a one-time service purchase. Client information should only be shared when needed to understand the workflow.</p>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-[#0a0d14]/86 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.24)]">
              <p className="text-[11px] uppercase tracking-[0.34em] text-cyan-300">Workflow Scan</p>
              <div className="mt-5 flex items-end gap-2"><p className="text-5xl font-bold tracking-tight text-white">$497</p><p className="pb-2 text-sm text-gray-400">one-time</p></div>
              <p className="mt-5 text-base leading-7 text-gray-300">Find the workflow friction slowing your business down.</p>
              <div className="mt-5 rounded-[22px] border border-white/8 bg-white/[0.03] p-4">
                <p className="text-sm font-semibold text-white">Includes:</p>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-gray-300"><li>• Bottleneck review</li><li>• Approval and handoff analysis</li><li>• Dashboard/report</li><li>• Recommended fixes</li><li>• Consultation call</li></ul>
              </div>
              <div className="mt-4 rounded-[22px] border border-cyan-400/12 bg-cyan-400/[0.06] p-4"><p className="text-sm font-semibold text-white">Need ongoing monitoring?</p><p className="mt-2 text-sm leading-6 text-gray-300">Monthly workflow monitoring plans start at <span className="font-semibold text-cyan-100">$149/month.</span></p></div>
            </div>
          </div>
        </div>
      </section>

      <section id="next-step" className="relative z-10 px-4 py-5 pb-12 sm:px-6 md:px-8 lg:px-10 lg:pb-16 xl:px-12">
        <div className="mx-auto max-w-7xl rounded-[30px] border border-cyan-400/12 bg-white/[0.03] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.18)] backdrop-blur-sm sm:p-6">
          <div className="grid items-center gap-5 xl:grid-cols-[minmax(0,1fr)_auto]">
            <div className="max-w-3xl">
              <p className="text-[11px] uppercase tracking-[0.34em] text-cyan-300 sm:text-xs">Next Step</p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Book a workflow scan and see where your workflow is leaking time and revenue</h2>
              <p className="mt-3 text-base leading-7 text-gray-300">Ghostlayer is built to make operational friction visible, actionable, and easier to prioritize. If the process is slowing growth, the scan shows what to fix first.</p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row xl:flex-col">
              <button type="button" onClick={openCalendly} className="rounded-2xl bg-white px-7 py-3.5 text-base font-semibold text-black transition hover:opacity-90">Book a Workflow Scan</button>
              <a href="/dashboard" className="rounded-2xl border border-white/12 bg-white/[0.04] px-7 py-3.5 text-center text-base font-semibold text-white transition hover:bg-white/[0.08]">View Sample Dashboard</a>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/8 bg-[#05070b]/70 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 md:px-8 lg:px-10">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="max-w-md">
              <a href="/" className={`inline-block text-[1.2rem] font-bold tracking-[0.14em] sm:text-[1.3rem] ${logoPulseGlow}`}>GHOSTLAYER</a>
              <p className="mt-2.5 text-sm leading-7 text-gray-400">Workflow scans for clearer operations, stronger follow-through, and faster execution.</p>
            </div>
            <div className="flex max-w-xl flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-400 md:justify-end">
              <a href="#how-it-works" className="transition hover:text-white">How It Works</a>
              <a href="#methodology" className="transition hover:text-white">Methodology</a>
              <a href="#who-it-helps" className="transition hover:text-white">Who It Helps</a>
              <a href="#results" className="transition hover:text-white">Results</a>
              <a href="#pricing" className="transition hover:text-white">Pricing</a>
              <a href="#next-step" className="transition hover:text-white">Next Step</a>
              <a href="/dashboard" className="transition hover:text-white">Sample Dashboard</a>
              <a href="/privacy" className="transition hover:text-white">Privacy</a>
              <a href="/terms" className="transition hover:text-white">Terms</a>
            </div>
          </div>
          <p className="mt-5 border-t border-white/8 pt-5 text-sm text-gray-500">© {currentYear} Ghostlayer. Workflow scans for clearer operations, stronger follow-through, and faster execution.</p>
        </div>
      </footer>

      {isCalendlyOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/72 px-4 py-6 backdrop-blur-md">
          <div className="relative w-full max-w-5xl overflow-hidden rounded-[30px] border border-white/10 bg-[#0a0d14] shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
            <div className="flex items-center justify-between border-b border-white/8 px-4 py-3 sm:px-5">
              <div><p className="text-sm font-semibold text-white">Book a Workflow Scan</p><p className="mt-1 text-xs text-gray-400">Loading secure scheduling...</p></div>
              <button type="button" onClick={closeCalendly} className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/[0.08]">Close</button>
            </div>
            <div className="relative h-[78vh] min-h-[620px] w-full bg-white">
              {isCalendlyLoading && <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[linear-gradient(180deg,#0b0f16,#111827)] text-white"><div className="loadingRing" /><p className="mt-4 text-sm font-medium text-white">Preparing your workflow scan booking...</p><p className="mt-2 text-xs text-gray-400">Connecting to Calendly securely</p></div>}
              <iframe src="https://calendly.com/dexterstevens630/30min?hide_gdpr_banner=1" title="Calendly booking" className="h-full w-full border-0" onLoad={() => setIsCalendlyLoading(false)} />
            </div>
          </div>
        </div>
      )}

      <style>{`
        .ghostlayerLogoPulse { animation: logoPulseGlow 3.2s ease-in-out infinite; color: #ffffff; text-shadow: 0 0 8px rgba(255,255,255,0.95),0 0 18px rgba(255,255,255,0.82),0 0 34px rgba(96,165,250,0.62),0 0 50px rgba(59,130,246,0.48); }
        .hero-glow { animation: heroPulse 6s ease-in-out infinite; text-shadow: 0 0 8px rgba(255,255,255,0.62),0 0 16px rgba(255,255,255,0.52),0 0 28px rgba(96,165,250,0.48),0 0 48px rgba(59,130,246,0.4),0 0 76px rgba(147,51,234,0.28); }
        .workflowSignalCard { background: linear-gradient(180deg, rgba(255,255,255,0.042), rgba(255,255,255,0.018)), rgba(10,13,20,0.92); box-shadow: 0 20px 60px rgba(0,0,0,0.36), inset 0 0 0 1px rgba(255,255,255,0.02); backdrop-filter: blur(20px); animation: cardFloat 7s ease-in-out infinite; }
        .signalHeader { display: flex; align-items: center; justify-content: space-between; background: rgba(7,10,16,0.78); box-shadow: inset 0 0 0 1px rgba(255,255,255,0.02),0 8px 24px rgba(0,0,0,0.18); }
        .signalLivePill { display: inline-flex; align-items: center; justify-content: center; min-width: 50px; border-radius: 9999px; border: 1px solid rgba(34,197,94,0.26); background: rgba(34,197,94,0.12); padding: 6px 12px; font-size: 10px; font-weight: 700; letter-spacing: 0.18em; color: #bbf7d0; animation: livePulseGreen 2.1s ease-in-out infinite; box-shadow: 0 0 0 1px rgba(34,197,94,0.08) inset,0 0 12px rgba(34,197,94,0.18); }
        .signalMetric { position: relative; overflow: hidden; min-width: 0; border-radius: 22px; border: 1px solid rgba(255,255,255,0.08); padding: 14px 15px 14px; transition: transform 220ms ease,border-color 220ms ease,box-shadow 220ms ease; animation: cardFloatSoft 6.5s ease-in-out infinite; }
        .signalMetric::before { content: ''; position: absolute; inset: 0; pointer-events: none; opacity: 0.55; background: linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0)); }
        .signalMetricCyan { background: rgba(8,44,56,0.72); border-color: rgba(34,211,238,0.26); box-shadow: inset 0 0 0 1px rgba(34,211,238,0.05),0 0 22px rgba(34,211,238,0.08); }
        .signalMetricRed { background: rgba(60,20,28,0.72); border-color: rgba(239,68,68,0.24); box-shadow: inset 0 0 0 1px rgba(239,68,68,0.05),0 0 22px rgba(239,68,68,0.08); }
        .signalMetric:hover { transform: translateY(-3px); }
        .signalMetricLabel { position: relative; z-index: 1; font-size: 10px; text-transform: uppercase; letter-spacing: 0.22em; line-height: 1.35; }
        .signalMetricValue { position: relative; z-index: 1; margin-top: 12px; font-size: clamp(1.95rem, 2vw, 2.55rem); font-weight: 700; line-height: 0.98; color: white; letter-spacing: -0.03em; text-shadow: 0 0 14px rgba(255,255,255,0.08); white-space: nowrap; }
        .signalMetricSuffix { margin-left: 3px; font-size: 0.4em; font-weight: 700; opacity: 0.95; }
        .signalMetricText { position: relative; z-index: 1; margin-top: 11px; font-size: 0.9rem; line-height: 1.6; word-break: break-word; }
        .loadingRing { width: 48px; height: 48px; border-radius: 9999px; border: 3px solid rgba(255,255,255,0.14); border-top-color: rgba(125,211,252,1); animation: spin 0.9s linear infinite; box-shadow: 0 0 20px rgba(125,211,252,0.18); }
        .sparkle { position: absolute; border-radius: 9999px; background: white; box-shadow: 0 0 8px rgba(255,255,255,0.88),0 0 16px rgba(96,165,250,0.34); animation-name: twinkle; animation-timing-function: ease-in-out; animation-iteration-count: infinite; }
        .orb { position: absolute; border-radius: 9999px; filter: blur(92px); opacity: 0.2; }
        .orb-a { left: -10%; top: -8%; height: 26rem; width: 26rem; background: rgba(34,211,238,0.045); animation: floatSlow 26s ease-in-out infinite; }
        .orb-b { right: -10%; top: 18%; height: 22rem; width: 22rem; background: rgba(59,130,246,0.04); animation: floatSlow 28s ease-in-out infinite; }
        .fog { position: absolute; left: -10%; right: -10%; height: 160px; border-radius: 9999px; filter: blur(100px); opacity: 0.028; mix-blend-mode: screen; background: linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.018), rgba(96,165,250,0.024), rgba(255,255,255,0.008)); }
        .fog-a { top: 18%; animation: fogDriftOne 42s ease-in-out infinite; }
        .fog-b { top: 58%; animation: fogDriftTwo 46s ease-in-out infinite; }
        .metricCard { border: 1px solid rgba(255,255,255,0.08); background: #0a0d14; border-radius: 24px; transition: transform 220ms ease,border-color 220ms ease,box-shadow 220ms ease,background 220ms ease; }
        .hoverCard { transition: transform 220ms ease,border-color 220ms ease,box-shadow 220ms ease,background 220ms ease; }
        .hoverCard:hover { transform: translateY(-2px); border-color: rgba(255,255,255,0.14); box-shadow: 0 14px 38px rgba(0,0,0,0.24),0 0 0 1px rgba(255,255,255,0.02) inset; }
        .metricInteractive:hover { transform: translateY(-3px); box-shadow: 0 18px 38px rgba(0,0,0,0.28),0 0 0 1px rgba(255,255,255,0.03) inset,0 0 22px rgba(103,232,249,0.08); }
        .metricBlue { border-color: rgba(34,211,238,0.2); background: rgba(34,211,238,0.1); }
        .metricRed { border-color: rgba(239,68,68,0.2); background: rgba(239,68,68,0.1); }
        .metricGreen { border-color: rgba(34,197,94,0.2); background: rgba(34,197,94,0.1); }
        .metricLabel { font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: rgb(156 163 175); }
        .metricValue { margin-top: 10px; font-size: 2.05rem; font-weight: 700; line-height: 1.05; word-break: break-word; }
        .metricText { margin-top: 7px; font-size: 0.875rem; color: rgb(156 163 175); line-height: 1.65; }
        @keyframes heroPulse { 0%,100% { opacity: 0.94; } 50% { opacity: 1; } }
        @keyframes livePulseGreen { 0%,100% { transform: scale(0.98); } 50% { transform: scale(1.03); } }
        @keyframes logoPulseGlow { 0%,100% { opacity: 0.82; } 50% { opacity: 1; } }
        @keyframes twinkle { 0%,100% { transform: translateY(0px) scale(0.9); opacity: 0.18; } 25% { transform: translateY(-3px) scale(1.03); opacity: 0.78; } 50% { transform: translateY(0px) scale(0.95); opacity: 0.34; } 75% { transform: translateY(2px) scale(1.01); opacity: 0.56; } }
        @keyframes floatSlow { 0%,100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(0,8px,0); } }
        @keyframes fogDriftOne { 0%,100% { transform: translateX(-2%) translateY(0px) scaleX(1); } 50% { transform: translateX(2.5%) translateY(-3px) scaleX(1.03); } }
        @keyframes fogDriftTwo { 0%,100% { transform: translateX(2.5%) translateY(0px) scaleX(1.02); } 50% { transform: translateX(-2%) translateY(4px) scaleX(1.05); } }
        @keyframes cardFloat { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-4px); } }
        @keyframes cardFloatSoft { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-2px); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 767px) { .workflowSignalCard { padding: 14px; } .signalMetric { padding: 13px 13px 14px; } .signalMetricValue { font-size: 1.82rem; } .signalMetricText { font-size: 0.84rem; line-height: 1.55; } .signalMetricSuffix { font-size: 0.42em; } .metricValue { font-size: 1.85rem; } .metricCard { border-radius: 20px; } }
        @media (max-width: 520px) { .signalMetricValue { white-space: normal; } }
      `}</style>
    </main>
  );
}
