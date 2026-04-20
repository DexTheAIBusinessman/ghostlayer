'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type SectionId =
| 'overview'
| 'priority-issues'
| 'intelligence-summary'
| 'run-scan'
| 'bookings'
| 'delay-hotspots'
| 'broken-handoffs'
| 'duplicate-work'
| 'activity-feed'
| 'feedback';

type ActivityItem = {
id: number;
time: string;
title: string;
detail: string;
tone: 'cyan' | 'red' | 'yellow' | 'green';
};

function AnimatedNumber({
value,
duration = 900,
prefix = '',
suffix = '',
}: {
value: number;
duration?: number;
prefix?: string;
suffix?: string;
}) {
const [display, setDisplay] = useState(0);

useEffect(() => {
let start = 0;
const startTime = performance.now();

const tick = (now: number) => {
const progress = Math.min((now - startTime) / duration, 1);
const eased = 1 - Math.pow(1 - progress, 3);
const next = Math.round(start + (value - start) * eased);
setDisplay(next);
if (progress < 1) requestAnimationFrame(tick);
};

requestAnimationFrame(tick);
}, [value, duration]);

return (
<span>
{prefix}
{display.toLocaleString()}
{suffix}
</span>
);
}

export default function DashboardPage() {
const [activeSection, setActiveSection] = useState<SectionId>('overview');
const [companyName, setCompanyName] = useState('');
const [teamSize, setTeamSize] = useState('');
const [workflowBottleneck, setWorkflowBottleneck] = useState('');
const [costImpact, setCostImpact] = useState('');
const [feedback, setFeedback] = useState('');
const [isScanning, setIsScanning] = useState(false);
const [scanProgress, setScanProgress] = useState(0);
const [summary, setSummary] = useState(
'Run a workflow scan to generate an operational intelligence summary.'
);
const [lastScanLabel, setLastScanLabel] = useState('Updated just now');
const [bookingSyncLabel, setBookingSyncLabel] = useState('Demo feed active');
const [activityIndex, setActivityIndex] = useState(0);

const navItems: { id: SectionId; label: string }[] = [
{ id: 'overview', label: 'Overview' },
{ id: 'priority-issues', label: 'Priority Issues' },
{ id: 'intelligence-summary', label: 'Intelligence Summary' },
{ id: 'run-scan', label: 'Run Scan' },
{ id: 'bookings', label: 'Bookings' },
{ id: 'delay-hotspots', label: 'Delay Hotspots' },
{ id: 'broken-handoffs', label: 'Broken Handoffs' },
{ id: 'duplicate-work', label: 'Duplicate Work' },
{ id: 'activity-feed', label: 'Activity Feed' },
];

const activityFeed: ActivityItem[] = [
{
id: 1,
time: '12s ago',
title: 'Approval queue threshold crossed',
detail: 'Ghostlayer detected review load increasing across the intake-to-approval lane.',
tone: 'red',
},
{
id: 2,
time: '41s ago',
title: 'Booking sync refreshed',
detail: 'Latest consultation event entered the dashboard demand layer.',
tone: 'green',
},
{
id: 3,
time: '1m ago',
title: 'Duplicate reporting signal raised',
detail: 'Status updates appear to be logged across multiple surfaces.',
tone: 'cyan',
},
{
id: 4,
time: '2m ago',
title: 'Handoff context degradation detected',
detail: 'Execution context appears incomplete between sales and delivery.',
tone: 'yellow',
},
];

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
}, []);

useEffect(() => {
const interval = setInterval(() => {
setActivityIndex((prev) => (prev + 1) % activityFeed.length);
}, 3200);

return () => clearInterval(interval);
}, [activityFeed.length]);

useEffect(() => {
if (!isScanning) return;

setScanProgress(0);
const startedAt = Date.now();

const interval = setInterval(() => {
const elapsed = Date.now() - startedAt;
const progress = Math.min(100, Math.round((elapsed / 2200) * 100));
setScanProgress(progress);

if (progress >= 100) {
clearInterval(interval);

const company = companyName || 'Unknown company';
const team = teamSize || 'Not provided';
const bottleneck = workflowBottleneck || 'approval and handoff drag';
const impact = costImpact || '$2,100/mo';

setSummary(`EXECUTIVE SUMMARY

${company} is showing operational drag across the workflow layer.

PRIMARY SIGNALS
- Workflow bottleneck: ${bottleneck}
- Team size: ${team}
- Monthly operational cost impacted: ${impact}
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

setLastScanLabel('Updated just now');
setBookingSyncLabel('Signal refresh complete');
setIsScanning(false);
}
}, 90);

return () => clearInterval(interval);
}, [isScanning, companyName, teamSize, workflowBottleneck, costImpact]);

useEffect(() => {
if (lastScanLabel !== 'Updated just now') return;
const timer = setTimeout(() => setLastScanLabel('Updated 1m ago'), 7000);
return () => clearTimeout(timer);
}, [lastScanLabel]);

function scrollToSection(id: SectionId) {
document.getElementById(id)?.scrollIntoView({
behavior: 'smooth',
block: 'start',
});
setActiveSection(id);
}

const metrics = useMemo(() => {
const team = Number(teamSize) || 8;
const spend = Number(costImpact.replace(/[^0-9]/g, '')) || 2100;
const risk = Math.min(88, 44 + Math.round(team * 0.9) + (workflowBottleneck ? 6 : 0));
const health = Math.max(61, 92 - Math.round(team * 0.7));
const recovery = Math.round(spend * 1.28);

return {
health,
risk,
loss: spend,
recovery,
};
}, [teamSize, costImpact, workflowBottleneck]);

const currentActivity = activityFeed[activityIndex];

return (
<main className="min-h-screen bg-[#05070b] text-white">
<div className="flex min-h-screen">
<aside className="hidden w-[252px] shrink-0 border-r border-white/10 bg-[#070a10] md:block">
<div className="sticky top-0 flex h-screen flex-col overflow-y-auto p-4">
<div className="px-1 pt-1">
<Link href="/" className="ghostlayerSidebarLogo">
GHOSTLAYER
</Link>
</div>

<div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.02] p-3.5">
<p className="text-[10px] uppercase tracking-[0.24em] text-gray-500">
Workspace
</p>
<p className="mt-2 text-sm font-medium text-white">
Operations Intelligence
</p>
<p className="mt-1 text-xs leading-6 text-gray-400">
Command surface for workflow drag, risk, and execution clarity.
</p>
</div>

<nav className="mt-5 space-y-1.5">
{navItems.map((item) => {
const isActive = activeSection === item.id;
return (
<button
key={item.id}
onClick={() => scrollToSection(item.id)}
className={`block w-full rounded-xl px-3 py-2.5 text-left text-[0.93rem] transition ${
isActive
? 'border border-cyan-400/20 bg-cyan-400/10 text-white shadow-[0_0_0_1px_rgba(34,211,238,0.08)]'
: 'text-gray-400 hover:bg-white/[0.04] hover:text-white'
}`}
>
{item.label}
</button>
);
})}
</nav>

<div className="mt-5 grid gap-3">
<div className="rounded-2xl border border-white/10 bg-black/20 p-3 transition duration-300 hover:border-white/15">
<p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
Last scan
</p>
<p className="mt-2 text-sm text-white">{lastScanLabel}</p>
</div>

<div className="rounded-2xl border border-white/10 bg-black/20 p-3 transition duration-300 hover:border-white/15">
<p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
Bookings sync
</p>
<p className="mt-2 text-sm text-white">{bookingSyncLabel}</p>
</div>

<div className="rounded-2xl border border-white/10 bg-black/20 p-3 transition duration-300 hover:border-white/15">
<p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
Environment
</p>
<p className="mt-2 text-sm font-semibold signal-green">Live</p>
</div>
</div>

<div className="mt-auto pt-5">
<button className="w-full rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-3.5 py-2.5 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/14 hover:shadow-[0_0_24px_rgba(34,211,238,0.12)]">
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
onClick={() => setIsScanning(true)}
disabled={isScanning}
className="rounded-xl border border-white/10 bg-white px-3.5 py-2 text-xs font-semibold text-black transition hover:opacity-90 disabled:opacity-50 sm:text-sm"
>
{isScanning ? 'Scanning...' : 'Run Scan'}
</button>

<button className="rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-white/[0.08] sm:text-sm">
Export
</button>
</div>
</div>
</div>

<div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 md:px-8 lg:px-10 md:py-7">
<section
id="overview"
className="revealSection overflow-hidden rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] shadow-[0_12px_40px_rgba(0,0,0,0.28)]"
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

{isScanning && (
<div className="mt-5 max-w-xl">
<div className="mb-2 flex items-center justify-between text-xs text-gray-400">
<span>Live scan in progress</span>
<span>{scanProgress}%</span>
</div>
<div className="h-2 overflow-hidden rounded-full bg-white/8">
<div
className="h-full rounded-full bg-cyan-300 transition-all duration-150"
style={{ width: `${scanProgress}%` }}
/>
</div>
</div>
)}
</div>

<div className="grid w-full grid-cols-2 gap-2.5 xl:max-w-[320px]">
<button className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-3.5 py-2.5 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/14 hover:shadow-[0_0_24px_rgba(34,211,238,0.1)]">
Save Scan
</button>

<button className="rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.08]">
Download
</button>

<button className="col-span-2 rounded-xl border border-white/10 bg-white/[0.035] px-3.5 py-2.5 text-sm font-semibold text-gray-100 transition hover:bg-white/[0.06]">
Schedule Operator Review
</button>
</div>
</div>
</div>

<div className="grid grid-cols-1 gap-3.5 px-5 py-5 sm:px-6 lg:grid-cols-4 lg:px-6">
<div className="metricCard hoverLift">
<p className="metricLabel">Workflow Health</p>
<p className="metricValue">
<AnimatedNumber value={metrics.health} suffix="%" />
</p>
<p className="metricText">Operational coherence across active workflow stages.</p>
</div>

<div className="metricCard metricBlue hoverLift">
<p className="metricLabel text-cyan-200">Risk Score</p>
<p className="metricValue">
<AnimatedNumber value={metrics.risk} suffix="/100" />
</p>
<p className="metricText text-cyan-50/80">
Elevated score signals drag, delay, and ownership instability.
</p>
</div>

<div className="metricCard metricRed hoverLift">
<p className="metricLabel text-red-200">Est. Monthly Loss</p>
<p className="metricValue">
<AnimatedNumber value={metrics.loss} prefix="$" suffix="/mo" />
</p>
<p className="metricText text-red-50/80">
Estimated productivity loss caused by workflow friction.
</p>
</div>

<div className="metricCard metricGreen hoverLift">
<p className="metricLabel text-green-200">Recovery Opportunity</p>
<p className="metricValue">
<AnimatedNumber value={metrics.recovery} prefix="$" suffix="/mo" />
</p>
<p className="metricText text-green-50/80">
Recoverable value if bottlenecks and duplicate effort are reduced.
</p>
</div>
</div>
</section>

<section
id="priority-issues"
className="revealSection mt-6 rounded-[28px] border border-white/8 bg-white/[0.022] p-5 shadow-[0_10px_34px_rgba(0,0,0,0.2)] sm:p-6"
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
<div className="issueCard hoverLift">
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

<div className="issueCard hoverLift">
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

<div className="issueCard hoverLift">
<div className="flex items-center justify-between gap-3">
<h4 className="text-lg font-semibold">Duplicate manual reporting</h4>
<span className="signal Medium">Medium</span>
</div>
<p className="mt-3.5 text-sm leading-7 text-gray-300">
The same progress signal is likely being captured in multiple places, increasing
drag.
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

<section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.04fr_0.96fr]">
<div className="grid gap-6 self-start">
<section id="intelligence-summary" className="cardShell revealSection hoverLift">
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

<pre className="mt-4 min-h-[126px] overflow-x-auto whitespace-pre-wrap break-words rounded-2xl border border-white/8 bg-[#0a0d14] p-4 text-sm leading-7 text-gray-300">
{summary}
</pre>
</section>

<section id="bookings" className="cardShell revealSection hoverLift">
<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
<div className="min-w-0">
<h3 className="text-[1.55rem] font-semibold">Recent Bookings</h3>
<p className="mt-2 text-sm text-gray-400">
Consultation activity entering the Ghostlayer demand layer.
</p>
</div>

<button className="rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-white/[0.08]">
Refresh
</button>
</div>

<div className="mt-5 overflow-hidden rounded-2xl border border-white/8 bg-[#0a0d14]">
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
<tr className="text-gray-200 transition hover:bg-white/[0.02]">
<td className="px-3 py-3.5">Dexter Test 5</td>
<td className="px-3 py-3.5">stevensdexter17@gmail.com</td>
<td className="px-3 py-3.5">Business Consultation</td>
<td className="px-3 py-3.5">5/22/2026, 1:00 PM</td>
<td className="px-3 py-3.5">
<span className="rounded-full border border-cyan-400/15 bg-cyan-400/8 px-3 py-1 text-xs text-cyan-200">
calendly
</span>
</td>
</tr>
</tbody>
</table>
</div>
</section>
</div>

<div className="grid gap-6 self-start">
<section id="run-scan" className="cardShell revealSection hoverLift">
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
/>

<input
value={teamSize}
onChange={(e) => setTeamSize(e.target.value)}
placeholder="Team size"
className="scanInput"
/>

<input
value={workflowBottleneck}
onChange={(e) => setWorkflowBottleneck(e.target.value)}
placeholder="Primary workflow bottleneck"
className="scanInput"
/>

<input
value={costImpact}
onChange={(e) => setCostImpact(e.target.value)}
placeholder="Monthly operational cost impacted"
className="scanInput"
/>
</div>

<div className="mt-5 flex flex-col gap-3 sm:flex-row">
<button
onClick={() => setIsScanning(true)}
disabled={isScanning}
className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:opacity-90 disabled:opacity-50"
>
{isScanning ? 'Running scan...' : 'Run Workflow Scan'}
</button>

<button className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2.5 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/14">
Save Current Scan
</button>
</div>
</section>

<section id="delay-hotspots" className="cardShell revealSection hoverLift">
<h3 className="text-xl font-semibold">Delay Hotspots</h3>

<div className="mt-4 space-y-3.5">
<div className="rounded-2xl border border-white/8 bg-[#0a0d14] p-4 transition hover:border-white/12">
<div className="flex items-center justify-between gap-4">
<p className="font-medium">Approval queue</p>
<span className="signal High text-sm font-semibold">High</span>
</div>
<p className="mt-2 text-sm text-gray-400">
Multi-step review pressure is likely slowing work before throughput resumes.
</p>
</div>

<div className="rounded-2xl border border-white/8 bg-[#0a0d14] p-4 transition hover:border-white/12">
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

<section id="broken-handoffs" className="cardShell revealSection hoverLift">
<h3 className="text-xl font-semibold">Broken Handoffs</h3>

<div className="mt-4 space-y-3.5">
<div className="rounded-2xl border border-white/8 bg-[#0a0d14] p-4 transition hover:border-white/12">
<div className="flex items-center justify-between gap-4">
<p className="font-medium">Sales → Delivery</p>
<span className="signal-red text-sm font-semibold">Missing context</span>
</div>
<p className="mt-2 text-sm text-gray-400">
Critical execution context is likely not arriving intact at the next stage.
</p>
</div>

<div className="rounded-2xl border border-white/8 bg-[#0a0d14] p-4 transition hover:border-white/12">
<div className="flex items-center justify-between gap-4">
<p className="font-medium">Support → Operations</p>
<span className="signal-yellow text-sm font-semibold">Weak ownership</span>
</div>
<p className="mt-2 text-sm text-gray-400">
Escalated work may be slowing because ownership boundaries are unclear.
</p>
</div>
</div>
</section>

<section id="duplicate-work" className="cardShell revealSection hoverLift">
<h3 className="text-xl font-semibold">Duplicate Work</h3>

<div className="mt-4 space-y-3.5">
<div className="rounded-2xl border border-white/8 bg-[#0a0d14] p-4 transition hover:border-white/12">
<div className="flex items-center justify-between gap-4">
<p className="font-medium">Reporting overlap</p>
<span className="signal-cyan text-sm font-semibold">Repeated effort</span>
</div>
<p className="mt-2 text-sm text-gray-400">
Similar progress signal is likely being captured across multiple surfaces.
</p>
</div>

<div className="rounded-2xl border border-white/8 bg-[#0a0d14] p-4 transition hover:border-white/12">
<div className="flex items-center justify-between gap-4">
<p className="font-medium">Manual progress updates</p>
<span className="signal-cyan text-sm font-semibold">Duplicate work</span>
</div>
<p className="mt-2 text-sm text-gray-400">
Teams may be re-entering the same status layer across tools and stages.
</p>
</div>
</div>
</section>
</div>
</section>

<section
id="activity-feed"
className="revealSection mt-6 rounded-[28px] border border-white/8 bg-white/[0.022] p-5 shadow-[0_10px_34px_rgba(0,0,0,0.2)] sm:p-6"
>
<div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
<div>
<h3 className="text-[1.55rem] font-semibold">Live Activity Feed</h3>
<p className="text-sm text-gray-400">
Rotating operational signals and live dashboard motion.
</p>
</div>

<div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.18em] text-gray-400">
Live stream
</div>
</div>

<div className="mt-5 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
<div className="rounded-3xl border border-white/8 bg-[#0a0d14] p-5">
<p className="text-[11px] uppercase tracking-[0.22em] text-gray-500">
Current event
</p>
<div className="mt-4">
<p className={`text-xs font-semibold ${currentActivity.tone === 'red' ? 'signal-red' : currentActivity.tone === 'yellow' ? 'signal-yellow' : currentActivity.tone === 'green' ? 'signal-green' : 'signal-cyan'}`}>
{currentActivity.time}
</p>
<h4 className="mt-2 text-lg font-semibold">{currentActivity.title}</h4>
<p className="mt-2 text-sm leading-7 text-gray-400">{currentActivity.detail}</p>
</div>
</div>

<div className="grid gap-3">
{activityFeed.map((item, index) => (
<div
key={item.id}
className={`rounded-2xl border bg-[#0a0d14] p-4 transition-all duration-500 ${
index === activityIndex
? 'border-cyan-400/20 bg-cyan-400/[0.04] shadow-[0_0_30px_rgba(34,211,238,0.06)]'
: 'border-white/8'
}`}
>
<div className="flex items-center justify-between gap-4">
<p className="font-medium text-white">{item.title}</p>
<span
className={`text-xs font-semibold ${
item.tone === 'red'
? 'signal-red'
: item.tone === 'yellow'
? 'signal-yellow'
: item.tone === 'green'
? 'signal-green'
: 'signal-cyan'
}`}
>
{item.time}
</span>
</div>
<p className="mt-2 text-sm text-gray-400">{item.detail}</p>
</div>
))}
</div>
</div>
</section>

<section id="feedback" className="mt-6 cardShell revealSection hoverLift">
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
<button className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:opacity-90">
Submit Feedback
</button>
</div>
</section>

<footer className="mt-8 border-t border-white/8 pt-8">
<div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
<div className="min-w-0 max-w-md">
<Link href="/" className="ghostlayerFooterLogo">
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
© 2026 Ghostlayer. Business workflow intelligence for clearer operations and faster execution.
</div>
</footer>
</div>
</div>
</div>

<style jsx global>{`
.revealSection {
animation: sectionReveal 0.6s ease both;
}

@keyframes sectionReveal {
0% {
opacity: 0;
transform: translateY(10px);
}
100% {
opacity: 1;
transform: translateY(0);
}
}

.hoverLift {
transition:
transform 0.22s ease,
box-shadow 0.22s ease,
border-color 0.22s ease;
}

.hoverLift:hover {
transform: translateY(-2px);
box-shadow: 0 16px 40px rgba(0, 0, 0, 0.24);
}

.cardShell {
border: 1px solid rgba(255, 255, 255, 0.08);
background: rgba(255, 255, 255, 0.022);
padding: 20px;
border-radius: 28px;
box-shadow: 0 10px 34px rgba(0, 0, 0, 0.2);
}

.metricCard {
border: 1px solid rgba(255, 255, 255, 0.08);
background: #0a0d14;
padding: 18px;
border-radius: 24px;
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
box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.08);
transform: translateY(-1px);
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
`}</style>
</main>
);
}
