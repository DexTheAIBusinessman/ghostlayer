'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { PopupModal } from 'react-calendly';
import { trackCtaClick } from '@/lib/trackCtaClick';

type Sparkle = {
left: string;
top: string;
size: number;
delay: string;
duration: string;
opacity: number;
};

export default function HomePage() {
const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);
const currentYear = new Date().getFullYear();

const logoPulseGlow =
'animate-[logoPulseGlow_3.2s_ease-in-out_infinite] [text-shadow:0_0_8px_rgba(255,255,255,0.95),0_0_18px_rgba(255,255,255,0.82),0_0_34px_rgba(96,165,250,0.62),0_0_56px_rgba(59,130,246,0.48)] text-white';

const sparkles = useMemo<Sparkle[]>(
() => [
{ left: '8%', top: '14%', size: 2, delay: '0s', duration: '5.8s', opacity: 0.3 },
{ left: '14%', top: '34%', size: 2, delay: '1.2s', duration: '6.4s', opacity: 0.42 },
{ left: '22%', top: '68%', size: 2, delay: '2.1s', duration: '5.7s', opacity: 0.28 },
{ left: '31%', top: '18%', size: 2, delay: '1.7s', duration: '6.1s', opacity: 0.36 },
{ left: '39%', top: '52%', size: 3, delay: '2.4s', duration: '6.8s', opacity: 0.44 },
{ left: '49%', top: '10%', size: 2, delay: '0.8s', duration: '5.9s', opacity: 0.26 },
{ left: '58%', top: '40%', size: 2, delay: '2.6s', duration: '6.2s', opacity: 0.35 },
{ left: '66%', top: '72%', size: 2, delay: '1.1s', duration: '5.6s', opacity: 0.3 },
{ left: '74%', top: '20%', size: 2, delay: '2.8s', duration: '6.5s', opacity: 0.4 },
{ left: '82%', top: '48%', size: 3, delay: '1.6s', duration: '6.1s', opacity: 0.42 },
{ left: '90%', top: '16%', size: 2, delay: '0.5s', duration: '5.5s', opacity: 0.3 },
{ left: '94%', top: '74%', size: 2, delay: '2s', duration: '6.3s', opacity: 0.34 },
],
[]
);

async function openCalendly(source: 'homepage' | 'dashboard' = 'homepage') {
await trackCtaClick(source);
setIsCalendlyOpen(true);
}

return (
<main className="relative min-h-screen overflow-x-hidden bg-[#05070b] text-white">
<div className="pointer-events-none absolute inset-0 overflow-hidden">
<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.08),transparent_28%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.07),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(6,182,212,0.04),transparent_24%)]" />
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

<header className="relative z-20 border-b border-white/8 bg-[#05070b]/72 backdrop-blur-xl">
<div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-5 sm:px-6 md:px-8 lg:px-10">
<Link
href="/"
className={`inline-block text-[1.06rem] font-bold tracking-[0.16em] sm:text-[1.18rem] ${logoPulseGlow}`}
>
GHOSTLAYER
</Link>

<nav className="hidden items-center gap-7 text-sm text-gray-300 lg:flex">
<a href="#how-it-works" className="transition hover:text-white">
How It Works
</a>
<a href="#who-it-helps" className="transition hover:text-white">
Who It Helps
</a>
<a href="#results" className="transition hover:text-white">
Results
</a>
<a href="#next-step" className="transition hover:text-white">
Next Step
</a>
<Link href="/privacy" className="transition hover:text-white">
Privacy
</Link>
<Link href="/terms" className="transition hover:text-white">
Terms
</Link>
<Link
href="/dashboard"
className="rounded-full border border-cyan-400/18 bg-cyan-400/8 px-4 py-2 font-semibold text-cyan-200 transition hover:bg-cyan-400/12 hover:text-white"
>
Live Dashboard
</Link>
</nav>

<Link
href="/dashboard"
className="rounded-xl border border-cyan-400/20 bg-cyan-400/8 px-3 py-2 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-400/12 hover:text-white lg:hidden"
>
Dashboard
</Link>
</div>
</header>

<section className="relative z-10 px-4 pb-16 pt-12 sm:px-6 sm:pb-20 md:px-8 md:pt-14 lg:px-10 lg:pb-24 xl:px-12">
<div className="mx-auto max-w-7xl">
<div className="grid items-center gap-10 md:gap-12 lg:gap-14 xl:grid-cols-[minmax(0,1.02fr)_minmax(360px,430px)] xl:gap-16">
<div className="max-w-4xl md:max-w-3xl lg:max-w-4xl">
<p className="text-[11px] uppercase tracking-[0.34em] text-cyan-300 sm:text-xs">
Business Workflow Intelligence
</p>

<h1 className="hero-glow mt-5 max-w-4xl text-4xl font-bold leading-[1.04] text-white sm:text-5xl md:max-w-3xl md:text-[3.15rem] md:leading-[1.02] lg:max-w-4xl lg:text-6xl xl:text-[4.15rem]">
Find Workflow Friction
<br />
Before It Slows
<br />
Growth, Burns Time,
<br />
and Costs Revenue
</h1>

<p className="mt-6 max-w-3xl text-base leading-8 text-gray-300 sm:text-lg">
Ghostlayer surfaces broken handoffs, approval bottlenecks, repeated manual work,
and hidden operational drag so businesses can move faster with better control.
</p>

<div className="mt-8 flex flex-col gap-4 sm:flex-row">
<button
onClick={() => openCalendly('homepage')}
className="rounded-2xl bg-white px-8 py-4 text-base font-semibold text-black transition hover:opacity-90"
>
Book Business Consultation
</button>

<Link
href="/dashboard"
className="rounded-2xl border border-white/12 bg-white/[0.04] px-8 py-4 text-center text-base font-semibold text-white transition hover:bg-white/[0.08]"
>
Explore Live Dashboard
</Link>
</div>

<div className="mt-8 flex flex-col gap-3 text-sm text-gray-400 sm:flex-row sm:flex-wrap sm:gap-6">
<span>Reduce operational drag</span>
<span>Improve accountability</span>
<span>Recover execution time</span>
</div>
</div>

<div className="w-full md:max-w-[620px] md:justify-self-center xl:max-w-none xl:justify-self-auto">
<div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.34)] backdrop-blur-xl sm:p-5 md:p-6">
<div className="flex items-center justify-between gap-3 rounded-2xl border border-white/8 bg-black/20 px-4 py-3">
<div>
<p className="text-[10px] uppercase tracking-[0.24em] text-gray-400">
Workflow Signal
</p>
<p className="mt-1 text-sm font-medium text-white">
Active operational scan
</p>
</div>
<span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-cyan-200">
Live
</span>
</div>

<div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
<div className="rounded-3xl border border-cyan-400/14 bg-cyan-400/7 p-5">
<p className="text-[11px] uppercase tracking-[0.24em] text-cyan-200">
Workflow Risk
</p>
<p className="mt-3 text-[2.15rem] font-bold leading-none text-white sm:text-[2.35rem]">
68/100
</p>
<p className="mt-3 text-sm leading-7 text-gray-200">
Elevated due to repeated approvals, weak ownership, and broken handoffs.
</p>
</div>

<div className="rounded-3xl border border-red-500/14 bg-red-500/9 p-5">
<p className="text-[11px] uppercase tracking-[0.24em] text-red-200">
Estimated Loss
</p>
<p className="mt-3 flex items-baseline whitespace-nowrap text-white">
<span className="text-[1.95rem] font-bold leading-none sm:text-[2.2rem]">
$3,247
</span>
<span className="ml-1 text-[1.02rem] font-bold leading-none sm:text-[1.12rem]">
/mo
</span>
</p>
<p className="mt-3 text-sm leading-7 text-gray-200">
Estimated productivity drag from process friction and missed follow-through.
</p>
</div>
</div>

<div className="mt-4 rounded-3xl border border-white/8 bg-black/22 p-5">
<div className="flex items-center justify-between gap-3">
<p className="text-[11px] uppercase tracking-[0.24em] text-gray-300">
What Ghostlayer Finds
</p>
<span className="text-[10px] uppercase tracking-[0.18em] text-gray-500">
Proof Panel
</span>
</div>

<ul className="mt-4 space-y-4 text-sm leading-7 text-gray-200 sm:text-[15px]">
<li>• Approval delays that stall delivery</li>
<li>• Handoffs losing client or operational context</li>
<li>• Duplicate reporting and repeated manual updates</li>
<li>• Missed revenue caused by broken execution flow</li>
</ul>
</div>
</div>
</div>
</div>
</div>
</section>

<section id="how-it-works" className="relative z-10 px-4 py-8 sm:px-6 md:px-8 lg:px-10 xl:px-12">
<div className="mx-auto max-w-7xl rounded-[32px] border border-white/8 bg-white/[0.03] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.18)] backdrop-blur-sm sm:p-8">
<div className="max-w-3xl">
<p className="text-[11px] uppercase tracking-[0.34em] text-cyan-300 sm:text-xs">
How It Works
</p>
<h2 className="mt-4 text-3xl font-bold sm:text-4xl">
A cleaner way to see what is slowing execution
</h2>
<p className="mt-4 text-base leading-8 text-gray-300">
Ghostlayer helps you spot where execution is slowing down, where handoffs are breaking,
and where repeated manual work is costing time and revenue.
</p>
</div>

<div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
<div className="rounded-3xl border border-white/8 bg-[#0a0d14] p-6">
<p className="text-sm uppercase tracking-[0.22em] text-cyan-300">1. Capture</p>
<h3 className="mt-3 text-xl font-semibold">Bring consultations into one view</h3>
<p className="mt-3 text-sm leading-7 text-gray-400">
Connect booked consultations to a workflow view so you can see operational demand clearly.
</p>
</div>

<div className="rounded-3xl border border-white/8 bg-[#0a0d14] p-6">
<p className="text-sm uppercase tracking-[0.22em] text-cyan-300">2. Diagnose</p>
<h3 className="mt-3 text-xl font-semibold">Identify bottlenecks and drag</h3>
<p className="mt-3 text-sm leading-7 text-gray-400">
Surface approval delays, broken handoffs, repeated updates, and execution friction.
</p>
</div>

<div className="rounded-3xl border border-white/8 bg-[#0a0d14] p-6">
<p className="text-sm uppercase tracking-[0.22em] text-cyan-300">3. Improve</p>
<h3 className="mt-3 text-xl font-semibold">Turn visibility into action</h3>
<p className="mt-3 text-sm leading-7 text-gray-400">
Prioritize what to fix first, tighten operations, and reduce waste without guesswork.
</p>
</div>
</div>
</div>
</section>

<section id="who-it-helps" className="relative z-10 px-4 py-8 sm:px-6 md:px-8 lg:px-10 xl:px-12">
<div className="mx-auto max-w-7xl rounded-[32px] border border-white/8 bg-white/[0.03] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.18)] backdrop-blur-sm sm:p-8">
<div className="max-w-3xl">
<p className="text-[11px] uppercase tracking-[0.34em] text-cyan-300 sm:text-xs">
Who It Helps
</p>
<h2 className="mt-4 text-3xl font-bold sm:text-4xl">
Built for businesses that need cleaner execution
</h2>
<p className="mt-4 text-base leading-8 text-gray-300">
Best for service businesses, agencies, consultants, operators, and growing teams
that need better handoffs, less manual waste, and stronger workflow visibility.
</p>
</div>

<div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
<div className="rounded-3xl border border-white/8 bg-[#0a0d14] p-6">
<h3 className="text-xl font-semibold">Agencies</h3>
<p className="mt-3 text-sm leading-7 text-gray-400">
Reduce handoff chaos between sales, onboarding, delivery, and support.
</p>
</div>
<div className="rounded-3xl border border-white/8 bg-[#0a0d14] p-6">
<h3 className="text-xl font-semibold">Consulting Firms</h3>
<p className="mt-3 text-sm leading-7 text-gray-400">
Improve intake quality, client follow-through, and internal execution.
</p>
</div>
<div className="rounded-3xl border border-white/8 bg-[#0a0d14] p-6">
<h3 className="text-xl font-semibold">Service Businesses</h3>
<p className="mt-3 text-sm leading-7 text-gray-400">
Spot where delivery slows down and where repeated admin work hurts margin.
</p>
</div>
<div className="rounded-3xl border border-white/8 bg-[#0a0d14] p-6">
<h3 className="text-xl font-semibold">Operations Leaders</h3>
<p className="mt-3 text-sm leading-7 text-gray-400">
Get a simple operational signal without clutter or guesswork.
</p>
</div>
</div>
</div>
</section>

<section id="results" className="relative z-10 px-4 py-8 sm:px-6 md:px-8 lg:px-10 xl:px-12">
<div className="mx-auto max-w-7xl rounded-[32px] border border-white/8 bg-white/[0.03] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.18)] backdrop-blur-sm sm:p-8">
<div className="max-w-3xl">
<p className="text-[11px] uppercase tracking-[0.34em] text-cyan-300 sm:text-xs">
Results
</p>
<h2 className="mt-4 text-3xl font-bold sm:text-4xl">
See the cost of friction before it compounds
</h2>
</div>

<div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
<div className="rounded-3xl border border-white/8 bg-[#0a0d14] p-6">
<p className="text-sm uppercase tracking-[0.2em] text-gray-300">Workflow Health</p>
<p className="mt-3 text-4xl font-bold">82%</p>
<p className="mt-3 text-sm text-gray-400">
Visibility and operational consistency across core workflows.
</p>
</div>

<div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6">
<p className="text-sm uppercase tracking-[0.2em] text-gray-100">Risk Score</p>
<p className="mt-3 text-4xl font-bold">68/100</p>
<p className="mt-3 text-sm text-cyan-50/80">
Higher scores indicate delays, repeated effort, weak ownership, and broken handoffs.
</p>
</div>

<div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6">
<p className="text-sm uppercase tracking-[0.2em] text-gray-100">Productivity Loss</p>
<p className="mt-3 text-4xl font-bold">$3,247/mo</p>
<p className="mt-3 text-sm text-red-50/80">
Estimated monthly business cost caused by workflow drag and missed execution.
</p>
</div>

<div className="rounded-3xl border border-green-500/20 bg-green-500/10 p-6">
<p className="text-sm uppercase tracking-[0.2em] text-gray-100">Savings Opportunity</p>
<p className="mt-3 text-4xl font-bold">$4,200/mo</p>
<p className="mt-3 text-sm text-green-50/80">
Potential monthly gain if friction and repeated effort are reduced.
</p>
</div>
</div>
</div>
</section>

<section id="next-step" className="relative z-10 px-4 py-8 pb-16 sm:px-6 md:px-8 lg:px-10 lg:pb-24 xl:px-12">
<div className="mx-auto max-w-7xl rounded-[32px] border border-cyan-400/12 bg-white/[0.03] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.18)] backdrop-blur-sm sm:p-8">
<div className="grid items-center gap-8 xl:grid-cols-[minmax(0,1fr)_auto]">
<div className="max-w-3xl">
<p className="text-[11px] uppercase tracking-[0.34em] text-cyan-300 sm:text-xs">
Next Step
</p>
<h2 className="mt-4 text-3xl font-bold sm:text-4xl">
Book a consultation and see where your workflow is leaking time and revenue
</h2>
<p className="mt-4 text-base leading-8 text-gray-300">
Ghostlayer is built to make operational friction visible, actionable, and expensive to ignore.
If the process is slowing growth, you should see it immediately.
</p>
</div>

<div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row xl:flex-col">
<button
onClick={() => openCalendly('homepage')}
className="rounded-2xl bg-white px-8 py-4 text-base font-semibold text-black transition hover:opacity-90"
>
Book Business Consultation
</button>

<Link
href="/dashboard"
className="rounded-2xl border border-white/12 bg-white/[0.04] px-8 py-4 text-center text-base font-semibold text-white transition hover:bg-white/[0.08]"
>
Open Live Dashboard
</Link>
</div>
</div>
</div>
</section>

<footer className="relative z-10 border-t border-white/8 bg-[#05070b]/70 backdrop-blur-xl">
<div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:px-8 lg:px-10">
<div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
<div className="max-w-md">
<Link
href="/"
className={`inline-block text-[1.2rem] font-bold tracking-[0.14em] sm:text-[1.3rem] ${logoPulseGlow}`}
>
GHOSTLAYER
</Link>
<p className="mt-4 text-sm leading-7 text-gray-400">
Business workflow intelligence for clearer operations, stronger follow-through,
and faster execution.
</p>
</div>

<div className="flex max-w-xl flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-400 md:justify-end">
<a href="#how-it-works" className="transition hover:text-white">
How It Works
</a>
<a href="#who-it-helps" className="transition hover:text-white">
Who It Helps
</a>
<a href="#results" className="transition hover:text-white">
Results
</a>
<a href="#next-step" className="transition hover:text-white">
Next Step
</a>
<Link href="/dashboard" className="transition hover:text-white">
Live Dashboard
</Link>
<Link href="/privacy" className="transition hover:text-white">
Privacy
</Link>
<Link href="/terms" className="transition hover:text-white">
Terms
</Link>
<button
onClick={() => openCalendly('homepage')}
className="text-left transition hover:text-white"
>
Book Consultation
</button>
</div>
</div>

<p className="mt-8 border-t border-white/8 pt-6 text-sm text-gray-500">
© {currentYear} Ghostlayer. Business workflow intelligence for clearer operations,
stronger follow-through, and faster execution.
</p>
</div>
</footer>

{isCalendlyOpen && (
<PopupModal
url="https://calendly.com/dexterstevens630/30min"
onModalClose={() => setIsCalendlyOpen(false)}
open={isCalendlyOpen}
rootElement={document.body}
/>
)}

<style jsx>{`
.hero-glow {
animation: heroPulse 6s ease-in-out infinite;
text-shadow:
0 0 8px rgba(255, 255, 255, 0.62),
0 0 16px rgba(255, 255, 255, 0.52),
0 0 28px rgba(96, 165, 250, 0.48),
0 0 48px rgba(59, 130, 246, 0.4),
0 0 76px rgba(147, 51, 234, 0.28);
}

.sparkle {
position: absolute;
border-radius: 9999px;
background: white;
box-shadow:
0 0 8px rgba(255, 255, 255, 0.85),
0 0 16px rgba(96, 165, 250, 0.42);
animation-name: twinkle;
animation-timing-function: ease-in-out;
animation-iteration-count: infinite;
}

.orb {
position: absolute;
border-radius: 9999px;
filter: blur(90px);
opacity: 0.28;
}

.orb-a {
left: -10%;
top: -8%;
height: 28rem;
width: 28rem;
background: rgba(34, 211, 238, 0.06);
animation: floatSlow 18s ease-in-out infinite;
}

.orb-b {
right: -10%;
top: 18%;
height: 24rem;
width: 24rem;
background: rgba(59, 130, 246, 0.06);
animation: floatSlow 20s ease-in-out infinite;
}

.fog {
position: absolute;
left: -10%;
right: -10%;
height: 180px;
border-radius: 9999px;
filter: blur(95px);
opacity: 0.05;
mix-blend-mode: screen;
background: linear-gradient(
90deg,
rgba(255, 255, 255, 0),
rgba(255, 255, 255, 0.03),
rgba(96, 165, 250, 0.04),
rgba(255, 255, 255, 0.01)
);
}

.fog-a {
top: 16%;
animation: fogDriftOne 30s ease-in-out infinite;
}

.fog-b {
top: 56%;
animation: fogDriftTwo 34s ease-in-out infinite;
}

@keyframes heroPulse {
0%,
100% {
opacity: 0.94;
text-shadow:
0 0 6px rgba(255, 255, 255, 0.46),
0 0 12px rgba(255, 255, 255, 0.38),
0 0 22px rgba(96, 165, 250, 0.34),
0 0 36px rgba(59, 130, 246, 0.28),
0 0 56px rgba(147, 51, 234, 0.2);
}
50% {
opacity: 1;
text-shadow:
0 0 10px rgba(255, 255, 255, 0.8),
0 0 20px rgba(255, 255, 255, 0.72),
0 0 36px rgba(96, 165, 250, 0.66),
0 0 58px rgba(59, 130, 246, 0.56),
0 0 88px rgba(147, 51, 234, 0.38);
}
}

@keyframes logoPulseGlow {
0%,
100% {
opacity: 0.82;
text-shadow:
0 0 5px rgba(255, 255, 255, 0.42),
0 0 12px rgba(255, 255, 255, 0.34),
0 0 22px rgba(96, 165, 250, 0.28),
0 0 36px rgba(59, 130, 246, 0.2);
}
50% {
opacity: 1;
text-shadow:
0 0 10px rgba(255, 255, 255, 1),
0 0 22px rgba(255, 255, 255, 0.92),
0 0 40px rgba(96, 165, 250, 0.86),
0 0 64px rgba(59, 130, 246, 0.68),
0 0 96px rgba(147, 51, 234, 0.44);
}
}

@keyframes twinkle {
0%,
100% {
transform: translateY(0px) scale(0.9);
opacity: 0.16;
}
25% {
transform: translateY(-4px) scale(1.04);
opacity: 0.72;
}
50% {
transform: translateY(0px) scale(0.95);
opacity: 0.3;
}
75% {
transform: translateY(3px) scale(1.02);
opacity: 0.52;
}
}

@keyframes floatSlow {
0%,
100% {
transform: translate3d(0, 0, 0);
}
50% {
transform: translate3d(0, 16px, 0);
}
}

@keyframes fogDriftOne {
0%,
100% {
transform: translateX(-4%) translateY(0px) scaleX(1);
}
50% {
transform: translateX(5%) translateY(-6px) scaleX(1.05);
}
}

@keyframes fogDriftTwo {
0%,
100% {
transform: translateX(5%) translateY(0px) scaleX(1.03);
}
50% {
transform: translateX(-4%) translateY(8px) scaleX(1.08);
}
}
`}</style>
</main>
);
}

