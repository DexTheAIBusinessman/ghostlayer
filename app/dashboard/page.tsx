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

type IssueSeverity = 'High' | 'Medium' | 'Low';

type PriorityIssue = {
title: string;
severity: IssueSeverity;
impact: string;
action: string;
};

export default function DashboardPage() {
const [isMounted, setIsMounted] = useState(false);
const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);

const [companyName, setCompanyName] = useState('');
const [teamSize, setTeamSize] = useState('');
const [bottleneck, setBottleneck] = useState('');
const [saasSpend, setSaasSpend] = useState('');

const [analysis, setAnalysis] = useState(
'Run a workflow scan to generate an operational intelligence summary.'
);
const [loading, setLoading] = useState(false);
const [saveMessage, setSaveMessage] = useState('');

const [feedback, setFeedback] = useState('');
const [feedbackMessage, setFeedbackMessage] = useState('');
const [feedbackLoading, setFeedbackLoading] = useState(false);

const [bookings, setBookings] = useState<BookingRow[]>([]);
const [bookingsLoading, setBookingsLoading] = useState(true);
const [bookingsMessage, setBookingsMessage] = useState('');

const [lastScanAt, setLastScanAt] = useState<string | null>(null);
const [activeSection, setActiveSection] = useState('overview');

const currentYear = new Date().getFullYear();

useEffect(() => {
setIsMounted(true);
loadBookings();
}, []);

useEffect(() => {
const ids = [
'overview',
'priority-issues',
'bookings',
'run-scan',
'intelligence-summary',
'delay-hotspots',
'broken-handoffs',
'duplicate-work',
'feedback',
];

const observer = new IntersectionObserver(
(entries) => {
const visible = entries
.filter((entry) => entry.isIntersecting)
.sort((a, b) => b.intersectionRatio - a.intersectionRatio);

if (visible[0]?.target?.id) {
setActiveSection(visible[0].target.id);
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
}, [bookingsLoading, bookings.length, analysis]);

function scrollToSection(id: string) {
const el = document.getElementById(id);
if (el) {
el.scrollIntoView({ behavior: 'smooth', block: 'start' });
setActiveSection(id);
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

const companyLabel = companyName || 'Unknown Company';
const teamNumber = Number(teamSize) || 5;
const teamLabel = teamSize || 'Not provided';
const spendNumber = Number(saasSpend.replace(/[^0-9.]/g, '')) || 0;
const spendLabel = saasSpend || '0';
const bottleneckLabel = bottleneck || 'unclear workflow stages';

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

const summary = `EXECUTIVE SUMMARY

${companyLabel} is showing operational friction across its workflow layer. The strongest signal is concentrated around ${bottleneckLabel}, where execution velocity is likely being reduced and context continuity is likely degrading.

PRIMARY SIGNALS

- Delay pressure is building around ${bottleneckLabel}
- Handoffs are likely losing context between intake, execution, and follow-through
- Repeated manual status work is increasing duplicate effort
- Visibility is weakening as work moves across stages and owners

COST EXPOSURE

- Estimated monthly productivity loss: $${productivityLoss.toLocaleString()}
- Estimated monthly recovery opportunity: $${savingsOpportunity.toLocaleString()}
- Workflow health score: ${workflowHealth}%
- Workflow risk score: ${workflowRisk}/100

OPERATOR RECOMMENDATIONS

1. Assign one accountable owner to each major workflow stage
2. Remove one repeated manual update step this week
3. Standardize intake data before work is handed downstream
4. Reduce non-essential approval steps that slow execution
5. Review consultation demand patterns to identify recurring load points

SCAN INPUTS

Company: ${companyLabel}
Team Size: ${teamLabel}
Primary Bottleneck: ${bottleneckLabel}
Monthly Cost Impacted: $${spendLabel}`;

setAnalysis('Running workflow scan...');

setTimeout(() => {
setAnalysis(summary);
setLastScanAt(new Date().toISOString());
setLoading(false);
}, 1000);
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

const { error } = await supabase.from('feedback').insert([{ message: feedback }]);

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
const report = `GHOSTLAYER OPERATIONS DASHBOARD REPORT

Company: ${companyName || 'Unknown Company'}
Team Size: ${teamSize || 'Not provided'}
Primary Workflow Bottleneck: ${bottleneck || 'Not provided'}
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
if (value.toLowerCase().includes('30 minute')) return 'Business Consultation';
if (value.toLowerCase().includes('consult')) return 'Business Consultation';
return value;
}

function formatRelativeTime(value: string | null) {
if (!value) return 'Demo scan ready';
const then = new Date(value).getTime();
const now = Date.now();
const diff = Math.max(0, now - then);

const mins = Math.floor(diff / 60000);
const hours = Math.floor(diff / 3600000);
const days = Math.floor(diff / 86400000);

if (mins < 1) return 'Updated just now';
if (mins < 60) return `Updated ${mins}m ago`;
if (hours < 24) return `Updated ${hours}h ago`;
return `Updated ${days}d ago`;
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

const priorityIssues: PriorityIssue[] = useMemo(() => {
const label = bottleneck || 'approval bottlenecks';

return [
{
title: 'Execution delay risk',
severity: 'High',
impact: `Throughput pressure is building around ${label}, increasing wait time before work advances cleanly.`,
action: 'Reduce approval drag and assign one accountable owner per stage.',
},
{
title: 'Handoff context loss',
severity: 'Medium',
impact:
'Critical workflow context is likely degrading between intake, execution, and follow-through.',
action: 'Standardize the handoff payload used by all teams.',
},
{
title: 'Duplicate manual reporting',
severity: 'Medium',
impact:
'The same progress signal is likely being captured in multiple places, increasing drag.',
action: 'Collapse status reporting into one primary operating view.',
},
];
}, [bottleneck]);

const sideNav = [
{ label: 'Overview', id: 'overview' },
{ label: 'Priority Issues', id: 'priority-issues' },
{ label: 'Bookings', id: 'bookings' },
{ label: 'Run Scan', id: 'run-scan' },
{ label: 'Intelligence Summary', id: 'intelligence-summary' },
{ label: 'Delay Hotspots', id: 'delay-hotspots' },
{ label: 'Broken Handoffs', id: 'broken-handoffs' },
{ label: 'Duplicate Work', id: 'duplicate-work' },
];

function severityClasses(severity: IssueSeverity) {
if (severity === 'High') return 'border-red-500/30 bg-red-500/10 text-red-300';
if (severity === 'Medium') return 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300';
return 'border-cyan-400/30 bg-cyan-400/10 text-cyan-300';
}

return (
<main className="min-h-screen overflow-x-hidden bg-[#05070b] text-white">
<div className="flex min-h-screen">
<aside className="hidden w-[236px] shrink-0 border-r border-white/8 bg-[#070a10] md:block lg:w-[248px] xl:w-[260px]">
<div className="sticky top-0 flex h-screen flex-col overflow-y-auto px-4 py-4">
<div className="px-1 pt-1">
<Link href="/" className="ghostlayerSidebarLogo" aria-label="Ghostlayer home">
GHOSTLAYER
</Link>
</div>

<div className="mt-5 rounded-2xl border border-white/8 bg-white/[0.025] p-3.5">
<p className="text-[10px] uppercase tracking-[0.24em] text-gray-500">Workspace</p>
<p className="mt-2 text-sm font-medium text-white">Operations Intelligence</p>
<p className="mt-1 text-xs leading-6 text-gray-400">
Command surface for workflow drag, risk, and execution clarity.
</p>
</div>

<nav className="mt-5 space-y-1.5">
{sideNav.map((item) => {
const isActive = activeSection === item.id;
return (
<button
key={item.id}
type="button"
onClick={() => scrollToSection(item.id)}
className={`flex w-full items-center rounded-xl px-3 py-2.5 text-left text-[0.93rem] transition ${
isActive
? 'border border-cyan-400/20 bg-cyan-400/10 text-white shadow-[inset_0_0_0_1px_rgba(34,211,238,0.08)]'
: 'text-gray-400 hover:bg-white/[0.04] hover:text-white'
}`}
>
{item.label}
</button>
);
})}
</nav>

<div className="mt-5 grid gap-3">
<div className="rounded-2xl border border-white/8 bg-black/22 p-3">
<p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">Last scan</p>
<p className="mt-2 text-sm text-white">{formatRelativeTime(lastScanAt)}</p>
</div>
<div className="rounded-2xl border border-white/8 bg-black/22 p-3">
<p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">Bookings sync</p>
<p className="mt-2 text-sm text-white">
{bookingsLoading ? 'Refreshing demo feed...' : 'Demo feed active'}
</p>
</div>
<div className="rounded-2xl border border-white/8 bg-black/22 p-3">
<p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">Environment</p>
<p className="mt-2 text-sm text-emerald-300">Live</p>
</div>
</div>

<div className="mt-auto pt-5">
<button
onClick={async () => {
await trackCtaClick('dashboard');
setIsCalendlyOpen(true);
}}
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
<p className="text-[11px] uppercase tracking-[0.28em] text-cyan-300">Dashboard</p>
<span className="rounded-full border border-cyan-400/18 bg-cyan-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-200">
Demo Workspace
</span>
<Link href="/privacy" className="text-xs text-gray-400 transition hover:text-white">
Privacy
</Link>
<Link href="/terms" className="text-xs text-gray-400 transition hover:text-white">
Terms
</Link>
</div>

<h2 className="mt-1 text-lg font-semibold text-white sm:text-[1.15rem]">
Workflow Operations Console
</h2>

<p className="mt-1 text-xs text-gray-400 sm:text-sm">
Public product demo for workflow visibility, drag detection, and operator framing.
</p>
</div>

<div className="flex items-center gap-2">
<button
onClick={runScan}
disabled={loading}
className="rounded-xl border border-white/10 bg-white px-3.5 py-2 text-xs font-semibold text-black transition hover:opacity-90 disabled:opacity-50 sm:text-sm"
>
{loading ? 'Scanning...' : 'Run Scan'}
</button>
<button
onClick={downloadReport}
className="rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-white/[0.08] sm:text-sm"
>
Export
</button>
</div>
</div>

<div className="flex gap-2.5 overflow-x-auto px-4 pb-3 md:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
{sideNav.map((item) => {
const isActive = activeSection === item.id;

return (
<button
key={item.id}
type="button"
onClick={() => scrollToSection(item.id)}
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
className="overflow-hidden rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] shadow-[0_12px_40px_rgba(0,0,0,0.28)]"
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
</div>

<div className="grid w-full grid-cols-2 gap-2.5 xl:max-w-[320px]">
<button
onClick={saveScan}
className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-3.5 py-2.5 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/14"
>
Save Scan
</button>
<button
onClick={downloadReport}
className="rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
>
Download
</button>
<button
onClick={async () => {
await trackCtaClick('dashboard');
setIsCalendlyOpen(true);
}}
className="col-span-2 rounded-xl border border-white/10 bg-white/[0.035] px-3.5 py-2.5 text-sm font-semibold text-gray-100 transition hover:bg-white/[0.06]"
>
Schedule Operator Review
</button>
</div>
</div>

{saveMessage && <p className="mt-4 text-sm text-cyan-300">{saveMessage}</p>}
</div>

<div className="grid grid-cols-1 gap-3.5 px-5 py-5 sm:px-6 lg:grid-cols-4 lg:px-6">
<div className="rounded-3xl border border-white/8 bg-[#0a0d14] p-[18px]">
<p className="text-[11px] uppercase tracking-[0.22em] text-gray-400">Workflow Health</p>
<p className="mt-3 text-[2.15rem] font-bold">{metrics.workflowHealth}%</p>
<p className="mt-2 text-sm text-gray-400">
Operational coherence across active workflow stages.
</p>
</div>

<div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-[18px]">
<p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200">Risk Score</p>
<p className="mt-3 text-[2.15rem] font-bold">{metrics.workflowRisk}/100</p>
<p className="mt-2 text-sm text-cyan-50/80">
Elevated score signals drag, delay, and ownership instability.
</p>
</div>

<div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-[18px]">
<p className="text-[11px] uppercase tracking-[0.22em] text-red-200">Est. Monthly Loss</p>
<p className="mt-3 break-words text-[2.15rem] font-bold">
${metrics.productivityLoss.toLocaleString()}/mo
</p>
<p className="mt-2 text-sm text-red-50/80">
Estimated productivity loss caused by workflow friction.
</p>
</div>

<div className="rounded-3xl border border-green-500/20 bg-green-500/10 p-[18px]">
<p className="text-[11px] uppercase tracking-[0.22em] text-green-200">Recovery Opportunity</p>
<p className="mt-3 break-words text-[2.15rem] font-bold">
${metrics.savingsOpportunity.toLocaleString()}/mo
</p>
<p className="mt-2 text-sm text-green-50/80">
Recoverable value if bottlenecks and duplicate effort are reduced.
</p>
</div>
</div>
</section>

<section
id="priority-issues"
className="mt-6 rounded-[28px] border border-white/8 bg-white/[0.022] p-5 shadow-[0_10px_34px_rgba(0,0,0,0.2)] sm:p-6"
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
{priorityIssues.map((issue) => (
<div
key={issue.title}
className="rounded-3xl border border-white/8 bg-[#0a0d14] p-[18px]"
>
<div className="flex items-center justify-between gap-3">
<h4 className="text-lg font-semibold">{issue.title}</h4>
<span
className={`rounded-full border px-3 py-1 text-xs font-semibold ${severityClasses(
issue.severity
)}`}
>
{issue.severity}
</span>
</div>

<p className="mt-3.5 text-sm leading-7 text-gray-300">{issue.impact}</p>

<div className="mt-4 rounded-2xl border border-cyan-400/15 bg-cyan-400/5 p-3.5">
<p className="text-[10px] uppercase tracking-[0.22em] text-cyan-300">Recommended action</p>
<p className="mt-2 text-sm text-gray-200">{issue.action}</p>
</div>
</div>
))}
</div>
</section>

<section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.02fr_0.98fr]">
<div className="grid gap-6 self-start">
<section
id="bookings"
className="rounded-[28px] border border-white/8 bg-white/[0.022] p-5 shadow-[0_10px_34px_rgba(0,0,0,0.2)] sm:p-6"
>
<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
<div className="min-w-0">
<h3 className="text-[1.55rem] font-semibold">Recent Bookings</h3>
<p className="mt-2 text-sm text-gray-400">
Consultation activity entering the Ghostlayer demand layer.
</p>
</div>

<button
onClick={loadBookings}
className="rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
>
Refresh
</button>
</div>

{bookingsLoading ? (
<div className="mt-5 grid gap-3">
<div className="h-14 animate-pulse rounded-2xl bg-white/[0.04]" />
<div className="h-14 animate-pulse rounded-2xl bg-white/[0.04]" />
<div className="h-14 animate-pulse rounded-2xl bg-white/[0.04]" />
</div>
) : bookingsMessage ? (
<p className="mt-5 text-sm text-red-400">{bookingsMessage}</p>
) : bookings.length === 0 ? (
<p className="mt-5 text-sm text-gray-400">
No bookings found yet. Use the consultation flow to populate this panel.
</p>
) : (
<>
<div className="mt-5 hidden xl:block">
<div className="overflow-hidden rounded-2xl border border-white/8 bg-[#0a0d14]">
<table className="min-w-full border-separate border-spacing-0 text-left text-sm">
<thead>
<tr className="text-gray-400">
<th className="border-b border-white/8 px-3 py-3 font-medium">Name</th>
<th className="border-b border-white/8 px-3 py-3 font-medium">Email</th>
<th className="border-b border-white/8 px-3 py-3 font-medium">Type</th>
<th className="border-b border-white/8 px-3 py-3 font-medium">Scheduled</th>
<th className="border-b border-white/8 px-3 py-3 font-medium">Source</th>
</tr>
</thead>
<tbody>
{bookings.slice(0, 5).map((booking, index, arr) => (
<tr key={booking.id} className="text-gray-200">
<td className={`${index !== arr.length - 1 ? 'border-b border-white/6' : ''} px-3 py-3.5`}>
{booking.invitee_name || 'Unknown'}
</td>
<td className={`${index !== arr.length - 1 ? 'border-b border-white/6' : ''} px-3 py-3.5`}>
<span className="break-all">
{booking.invitee_email || 'No email'}
</span>
</td>
<td className={`${index !== arr.length - 1 ? 'border-b border-white/6' : ''} px-3 py-3.5`}>
{normalizeEventTypeName(booking.event_type_name)}
</td>
<td className={`${index !== arr.length - 1 ? 'border-b border-white/6' : ''} px-3 py-3.5`}>
{formatDateTime(booking.scheduled_at)}
</td>
<td className={`${index !== arr.length - 1 ? 'border-b border-white/6' : ''} px-3 py-3.5`}>
<span className="rounded-full border border-cyan-400/15 bg-cyan-400/8 px-3 py-1 text-xs text-cyan-200">
{booking.source || 'Not tracked'}
</span>
</td>
</tr>
))}
</tbody>
</table>
</div>
</div>

<div className="mt-5 grid gap-3.5 xl:hidden">
{bookings.slice(0, 5).map((booking) => (
<div
key={booking.id}
className="rounded-2xl border border-white/8 bg-[#0a0d14] p-4"
>
<div className="grid gap-2 text-sm">
<div>
<span className="text-gray-400">Name: </span>
<span>{booking.invitee_name || 'Unknown'}</span>
</div>
<div>
<span className="text-gray-400">Email: </span>
<span className="break-all">
{booking.invitee_email || 'No email'}
</span>
</div>
<div>
<span className="text-gray-400">Type: </span>
<span>{normalizeEventTypeName(booking.event_type_name)}</span>
</div>
<div>
<span className="text-gray-400">Scheduled: </span>
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
id="run-scan"
className="rounded-[28px] border border-white/8 bg-white/[0.022] p-5 shadow-[0_10px_34px_rgba(0,0,0,0.2)] sm:p-6"
>
<h3 className="text-[1.55rem] font-semibold">Run a New Workflow Scan</h3>
<p className="mt-2 text-sm text-gray-400">
Enter business inputs to generate a fresh workflow intelligence summary and cost signal.
</p>

<div className="mt-5 grid grid-cols-1 gap-3.5 md:grid-cols-2">
<input
value={companyName}
onChange={(e) => setCompanyName(e.target.value)}
placeholder="Company name"
className="w-full rounded-2xl border border-white/10 bg-[#0a0d14] px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
/>

<input
value={teamSize}
onChange={(e) => setTeamSize(e.target.value)}
placeholder="Team size"
className="w-full rounded-2xl border border-white/10 bg-[#0a0d14] px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
/>

<input
value={bottleneck}
onChange={(e) => setBottleneck(e.target.value)}
placeholder="Primary workflow bottleneck"
className="w-full rounded-2xl border border-white/10 bg-[#0a0d14] px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
/>

<input
value={saasSpend}
onChange={(e) => setSaasSpend(e.target.value)}
placeholder="Monthly operational cost impacted"
className="w-full rounded-2xl border border-white/10 bg-[#0a0d14] px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
/>
</div>

<div className="mt-5 flex flex-col gap-3 sm:flex-row">
<button
onClick={runScan}
disabled={loading}
className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:opacity-90 disabled:opacity-50"
>
{loading ? 'Running scan...' : 'Run Workflow Scan'}
</button>

<button
onClick={saveScan}
className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2.5 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/14"
>
Save Current Scan
</button>
</div>
</section>

<section
id="intelligence-summary"
className="rounded-[28px] border border-white/8 bg-white/[0.022] p-5 shadow-[0_10px_34px_rgba(0,0,0,0.2)] sm:p-6"
>
<div className="flex items-center justify-between gap-4">
<div>
<h3 className="text-[1.55rem] font-semibold text-cyan-300">Workflow Intelligence Summary</h3>
<p className="mt-2 text-sm uppercase tracking-[0.2em] text-gray-500">Operational signal</p>
</div>
<span className="hidden rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.18em] text-gray-400 sm:block">
Premium view
</span>
</div>

<p className="mt-4 text-sm text-gray-500">
This summary isolates where drag is forming, where cost exposure is building, and where operator attention should concentrate first.
</p>

<pre className="mt-4 min-h-[126px] overflow-x-auto whitespace-pre-wrap break-words rounded-2xl border border-white/8 bg-[#0a0d14] p-4 text-sm leading-7 text-gray-300">
{analysis}
</pre>
</section>

<section
id="feedback"
className="rounded-[28px] border border-white/8 bg-white/[0.022] p-5 shadow-[0_10px_34px_rgba(0,0,0,0.2)] sm:p-6"
>
<h3 className="text-xl font-semibold">Help improve Ghostlayer</h3>
<p className="mt-2 text-sm text-gray-400">
What would make this console more useful in a real operating environment?
</p>

<textarea
value={feedback}
onChange={(e) => setFeedback(e.target.value)}
placeholder="Tell us what would make this more useful..."
className="mt-5 min-h-[132px] w-full rounded-2xl border border-white/10 bg-[#0a0d14] px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
/>

<div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
<button
onClick={submitFeedback}
disabled={feedbackLoading}
className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:opacity-90 disabled:opacity-50"
>
{feedbackLoading ? 'Submitting...' : 'Submit Feedback'}
</button>

{feedbackMessage && <p className="text-sm text-cyan-300">{feedbackMessage}</p>}
</div>
</section>
</div>

<div className="grid gap-6 self-start">
<section
id="delay-hotspots"
className="rounded-[28px] border border-white/8 bg-white/[0.022] p-5 shadow-[0_10px_34px_rgba(0,0,0,0.2)] sm:p-6"
>
<h3 className="text-xl font-semibold">Delay Hotspots</h3>
<div className="mt-4 space-y-3.5">
<div className="rounded-2xl border border-white/8 bg-[#0a0d14] p-4">
<div className="flex items-center justify-between gap-4">
<p className="font-medium">Approval queue</p>
<span className="text-sm text-red-400">High</span>
</div>
<p className="mt-2 text-sm text-gray-400">
Multi-step review pressure is likely slowing work before throughput resumes.
</p>
</div>

<div className="rounded-2xl border border-white/8 bg-[#0a0d14] p-4">
<div className="flex items-center justify-between gap-4">
<p className="font-medium">Intake completion</p>
<span className="text-sm text-yellow-400">Medium</span>
</div>
<p className="mt-2 text-sm text-gray-400">
Missing intake signal can create early delay and downstream rework.
</p>
</div>
</div>
</section>

<section
id="broken-handoffs"
className="rounded-[28px] border border-white/8 bg-white/[0.022] p-5 shadow-[0_10px_34px_rgba(0,0,0,0.2)] sm:p-6"
>
<h3 className="text-xl font-semibold">Broken Handoffs</h3>
<div className="mt-4 space-y-3.5">
<div className="rounded-2xl border border-white/8 bg-[#0a0d14] p-4">
<div className="flex items-center justify-between gap-4">
<p className="font-medium">Sales → Delivery</p>
<span className="text-sm text-red-400">Missing context</span>
</div>
<p className="mt-2 text-sm text-gray-400">
Critical execution context is likely not arriving intact at the next stage.
</p>
</div>

<div className="rounded-2xl border border-white/8 bg-[#0a0d14] p-4">
<div className="flex items-center justify-between gap-4">
<p className="font-medium">Support → Operations</p>
<span className="text-sm text-yellow-400">Weak ownership</span>
</div>
<p className="mt-2 text-sm text-gray-400">
Escalated work may be slowing because ownership boundaries are unclear.
</p>
</div>
</div>
</section>

<section
id="duplicate-work"
className="rounded-[28px] border border-white/8 bg-white/[0.022] p-5 shadow-[0_10px_34px_rgba(0,0,0,0.2)] sm:p-6"
>
<h3 className="text-xl font-semibold">Duplicate Work</h3>
<div className="mt-4 space-y-3.5">
<div className="rounded-2xl border border-white/8 bg-[#0a0d14] p-4">
<div className="flex items-center justify-between gap-4">
<p className="font-medium">Reporting overlap</p>
<span className="text-sm text-cyan-300">Repeated effort</span>
</div>
<p className="mt-2 text-sm text-gray-400">
Similar progress signal is likely being captured across multiple surfaces.
</p>
</div>

<div className="rounded-2xl border border-white/8 bg-[#0a0d14] p-4">
<div className="flex items-center justify-between gap-4">
<p className="font-medium">Manual progress updates</p>
<span className="text-sm text-cyan-300">Duplicated work</span>
</div>
<p className="mt-2 text-sm text-gray-400">
Teams may be re-entering the same status layer across tools and stages.
</p>
</div>
</div>
</section>
</div>
</section>

<footer className="mt-8 border-t border-white/8 pt-8">
<div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
<div className="min-w-0 max-w-md">
<Link href="/" className="ghostlayerFooterLogo" aria-label="Ghostlayer home">
GHOSTLAYER
</Link>
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
<Link href="/privacy" className="transition hover:text-white">
Privacy
</Link>
<Link href="/terms" className="transition hover:text-white">
Terms
</Link>
</div>
</div>

<div className="mt-6 border-t border-white/8 pt-6 text-sm text-gray-500">
© {currentYear} Ghostlayer. Business workflow intelligence for clearer operations and faster execution.
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

<style jsx global>{`
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

.ghostlayerSidebarLogo::before,
.ghostlayerSidebarLogo::after,
.ghostlayerFooterLogo::before,
.ghostlayerFooterLogo::after {
content: none !important;
display: none !important;
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
animation: dashboardHeadlinePulse 6.2s ease-in-out infinite;
text-shadow:
0 0 4px rgba(255, 255, 255, 0.22),
0 0 10px rgba(255, 255, 255, 0.16),
0 0 18px rgba(96, 165, 250, 0.12),
0 0 28px rgba(59, 130, 246, 0.08);
}

@keyframes dashboardHeadlinePulse {
0%,
100% {
opacity: 0.97;
text-shadow:
0 0 3px rgba(255, 255, 255, 0.2),
0 0 8px rgba(255, 255, 255, 0.14),
0 0 14px rgba(96, 165, 250, 0.1),
0 0 22px rgba(59, 130, 246, 0.06);
}
50% {
opacity: 1;
text-shadow:
0 0 6px rgba(255, 255, 255, 0.44),
0 0 12px rgba(255, 255, 255, 0.28),
0 0 22px rgba(96, 165, 250, 0.18),
0 0 34px rgba(59, 130, 246, 0.1),
0 0 46px rgba(147, 51, 234, 0.06);
}
}
`}</style>
</main>
);
}
