'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

type SectionId =
  | 'overview'
  | 'priority-issues'
  | 'health-chart'
  | 'intelligence-summary'
  | 'bookings'
  | 'run-scan'
  | 'delay-hotspots'
  | 'broken-handoffs'
  | 'duplicate-work'
  | 'activity'
  | 'feedback';

type Tone = 'cyan' | 'green' | 'yellow' | 'red';

type ActivityItem = {
  id: number;
  time: string;
  label: string;
  detail: string;
  tone: Tone;
};

type BookingItem = {
  id: number;
  name: string;
  email: string;
  type: string;
  scheduled: string;
  source: string;
  status: 'confirmed' | 'pending';
};

type ScanSnapshot = {
  id: number;
  companyName: string;
  teamSize: string;
  workflowBottleneck: string;
  costImpact: number;
  workflowHealth: number;
  riskScore: number;
  monthlyLoss: number;
  recoveryOpportunity: number;
  createdAt: string;
};

type Toast = {
  id: number;
  title: string;
  message: string;
  tone: Tone;
};

const STORAGE_KEY = 'ghostlayer_dashboard_saved_scans';
const HOMEPAGE_URL = 'https://ghostlayer-swart.vercel.app/';
const MAX_SAVED_SCANS = 10;
const MAX_ACTIVITY_ITEMS = 6;

function AppLink({
  href,
  className,
  children,
  onClick,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  const isExternal = /^https?:\/\//.test(href);

  return (
    <a
      href={href}
      className={className}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noreferrer noopener' : undefined}
      onClick={(e) => {
        if (href.startsWith('#')) {
          e.preventDefault();
        }
        onClick?.();
      }}
    >
      {children}
    </a>
  );
}

function formatCurrency(value: number) {
  return `$${value.toLocaleString()}/mo`;
}

function formatClock(date: Date) {
  return date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatShortDate(date: Date) {
  return date.toLocaleString([], {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function parsePositiveNumber(value: string, fallback: number) {
  const cleaned = value.replace(/[^0-9.]/g, '');
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function downloadTextFile(
  filename: string,
  content: string,
  mime = 'text/plain;charset=utf-8'
) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

function AnimatedNumber({
  value,
  prefix = '',
  suffix = '',
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

  useEffect(() => {
    let frame = 0;
    const start = display;
    const end = value;
    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(start + (end - start) * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [display, duration, value]);

  return (
    <span>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}

function TrendChart({
  healthSeries,
  riskSeries,
  lossSeries,
  scanMode,
}: {
  healthSeries: number[];
  riskSeries: number[];
  lossSeries: number[];
  scanMode: 'idle' | 'running' | 'complete';
}) {
  const width = 720;
  const height = 240;
  const pad = 20;

  const scaledLoss = lossSeries.map((v) => v / 45);
  const all = [...healthSeries, ...riskSeries, ...scaledLoss];
  const min = Math.min(...all) - 3;
  const max = Math.max(...all) + 3;

  const points = (series: number[]) => {
    const w = width - pad * 2;
    const h = height - pad * 2;

    return series
      .map((value, i) => {
        const x = pad + (i / Math.max(series.length - 1, 1)) * w;
        const y = pad + (1 - (value - min) / Math.max(max - min, 1)) * h;
        return `${x},${y}`;
      })
      .join(' ');
  };

  return (
    <div
      className={`trendChartShell ${
        scanMode === 'running' ? 'trendChartShellRunning' : ''
      } ${scanMode === 'complete' ? 'trendChartShellComplete' : ''}`}
    >
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500">
            Trend intelligence
          </p>
          <h3 className="mt-2 text-lg font-semibold text-white">
            Workflow health, risk, and loss trend
          </h3>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="legendPill">
            <span className="legendDot legendDotGreen legendDotPulse" />
            Health
          </span>
          <span className="legendPill">
            <span className="legendDot legendDotCyan legendDotPulse" />
            Risk
          </span>
          <span className="legendPill">
            <span className="legendDot legendDotRed legendDotPulse" />
            Loss
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-[220px] w-full"
          preserveAspectRatio="none"
          role="img"
          aria-label="Workflow health, risk, and loss trend chart"
        >
          {[0, 1, 2, 3].map((row) => {
            const y = pad + (row / 3) * (height - pad * 2);
            return (
              <line
                key={`h-${row}`}
                x1={pad}
                x2={width - pad}
                y1={y}
                y2={y}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1"
              />
            );
          })}

          {[0, 1, 2, 3, 4, 5, 6].map((col) => {
            const x = pad + (col / 6) * (width - pad * 2);
            return (
              <line
                key={`v-${col}`}
                x1={x}
                x2={x}
                y1={pad}
                y2={height - pad}
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
              />
            );
          })}

          <polyline
            points={points(healthSeries)}
            fill="none"
            stroke="rgba(134,239,172,0.95)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="chartPolyline chartPolylineGreen"
          />
          <polyline
            points={points(riskSeries)}
            fill="none"
            stroke="rgba(125,211,252,0.95)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="chartPolyline chartPolylineCyan"
          />
          <polyline
            points={points(scaledLoss)}
            fill="none"
            stroke="rgba(248,113,113,0.95)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="chartPolyline chartPolylineRed"
          />
        </svg>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState<SectionId>('overview');

  const [companyName, setCompanyName] = useState('Ghostlayer Demo Co.');
  const [teamSize, setTeamSize] = useState('18');
  const [workflowBottleneck, setWorkflowBottleneck] = useState(
    'Approval and delivery handoff'
  );
  const [costImpact, setCostImpact] = useState('2840');

  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [lastScanAt, setLastScanAt] = useState<Date | null>(new Date());
  const [feedback, setFeedback] = useState('');
  const [scanFlash, setScanFlash] = useState(false);

  const [scanMode, setScanMode] = useState<'idle' | 'running' | 'complete'>(
    'idle'
  );
  const [healthDelta, setHealthDelta] = useState('+2.1%');
  const [riskDelta, setRiskDelta] = useState('-1.4');
  const [lossDelta, setLossDelta] = useState('-$180');

  const [workflowHealth, setWorkflowHealth] = useState(91);
  const [riskScore, setRiskScore] = useState(58);
  const [monthlyLoss, setMonthlyLoss] = useState(2840);
  const [recoveryOpportunity, setRecoveryOpportunity] = useState(3975);
  const [savedScans, setSavedScans] = useState<ScanSnapshot[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const [healthSeries, setHealthSeries] = useState([87, 88, 89, 90, 90, 91, 91]);
  const [riskSeries, setRiskSeries] = useState([61, 60, 60, 59, 58, 58, 58]);
  const [lossSeries, setLossSeries] = useState([
    3180, 3120, 3040, 2980, 2920, 2880, 2840,
  ]);

  const [bookings, setBookings] = useState<BookingItem[]>([
    {
      id: 1,
      name: 'Dexter Test 5',
      email: 'stevensdexter17@gmail.com',
      type: 'Business Consultation',
      scheduled: '5/22/2026, 1:00 PM',
      source: 'calendly',
      status: 'confirmed',
    },
    {
      id: 2,
      name: 'Ariana Lewis',
      email: 'ops@northbridge.io',
      type: 'Workflow Review',
      scheduled: '5/23/2026, 11:30 AM',
      source: 'website',
      status: 'pending',
    },
    {
      id: 3,
      name: 'Mark Chen',
      email: 'founder@fieldscope.co',
      type: 'Business Consultation',
      scheduled: '5/24/2026, 9:00 AM',
      source: 'calendly',
      status: 'confirmed',
    },
    {
      id: 4,
      name: 'Talia Brooks',
      email: 'team@arcpilot.ai',
      type: 'Business Consultation',
      scheduled: '5/25/2026, 2:15 PM',
      source: 'referral',
      status: 'confirmed',
    },
  ]);

  const [activity, setActivity] = useState<ActivityItem[]>([
    {
      id: 1,
      time: formatClock(new Date()),
      label: 'Signal recalculated',
      detail: 'Risk score adjusted after approval-lane drift.',
      tone: 'cyan',
    },
    {
      id: 2,
      time: formatClock(new Date(Date.now() - 1000 * 60 * 8)),
      label: 'Booking sync active',
      detail: 'New consultation entered the demand layer.',
      tone: 'green',
    },
    {
      id: 3,
      time: formatClock(new Date(Date.now() - 1000 * 60 * 15)),
      label: 'Context loss flagged',
      detail: 'Sales to Delivery payload missing execution notes.',
      tone: 'red',
    },
  ]);

  const [summary, setSummary] = useState(`EXECUTIVE SUMMARY

Ghostlayer Demo Co. is showing operational drag across its workflow layer.

PRIMARY SIGNALS
- Workflow bottleneck: Approval and delivery handoff
- Team size: 18
- Monthly operational cost impacted: $2,840/mo
- Repeated manual reporting is increasing duplicate effort
- Critical context is degrading between handoff stages

OPERATOR RECOMMENDATIONS
1. Reduce approval drag in the primary workflow lane
2. Standardize handoff payloads between teams
3. Collapse repeated reporting into one source of truth
4. Assign one clear owner to each transition stage
5. Review booking load and intake flow for execution pressure

OUTLOOK
If current friction is reduced, workflow health, throughput stability, and recovery opportunity should improve.`);

  const navItems: { id: SectionId; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'priority-issues', label: 'Priority Issues' },
    { id: 'health-chart', label: 'Trend Chart' },
    { id: 'intelligence-summary', label: 'Intelligence Summary' },
    { id: 'bookings', label: 'Bookings' },
    { id: 'run-scan', label: 'Run Scan' },
    { id: 'delay-hotspots', label: 'Delay Hotspots' },
    { id: 'broken-handoffs', label: 'Broken Handoffs' },
    { id: 'duplicate-work', label: 'Duplicate Work' },
    { id: 'activity', label: 'Live Activity' },
    { id: 'feedback', label: 'Feedback' },
  ];

  const timeoutRefs = useRef<number[]>([]);

  const addTimeout = useCallback((callback: () => void, delay: number) => {
    const id = window.setTimeout(callback, delay);
    timeoutRefs.current.push(id);
    return id;
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const pushToast = useCallback(
    (title: string, message: string, tone: Tone = 'cyan') => {
      const id = Date.now() + Math.floor(Math.random() * 1000);
      setToasts((prev) => [...prev, { id, title, message, tone }]);
      addTimeout(() => removeToast(id), 3200);
    },
    [addTimeout, removeToast]
  );

  const scrollToSection = useCallback((id: SectionId) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
    setActiveSection(id);
  }, []);

  function buildSnapshot(): ScanSnapshot {
    return {
      id: Date.now(),
      companyName,
      teamSize,
      workflowBottleneck,
      costImpact: parsePositiveNumber(costImpact, monthlyLoss),
      workflowHealth,
      riskScore,
      monthlyLoss,
      recoveryOpportunity,
      createdAt: new Date().toISOString(),
    };
  }

  function addActivityItem(item: ActivityItem) {
    setActivity((prev) => [item, ...prev.slice(0, MAX_ACTIVITY_ITEMS - 1)]);
  }

  function saveCurrentScan() {
    const snapshot = buildSnapshot();
    const next = [snapshot, ...savedScans].slice(0, MAX_SAVED_SCANS);
    setSavedScans(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setLastScanAt(new Date());
    setScanFlash(true);
    addTimeout(() => setScanFlash(false), 1100);
    addActivityItem({
      id: Date.now(),
      time: formatClock(new Date()),
      label: 'Scan saved',
      detail: `${snapshot.companyName} snapshot stored locally for quick export and review.`,
      tone: 'green',
    });
    pushToast(
      'Scan saved',
      'Current dashboard state was saved locally in this browser.',
      'green'
    );
  }

  function exportDashboard() {
    const payload = {
      exportedAt: new Date().toISOString(),
      summary,
      snapshot: buildSnapshot(),
      bookings,
      activity: activity.slice(0, MAX_ACTIVITY_ITEMS),
    };
    downloadTextFile(
      'ghostlayer-dashboard-export.json',
      JSON.stringify(payload, null, 2),
      'application/json;charset=utf-8'
    );
    pushToast('Export ready', 'Dashboard export downloaded as JSON.', 'cyan');
  }

  function downloadExecutiveSummary() {
    const content = `${summary}\n\nSaved scans available: ${savedScans.length}`;
    downloadTextFile('ghostlayer-executive-summary.txt', content);
    pushToast(
      'Summary downloaded',
      'Executive summary exported as a text file.',
      'cyan'
    );
  }

  function scheduleOperatorReview() {
    scrollToSection('bookings');
    pushToast(
      'Review queued',
      'Jumped to bookings so you can schedule the next operator review.',
      'yellow'
    );
  }

  function bookConsultation() {
    scrollToSection('bookings');
    addActivityItem({
      id: Date.now(),
      time: formatClock(new Date()),
      label: 'Consultation CTA clicked',
      detail:
        'User moved to the bookings section to review demand and next conversations.',
      tone: 'cyan',
    });
    pushToast(
      'Bookings section opened',
      'Review recent bookings and next-up consultation demand.',
      'cyan'
    );
  }

  function startWorkflowScan() {
    if (isScanning) return;

    if (!companyName.trim()) {
      pushToast(
        'Company name required',
        'Add a company name before running a scan.',
        'yellow'
      );
      scrollToSection('run-scan');
      return;
    }

    setIsScanning(true);
    setScanProgress(0);
    setScanMode('running');
    addActivityItem({
      id: Date.now(),
      time: formatClock(new Date()),
      label: 'Workflow scan started',
      detail: 'Operator-grade refresh running across active signal layers.',
      tone: 'cyan',
    });
  }

  function refreshBookings() {
    setBookings((prev) => [
      {
        id: Date.now(),
        name: 'New Demo Lead',
        email: `lead${prev.length + 1}@ghostlayer.ai`,
        type: 'Workflow Review',
        scheduled: formatShortDate(new Date(Date.now() + 1000 * 60 * 60 * 24)),
        source: 'website',
        status: 'pending',
      },
      ...prev.slice(0, 4),
    ]);
    pushToast(
      'Bookings refreshed',
      'A new demo lead was added to the demand layer.',
      'cyan'
    );
  }

  function submitFeedback() {
    const trimmed = feedback.trim();
    if (!trimmed) {
      pushToast('Feedback is empty', 'Type feedback before submitting.', 'yellow');
      return;
    }

    addActivityItem({
      id: Date.now(),
      time: formatClock(new Date()),
      label: 'Feedback captured',
      detail: trimmed.slice(0, 96),
      tone: 'yellow',
    });
    setFeedback('');
    pushToast(
      'Feedback submitted',
      'Your feedback was captured in live activity.',
      'yellow'
    );
  }

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as ScanSnapshot[];
      if (Array.isArray(parsed)) setSavedScans(parsed);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    const ids = navItems.map((item) => item.id);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target?.id) {
          setActiveSection(visible[0].target.id as SectionId);
        }
      },
      {
        rootMargin: '-18% 0px -58% 0px',
        threshold: [0.2, 0.35, 0.5, 0.7],
      }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [navItems]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setWorkflowHealth((v) => {
        const next = Math.max(84, Math.min(95, v + (Math.random() > 0.5 ? 1 : -1)));
        setHealthSeries((series) => [...series.slice(1), next]);
        return next;
      });

      setRiskScore((v) => {
        const next = Math.max(49, Math.min(69, v + (Math.random() > 0.5 ? 1 : -1)));
        setRiskSeries((series) => [...series.slice(1), next]);
        return next;
      });

      setMonthlyLoss((v) => {
        const next = Math.max(
          2200,
          Math.min(3600, v + Math.round((Math.random() - 0.5) * 120))
        );
        setLossSeries((series) => [...series.slice(1), next]);
        return next;
      });

      setRecoveryOpportunity((v) =>
        Math.max(3000, Math.min(4700, v + Math.round((Math.random() - 0.5) * 160)))
      );
    }, 4500);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const tones: Tone[] = ['cyan', 'green', 'yellow', 'red'];
      const labels = [
        'Signal recalculated',
        'Operator view refreshed',
        'Booking sync active',
        'Throughput drift detected',
        'Context gap flagged',
        'Status overlap reduced',
      ];
      const details = [
        'Risk score adjusted after workflow drift.',
        'Summary cards refreshed with the latest scan state.',
        'New consultation entered the demand layer.',
        'Approval lane wait time ticked up in the current cycle.',
        'Handoff packet is missing execution notes.',
        'Manual progress updates consolidated into one surface.',
      ];

      addActivityItem({
        id: Date.now(),
        time: formatClock(new Date()),
        label: labels[Math.floor(Math.random() * labels.length)],
        detail: details[Math.floor(Math.random() * details.length)],
        tone: tones[Math.floor(Math.random() * tones.length)],
      });
    }, 7000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  useEffect(() => {
    if (!isScanning) return;

    if (scanProgress >= 100) {
      const team = Number(teamSize) || 18;
      const cost = parsePositiveNumber(costImpact, 2840);
      const risk = Math.max(
        50,
        Math.min(82, 44 + Math.floor(team / 2) + (workflowBottleneck ? 8 : 0))
      );
      const health = Math.max(82, Math.min(96, 96 - Math.floor(team / 5)));
      const loss = Math.max(2000, Math.round(cost));
      const recovery = Math.round(loss * 1.4);

      setWorkflowHealth(health);
      setRiskScore(risk);
      setMonthlyLoss(loss);
      setRecoveryOpportunity(recovery);
      setHealthSeries((series) => [...series.slice(1), health]);
      setRiskSeries((series) => [...series.slice(1), risk]);
      setLossSeries((series) => [...series.slice(1), loss]);
      setLastScanAt(new Date());
      setScanFlash(true);
      addTimeout(() => setScanFlash(false), 1100);
      setHealthDelta(`+${Math.max(1.2, Math.random() * 2.8 + 0.8).toFixed(1)}%`);
      setRiskDelta(`-${Math.max(0.8, Math.random() * 2.1 + 0.4).toFixed(1)}`);
      setLossDelta(`-$${Math.round(Math.random() * 220 + 90)}`);

      setSummary(`EXECUTIVE SUMMARY

${companyName || 'Unknown company'} is showing operational drag across its workflow layer.

PRIMARY SIGNALS
- Workflow bottleneck: ${workflowBottleneck || 'Approval and delivery handoff'}
- Team size: ${teamSize || 'Not provided'}
- Monthly operational cost impacted: ${formatCurrency(loss)}
- Repeated manual reporting is increasing duplicate effort
- Critical context is degrading between handoff stages
- Workflow risk is currently elevated to ${risk}/100

OPERATOR RECOMMENDATIONS
1. Reduce approval drag in the primary workflow lane
2. Standardize handoff payloads between teams
3. Collapse repeated reporting into one source of truth
4. Assign one clear owner to each transition stage
5. Review booking load and intake flow for execution pressure

OUTLOOK
If current friction is reduced, workflow health should move toward ${Math.min(
        98,
        health + 4
      )}% and recovery opportunity can rise toward ${formatCurrency(
        Math.round(recovery * 1.08)
      )}.`);

      addActivityItem({
        id: Date.now(),
        time: formatClock(new Date()),
        label: 'Workflow scan completed',
        detail: `${companyName || 'Unknown company'} refreshed to risk ${risk}/100 and health ${health}%.`,
        tone: 'green',
      });

      setIsScanning(false);
      setScanMode('complete');
      pushToast(
        'Scan completed',
        `${companyName || 'Company'} refreshed with updated workflow signals.`,
        'green'
      );

      addTimeout(() => {
        setScanMode('idle');
        setScanFlash(false);
      }, 1600);

      return;
    }

    const timer = window.setTimeout(() => {
      setScanProgress((p) => Math.min(100, p + 10));
    }, 120);

    return () => window.clearTimeout(timer);
  }, [
    addTimeout,
    companyName,
    costImpact,
    isScanning,
    pushToast,
    scanProgress,
    teamSize,
    workflowBottleneck,
  ]);

  const scanStatusText = useMemo(() => {
    if (isScanning) return `Scanning workflow layer... ${scanProgress}%`;
    if (!lastScanAt) return 'No scan yet';
    return `Last scan: ${formatShortDate(lastScanAt)}`;
  }, [isScanning, scanProgress, lastScanAt]);

  const progressBarWidth = isScanning ? scanProgress : lastScanAt ? 100 : 0;
  const isFeedbackDisabled = !feedback.trim();

  const demandSnapshot = useMemo(() => {
    const confirmed = bookings.filter((b) => b.status === 'confirmed').length;
    const pending = bookings.filter((b) => b.status === 'pending').length;
    const nextBooking = bookings[0];
    const inquiryMix = bookings.reduce<Record<string, number>>((acc, booking) => {
      acc[booking.type] = (acc[booking.type] || 0) + 1;
      return acc;
    }, {});
    const topInquiryType =
      Object.entries(inquiryMix).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      'Business Consultation';

    return {
      inboundThisWeek: bookings.length + 7,
      confirmedRate: Math.round((confirmed / Math.max(bookings.length, 1)) * 100),
      nextUp: nextBooking?.name || 'No upcoming booking',
      topInquiryType,
      avgDaysToCall: 2.1,
      pending,
    };
  }, [bookings]);

  return (
    <main className="min-h-screen bg-[#05070b] text-white">
      <div className="pointer-events-none fixed right-4 top-4 z-[80] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-2xl border bg-[#0a0d14]/95 p-4 shadow-2xl backdrop-blur ${
              toast.tone === 'green'
                ? 'border-green-400/20'
                : toast.tone === 'red'
                ? 'border-red-400/20'
                : toast.tone === 'yellow'
                ? 'border-yellow-400/20'
                : 'border-cyan-400/20'
            }`}
            role="status"
            aria-live="polite"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">{toast.title}</p>
                <p className="mt-1 text-sm text-gray-300">{toast.message}</p>
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="rounded-md px-2 py-1 text-xs text-gray-400 transition hover:bg-white/5 hover:text-white"
                aria-label={`Close ${toast.title} notification`}
              >
                Close
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex min-h-screen">
        <aside className="hidden w-[252px] shrink-0 border-r border-white/10 bg-[#070a10] md:block">
          <div className="sticky top-0 flex h-screen flex-col overflow-y-auto p-4">
            <div className="px-1 pt-1">
              <AppLink href={HOMEPAGE_URL} className="ghostlayerSidebarLogo">
                GHOSTLAYER
              </AppLink>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.02] p-3.5">
              <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500">
                Workspace
              </p>
              <p className="mt-2 text-[0.95rem] font-medium text-white">
                Operations Intelligence
              </p>
              <p className="mt-1 text-xs leading-6 text-gray-400">
                Command surface for workflow drag, risk, and execution clarity.
              </p>
            </div>

            <nav className="mt-5 space-y-1.5" aria-label="Dashboard sections">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`block w-full rounded-xl px-3 py-2.5 text-left text-[0.93rem] transition ${
                      isActive
                        ? 'border border-cyan-400/20 bg-cyan-400/10 text-white shadow-[0_0_0_1px_rgba(34,211,238,0.08)_inset]'
                        : 'text-gray-400 hover:bg-white/[0.04] hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <div className="mt-5 grid gap-3">
              <div
                className={`rounded-2xl border p-3 transition-all duration-500 ${
                  scanFlash
                    ? 'border-cyan-300/25 bg-cyan-400/[0.08]'
                    : 'border-white/10 bg-black/20'
                }`}
              >
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
                  Last scan
                </p>
                <p className="mt-2 text-sm text-white">
                  {lastScanAt ? formatClock(lastScanAt) : 'None yet'}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
                  Bookings sync
                </p>
                <p className="mt-2 text-[0.95rem] text-white">Demand layer active</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
                  Environment
                </p>
                <p className="mt-2 text-sm font-semibold signal-green">Live</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
                  Saved scans
                </p>
                <p className="mt-2 text-[0.95rem] text-white">{savedScans.length}</p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
                Signal rail
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="railDot railDotGreen" />
                <span className="railDot railDotCyan" />
                <span className="railDot railDotYellow" />
                <span className="railDot railDotRed" />
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.06] p-3.5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-300">
                Console state
              </p>
              <p className="mt-2 text-sm text-cyan-100">{scanStatusText}</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-cyan-300 transition-all duration-300"
                  style={{ width: `${progressBarWidth}%` }}
                />
              </div>
            </div>

            <div className="mt-auto pt-5">
              <button
                type="button"
                onClick={bookConsultation}
                className="w-full rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-3.5 py-2.5 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/14"
              >
                Book Consultation
              </button>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="sticky top-0 z-30 border-b border-white/8 bg-[#05070b]/92 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 md:px-8 lg:px-10">
              <div className="min-w-0">
                <div className="hidden md:flex md:items-center md:gap-3">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-cyan-300">
                    Dashboard
                  </p>
                  <span className="rounded-full border border-cyan-400/18 bg-cyan-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-200">
                    Demo Workspace
                  </span>
                  <AppLink
                    href="/privacy"
                    className="text-xs text-gray-400 transition hover:text-white"
                  >
                    Privacy
                  </AppLink>
                  <AppLink
                    href="/terms"
                    className="text-xs text-gray-400 transition hover:text-white"
                  >
                    Terms
                  </AppLink>
                </div>

                <h2 className="mt-1 text-lg font-semibold text-white sm:text-[1.15rem]">
                  Workflow Operations Console
                </h2>

                <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                  Public product demo for workflow visibility, drag detection, and operator
                  framing.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={startWorkflowScan}
                  disabled={isScanning}
                  className="rounded-xl border border-white/10 bg-white px-3.5 py-2 text-xs font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
                  aria-busy={isScanning}
                >
                  {isScanning ? `Scanning ${scanProgress}%` : 'Run Scan'}
                </button>

                <button
                  type="button"
                  onClick={exportDashboard}
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-white/[0.08] sm:text-sm"
                >
                  Export
                </button>
              </div>
            </div>

            <div className="flex gap-2.5 overflow-x-auto px-4 pb-3 md:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`whitespace-nowrap rounded-full border px-3.5 py-2 text-sm transition ${
                      isActive
                        ? 'border-cyan-400/35 bg-cyan-400/10 text-white'
                        : 'border-white/10 bg-white/[0.04] text-gray-300 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 md:px-8 lg:px-10 md:py-7">
            <section
              id="overview"
              className={`panelReveal overflow-hidden rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] shadow-[0_12px_40px_rgba(0,0,0,0.28)] ${
                scanFlash ? 'scanPulse' : ''
              } ${scanMode === 'running' ? 'scanModeShell' : ''} ${
                scanMode === 'complete' ? 'scanCompleteShell' : ''
              }`}
            >
              <div className="border-b border-white/8 px-5 py-5 sm:px-6 lg:px-6">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                  <div className="max-w-4xl">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-cyan-300">
                      Operations Overview
                    </p>

                    <h1 className="dashboardHeadlineGlow mt-3 text-3xl font-bold leading-tight sm:text-4xl lg:text-[2.55rem]">
                      Detect execution drag before it compounds across the workflow layer
                    </h1>

                    <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-300 sm:text-[15px]">
                      Ghostlayer surfaces throughput pressure, weak handoffs, repeated manual work,
                      and cost exposure in one operator-grade command view.
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-gray-300">
                        Live telemetry feel
                      </span>
                      <span className="rounded-full border border-cyan-400/18 bg-cyan-400/8 px-3 py-1 text-xs text-cyan-200">
                        Dynamic scan state
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-gray-300">
                        Operator-grade hierarchy
                      </span>
                    </div>
                  </div>

                  <div className="grid w-full grid-cols-2 gap-2.5 xl:max-w-[320px]">
                    <button
                      type="button"
                      onClick={saveCurrentScan}
                      className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-3.5 py-2.5 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/14"
                    >
                      Save Scan
                    </button>

                    <button
                      type="button"
                      onClick={downloadExecutiveSummary}
                      className="rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
                    >
                      Download
                    </button>

                    <button
                      type="button"
                      onClick={scheduleOperatorReview}
                      className="col-span-2 rounded-xl border border-white/10 bg-white/[0.035] px-3.5 py-2.5 text-sm font-semibold text-gray-100 transition hover:bg-white/[0.06]"
                    >
                      Schedule Operator Review
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3.5 px-5 py-5 sm:px-6 md:grid-cols-2 xl:grid-cols-4 lg:px-6">
                <div
                  className={`metricCard hoverCard metricInteractive ${scanFlash ? 'metricFlash' : ''}`}
                >
                  <p className="metricLabel">Workflow Health</p>
                  <p className="metricValue">
                    <AnimatedNumber value={workflowHealth} suffix="%" />
                  </p>
                  <p className="metricText">
                    Operational coherence across active workflow stages.
                  </p>
                  <div className="mt-3">
                    <span className="deltaPill deltaPillGreen">{healthDelta}</span>
                  </div>
                </div>

                <div
                  className={`metricCard metricBlue hoverCard metricInteractive ${scanFlash ? 'metricFlash' : ''}`}
                >
                  <p className="metricLabel text-cyan-200">Risk Score</p>
                  <p className="metricValue">
                    <AnimatedNumber value={riskScore} suffix="/100" />
                  </p>
                  <p className="metricText text-cyan-50/80">
                    Elevated score signals drag, delay, and ownership instability.
                  </p>
                  <div className="mt-3">
                    <span className="deltaPill deltaPillCyan">{riskDelta}</span>
                  </div>
                </div>

                <div
                  className={`metricCard metricRed hoverCard metricInteractive ${scanFlash ? 'metricFlash' : ''}`}
                >
                  <p className="metricLabel text-red-200">Est. Monthly Loss</p>
                  <p className="metricValue">
                    <AnimatedNumber value={monthlyLoss} prefix="$" suffix="/mo" />
                  </p>
                  <p className="metricText text-red-50/80">
                    Estimated productivity loss caused by workflow friction.
                  </p>
                  <div className="mt-3">
                    <span className="deltaPill deltaPillRed">{lossDelta}</span>
                  </div>
                </div>

                <div
                  className={`metricCard metricGreen hoverCard metricInteractive ${scanFlash ? 'metricFlash' : ''}`}
                >
                  <p className="metricLabel text-green-200">Recovery Opportunity</p>
                  <p className="metricValue">
                    <AnimatedNumber value={recoveryOpportunity} prefix="$" suffix="/mo" />
                  </p>
                  <p className="metricText text-green-50/80">
                    Recoverable value if bottlenecks and duplicate effort are reduced.
                  </p>
                </div>
              </div>
            </section>

            <section
              id="priority-issues"
              className="panelReveal mt-6 rounded-[28px] border border-white/8 bg-white/[0.022] p-5 shadow-[0_10px_34px_rgba(0,0,0,0.2)] sm:p-6"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-[1.55rem] font-semibold">Priority Issues</h3>
                  <p className="text-sm text-gray-400">
                    Highest-value areas to stabilize first based on current signal conditions.
                  </p>
                </div>

                <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.18em] text-gray-400">
                  Operator view
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3.5 xl:grid-cols-3">
                <div className="issueCard hoverCard">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-lg font-semibold">Execution delay risk</h4>
                    <span className="signal High">High</span>
                  </div>
                  <p className="mt-3.5 text-sm leading-7 text-gray-300">
                    Throughput pressure is building around approval bottlenecks, increasing wait
                    time before work advances cleanly.
                  </p>
                  <div className="actionCard">
                    <p className="actionLabel">Recommended action</p>
                    <p className="mt-2 text-sm text-gray-200">
                      Reduce approval drag and assign one accountable owner per stage.
                    </p>
                  </div>
                </div>

                <div className="issueCard hoverCard">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-lg font-semibold">Handoff context loss</h4>
                    <span className="signal Medium">Medium</span>
                  </div>
                  <p className="mt-3.5 text-sm leading-7 text-gray-300">
                    Critical workflow context is likely degrading between intake, execution, and
                    follow-through.
                  </p>
                  <div className="actionCard">
                    <p className="actionLabel">Recommended action</p>
                    <p className="mt-2 text-sm text-gray-200">
                      Standardize the handoff payload used by all teams.
                    </p>
                  </div>
                </div>

                <div className="issueCard hoverCard">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-lg font-semibold">Duplicate manual reporting</h4>
                    <span className="signal Medium">Medium</span>
                  </div>
                  <p className="mt-3.5 text-sm leading-7 text-gray-300">
                    The same progress signal is likely being captured in multiple places,
                    increasing drag.
                  </p>
                  <div className="actionCard">
                    <p className="actionLabel">Recommended action</p>
                    <p className="mt-2 text-sm text-gray-200">
                      Collapse status reporting into one primary operating view.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section id="health-chart" className="panelReveal mt-6">
              <TrendChart
                healthSeries={healthSeries}
                riskSeries={riskSeries}
                lossSeries={lossSeries}
                scanMode={scanMode}
              />
            </section>

            <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.08fr_0.92fr]">
              <div className="grid gap-6 self-start">
                <section id="intelligence-summary" className="cardShell hoverCard panelReveal">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-[1.55rem] font-semibold text-cyan-300">
                        Workflow Intelligence Summary
                      </h3>
                      <p className="mt-2 text-sm uppercase tracking-[0.2em] text-gray-500">
                        Operational signal
                      </p>
                    </div>

                    <span className="hidden rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.18em] text-gray-400 sm:block">
                      Premium view
                    </span>
                  </div>

                  <p className="mt-4 text-sm text-gray-500">
                    This summary isolates where drag is forming, where cost exposure is building,
                    and where operator attention should concentrate first.
                  </p>

                  <pre className="mt-4 min-h-[180px] overflow-x-auto whitespace-pre-wrap break-words rounded-2xl border border-white/8 bg-[#0a0d14] p-4 text-sm leading-7 text-gray-300">
                    {summary}
                  </pre>
                </section>

                <section id="bookings" className="cardShell hoverCard panelReveal">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="text-[1.55rem] font-semibold">Recent Bookings</h3>
                      <p className="mt-2 text-sm text-gray-400">
                        Consultation activity entering the Ghostlayer demand layer.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={refreshBookings}
                      className="rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
                    >
                      Refresh
                    </button>
                  </div>

                  <div className="mt-5 overflow-hidden rounded-2xl border border-white/8 bg-[#0a0d14]">
                    <div className="hidden lg:block">
                      <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
                        <thead>
                          <tr className="text-gray-400">
                            <th className="border-b border-white/8 px-3 py-3 font-medium">
                              Name
                            </th>
                            <th className="border-b border-white/8 px-3 py-3 font-medium">
                              Email
                            </th>
                            <th className="border-b border-white/8 px-3 py-3 font-medium">
                              Type
                            </th>
                            <th className="border-b border-white/8 px-3 py-3 font-medium">
                              Scheduled
                            </th>
                            <th className="border-b border-white/8 px-3 py-3 font-medium">
                              Source
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookings.map((booking) => (
                            <tr
                              key={booking.id}
                              className="text-gray-200 transition-colors duration-200 hover:bg-white/[0.03]"
                            >
                              <td className="border-b border-white/6 px-3 py-3.5">
                                {booking.name}
                              </td>
                              <td className="border-b border-white/6 px-3 py-3.5">
                                {booking.email}
                              </td>
                              <td className="border-b border-white/6 px-3 py-3.5">
                                {booking.type}
                              </td>
                              <td className="border-b border-white/6 px-3 py-3.5">
                                {booking.scheduled}
                              </td>
                              <td className="border-b border-white/6 px-3 py-3.5">
                                <span
                                  className={`rounded-full border px-3 py-1 text-xs ${
                                    booking.status === 'confirmed'
                                      ? 'border-cyan-400/15 bg-cyan-400/8 text-cyan-200'
                                      : 'border-yellow-400/15 bg-yellow-400/8 text-yellow-200'
                                  }`}
                                >
                                  <span className="inline-flex items-center gap-2">
                                    <span
                                      className={`bookingSignalDot ${
                                        booking.status === 'confirmed'
                                          ? 'bookingSignalDotCyan'
                                          : 'bookingSignalDotYellow'
                                      }`}
                                    />
                                    {booking.source}
                                  </span>
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="grid gap-3 p-3 lg:hidden">
                      {bookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="rounded-2xl border border-white/8 bg-white/[0.02] p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="font-medium text-white">{booking.name}</p>
                              <p className="mt-1 break-all text-sm text-gray-400">
                                {booking.email}
                              </p>
                            </div>
                            <span
                              className={`shrink-0 rounded-full border px-3 py-1 text-xs ${
                                booking.status === 'confirmed'
                                  ? 'border-cyan-400/15 bg-cyan-400/8 text-cyan-200'
                                  : 'border-yellow-400/15 bg-yellow-400/8 text-yellow-200'
                              }`}
                            >
                              <span className="inline-flex items-center gap-2">
                                <span
                                  className={`bookingSignalDot ${
                                    booking.status === 'confirmed'
                                      ? 'bookingSignalDotCyan'
                                      : 'bookingSignalDotYellow'
                                  }`}
                                />
                                {booking.source}
                              </span>
                            </span>
                          </div>

                          <div className="mt-3 grid gap-2 text-sm text-gray-300">
                            <p>Type: {booking.type}</p>
                            <p>Scheduled: {booking.scheduled}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    <div className="rounded-2xl border border-white/8 bg-[#0a0d14] p-4">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500">
                        Inbound this week
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-white">
                        {demandSnapshot.inboundThisWeek}
                      </p>
                      <p className="mt-2 text-sm text-gray-400">
                        Total consultation demand entering the current week.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/8 bg-[#0a0d14] p-4">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500">
                        Confirmed rate
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-cyan-200">
                        {demandSnapshot.confirmedRate}%
                      </p>
                      <p className="mt-2 text-sm text-gray-400">
                        Share of scheduled demand already locked in.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/8 bg-[#0a0d14] p-4">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500">
                        Top inquiry type
                      </p>
                      <p className="mt-2 text-lg font-semibold text-white">
                        {demandSnapshot.topInquiryType}
                      </p>
                      <p className="mt-2 text-sm text-gray-400">
                        Most common operator entry point right now.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/8 bg-[#0a0d14] p-4">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500">
                        Next up
                      </p>
                      <p className="mt-2 text-lg font-semibold text-white">
                        {demandSnapshot.nextUp}
                      </p>
                      <p className="mt-2 text-sm text-gray-400">
                        Closest demand event requiring operator attention.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/8 bg-[#0a0d14] p-4">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500">
                        Avg. days to call
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-white">
                        {demandSnapshot.avgDaysToCall}
                      </p>
                      <p className="mt-2 text-sm text-gray-400">
                        Typical lag from inquiry to scheduled conversation.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/8 bg-[#0a0d14] p-4">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500">
                        Pending demand
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-yellow-200">
                        {demandSnapshot.pending}
                      </p>
                      <p className="mt-2 text-sm text-gray-400">
                        Active opportunities not yet fully confirmed.
                      </p>
                    </div>
                  </div>
                </section>
              </div>

              <div className="grid gap-6 self-start">
                <section
                  id="run-scan"
                  className={`cardShell hoverCard panelReveal ${scanFlash ? 'scanPulse' : ''} ${
                    scanMode === 'running' ? 'scanModeShell' : ''
                  } ${scanMode === 'complete' ? 'scanCompleteShell' : ''}`}
                >
                  <h3 className="text-[1.55rem] font-semibold">Run a New Workflow Scan</h3>
                  <p className="mt-2 text-sm text-gray-400">
                    Enter business inputs to generate a fresh workflow intelligence summary and
                    cost signal.
                  </p>

                  <div className="mt-5 grid grid-cols-1 gap-3.5 md:grid-cols-2">
                    <input
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Company name"
                      className="scanInput"
                      aria-label="Company name"
                    />

                    <input
                      value={teamSize}
                      onChange={(e) => setTeamSize(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="Team size"
                      inputMode="numeric"
                      className="scanInput"
                      aria-label="Team size"
                    />

                    <input
                      value={workflowBottleneck}
                      onChange={(e) => setWorkflowBottleneck(e.target.value)}
                      placeholder="Primary workflow bottleneck"
                      className="scanInput"
                      aria-label="Primary workflow bottleneck"
                    />

                    <input
                      value={costImpact}
                      onChange={(e) => setCostImpact(e.target.value.replace(/[^0-9.]/g, ''))}
                      placeholder="Monthly operational cost impacted"
                      inputMode="decimal"
                      className="scanInput"
                      aria-label="Monthly operational cost impacted"
                    />
                  </div>

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={startWorkflowScan}
                      disabled={isScanning}
                      className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isScanning ? `Running ${scanProgress}%` : 'Run Workflow Scan'}
                    </button>

                    <button
                      type="button"
                      onClick={saveCurrentScan}
                      className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2.5 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/14"
                    >
                      Save Current Scan
                    </button>
                  </div>

                  <div className="mt-5 rounded-2xl border border-white/8 bg-[#0a0d14] p-4">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-medium text-white">Scan progress</p>
                      {isScanning ? (
                        <p className="text-sm text-cyan-200">{`${scanProgress}%`}</p>
                      ) : (
                        <p className="text-sm font-semibold signal-green">Ready</p>
                      )}
                    </div>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 transition-all duration-300"
                        style={{ width: `${isScanning ? scanProgress : 0}%` }}
                      />
                    </div>

                    <p className="mt-3 text-sm text-gray-400">
                      {isScanning
                        ? 'Refreshing live signal state across workflow, handoff, and reporting layers.'
                        : 'Ready for the next operator-grade scan.'}
                    </p>
                  </div>
                </section>

                <section id="delay-hotspots" className="cardShell hoverCard panelReveal">
                  <h3 className="sectionTitleCompact">Delay Hotspots</h3>

                  <div className="mt-4 space-y-3.5">
                    <div className="rounded-2xl border border-white/8 bg-[#0a0d14] p-4">
                      <div className="flex items-center justify-between gap-4">
                        <p className="font-medium">Approval queue</p>
                        <span className="signal High text-sm font-semibold">High</span>
                      </div>
                      <p className="mt-2 text-sm text-gray-400">
                        Multi-step review pressure is likely slowing work before throughput
                        resumes.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/8 bg-[#0a0d14] p-4">
                      <div className="flex items-center justify-between gap-4">
                        <p className="font-medium">Intake completion</p>
                        <span className="signal Medium text-sm font-semibold">Medium</span>
                      </div>
                      <p className="mt-2 text-sm text-gray-400">
                        Missing intake signal can create early delay and downstream rework.
                      </p>
                    </div>
                  </div>
                </section>

                <section id="broken-handoffs" className="cardShell hoverCard panelReveal">
                  <h3 className="sectionTitleCompact">Broken Handoffs</h3>

                  <div className="mt-4 space-y-3.5">
                    <div className="rounded-2xl border border-white/8 bg-[#0a0d14] p-4">
                      <div className="flex items-center justify-between gap-4">
                        <p className="font-medium">Sales to Delivery</p>
                        <span className="signal-red text-sm font-semibold">
                          Missing context
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-400">
                        Critical execution context is likely not arriving intact at the next stage.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/8 bg-[#0a0d14] p-4">
                      <div className="flex items-center justify-between gap-4">
                        <p className="font-medium">Support to Operations</p>
                        <span className="signal-yellow text-sm font-semibold">
                          Weak ownership
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-400">
                        Escalated work may be slowing because ownership boundaries are unclear.
                      </p>
                    </div>
                  </div>
                </section>

                <section id="duplicate-work" className="cardShell hoverCard panelReveal">
                  <h3 className="sectionTitleCompact">Duplicate Work</h3>

                  <div className="mt-4 space-y-3.5">
                    <div className="rounded-2xl border border-white/8 bg-[#0a0d14] p-4">
                      <div className="flex items-center justify-between gap-4">
                        <p className="font-medium">Reporting overlap</p>
                        <span className="signal-cyan text-sm font-semibold">
                          Repeated effort
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-400">
                        Similar progress signal is likely being captured across multiple surfaces.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/8 bg-[#0a0d14] p-4">
                      <div className="flex items-center justify-between gap-4">
                        <p className="font-medium">Manual progress updates</p>
                        <span className="signal-cyan text-sm font-semibold">
                          Duplicate work
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-400">
                        Teams may be re-entering the same status layer across tools and stages.
                      </p>
                    </div>
                  </div>
                </section>

                <section id="activity" className="cardShell hoverCard panelReveal">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-[1.55rem] font-semibold">Live Activity</h3>
                      <p className="mt-2 text-sm text-gray-400">
                        Console-native signal and action updates.
                      </p>
                    </div>

                    <span className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-green-200 signal-green">
                      Live
                    </span>
                  </div>

                  <div className="mt-5 space-y-3">
                    {activity.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-white/8 bg-[#0a0d14] p-4 transition-all duration-300 hover:border-white/14"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span
                              className={`activitySignalDot ${
                                item.tone === 'cyan'
                                  ? 'activitySignalDotCyan'
                                  : item.tone === 'green'
                                  ? 'activitySignalDotGreen'
                                  : item.tone === 'yellow'
                                  ? 'activitySignalDotYellow'
                                  : 'activitySignalDotRed'
                              }`}
                            />
                            <p className="font-medium text-white">{item.label}</p>
                          </div>

                          <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
                            {item.time}
                          </p>
                        </div>

                        <p className="mt-2 text-sm text-gray-400">{item.detail}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </section>

            <section id="feedback" className="cardShell hoverCard panelReveal mt-6">
              <h3 className="sectionTitleCompact">Help improve Ghostlayer</h3>
              <p className="mt-2 text-sm text-gray-400">
                What would make this console more useful in a real operating environment?
              </p>

              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                    e.preventDefault();
                    submitFeedback();
                  }
                }}
                placeholder="Tell us what would make this more useful..."
                className="mt-5 min-h-[132px] w-full rounded-2xl border border-white/10 bg-[#0a0d14] px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
                aria-label="Feedback input"
              />

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={submitFeedback}
                  disabled={isFeedbackDisabled}
                  className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Submit Feedback
                </button>
                <p className="text-xs text-gray-500">Press Ctrl/Cmd + Enter to submit.</p>
              </div>
            </section>

            <footer className="mt-8 border-t border-white/8 pt-8">
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0 max-w-md">
                  <AppLink href={HOMEPAGE_URL} className="ghostlayerFooterLogo">
                    GHOSTLAYER
                  </AppLink>
                  <p className="mt-3 text-sm leading-7 text-gray-400">
                    Business workflow intelligence for faster execution.
                  </p>
                </div>

                <div className="flex max-w-xl flex-wrap items-center gap-x-5 gap-y-3 text-sm text-gray-400 md:justify-end">
                  <button
                    type="button"
                    onClick={() => scrollToSection('overview')}
                    className="transition hover:text-white"
                  >
                    Overview
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection('bookings')}
                    className="transition hover:text-white"
                  >
                    Bookings
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection('run-scan')}
                    className="transition hover:text-white"
                  >
                    Run Scan
                  </button>
                  <AppLink href="/privacy" className="transition hover:text-white">
                    Privacy
                  </AppLink>
                  <AppLink href="/terms" className="transition hover:text-white">
                    Terms
                  </AppLink>
                </div>
              </div>

              <div className="mt-6 border-t border-white/8 pt-6 text-sm text-gray-500">
                © 2026 Ghostlayer. Business workflow intelligence for clearer operations and
                faster execution.
              </div>
            </footer>
          </div>
        </div>
      </div>

      <style>{`
        .panelReveal {
          animation: panelReveal 520ms ease both;
        }

        @keyframes panelReveal {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .cardShell {
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.02);
          padding: 20px;
          border-radius: 24px;
          box-shadow: 0 10px 34px rgba(0, 0, 0, 0.2);
          height: auto !important;
          min-height: 0 !important;
          align-self: start !important;
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

        .metricCard {
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: #0a0d14;
          padding: 18px;
          border-radius: 24px;
          transition:
            transform 220ms ease,
            border-color 220ms ease,
            box-shadow 220ms ease,
            background 220ms ease;
        }

        .metricInteractive:hover {
          transform: translateY(-3px);
          box-shadow:
            0 18px 38px rgba(0, 0, 0, 0.28),
            0 0 0 1px rgba(255, 255, 255, 0.03) inset,
            0 0 22px rgba(103, 232, 249, 0.08);
        }

        .metricFlash {
          box-shadow:
            0 0 0 1px rgba(103, 232, 249, 0.1) inset,
            0 0 22px rgba(103, 232, 249, 0.12);
        }

        .metricBlue {
          border-color: rgba(34, 211, 238, 0.2);
          background: rgba(34, 211, 238, 0.1);
        }

        .metricRed {
          border-color: rgba(239, 68, 68, 0.2);
          background: rgba(239, 68, 68, 0.1);
        }

        .metricGreen {
          border-color: rgba(34, 197, 94, 0.2);
          background: rgba(34, 197, 94, 0.1);
        }

        .metricLabel {
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgb(156 163 175);
        }

        .metricValue {
          margin-top: 12px;
          font-size: 2.15rem;
          font-weight: 700;
          line-height: 1.05;
          word-break: break-word;
        }

        .metricText {
          margin-top: 8px;
          font-size: 0.875rem;
          color: rgb(156 163 175);
        }

        .issueCard {
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: #0a0d14;
          padding: 18px;
          border-radius: 24px;
        }

        .actionCard {
          margin-top: 16px;
          border: 1px solid rgba(34, 211, 238, 0.15);
          background: rgba(34, 211, 238, 0.05);
          padding: 14px;
          border-radius: 18px;
        }

        .actionLabel {
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgb(103 232 249);
        }

        .scanInput {
          width: 100%;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: #0a0d14;
          padding: 12px 16px;
          color: white;
          outline: none;
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            transform 0.2s ease;
        }

        .scanInput:focus {
          border-color: rgba(34, 211, 238, 0.4);
          box-shadow: 0 0 0 4px rgba(34, 211, 238, 0.08);
          transform: translateY(-1px);
        }

        .trendChartShell {
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.02);
          padding: 20px;
          border-radius: 24px;
          box-shadow: 0 10px 34px rgba(0, 0, 0, 0.2);
          transition:
            transform 220ms ease,
            border-color 220ms ease,
            box-shadow 220ms ease,
            background 220ms ease;
        }

        .trendChartShell:hover {
          transform: translateY(-2px);
          border-color: rgba(255, 255, 255, 0.14);
          box-shadow:
            0 14px 38px rgba(0, 0, 0, 0.24),
            0 0 0 1px rgba(255, 255, 255, 0.02) inset,
            0 0 24px rgba(103, 232, 249, 0.08);
        }

        .trendChartShellRunning {
          box-shadow:
            0 0 0 1px rgba(103, 232, 249, 0.08) inset,
            0 0 28px rgba(103, 232, 249, 0.08),
            0 12px 40px rgba(0, 0, 0, 0.32);
        }

        .trendChartShellComplete {
          box-shadow:
            0 0 0 1px rgba(134, 239, 172, 0.1) inset,
            0 0 28px rgba(134, 239, 172, 0.08),
            0 12px 40px rgba(0, 0, 0, 0.32);
        }

        .chartPolyline {
          filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.06));
          transition: filter 220ms ease;
        }

        .trendChartShell:hover .chartPolylineGreen {
          filter: drop-shadow(0 0 12px rgba(134, 239, 172, 0.35));
        }

        .trendChartShell:hover .chartPolylineCyan {
          filter: drop-shadow(0 0 12px rgba(125, 211, 252, 0.35));
        }

        .trendChartShell:hover .chartPolylineRed {
          filter: drop-shadow(0 0 12px rgba(248, 113, 113, 0.35));
        }

        .ghostlayerSidebarLogo,
        .ghostlayerFooterLogo {
          display: inline-block !important;
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
          outline: none !important;
          text-decoration: none !important;
          filter: none !important;
          color: #ffffff !important;
          font-weight: 700 !important;
          letter-spacing: 0.1em !important;
          line-height: 1 !important;
          animation: dashboardLogoPulse 2.8s ease-in-out infinite !important;
          text-shadow:
            0 0 5px rgba(255, 255, 255, 0.72),
            0 0 12px rgba(255, 255, 255, 0.48),
            0 0 24px rgba(96, 165, 250, 0.32),
            0 0 40px rgba(59, 130, 246, 0.18) !important;
        }

        .ghostlayerSidebarLogo {
          width: 100%;
          text-align: left;
          font-size: 1.2rem !important;
        }

        .ghostlayerFooterLogo {
          font-size: 1.08rem !important;
        }

        @keyframes dashboardLogoPulse {
          0%,
          100% {
            opacity: 0.86;
            text-shadow:
              0 0 4px rgba(255, 255, 255, 0.5),
              0 0 10px rgba(255, 255, 255, 0.34),
              0 0 22px rgba(96, 165, 250, 0.2),
              0 0 34px rgba(59, 130, 246, 0.1);
          }
          50% {
            opacity: 1;
            text-shadow:
              0 0 8px rgba(255, 255, 255, 0.96),
              0 0 20px rgba(255, 255, 255, 0.74),
              0 0 34px rgba(96, 165, 250, 0.48),
              0 0 52px rgba(59, 130, 246, 0.28),
              0 0 74px rgba(147, 51, 234, 0.14);
          }
        }

        .dashboardHeadlineGlow {
          animation: headlinePulse 6s ease-in-out infinite;
        }

        @keyframes headlinePulse {
          0%,
          100% {
            text-shadow:
              0 0 5px rgba(255, 255, 255, 0.2),
              0 0 10px rgba(255, 255, 255, 0.08);
          }
          50% {
            text-shadow:
              0 0 16px rgba(255, 255, 255, 0.45),
              0 0 30px rgba(96, 165, 250, 0.26);
          }
        }

        .deltaPill {
          display: inline-flex;
          align-items: center;
          border-radius: 9999px;
          padding: 6px 10px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.04em;
        }

        .deltaPillGreen {
          border: 1px solid rgba(34, 197, 94, 0.2);
          background: rgba(34, 197, 94, 0.08);
          color: #86efac;
        }

        .deltaPillCyan {
          border: 1px solid rgba(34, 211, 238, 0.2);
          background: rgba(34, 211, 238, 0.08);
          color: #7dd3fc;
        }

        .deltaPillRed {
          border: 1px solid rgba(239, 68, 68, 0.2);
          background: rgba(239, 68, 68, 0.08);
          color: #fca5a5;
        }

        .railDot {
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 9999px;
          animation: railPulse 2s infinite ease-in-out;
        }

        .railDotGreen {
          background: #86efac;
          box-shadow: 0 0 12px rgba(134, 239, 172, 0.8);
        }

        .railDotCyan {
          background: #7dd3fc;
          box-shadow: 0 0 12px rgba(125, 211, 252, 0.8);
        }

        .railDotYellow {
          background: #fde68a;
          box-shadow: 0 0 12px rgba(253, 230, 138, 0.8);
        }

        .railDotRed {
          background: #f87171;
          box-shadow: 0 0 12px rgba(248, 113, 113, 0.8);
        }

        @keyframes railPulse {
          0%,
          100% {
            transform: scale(0.95);
            opacity: 0.82;
          }
          50% {
            transform: scale(1.15);
            opacity: 1;
          }
        }

        .scanModeShell {
          box-shadow:
            0 0 0 1px rgba(103, 232, 249, 0.08) inset,
            0 0 28px rgba(103, 232, 249, 0.08),
            0 12px 40px rgba(0, 0, 0, 0.32);
        }

        .scanCompleteShell {
          box-shadow:
            0 0 0 1px rgba(134, 239, 172, 0.1) inset,
            0 0 28px rgba(134, 239, 172, 0.08),
            0 12px 40px rgba(0, 0, 0, 0.32);
        }

        .signal {
          font-weight: 600;
        }

        .signal.High {
          color: #f87171;
          animation: pulseRed 2s infinite;
        }

        .signal.Medium {
          color: #fde68a;
          animation: pulseYellow 2s infinite;
        }

        .signal-red {
          color: #f87171;
          animation: pulseRed 2s infinite;
        }

        .signal-yellow {
          color: #fde68a;
          animation: pulseYellow 2s infinite;
        }

        .signal-cyan {
          color: #7dd3fc;
          animation: pulseCyan 2s infinite;
        }

        .signal-green {
          color: #86efac;
          animation: pulseGreen 2s infinite;
        }

        .scanPulse {
          animation: scanPulse 1.05s ease;
        }

        @keyframes scanPulse {
          0% {
            box-shadow: 0 0 0 rgba(103, 232, 249, 0);
          }
          50% {
            box-shadow:
              0 0 0 1px rgba(103, 232, 249, 0.16) inset,
              0 0 32px rgba(103, 232, 249, 0.12);
          }
          100% {
            box-shadow: 0 0 0 rgba(103, 232, 249, 0);
          }
        }

        @keyframes pulseRed {
          0%,
          100% {
            text-shadow: 0 0 4px rgba(239, 68, 68, 0.3);
          }
          50% {
            text-shadow:
              0 0 9px rgba(248, 113, 113, 0.9),
              0 0 20px rgba(239, 68, 68, 0.55);
          }
        }

        @keyframes pulseYellow {
          0%,
          100% {
            text-shadow: 0 0 4px rgba(245, 158, 11, 0.3);
          }
          50% {
            text-shadow:
              0 0 9px rgba(253, 224, 71, 0.9),
              0 0 20px rgba(245, 158, 11, 0.55);
          }
        }

        @keyframes pulseCyan {
          0%,
          100% {
            text-shadow: 0 0 4px rgba(34, 211, 238, 0.3);
          }
          50% {
            text-shadow:
              0 0 9px rgba(103, 232, 249, 0.9),
              0 0 20px rgba(34, 211, 238, 0.55);
          }
        }

        @keyframes pulseGreen {
          0%,
          100% {
            text-shadow: 0 0 4px rgba(34, 197, 94, 0.3);
          }
          50% {
            text-shadow:
              0 0 9px rgba(134, 239, 172, 0.95),
              0 0 20px rgba(34, 197, 94, 0.55);
          }
        }

        .legendPill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border-radius: 9999px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.03);
          padding: 6px 10px;
          color: rgb(209 213 219);
        }

        .legendDot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 9999px;
        }

        .legendDotPulse {
          animation: legendSignalPulse 1.9s ease-in-out infinite;
        }

        .activitySignalDot {
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 9999px;
          animation: legendSignalPulse 1.7s ease-in-out infinite;
        }

        .activitySignalDotCyan {
          background: #67e8f9;
          box-shadow:
            0 0 14px rgba(34, 211, 238, 0.88),
            0 0 26px rgba(34, 211, 238, 0.45);
        }

        .activitySignalDotGreen {
          background: #86efac;
          box-shadow:
            0 0 14px rgba(34, 197, 94, 0.88),
            0 0 26px rgba(34, 197, 94, 0.45);
        }

        .activitySignalDotYellow {
          background: #fde68a;
          box-shadow:
            0 0 14px rgba(245, 158, 11, 0.88),
            0 0 26px rgba(245, 158, 11, 0.45);
        }

        .activitySignalDotRed {
          background: #fca5a5;
          box-shadow:
            0 0 14px rgba(239, 68, 68, 0.88),
            0 0 26px rgba(239, 68, 68, 0.45);
        }

        .legendDotGreen {
          background: rgba(134, 239, 172, 0.95);
          box-shadow: 0 0 12px rgba(134, 239, 172, 0.5);
        }

        .legendDotCyan {
          background: rgba(125, 211, 252, 0.95);
          box-shadow: 0 0 12px rgba(125, 211, 252, 0.5);
        }

        .legendDotRed {
          background: rgba(248, 113, 113, 0.95);
          box-shadow: 0 0 12px rgba(248, 113, 113, 0.5);
        }

        .bookingSignalDot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          animation: legendSignalPulse 1.9s ease-in-out infinite;
        }

        .bookingSignalDotCyan {
          background: #7dd3fc;
          box-shadow: 0 0 12px rgba(125, 211, 252, 0.7);
        }

        .bookingSignalDotYellow {
          background: #fde68a;
          box-shadow: 0 0 12px rgba(253, 230, 138, 0.7);
        }

        @keyframes legendSignalPulse {
          0%,
          100% {
            transform: scale(0.94);
            opacity: 0.85;
            filter: brightness(1);
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
            filter: brightness(1.18);
          }
        }

        .sectionTitleCompact {
          font-size: 1.3rem;
          line-height: 1.2;
          font-weight: 600;
          letter-spacing: -0.01em;
        }

        @media (max-width: 1023px) {
          .cardShell {
            padding: 18px;
            border-radius: 22px;
          }

          .metricCard {
            padding: 16px;
            border-radius: 22px;
          }

          .issueCard {
            padding: 16px;
            border-radius: 22px;
          }
        }

        @media (max-width: 767px) {
          .sectionTitleCompact {
            font-size: 1.18rem;
          }

          .cardShell {
            padding: 16px;
            border-radius: 20px;
          }

          .metricCard {
            padding: 15px;
            border-radius: 20px;
          }

          .metricValue {
            font-size: 1.85rem;
          }

          .issueCard {
            padding: 15px;
            border-radius: 20px;
          }

          .trendChartShell {
            padding: 16px;
            border-radius: 20px;
          }
        }
      `}</style>
    </main>
  );
}
