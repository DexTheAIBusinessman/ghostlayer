'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { PopupModal } from 'react-calendly';
import { supabase } from '@/lib/supabase';
import { trackCtaClick } from '@/lib/trackCtaClick';

type BookingRow = {
  id: number;
  calendly_event_uri: string | null;
  calendly_invitee_uri: string | null;
  event_type_name: string | null;
  invitee_name: string | null;
  invitee_email: string | null;
  scheduled_at: string | null;
  source: string | null;
  created_at?: string | null;
};

export default function DashboardPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);

  const [companyName, setCompanyName] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [bottleneck, setBottleneck] = useState('');
  const [saasSpend, setSaasSpend] = useState('');

  const [analysis, setAnalysis] = useState(
    'No business workflow scan has been run yet.'
  );
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const [feedback, setFeedback] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingsMessage, setBookingsMessage] = useState('');

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    setIsMounted(true);
    loadBookings();
  }, []);

  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  async function loadBookings() {
    try {
      setBookingsLoading(true);
      setBookingsMessage('');

      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        setBookingsMessage(`Failed to load bookings: ${error.message}`);
        setBookings([]);
        return;
      }

      setBookings((data as BookingRow[]) || []);
    } catch {
      setBookingsMessage('Failed to load bookings.');
      setBookings([]);
    } finally {
      setBookingsLoading(false);
    }
  }

  async function runScan() {
    setLoading(true);
    setSaveMessage('');
    setFeedbackMessage('');
    setAnalysis('Running business workflow scan...');

    const teamNumber = Number(teamSize) || 5;
    const spendNumber = Number(saasSpend.replace(/[^0-9.]/g, '')) || 0;

    const healthScore = Math.max(61, Math.min(94, 88 - Math.floor(teamNumber / 3)));
    const riskScore = Math.max(
      38,
      Math.min(
        91,
        52 +
          (bottleneck ? 9 : 0) +
          (teamNumber >= 10 ? 7 : 0) +
          (spendNumber >= 500 ? 4 : 0)
      )
    );
    const monthlyLoss = Math.max(
      1200,
      Math.round(teamNumber * 420 + spendNumber * 0.35)
    );

    const mainBottleneck = bottleneck || 'unclear workflow stages';
    const sizeLabel = teamSize || 'Not provided';
    const companyLabel = companyName || 'Unknown Company';
    const spendLabel = saasSpend || '0';

    const summary = `BUSINESS WORKFLOW SCAN COMPLETE

Company:
${companyLabel}

Team Size:
${sizeLabel}

Biggest Workflow Bottleneck:
${mainBottleneck}

Monthly Operational Cost Impacted:
$${spendLabel}

DETECTED WORKFLOW RISKS
- Task delays tied to ${mainBottleneck}
- Duplicate effort across team responsibilities
- Handoff friction causing work to stall between owners

ESTIMATED IMPACT
~$${monthlyLoss.toLocaleString()} in monthly productivity loss

RECOMMENDED ACTIONS
1. Clarify ownership at each workflow stage
2. Remove repeated manual steps across teams
3. Add visibility at handoff points to prevent delays

CONFIDENCE SCORE
${healthScore}%

ANALYSIS
Ghostlayer detected workflow inefficiency patterns that may be slowing execution, increasing costs, and reducing follow-through across the business.`;

    setTimeout(() => {
      setAnalysis(summary);
      setLoading(false);
    }, 1400);
  }

  async function saveScan() {
    try {
      setSaveMessage('Saving scan...');

      const { error } = await supabase.from('scans').insert([
        {
          company_name: companyName || 'Unknown Company',
          team_size: teamSize || 'Not provided',
          bottleneck: bottleneck || 'Not provided',
          saas_spend: saasSpend || '0',
          analysis,
        },
      ]);

      if (error) {
        setSaveMessage(`Failed to save scan: ${error.message}`);
        return;
      }

      setSaveMessage('Scan saved successfully.');
    } catch {
      setSaveMessage('Failed to save scan.');
    }
  }

  async function submitFeedback() {
    if (!feedback.trim()) {
      setFeedbackMessage('Please enter feedback before submitting.');
      return;
    }

    try {
      setFeedbackLoading(true);
      setFeedbackMessage('Saving feedback...');

      const { error } = await supabase.from('feedback').insert([
        {
          message: feedback,
        },
      ]);

      if (error) {
        setFeedbackMessage(`Failed to save feedback: ${error.message}`);
        return;
      }

      setFeedbackMessage('Feedback submitted. Thank you.');
      setFeedback('');
    } catch {
      setFeedbackMessage('Failed to save feedback.');
    } finally {
      setFeedbackLoading(false);
    }
  }

  function downloadReport() {
    const report = `GHOSTLAYER BUSINESS WORKFLOW REPORT

Company: ${companyName || 'Unknown Company'}
Team Size: ${teamSize || 'Not provided'}
Biggest Workflow Bottleneck: ${bottleneck || 'Not provided'}
Monthly Operational Cost Impacted: $${saasSpend || '0'}

${analysis}`;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `ghostlayer-report-${(companyName || 'company')
      .toLowerCase()
      .replace(/\s+/g, '-')}.txt`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  function formatDateTime(value: string | null) {
    if (!value) return 'Not scheduled';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString();
  }

  function normalizeEventTypeName(value: string | null) {
    if (!value) return 'Business Consultation';
    if (value.includes('/event_types/')) return 'Business Consultation';
    return value;
  }

  const metrics = useMemo(() => {
    const teamNumber = Number(teamSize) || 5;
    const spendNumber = Number(saasSpend.replace(/[^0-9.]/g, '')) || 0;

    const workflowHealth = Math.max(
      61,
      Math.min(94, 88 - Math.floor(teamNumber / 3))
    );
    const workflowRisk = Math.max(
      38,
      Math.min(
        91,
        52 +
          (bottleneck ? 9 : 0) +
          (teamNumber >= 10 ? 7 : 0) +
          (spendNumber >= 500 ? 4 : 0)
      )
    );
    const productivityLoss = Math.max(
      1200,
      Math.round(teamNumber * 420 + spendNumber * 0.35)
    );
    const savingsOpportunity = Math.round(productivityLoss * 1.28);

    return {
      workflowHealth,
      workflowRisk,
      productivityLoss,
      savingsOpportunity,
    };
  }, [teamSize, saasSpend, bottleneck]);

  const sideNav = [
    { label: 'Overview', id: 'overview' },
    { label: 'Delay Hotspots', id: 'delay-hotspots' },
    { label: 'Broken Handoffs', id: 'broken-handoffs' },
    { label: 'Duplicate Work', id: 'duplicate-work' },
    { label: 'Bookings', id: 'bookings' },
    { label: 'Business Inputs', id: 'business-inputs' },
    { label: 'AI Analysis', id: 'analysis' },
    { label: 'Feedback', id: 'feedback' },
  ];

  const glowLogo =
    '[text-shadow:0_0_8px_rgba(255,255,255,0.95),0_0_18px_rgba(96,165,250,0.95),0_0_34px_rgba(59,130,246,0.9),0_0_54px_rgba(147,51,234,0.7)]';

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-black/80 p-6 md:block">
          <Link
            href="/"
            className={`text-3xl font-bold tracking-[0.22em] text-white ${glowLogo}`}
          >
            GHOSTLAYER
          </Link>

          <nav className="mt-10 space-y-4 text-gray-400">
            {sideNav.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className="block text-left text-lg transition hover:text-white"
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="flex-1">
          <div className="sticky top-0 z-30 border-b border-white/10 bg-black/85 backdrop-blur md:hidden">
            <div className="px-4 py-4">
              <Link
                href="/"
                className={`text-2xl font-bold tracking-[0.2em] text-white ${glowLogo}`}
              >
                GHOSTLAYER
              </Link>
            </div>

            <div className="flex gap-3 overflow-x-auto px-4 pb-4">
              {sideNav.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className="whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 transition hover:text-white"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:px-10 md:py-10">
            <section
              id="overview"
              className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between"
            >
              <div className="max-w-3xl">
                <p className="text-xs uppercase tracking-[0.35em] text-cyan-300 sm:text-sm">
                  Business Workflow Inefficiency Scanner
                </p>

                <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
                  Find Workflow Inefficiencies Costing Your Business Time and
                  Revenue
                </h1>

                <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-300 sm:text-base">
                  Ghostlayer scans business workflows to uncover delays,
                  duplicate work, broken handoffs, and hidden operational
                  bottlenecks across your team.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap md:max-w-sm md:justify-end">
                <button
                  onClick={runScan}
                  disabled={loading}
                  className="rounded-2xl bg-white px-5 py-4 text-sm font-semibold text-black transition hover:opacity-85 disabled:opacity-50"
                >
                  {loading ? 'Scanning...' : 'Run Business Scan'}
                </button>

                <button
                  onClick={saveScan}
                  className="rounded-2xl border border-cyan-400/30 px-5 py-4 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/10"
                >
                  Save Scan
                </button>

                <button
                  onClick={downloadReport}
                  className="rounded-2xl border border-white/20 px-5 py-4 text-sm font-semibold text-white transition hover:bg-white hover:text-black"
                >
                  Download Business Report
                </button>

                <button
                  onClick={async () => {
                    await trackCtaClick('dashboard');
                    setIsCalendlyOpen(true);
                  }}
                  className="rounded-2xl border border-cyan-400/30 px-5 py-4 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/10"
                >
                  Book Business Consultation
                </button>
              </div>
            </section>

            {saveMessage && (
              <p className="mt-4 text-sm text-cyan-300">{saveMessage}</p>
            )}

            <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-sm uppercase tracking-[0.2em] text-gray-300">
                  Workflow Health
                </h3>
                <p className="mt-3 text-4xl font-bold">{metrics.workflowHealth}%</p>
                <p className="mt-2 text-sm text-gray-400">
                  Estimated visibility and operational consistency across core
                  business workflows.
                </p>
              </div>

              <div className="rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-6">
                <h3 className="text-sm uppercase tracking-[0.2em] text-gray-200">
                  Workflow Risk Score
                </h3>
                <p className="mt-3 text-4xl font-bold">{metrics.workflowRisk}/100</p>
                <p className="mt-2 text-sm text-gray-300">
                  Higher scores indicate delays, repeated effort, weak
                  ownership, and broken handoffs.
                </p>
              </div>

              <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6">
                <h3 className="text-sm uppercase tracking-[0.2em] text-gray-200">
                  Productivity Loss
                </h3>
                <p className="mt-3 text-4xl font-bold">
                  ${metrics.productivityLoss.toLocaleString()}/mo
                </p>
                <p className="mt-2 text-sm text-gray-300">
                  Estimated monthly business cost caused by workflow drag and
                  missed execution.
                </p>
              </div>

              <div className="rounded-3xl border border-green-500/30 bg-green-500/10 p-6">
                <h3 className="text-sm uppercase tracking-[0.2em] text-gray-200">
                  Savings Opportunity
                </h3>
                <p className="mt-3 text-4xl font-bold">
                  ${metrics.savingsOpportunity.toLocaleString()}/mo
                </p>
                <p className="mt-2 text-sm text-gray-300">
                  Potential monthly gain if workflow friction and repeated
                  effort are reduced.
                </p>
              </div>
            </section>

            <section
              id="bookings"
              className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-6"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-2xl font-semibold text-cyan-300">
                    Recent Bookings
                  </h3>
                  <p className="mt-2 text-sm text-gray-400">
                    Recent business consultations captured through your Calendly
                    workflow.
                  </p>
                </div>

                <button
                  onClick={loadBookings}
                  className="self-start rounded-2xl border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white hover:text-black sm:self-auto"
                >
                  Refresh
                </button>
              </div>

              {bookingsLoading ? (
                <p className="mt-6 text-sm text-gray-400">Loading bookings...</p>
              ) : bookingsMessage ? (
                <p className="mt-6 text-sm text-red-400">{bookingsMessage}</p>
              ) : bookings.length === 0 ? (
                <p className="mt-6 text-sm text-gray-400">
                  No bookings found yet. Book a test call to populate this
                  section.
                </p>
              ) : (
                <>
                  <div className="mt-6 hidden overflow-x-auto lg:block">
                    <table className="min-w-full border-collapse text-left text-sm">
                      <thead>
                        <tr className="border-b border-white/10 text-gray-400">
                          <th className="px-3 py-3 font-medium">Name</th>
                          <th className="px-3 py-3 font-medium">Email</th>
                          <th className="px-3 py-3 font-medium">Event Type</th>
                          <th className="px-3 py-3 font-medium">Scheduled At</th>
                          <th className="px-3 py-3 font-medium">Source</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((booking) => (
                          <tr
                            key={booking.id}
                            className="border-b border-white/5 text-gray-200"
                          >
                            <td className="px-3 py-3">
                              {booking.invitee_name || 'Unknown'}
                            </td>
                            <td className="px-3 py-3">
                              {booking.invitee_email || 'No email'}
                            </td>
                            <td className="px-3 py-3">
                              {normalizeEventTypeName(booking.event_type_name)}
                            </td>
                            <td className="px-3 py-3">
                              {formatDateTime(booking.scheduled_at)}
                            </td>
                            <td className="px-3 py-3">
                              {booking.source || 'Not tracked'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-6 grid gap-4 lg:hidden">
                    {bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="rounded-2xl border border-white/10 bg-black/30 p-4"
                      >
                        <div className="grid gap-2 text-sm">
                          <div>
                            <span className="text-gray-400">Name: </span>
                            <span>{booking.invitee_name || 'Unknown'}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Email: </span>
                            <span>{booking.invitee_email || 'No email'}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Event Type: </span>
                            <span>
                              {normalizeEventTypeName(booking.event_type_name)}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">Scheduled At: </span>
                            <span>{formatDateTime(booking.scheduled_at)}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Source: </span>
                            <span>{booking.source || 'Not tracked'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </section>

            <section
              id="business-inputs"
              className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-6"
            >
              <h3 className="text-2xl font-semibold">Business Workflow Inputs</h3>
              <p className="mt-2 text-sm text-gray-400">
                Enter your business details below to simulate where workflow
                inefficiencies may be slowing execution, increasing costs, and
                creating missed opportunities.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Company name"
                  className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-cyan-400/50"
                />

                <input
                  value={teamSize}
                  onChange={(e) => setTeamSize(e.target.value)}
                  placeholder="Team size"
                  className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-cyan-400/50"
                />

                <input
                  value={bottleneck}
                  onChange={(e) => setBottleneck(e.target.value)}
                  placeholder="Biggest workflow bottleneck"
                  className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-cyan-400/50"
                />

                <input
                  value={saasSpend}
                  onChange={(e) => setSaasSpend(e.target.value)}
                  placeholder="Monthly operational cost impacted"
                  className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-cyan-400/50"
                />
              </div>
            </section>

            <section className="mt-10 grid grid-cols-1 gap-6 xl:grid-cols-3">
              <div
                id="delay-hotspots"
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <h3 className="text-xl font-semibold">Delay Hotspots</h3>
                <div className="mt-5 space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-medium">Operations Approval Queue</p>
                      <span className="text-sm text-red-400">High delay</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-400">
                      Approval steps are causing tasks to wait too long before
                      moving forward.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-medium">Client Onboarding</p>
                      <span className="text-sm text-yellow-400">
                        Moderate delay
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-400">
                      Work stalls when information collection is incomplete at
                      intake.
                    </p>
                  </div>
                </div>
              </div>

              <div
                id="broken-handoffs"
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <h3 className="text-xl font-semibold">Broken Handoffs</h3>
                <div className="mt-5 space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-medium">Sales → Operations</p>
                      <span className="text-sm text-red-400">Missing context</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-400">
                      Key information is not consistently passed when deals move
                      into delivery.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-medium">Support → Product</p>
                      <span className="text-sm text-yellow-400">
                        Weak ownership
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-400">
                      Escalated issues lack a clear owner after being
                      transferred.
                    </p>
                  </div>
                </div>
              </div>

              <div
                id="duplicate-work"
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <h3 className="text-xl font-semibold">Duplicate Work</h3>
                <div className="mt-5 space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-medium">Reporting Tasks</p>
                      <span className="text-sm text-cyan-300">Duplicated work</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-400">
                      Two teams are recreating similar reports in separate
                      tools.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-medium">Manual Status Updates</p>
                      <span className="text-sm text-cyan-300">Repeated effort</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-400">
                      Team members are updating the same progress in multiple
                      places.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section
              id="analysis"
              className="mt-10 rounded-3xl border border-cyan-400/20 bg-white/5 p-4 sm:p-6"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-semibold text-cyan-300">
                    AI Analysis
                  </h3>
                  <p className="mt-2 text-sm uppercase tracking-[0.2em] text-gray-500">
                    Beta Estimate
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm text-gray-500">
                These results are directional estimates and are improving over
                time.
              </p>

              <pre className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-2xl border border-white/10 bg-black/40 p-4 text-sm leading-7 text-gray-300">
                {analysis}
              </pre>
            </section>

            <section
              id="feedback"
              className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-6"
            >
              <h3 className="text-2xl font-semibold">Help us improve Ghostlayer</h3>
              <p className="mt-2 text-sm text-gray-400">
                What would make this 10x more useful for your business?
              </p>

              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell us what would make this more useful..."
                className="mt-6 min-h-[140px] w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-cyan-400/50"
              />

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  onClick={submitFeedback}
                  disabled={feedbackLoading}
                  className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:opacity-85 disabled:opacity-50"
                >
                  {feedbackLoading ? 'Submitting...' : 'Submit Feedback'}
                </button>

                {feedbackMessage && (
                  <p className="text-sm text-cyan-300">{feedbackMessage}</p>
                )}
              </div>
            </section>

            <footer className="mt-10 border-t border-white/10 pt-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div className="max-w-xl">
                  <Link
                    href="/"
                    className={`text-2xl font-bold tracking-[0.22em] text-white ${glowLogo}`}
                  >
                    GHOSTLAYER
                  </Link>
                  <p className="mt-4 text-sm leading-7 text-gray-400">
                    Built to help businesses uncover workflow inefficiencies,
                    reduce drag, and recover execution time.
                  </p>
                </div>

                <div className="grid gap-8 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
                      Dashboard
                    </p>
                    <div className="mt-4 space-y-3 text-sm text-gray-400">
                      <button
                        type="button"
                        onClick={() => scrollToSection('overview')}
                        className="block text-left transition hover:text-white"
                      >
                        Overview
                      </button>
                      <button
                        type="button"
                        onClick={() => scrollToSection('bookings')}
                        className="block text-left transition hover:text-white"
                      >
                        Bookings
                      </button>
                      <button
                        type="button"
                        onClick={() => scrollToSection('analysis')}
                        className="block text-left transition hover:text-white"
                      >
                        AI Analysis
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
                      Actions
                    </p>
                    <div className="mt-4 space-y-3 text-sm text-gray-400">
                      <button
                        type="button"
                        onClick={runScan}
                        className="block text-left transition hover:text-white"
                      >
                        Run Business Scan
                      </button>
                      <button
                        type="button"
                        onClick={saveScan}
                        className="block text-left transition hover:text-white"
                      >
                        Save Scan
                      </button>
                      <button
                        type="button"
                        onClick={downloadReport}
                        className="block text-left transition hover:text-white"
                      >
                        Download Report
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-white/10 pt-6 text-sm text-gray-500">
                © {currentYear} Ghostlayer. Business workflow inefficiency
                scanner for clearer operations and faster execution.
              </div>
            </footer>
          </div>
        </div>
      </div>

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
