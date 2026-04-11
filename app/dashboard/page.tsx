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
'Run a business workflow scan to generate a workflow intelligence summary.'
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

const logoGlow =
'animate-[dashboardGhostGlow_3s_ease-in-out_infinite] text-white [text-shadow:0_0_10px_rgba(255,255,255,0.96),0_0_22px_rgba(255,255,255,0.92),0_0_42px_rgba(96,165,250,0.9),0_0_72px_rgba(59,130,246,0.84),0_0_116px_rgba(147,51,234,0.76)]';

useEffect(() => {
setIsMounted(true);
loadBookings();
}, []);

useEffect(() => {
const ids = [
'overview',
'priority-issues',
'bookings',
'delay-hotspots',
'broken-handoffs',
'duplicate-work',
'intelligence-summary',
'run-scan',
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

${companyLabel} is showing workflow friction that may be slowing execution, increasing operational drag, and creating avoidable revenue leakage. The strongest risk signal is tied to ${bottleneckLabel}.

MAIN RISKS

- Delays are building around ${bottleneckLabel}
- Handoffs are likely losing context between teams
- Repeated manual updates are increasing duplicate work
- Visibility drops as work moves from intake to delivery

ESTIMATED COST IMPACT

- Estimated monthly productivity loss: $${productivityLoss.toLocaleString()}
- Estimated recovery opportunity: $${savingsOpportunity.toLocaleString()}
- Workflow health score: ${workflowHealth}%
- Workflow risk score: ${workflowRisk}/100

NEXT BEST ACTIONS

1. Assign one owner to each major workflow stage
2. Remove one repeated manual update step this week
3. Standardize intake information before handoff
4. Review approval steps that delay execution
5. Use booked consultation data to identify demand patterns

SCAN INPUTS

Company: ${companyLabel}
Team Size: ${teamLabel}
Biggest Bottleneck: ${bottleneckLabel}
Monthly Cost Impacted: $${spendLabel}`;

setAnalysis('Running business workflow scan...');

setTimeout(() => {
setAnalysis(summary);
setLastScanAt(new Date().toISOString());
setLoading(false);
}, 1200);
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
if (value.toLowerCase().includes('30 minute')) return 'Business Consultation';
if (value.toLowerCase().includes('consult')) return 'Business Consultation';
return value;
}

function formatRelativeTime(value: string | null) {
if (!value) return 'Not yet run';
const then = new Date(value).getTime();
const now = Date.now();
const diff = Math.max(0, now - then);

const mins = Math.floor(diff / 60000);
const hours = Math.floor(diff / 3600000);
const days = Math.floor(diff / 86400000);

if (mins < 1) return 'just now';
if (mins < 60) return `${mins}m ago`;
if (hours < 24) return `${hours}h ago`;
return `${days}d ago`;
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
impact: `Work is slowing around ${label}. Teams may be waiting too long to move work forward.`,
action: 'Assign one owner and reduce extra review steps.',
},
{
title: 'Handoff context loss',
severity: 'Medium',
impact:
'Important information may be dropping between intake, delivery, and follow-through.',
action: 'Standardize the handoff checklist used by all teams.',
},
{
title: 'Duplicate manual reporting',
severity: 'Medium',
impact:
'People may be updating the same status in multiple places, increasing drag.',
action: 'Consolidate progress tracking into one primary workflow.',
},
];
}, [bottleneck]);

const sideNav = [
{ label: 'Overview', id: 'overview' },
{ label: 'Priority Issues', id: 'priority-issues' },
{ label: 'Bookings', id: 'bookings' },
{ label: 'Delay Hotspots', id: 'delay-hotspots' },
{ label: 'Broken Handoffs', id: 'broken-handoffs' },
{ label: 'Duplicate Work', id: 'duplicate-work' },
{ label: 'Intelligence Summary', id: 'intelligence-summary' },
{ label: 'Run Scan', id: 'run-scan' },
];

function severityClasses(severity: IssueSeverity) {
if (severity === 'High') return 'border-red-500/30 bg-red-500/10 text-red-300';
if (severity === 'Medium')
return 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300';
return 'border-cyan-400/30 bg-cyan-400/10 text-cyan-300';
}

return (
<main className="min-h-screen overflow-x-hidden bg-[#05070b] text-white">
<div className="flex min-h-screen">
<aside className="hidden w-[236px] shrink-0 border-r border-white/10 bg-[#080b11] md:block lg:w-[248px] xl:w-[264px]">
<div className="sticky top-0 flex h-screen flex-col overflow-y-auto px-4 py-5">
<div className="flex items-center justify-between">
<Link
href="/"
className={`block w-full overflow-hidden text-ellipsis whitespace-nowrap text-[1.05rem] font-bold leading-none tracking-[0.1em] lg:text-[1.14rem] xl:text-[1.2rem] ${logoGlow}`}
>
GHOSTLAYER
</Link>
</div>

<div className="mt-6 rounded-2xl border border-white/8 bg-white/[0.03] p-3">
<p className="text-[10px] uppercase tracking-[0.26em] text-gray-500">
Workspace
</p>
<p className="mt-2 text-sm font-medium text-white">Operations Intelligence</p>
<p className="mt-1 text-xs leading-6 text-gray-400">
Premium command view for drag, risk, and execution flow.
</p>
</div>

<nav className="mt-6 space-y-1.5">
{sideNav.map((item) => {
const isActive = activeSection === item.id;
return (
<button
key={item.id}
type="button"
onClick={() => scrollToSection(item.id)}
className={`flex w-full items-center rounded-xl px-3 py-2.5 text-left text-[0.95rem] transition ${
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

<div className="mt-6 grid gap-3">
<div className="rounded-2xl border border-white/8 bg-black/30 p-3">
<p className="text-[10px] uppercase tracking-[0.22em] text-gray-500">
Last scan
</p>
<p className="mt-2 text-sm text-white">{formatRelativeTime(lastScanAt)}</p>
</div>
<div className="rounded-2xl border border-white/8 bg-black/30 p-3">
<p className="text-[10px] uppercase tracking-[0.22em] text-gray-500">
Bookings sync
</p>
<p className="mt-2 text-sm text-white">
{bookingsLoading ? 'Syncing...' : 'Active'}
</p>
</div>
<div className="rounded-2xl border border-white/8 bg-black/30 p-3">
<p className="text-[10px] uppercase tracking-[0.22em] text-gray-500">
Environment
</p>
<p className="mt-2 text-sm text-emerald-300">Live</p>
</div>
</div>

<div className="mt-auto pt-6">
<button
onClick={async () => {
await trackCtaClick('dashboard');
setIsCalendlyOpen(true);
}}
className="w-full rounded-2xl border border-cyan-400/25 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/15"
>
Book Consultation
</button>
</div>
</div>
</aside>

<div className="min-w-0 flex-1">
<div className="sticky top-0 z-30 border-b border-white/8 bg-[#05070b]/90 backdrop-blur-xl">
<div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 md:px-8 lg:px-10">
<div className="min-w-0">
<Link
href="/"
className={`block overflow-hidden text-ellipsis whitespace-nowrap text-[0.98rem] font-bold leading-none tracking-[0.1em] md:hidden ${logoGlow}`}
>
GHOSTLAYER
</Link>
<p className="hidden text-[11px] uppercase tracking-[0.28em] text-cyan-300 md:block">
Dashboard
</p>
<h2 className="mt-1 text-lg font-semibold text-white sm:text-xl">
Workflow Operations Console
</h2>
</div>

<div className="flex items-center gap-2 sm:gap-3">
<button
onClick={runScan}
disabled={loading}
className="rounded-xl border border-white/10 bg-white px-3 py-2 text-xs font-semibold text-black transition hover:opacity-90 disabled:opacity-50 sm:px-4 sm:text-sm"
>
{loading ? 'Scanning...' : 'Run Scan'}
</button>
<button
onClick={downloadReport}
className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/[0.08] sm:px-4 sm:text-sm"
>
Export
</button>
</div>
</div>

<div className="flex gap-3 overflow-x-auto px-4 pb-4 md:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
{sideNav.map((item) => {
const isActive = activeSection === item.id;

return (
<button
key={item.id}
type="button"
onClick={() => scrollToSection(item.id)}
className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm transition ${
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

<div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 md:px-8 lg:px-10 md:py-8">
<section
id="overview"
className="overflow-hidden rounded-[30px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] shadow-[0_12px_44px_rgba(0,0,0,0.3)]"
>
<div className="border-b border-white/8 px-5 py-5 sm:px-6 lg:px-7">
<div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
<div className="max-w-4xl">
<p className="text-[11px] uppercase tracking-[0.32em] text-cyan-300">
Operations Overview
</p>

<h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl lg:text-[2.7rem]">
Monitor workflow drag, handoff risk, and execution quality
</h1>

<p className="mt-4 max-w-3xl text-sm leading-7 text-gray-300 sm:text-base">
Ghostlayer surfaces approval delays, broken handoffs, repeated manual work,
and operational loss signals in one premium command view.
</p>
</div>

<div className="grid w-full grid-cols-2 gap-3 xl:max-w-md">
<button
onClick={saveScan}
className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/15"
>
Save Scan
</button>
<button
onClick={downloadReport}
className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
>
Download
</button>
<button
onClick={async () => {
await trackCtaClick('dashboard');
setIsCalendlyOpen(true);
}}
className="col-span-2 rounded-2xl border border-white/10 bg-white px-4 py-3 text-sm font-semibold text-black transition hover:opacity-90"
>
Book Business Consultation
</button>
</div>
</div>

{saveMessage && <p className="mt-4 text-sm text-cyan-300">{saveMessage}</p>}
</div>

<div className="grid grid-cols-1 gap-4 px-5 py-5 sm:px-6 lg:grid-cols-4 lg:px-7">
<div className="rounded-3xl border border-white/8 bg-[#0a0d14] p-5">
<p className="text-[11px] uppercase tracking-[0.22em] text-gray-400">
Workflow Health
</p>
<p className="mt-3 text-4xl font-bold">{metrics.workflowHealth}%</p>
<p className="mt-2 text-sm text-gray-400">
Operational visibility across active business workflows.
</p>
</div>

<div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-5">
<p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200">
Risk Score
</p>
<p className="mt-3 text-4xl font-bold">{metrics.workflowRisk}/100</p>
<p className="mt-2 text-sm text-cyan-50/80">
Higher score means more drag, delay, and ownership risk.
</p>
</div>

<div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-5">
<p className="text-[11px] uppercase tracking-[0.22em] text-red-200">
Est. Monthly Loss
</p>
<p className="mt-3 break-words text-4xl font-bold">
${metrics.productivityLoss.toLocaleString()}/mo
</p>
<p className="mt-2 text-sm text-red-50/80">
Productivity and execution cost caused by workflow friction.
</p>
</div>

<div className="rounded-3xl border border-green-500/20 bg-green-500/10 p-5">
<p className="text-[11px] uppercase tracking-[0.22em] text-green-200">
Recovery Opportunity
</p>
<p className="mt-3 break-words text-4xl font-bold">
${metrics.savingsOpportunity.toLocaleString()}/mo
</p>
<p className="mt-2 text-sm text-green-50/80">
Possible gain if delays and repeated work are reduced.
</p>
</div>
</div>
</section>

<section
id="priority-issues"
className="mt-8 rounded-[30px] border border-white/8 bg-white/[0.025] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.2)] sm:p-6"
>
<div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
<div>
<h3 className="text-2xl font-semibold">Priority Issues</h3>
<p className="text-sm text-gray-400">
Highest-value areas to address first based on current workflow inputs.
</p>
</div>
<div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.18em] text-gray-400">
Operator view
</div>
</div>

<div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
{priorityIssues.map((issue) => (
<div
key={issue.title}
className="rounded-3xl border border-white/8 bg-[#0a0d14] p-5"
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

<p className="mt-4 text-sm leading-7 text-gray-300">{issue.impact}</p>

<div className="mt-4 rounded-2xl border border-cyan-400/15 bg-cyan-400/5 p-4">
<p className="text-[10px] uppercase tracking-[0.22em] text-cyan-300">
Recommended action
</p>
<p className="mt-2 text-sm text-gray-200">{issue.action}</p>
</div>
</div>
))}
</div>
</section>

<section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
<div
id="bookings"
className="rounded-[30px] border border-white/8 bg-white/[0.025] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.2)] sm:p-6"
>
<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
<div className="min-w-0">
<h3 className="text-2xl font-semibold">Recent Bookings</h3>
<p className="mt-2 text-sm text-gray-400">
Consultations captured through the live Ghostlayer workflow.
</p>
</div>

<button
onClick={loadBookings}
className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
>
Refresh
</button>
</div>

{bookingsLoading ? (
<div className="mt-6 grid gap-3">
<div className="h-16 animate-pulse rounded-2xl bg-white/[0.04]" />
<div className="h-16 animate-pulse rounded-2xl bg-white/[0.04]" />
<div className="h-16 animate-pulse rounded-2xl bg-white/[0.04]" />
</div>
) : bookingsMessage ? (
<p className="mt-6 text-sm text-red-400">{bookingsMessage}</p>
) : bookings.length === 0 ? (
<p className="mt-6 text-sm text-gray-400">
No bookings found yet. Book a business consultation to populate this panel.
</p>
) : (
<>
<div className="mt-6 hidden overflow-x-auto xl:block">
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
<tr key={booking.id} className="text-gray-200">
<td className="border-b border-white/6 px-3 py-4">
{booking.invitee_name || 'Unknown'}
</td>
<td className="border-b border-white/6 px-3 py-4">
<span className="break-all">
{booking.invitee_email || 'No email'}
</span>
</td>
<td className="border-b border-white/6 px-3 py-4">
{normalizeEventTypeName(booking.event_type_name)}
</td>
<td className="border-b border-white/6 px-3 py-4">
{formatDateTime(booking.scheduled_at)}
</td>
<td className="border-b border-white/6 px-3 py-4">
<span className="rounded-full border border-cyan-400/15 bg-cyan-400/8 px-3 py-1 text-xs text-cyan-200">
{booking.source || 'Not tracked'}
</span>
</td>
</tr>
))}
</tbody>
</table>
</div>

<div className="mt-6 grid gap-4 xl:hidden">
{bookings.map((booking) => (
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
</div>

<div className="grid gap-6">
<section
id="delay-hotspots"
className="rounded-[30px] border border-white/8 bg-white/[0.025] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.2)] sm:p-6"
>
<h3 className="text-xl font-semibold">Delay Hotspots</h3>
<div className="mt-5 space-y-4">
<div className="rounded-2xl border border-white/8 bg-[#0a0d14] p-4">
<div className="flex items-center justify-between gap-4">
<p className="font-medium">Approval queue</p>
<span className="text-sm text-red-400">High</span>
</div>
<p className="mt-2 text-sm text-gray-400">
Multiple review steps are likely delaying work before it moves forward.
</p>
</div>

<div className="rounded-2xl border border-white/8 bg-[#0a0d14] p-4">
<div className="flex items-center justify-between gap-4">
<p className="font-medium">Intake completion</p>
<span className="text-sm text-yellow-400">Medium</span>
</div>
<p className="mt-2 text-sm text-gray-400">
Missing initial details can create early delays and downstream rework.
</p>
</div>
</div>
</section>

<section
id="broken-handoffs"
className="rounded-[30px] border border-white/8 bg-white/[0.025] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.2)] sm:p-6"
>
<h3 className="text-xl font-semibold">Broken Handoffs</h3>
<div className="mt-5 space-y-4">
<div className="rounded-2xl border border-white/8 bg-[#0a0d14] p-4">
<div className="flex items-center justify-between gap-4">
<p className="font-medium">Sales → Delivery</p>
<span className="text-sm text-red-400">Missing context</span>
</div>
<p className="mt-2 text-sm text-gray-400">
Critical information may not be passed cleanly into execution.
</p>
</div>

<div className="rounded-2xl border border-white/8 bg-[#0a0d14] p-4">
<div className="flex items-center justify-between gap-4">
<p className="font-medium">Support → Operations</p>
<span className="text-sm text-yellow-400">Weak ownership</span>
</div>
<p className="mt-2 text-sm text-gray-400">
Escalated requests can lose momentum when ownership is unclear.
</p>
</div>
</div>
</section>

<section
id="duplicate-work"
className="rounded-[30px] border border-white/8 bg-white/[0.025] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.2)] sm:p-6"
>
<h3 className="text-xl font-semibold">Duplicate Work</h3>
<div className="mt-5 space-y-4">
<div className="rounded-2xl border border-white/8 bg-[#0a0d14] p-4">
<div className="flex items-center justify-between gap-4">
<p className="font-medium">Reporting overlap</p>
<span className="text-sm text-cyan-300">Repeated effort</span>
</div>
<p className="mt-2 text-sm text-gray-400">
Similar updates may be getting entered in multiple systems.
</p>
</div>

<div className="rounded-2xl border border-white/8 bg-[#0a0d14] p-4">
<div className="flex items-center justify-between gap-4">
<p className="font-medium">Manual progress updates</p>
<span className="text-sm text-cyan-300">Duplicated work</span>
</div>
<p className="mt-2 text-sm text-gray-400">
Teams may be re-entering status data across tools and stages.
</p>
</div>
</div>
</section>
</div>
</section>

<section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[0.95fr_1.05fr]">
<section
id="intelligence-summary"
className="rounded-[30px] border border-white/8 bg-white/[0.025] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.2)] sm:p-6"
>
<div className="flex items-center justify-between gap-4">
<div>
<h3 className="text-2xl font-semibold text-cyan-300">
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
This summary helps identify workflow drag, cost exposure, and the clearest next actions.
</p>

<pre className="mt-4 overflow-x-auto whitespace-pre-wrap break-words rounded-2xl border border-white/8 bg-[#0a0d14] p-4 text-sm leading-7 text-gray-300">
{analysis}
</pre>
</section>

<section
id="run-scan"
className="rounded-[30px] border border-white/8 bg-white/[0.025] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.2)] sm:p-6"
>
<h3 className="text-2xl font-semibold">Run a New Workflow Scan</h3>
<p className="mt-2 text-sm text-gray-400">
Enter business details to generate a workflow intelligence summary and estimate drag.
</p>

<div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
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
placeholder="Biggest workflow bottleneck"
className="w-full rounded-2xl border border-white/10 bg-[#0a0d14] px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
/>

<input
value={saasSpend}
onChange={(e) => setSaasSpend(e.target.value)}
placeholder="Monthly operational cost impacted"
className="w-full rounded-2xl border border-white/10 bg-[#0a0d14] px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
/>
</div>

<div className="mt-6 flex flex-col gap-3 sm:flex-row">
<button
onClick={runScan}
disabled={loading}
className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90 disabled:opacity-50"
>
{loading ? 'Running scan...' : 'Run Business Scan'}
</button>

<button
onClick={saveScan}
className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/15"
>
Save Current Scan
</button>
</div>
</section>
</section>

<section className="mt-8 rounded-[30px] border border-white/8 bg-white/[0.025] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.2)] sm:p-6">
<h3 className="text-xl font-semibold">Help improve Ghostlayer</h3>
<p className="mt-2 text-sm text-gray-400">
What would make this dashboard more useful for your business?
</p>

<textarea
value={feedback}
onChange={(e) => setFeedback(e.target.value)}
placeholder="Tell us what would make this more useful..."
className="mt-6 min-h-[140px] w-full rounded-2xl border border-white/10 bg-[#0a0d14] px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
/>

<div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
<button
onClick={submitFeedback}
disabled={feedbackLoading}
className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90 disabled:opacity-50"
>
{feedbackLoading ? 'Submitting...' : 'Submit Feedback'}
</button>

{feedbackMessage && (
<p className="text-sm text-cyan-300">{feedbackMessage}</p>
)}
</div>
</section>

<footer className="mt-10 border-t border-white/8 pt-8">
<div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
<div className="min-w-0">
<Link
href="/"
className={`inline-block max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-[1.28rem] font-bold leading-none tracking-[0.12em] sm:text-[1.4rem] ${logoGlow}`}
>
GHOSTLAYER
</Link>
<p className="mt-3 text-sm text-gray-400">
Business workflow intelligence for faster execution.
</p>
</div>

<div className="flex flex-wrap gap-4 text-sm text-gray-400">
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
</div>
</div>

<div className="mt-6 border-t border-white/8 pt-6 text-sm text-gray-500">
© {currentYear} Ghostlayer. Business workflow intelligence for clearer operations
and faster execution.
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
@keyframes dashboardGhostGlow {
0%,
100% {
opacity: 0.9;
text-shadow:
0 0 7px rgba(255, 255, 255, 0.62),
0 0 16px rgba(255, 255, 255, 0.56),
0 0 30px rgba(96, 165, 250, 0.56),
0 0 50px rgba(59, 130, 246, 0.44),
0 0 76px rgba(147, 51, 234, 0.28);
filter: brightness(1);
}

50% {
opacity: 1;
text-shadow:
0 0 14px rgba(255, 255, 255, 1),
0 0 28px rgba(255, 255, 255, 0.98),
0 0 52px rgba(96, 165, 250, 1),
0 0 90px rgba(59, 130, 246, 0.98),
0 0 138px rgba(147, 51, 234, 0.94);
filter: brightness(1.22);
}
}
`}</style>
</main>
);
}
