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

const sparkles = useMemo<Sparkle[]>(
() => [
{ left: '6%', top: '10%', size: 2, delay: '0s', duration: '5.4s', opacity: 0.45 },
{ left: '11%', top: '28%', size: 3, delay: '1.1s', duration: '6.2s', opacity: 0.72 },
{ left: '17%', top: '68%', size: 2, delay: '2.2s', duration: '5.1s', opacity: 0.5 },
{ left: '23%', top: '42%', size: 2, delay: '0.8s', duration: '6.6s', opacity: 0.62 },
{ left: '29%', top: '17%', size: 3, delay: '1.9s', duration: '5.8s', opacity: 0.78 },
{ left: '35%', top: '60%', size: 2, delay: '2.6s', duration: '6.3s', opacity: 0.56 },
{ left: '42%', top: '24%', size: 2, delay: '1.3s', duration: '5.7s', opacity: 0.6 },
{ left: '48%', top: '80%', size: 3, delay: '2.1s', duration: '6.4s', opacity: 0.8 },
{ left: '55%', top: '12%', size: 2, delay: '0.9s', duration: '5.5s', opacity: 0.48 },
{ left: '61%', top: '48%', size: 3, delay: '2.7s', duration: '6.1s', opacity: 0.72 },
{ left: '67%', top: '72%', size: 2, delay: '1.5s', duration: '5.3s', opacity: 0.52 },
{ left: '73%', top: '22%', size: 2, delay: '2.8s', duration: '6.5s', opacity: 0.64 },
{ left: '79%', top: '58%', size: 3, delay: '1.6s', duration: '5.9s', opacity: 0.74 },
{ left: '85%', top: '16%', size: 2, delay: '0.5s', duration: '6.7s', opacity: 0.5 },
{ left: '91%', top: '44%', size: 2, delay: '2s', duration: '5.4s', opacity: 0.58 },
{ left: '94%', top: '76%', size: 3, delay: '1.2s', duration: '6s', opacity: 0.78 },
{ left: '14%', top: '90%', size: 2, delay: '2.4s', duration: '6.8s', opacity: 0.44 },
{ left: '37%', top: '92%', size: 2, delay: '1.4s', duration: '5.2s', opacity: 0.5 },
{ left: '58%', top: '6%', size: 2, delay: '2.3s', duration: '6.4s', opacity: 0.46 },
{ left: '72%', top: '90%', size: 2, delay: '0.7s', duration: '5.6s', opacity: 0.52 },
],
[]
);

async function openCalendly(source: 'homepage' | 'dashboard' = 'homepage') {
await trackCtaClick(source);
setIsCalendlyOpen(true);
}

return (
<main className="relative min-h-screen overflow-x-hidden bg-[#04060a] text-white">
<div className="pointer-events-none absolute inset-0 overflow-hidden">
<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.1),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(6,182,212,0.06),transparent_24%),radial-gradient(circle_at_center,rgba(255,255,255,0.02),transparent_42%)]" />

<div className="smoke smoke-a" />
<div className="smoke smoke-b" />
<div className="smoke smoke-c" />

<div className="fog fog-a" />
<div className="fog fog-b" />

<div className="orb orb-cyan" />
<div className="orb orb-blue" />
<div className="orb orb-purple" />

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

<header className="relative z-20 border-b border-white/8 bg-[#04060a]/72 backdrop-blur-xl">
<div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-5 sm:px-6 md:px-8 lg:px-10">
<Link
href="/"
className="inline-block text-[1.08rem] font-bold tracking-[0.16em] text-white [text-shadow:0_0_8px_rgba(255,255,255,1),0_0_18px_rgba(255,255,255,0.92),0_0_34px_rgba(96,165,250,0.84),0_0_58px_rgba(59,130,246,0.72),0_0_92px_rgba(147,51,234,0.54)] sm:text-[1.2rem]"
>
GHOSTLAYER
</Link>

<nav className="hidden items-center gap-8 text-sm text-gray-300 lg:flex">
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
<Link href="/dashboard" className="font-semibold text-cyan-300 transition hover:text-white">
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

<section className="relative z-10 px-4 pb-16 pt-10 sm:px-6 sm:pb-20 md:px-8 md:pt-14 lg:px-10 lg:pb-24 xl:px-12">
<div className="mx-auto max-w-7xl">
<div className="grid items-center gap-10 xl:grid-cols-[minmax(0,1.05fr)_minmax(380px,480px)] xl:gap-14">
<div className="max-w-4xl">
<p className="text-[11px] uppercase tracking-[0.34em] text-cyan-300 sm:text-xs">
Business Workflow Intelligence
</p>

<h1 className="hero-glow mt-5 max-w-4xl text-4xl font-bold leading-[1.02] text-white sm:text-5xl lg:text-6xl xl:text-[4.35rem]">
Find Workflow Friction
<br />
Before It Slows
<br />
Growth, Burns Time,
<br />
and Costs Revenue
</h1>

<p className="mt-6 max-w-3xl text-base leading-8 text-gray-300 sm:text-lg">
Ghostlayer helps businesses uncover broken handoffs, approval bottlenecks,
repeated manual work, and hidden operational drag so teams can move faster
with less waste.
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
className="rounded-2xl border border-cyan-400/20 bg-cyan-400/8 px-8 py-4 text-center text-base font-semibold text-cyan-200 transition hover:bg-cyan-400/12 hover:text-white"
>
See Live Dashboard
</Link>
</div>

<div className="mt-8 flex flex-col gap-3 text-sm text-gray-400 sm:flex-row sm:flex-wrap sm:gap-6">
<span>Reduce operational drag</span>
<span>Improve accountability</span>
<span>Recover missed execution time</span>
</div>
</div>

<div className="w-full xl:-mt-2">
<div className="rounded-[32px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.018))] p-4 shadow-[0_20px_70px_rgba(0,0,0,0.34)] backdrop-blur-xl sm:p-5">
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
<div className="min-w-0 rounded-3xl border border-cyan-400/12 bg-cyan-400/7 p-5">
<p className="text-[11px] uppercase tracking-[0.24em] text-cyan-200">
Workflow Risk
</p>
<p className="mt-3 break-words text-[2.1rem] font-bold leading-none text-white sm:text-[2.35rem] lg:text-[2.55rem]">
68/100
</p>
<p className="mt-3 text-sm leading-7 text-gray-200">
Elevated due to repeated approvals, weak ownership, and broken handoffs.
</p>
</div>

<div className="min-w-0 rounded-3xl border border-red-500/14 bg-red-500/9 p-5">
<p className="text-[11px] uppercase tracking-[0.24em] text-red-200">
Estimated Loss
</p>
<p className="mt-3 flex items-baseline whitespace-nowrap text-white">
<span className="text-[1.95rem] font-bold leading-none sm:text-[2.2rem] lg:text-[2.35rem]">
$3,247
</span>
<span className="ml-1 text-[1.02rem] font-bold leading-none sm:text-[1.1rem] lg:text-[1.14rem]">
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
<span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-gray-400">
Live Signal
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
<div className="mx-auto max-w-7xl rounded-[32px] border border-white/8 bg-white/[0.03] p-6 backdrop-blur-sm shadow-[0_10px_40px_rgba(0,0,0,0.18)] sm:p-8">
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
<div className="mx-auto max-w-7xl rounded-[32px] border border-white/8 bg-white/[0.03] p-6 backdrop-blur-sm shadow-[0_10px_40px_rgba(0,0,0,0.18)] sm:p-8">
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
<div className="mx-auto max-w-7xl rounded-[32px] border border-white/8 bg-white/[0.03] p-6 backdrop-blur-sm shadow-[0_10px_40px_rgba(0,0,0,0.18)] sm:p-8">
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
<div className="mx-auto max-w-7xl rounded-[32px] border border-cyan-400/14 bg-white/[0.03] p-6 backdrop-blur-sm shadow-[0_10px_40px_rgba(0,0,0,0.18)] sm:p-8">
<div className="grid items-center gap-8 xl:grid-cols-[minmax(0,1fr)_auto]">
<div className="max-w-3xl">
<p className="text-[11px] uppercase tracking-[0.34em] text-cyan-300 sm:text-xs">
Next Step
</p>
<h2 className="mt-4 text-3xl font-bold sm:text-4xl">
Book a consultation and see where your workflow is leaking time and revenue
</h2>
<p className="mt-4 text-base leading-8 text-gray-300">
Ghostlayer is built to make operational friction visible, actionable, and
expensive to ignore. If the process is slowing growth, you should see it immediately.
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
className="rounded-2xl border border-cyan-400/20 bg-cyan-400/8 px-8 py-4 text-center text-base font-semibold text-cyan-200 transition hover:bg-cyan-400/12 hover:text-white"
>
Open Live Dashboard
</Link>
</div>
</div>
</div>
</section>

<footer className="relative z-10 border-t border-white/8 bg-[#04060a]/70 backdrop-blur-xl">
<div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:px-8 lg:px-10">
<div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
<div className="max-w-md">
<Link
href="/"
className="inline-block text-[1.24rem] font-bold tracking-[0.14em] text-white [text-shadow:0_0_8px_rgba(255,255,255,1),0_0_18px_rgba(255,255,255,0.92),0_0_34px_rgba(96,165,250,0.84),0_0_58px_rgba(59,130,246,0.72),0_0_92px_rgba(147,51,234,0.54)] sm:text-[1.34rem]"
>
GHOSTLAYER
</Link>
<p className="mt-4 text-sm leading-7 text-gray-400">
Business workflow intelligence for clearer operations, stronger follow-through,
and faster execution.
</p>
</div>

<div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-400 md:max-w-md md:justify-end">
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
0 0 8px rgba(255, 255, 255, 0.68),
0 0 16px rgba(255, 255, 255, 0.6),
0 0 30px rgba(96, 165, 250, 0.62),
0 0 54px rgba(59, 130, 246, 0.54),
0 0 86px rgba(147, 51, 234, 0.4);
}

.sparkle {
position: absolute;
border-radius: 9999px;
background: white;
box-shadow:
0 0 10px rgba(255, 255, 255, 0.9),
0 0 18px rgba(96, 165, 250, 0.65),
0 0 28px rgba(147, 51, 234, 0.32);
animation-name: twinkle;
animation-timing-function: ease-in-out;
animation-iteration-count: infinite;
}

.orb {
position: absolute;
border-radius: 9999px;
filter: blur(86px);
opacity: 0.46;
}

.orb-cyan {
left: -10%;
top: -8%;
height: 30rem;
width: 30rem;
background: rgba(34, 211, 238, 0.08);
animation: floatSlow 16s ease-in-out infinite;
}

.orb-blue {
right: -10%;
top: 18%;
height: 28rem;
width: 28rem;
background: rgba(59, 130, 246, 0.07);
animation: floatSlower 19s ease-in-out infinite;
}

.orb-purple {
bottom: -12%;
left: 24%;
height: 25rem;
width: 25rem;
background: rgba(168, 85, 247, 0.06);
animation: floatSlow 20s ease-in-out infinite;
}

.smoke {
position: absolute;
border-radius: 9999px;
filter: blur(120px);
opacity: 0.09;
mix-blend-mode: screen;
}

.smoke-a {
left: -8%;
top: 22%;
width: 30rem;
height: 16rem;
background: linear-gradient(
90deg,
rgba(255, 255, 255, 0.02),
rgba(56, 189, 248, 0.07),
rgba(255, 255, 255, 0.01)
);
animation: driftOne 22s ease-in-out infinite;
}

.smoke-b {
right: -10%;
top: 34%;
width: 32rem;
height: 18rem;
background: linear-gradient(
90deg,
rgba(168, 85, 247, 0.02),
rgba(59, 130, 246, 0.06),
rgba(255, 255, 255, 0.01)
);
animation: driftTwo 26s ease-in-out infinite;
}

.smoke-c {
left: 20%;
bottom: 10%;
width: 38rem;
height: 14rem;
background: linear-gradient(
90deg,
rgba(255, 255, 255, 0.01),
rgba(6, 182, 212, 0.06),
rgba(168, 85, 247, 0.02)
);
animation: driftThree 24s ease-in-out infinite;
}

.fog {
position: absolute;
left: -10%;
right: -10%;
height: 180px;
border-radius: 9999px;
filter: blur(90px);
opacity: 0.07;
mix-blend-mode: screen;
background: linear-gradient(
90deg,
rgba(255, 255, 255, 0),
rgba(255, 255, 255, 0.04),
rgba(96, 165, 250, 0.05),
rgba(255, 255, 255, 0.01)
);
}

.fog-a {
top: 14%;
animation: fogDriftOne 30s ease-in-out infinite;
}

.fog-b {
top: 52%;
animation: fogDriftTwo 36s ease-in-out infinite;
}

@keyframes heroPulse {
0%,
100% {
opacity: 0.92;
text-shadow:
0 0 6px rgba(255, 255, 255, 0.52),
0 0 12px rgba(255, 255, 255, 0.46),
0 0 24px rgba(96, 165, 250, 0.5),
0 0 40px rgba(59, 130, 246, 0.44),
0 0 66px rgba(147, 51, 234, 0.32);
}
50% {
opacity: 1;
text-shadow:
0 0 10px rgba(255, 255, 255, 0.88),
0 0 22px rgba(255, 255, 255, 0.82),
0 0 40px rgba(96, 165, 250, 0.84),
0 0 66px rgba(59, 130, 246, 0.72),
0 0 102px rgba(147, 51, 234, 0.56);
}
}

@keyframes twinkle {
0%,
100% {
transform: translateY(0px) scale(0.9);
opacity: 0.22;
}
25% {
transform: translateY(-5px) scale(1.05);
opacity: 0.82;
}
50% {
transform: translateY(0px) scale(0.95);
opacity: 0.42;
}
75% {
transform: translateY(3px) scale(1.02);
opacity: 0.68;
}
}

@keyframes floatSlow {
0%,
100% {
transform: translate3d(0, 0, 0);
}
50% {
transform: translate3d(0, 18px, 0);
}
}

@keyframes floatSlower {
0%,
100% {
transform: translate3d(0, 0, 0);
}
50% {
transform: translate3d(-14px, 22px, 0);
}
}

@keyframes driftOne {
0%,
100% {
transform: translate3d(0, 0, 0) scale(1);
}
50% {
transform: translate3d(70px, -24px, 0) scale(1.08);
}
}

@keyframes driftTwo {
0%,
100% {
transform: translate3d(0, 0, 0) scale(1);
}
50% {
transform: translate3d(-90px, 20px, 0) scale(1.06);
}
}

@keyframes driftThree {
0%,
100% {
transform: translate3d(0, 0, 0) scale(1);
}
50% {
transform: translate3d(50px, -18px, 0) scale(1.04);
}
}

@keyframes fogDriftOne {
0%,
100% {
transform: translateX(-4%) translateY(0px) scaleX(1);
}
50% {
transform: translateX(6%) translateY(-8px) scaleX(1.08);
}
}

@keyframes fogDriftTwo {
0%,
100% {
transform: translateX(6%) translateY(0px) scaleX(1.04);
}
50% {
transform: translateX(-5%) translateY(10px) scaleX(1.1);
}
}
`}</style>
</main>
);
}
