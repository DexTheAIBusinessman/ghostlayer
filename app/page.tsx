'use client';

import Link from 'next/link';
import { PopupModal } from 'react-calendly';
import { useEffect, useState } from 'react';
import { trackCtaClick } from '@/lib/trackCtaClick';

export default function HomePage() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  async function openCalendly() {
    await trackCtaClick('homepage');
    setIsCalendlyOpen(true);
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_right,rgba(168,85,247,0.10),transparent_25%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-8 md:px-10">
          <header className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="text-xl font-bold tracking-[0.2em] text-white transition hover:text-cyan-300"
            >
              GHOSTLAYER
            </Link>

            <nav className="hidden items-center gap-6 text-sm text-gray-300 md:flex">
              <a href="#how-it-works" className="transition hover:text-white">
                How It Works
              </a>
              <a href="#who-its-for" className="transition hover:text-white">
                Who It Helps
              </a>
              <a href="#results" className="transition hover:text-white">
                Results
              </a>
              <a href="#pricing" className="transition hover:text-white">
                Next Step
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="hidden rounded-2xl border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white hover:text-black sm:inline-flex"
              >
                View Dashboard
              </Link>

              <button
                onClick={openCalendly}
                className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:opacity-85"
              >
                Book Consultation
              </button>
            </div>
          </header>

          <div className="grid gap-12 py-16 md:grid-cols-[1.15fr_0.85fr] md:py-24">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">
                Business Workflow Inefficiency Scanner
              </p>

              <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
                Find Workflow Friction Before It Slows Growth, Burns Time, and
                Costs Revenue
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-gray-300 md:text-lg">
                Ghostlayer helps businesses uncover broken handoffs, approval
                bottlenecks, duplicate work, and hidden operational drag so
                teams can move faster with less waste.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <button
                  onClick={openCalendly}
                  className="rounded-2xl bg-white px-6 py-4 text-base font-semibold text-black transition hover:opacity-85"
                >
                  Book Business Consultation
                </button>

                <Link
                  href="/dashboard"
                  className="rounded-2xl border border-cyan-400/30 px-6 py-4 text-base font-semibold text-cyan-300 transition hover:bg-cyan-400/10"
                >
                  See Live Dashboard
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-6 text-sm text-gray-400">
                <span>Reduce operational drag</span>
                <span>Improve team accountability</span>
                <span>Recover missed execution time</span>
              </div>
            </div>

            <div className="rounded-[28px] border border-cyan-400/20 bg-white/5 p-6 shadow-[0_0_40px_rgba(34,211,238,0.08)] backdrop-blur">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <p className="text-xs uppercase tracking-[0.25em] text-gray-400">
                    Workflow Health
                  </p>
                  <p className="mt-3 text-4xl font-bold">82%</p>
                  <p className="mt-2 text-sm text-gray-300">
                    Visibility is decent, but key process friction remains.
                  </p>
                </div>

                <div className="rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-5">
                  <p className="text-xs uppercase tracking-[0.25em] text-gray-200">
                    Risk Score
                  </p>
                  <p className="mt-3 text-4xl font-bold">68/100</p>
                  <p className="mt-2 text-sm text-gray-300">
                    Delays, repeated effort, and weak handoffs are active.
                  </p>
                </div>

                <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-5">
                  <p className="text-xs uppercase tracking-[0.25em] text-gray-200">
                    Productivity Loss
                  </p>
                  <p className="mt-3 text-4xl font-bold">$3,247/mo</p>
                  <p className="mt-2 text-sm text-gray-300">
                    Estimated cost from execution drag and operational waste.
                  </p>
                </div>

                <div className="rounded-3xl border border-green-500/30 bg-green-500/10 p-5">
                  <p className="text-xs uppercase tracking-[0.25em] text-gray-200">
                    Savings Opportunity
                  </p>
                  <p className="mt-3 text-4xl font-bold">$4,200/mo</p>
                  <p className="mt-2 text-sm text-gray-300">
                    Recoverable value if workflow friction is corrected.
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-3xl border border-white/10 bg-black/40 p-5">
                <p className="text-sm font-semibold text-cyan-300">
                  What Ghostlayer surfaces
                </p>
                <ul className="mt-4 space-y-3 text-sm text-gray-300">
                  <li>• Approval steps that slow deals and delivery</li>
                  <li>• Handoffs where ownership gets blurry</li>
                  <li>• Duplicate manual work across teams</li>
                  <li>• Missed revenue caused by workflow drag</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
            How It Works
          </p>
          <h2 className="mt-4 text-3xl font-bold md:text-4xl">
            A faster way to spot what is slowing your business down
          </h2>
          <p className="mt-4 text-base leading-7 text-gray-400">
            Ghostlayer is designed to help business owners, operators, and lean
            teams quickly identify workflow inefficiencies without needing a
            full operations department.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
              Step 1
            </div>
            <h3 className="mt-4 text-xl font-semibold">
              Enter your business workflow inputs
            </h3>
            <p className="mt-3 text-sm leading-7 text-gray-400">
              Add basic business details like team size, bottlenecks, and
              operational cost pressure.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
              Step 2
            </div>
            <h3 className="mt-4 text-xl font-semibold">
              Review friction signals instantly
            </h3>
            <p className="mt-3 text-sm leading-7 text-gray-400">
              See risk signals tied to delays, duplicate work, broken handoffs,
              and missed execution.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
              Step 3
            </div>
            <h3 className="mt-4 text-xl font-semibold">
              Turn insights into business action
            </h3>
            <p className="mt-3 text-sm leading-7 text-gray-400">
              Use the results to tighten operations, improve accountability, and
              protect revenue.
            </p>
          </div>
        </div>
      </section>

      <section id="who-its-for" className="border-y border-white/10 bg-white/5">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
              Who It Helps
            </p>
            <h2 className="mt-4 text-3xl font-bold md:text-4xl">
              Built for businesses that need smoother execution
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-400">
              Ghostlayer is a strong fit for small businesses, service firms,
              agencies, consultancies, operators, founders, and individuals
              managing complex work with limited time and limited margin for
              waste.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl border border-white/10 bg-black/40 p-6">
              <h3 className="text-xl font-semibold">Founders</h3>
              <p className="mt-3 text-sm leading-7 text-gray-400">
                Get visibility into what is slowing the business before it turns
                into expensive chaos.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/40 p-6">
              <h3 className="text-xl font-semibold">Operations Teams</h3>
              <p className="mt-3 text-sm leading-7 text-gray-400">
                Spot handoff issues, unclear ownership, and process drag across
                the team.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/40 p-6">
              <h3 className="text-xl font-semibold">Service Businesses</h3>
              <p className="mt-3 text-sm leading-7 text-gray-400">
                Reduce delays between intake, onboarding, delivery, and client
                communication.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/40 p-6">
              <h3 className="text-xl font-semibold">Individuals</h3>
              <p className="mt-3 text-sm leading-7 text-gray-400">
                Use the scanner to better structure workload, decision points,
                and recurring responsibilities.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="results" className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
            What Businesses Want
          </p>
          <h2 className="mt-4 text-3xl font-bold md:text-4xl">
            Clearer workflows. Faster execution. Less waste.
          </h2>
          <p className="mt-4 text-base leading-7 text-gray-400">
            The best workflow tools do not just look smart. They help teams move
            faster, operate more clearly, and stop losing time to preventable
            friction.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6">
            <h3 className="text-xl font-semibold text-cyan-300">
              What Ghostlayer helps reduce
            </h3>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-gray-200">
              <li>• Delayed approvals and stalled execution</li>
              <li>• Duplicate admin work across different tools</li>
              <li>• Broken handoffs between departments or people</li>
              <li>• Revenue leakage caused by slow follow-through</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-semibold">What businesses gain</h3>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-gray-300">
              <li>• Better visibility into operational weak spots</li>
              <li>• Faster movement across critical workflows</li>
              <li>• Stronger ownership and less confusion</li>
              <li>• More confidence in scaling what already works</li>
            </ul>
          </div>
        </div>
      </section>

      <section
        id="pricing"
        className="border-y border-white/10 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.10),transparent_35%)]"
      >
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
              Next Step
            </p>
            <h2 className="mt-4 text-3xl font-bold md:text-4xl">
              Start with a consultation and see where the real drag lives
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-400">
              The fastest way to see whether Ghostlayer fits your business is to
              walk through your workflow and identify the friction points
              directly.
            </p>
          </div>

          <div className="mt-10 rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-[0_0_60px_rgba(34,211,238,0.08)]">
            <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <h3 className="text-2xl font-semibold">
                  Book a business workflow consultation
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-400">
                  Get a focused conversation around your bottlenecks, workflow
                  friction, and where execution may be slipping. Good for
                  businesses, operators, and individuals ready to tighten how
                  work moves.
                </p>

                <div className="mt-5 flex flex-wrap gap-4 text-sm text-gray-300">
                  <span>Business workflow review</span>
                  <span>Operational bottleneck discussion</span>
                  <span>Next-step recommendations</span>
                </div>
              </div>

              <button
                onClick={openCalendly}
                className="rounded-2xl bg-white px-6 py-4 text-base font-semibold text-black transition hover:opacity-85"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-black">
        <div className="mx-auto max-w-7xl px-6 py-10 md:px-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="max-w-xl">
              <Link
                href="/"
                className="text-xl font-bold tracking-[0.2em] text-white transition hover:text-cyan-300"
              >
                GHOSTLAYER
              </Link>

              <p className="mt-4 text-sm leading-7 text-gray-400">
                Ghostlayer helps businesses and individuals uncover workflow
                inefficiencies, reduce operational drag, strengthen execution,
                and recover valuable time.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
                  Explore
                </p>
                <div className="mt-4 space-y-3 text-sm text-gray-400">
                  <a href="#how-it-works" className="block transition hover:text-white">
                    How It Works
                  </a>
                  <a href="#who-its-for" className="block transition hover:text-white">
                    Who It Helps
                  </a>
                  <a href="#results" className="block transition hover:text-white">
                    Results
                  </a>
                  <Link href="/dashboard" className="block transition hover:text-white">
                    Dashboard
                  </Link>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
                  Actions
                </p>
                <div className="mt-4 space-y-3 text-sm text-gray-400">
                  <button
                    onClick={openCalendly}
                    className="block text-left transition hover:text-white"
                  >
                    Book Consultation
                  </button>
                  <Link href="/dashboard" className="block transition hover:text-white">
                    View Live Dashboard
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-6 text-sm text-gray-500">
            © {currentYear} Ghostlayer. Built to help businesses uncover
            workflow inefficiencies, reduce drag, and recover execution time.
          </div>
        </div>
      </footer>

      {isMounted && (
        <PopupModal
          url="https://calendly.com/dexterstevens630/30min"
          onModalClose={() => setIsCalendlyOpen(false)}
          open={isCalendlyOpen}
          rootElement={document.body}
        />
      )}
    </main>
  );
}
