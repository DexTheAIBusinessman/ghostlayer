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
{ left: '5%', top: '12%', size: 2, delay: '0s', duration: '5.5s', opacity: 0.55 },
{ left: '9%', top: '28%', size: 3, delay: '1.2s', duration: '6.1s', opacity: 0.8 },
{ left: '14%', top: '74%', size: 2, delay: '2.4s', duration: '5.2s', opacity: 0.6 },
{ left: '20%', top: '46%', size: 2, delay: '0.7s', duration: '6.8s', opacity: 0.72 },
{ left: '26%', top: '16%', size: 3, delay: '1.8s', duration: '5.9s', opacity: 0.82 },
{ left: '31%', top: '63%', size: 2, delay: '2.8s', duration: '6.3s', opacity: 0.66 },
{ left: '38%', top: '30%', size: 2, delay: '1.1s', duration: '5.6s', opacity: 0.74 },
{ left: '44%', top: '82%', size: 3, delay: '2.2s', duration: '6.5s', opacity: 0.84 },
{ left: '51%', top: '10%', size: 2, delay: '0.9s', duration: '5.7s', opacity: 0.56 },
{ left: '57%', top: '50%', size: 3, delay: '2.6s', duration: '6.4s', opacity: 0.8 },
{ left: '63%', top: '76%', size: 2, delay: '1.5s', duration: '5.4s', opacity: 0.62 },
{ left: '69%', top: '22%', size: 2, delay: '2.9s', duration: '6.2s', opacity: 0.76 },
{ left: '75%', top: '58%', size: 3, delay: '1.7s', duration: '5.8s', opacity: 0.82 },
{ left: '81%', top: '14%', size: 2, delay: '0.4s', duration: '6.7s', opacity: 0.6 },
{ left: '87%', top: '41%', size: 2, delay: '2s', duration: '5.3s', opacity: 0.7 },
{ left: '92%', top: '71%', size: 3, delay: '1.3s', duration: '6s', opacity: 0.82 },
{ left: '12%', top: '90%', size: 2, delay: '2.5s', duration: '6.9s', opacity: 0.52 },
{ left: '33%', top: '92%', size: 2, delay: '1.4s', duration: '5.1s', opacity: 0.64 },
{ left: '54%', top: '6%', size: 2, delay: '2.1s', duration: '6.6s', opacity: 0.56 },
{ left: '73%', top: '90%', size: 2, delay: '0.8s', duration: '5.4s', opacity: 0.65 },
],
[]
);

async function openCalendly(source: 'homepage' | 'dashboard' = 'homepage') {
await trackCtaClick(source);
setIsCalendlyOpen(true);
}

return (
<main className="relative min-h-screen overflow-x-hidden bg-black text-white">
<div className="pointer-events-none absolute inset-0 overflow-hidden">
<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.15),transparent_28%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.14),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(6,182,212,0.10),transparent_24%),radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_42%)]" />

<div className="smoke smoke-a" />
<div className="smoke smoke-b" />
<div className="smoke smoke-c" />

<div className="fog fog-a" />
<div className="fog fog-b" />
<div className="fog fog-c" />

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

<header className="relative z-20 border-b border-white/10 bg-black/55 backdrop-blur">
<div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-5 sm:px-6 md:px-8 lg:px-10">
<Link
href="/"
className="inline-block text-[1.14rem] font-bold tracking-[0.16em] text-white [text-shadow:0_0_8px_rgba(255,255,255,1),0_0_18px_rgba(255,255,255,0.96),0_0_34px_rgba(96,165,250,0.95),0_0_58px_rgba(59,130,246,0.9),0_0_92px_rgba(147,51,234,0.76)] sm:text-[1.3rem]"
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
className="rounded-xl border border-cyan-400/30 bg-cyan-400/5 px-3 py-2 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-400/10 hover:text-white lg:hidden"
>
Dashboard
</Link>
</div>
</header>

<section className="relative z-10 overflow-hidden px-4 pb-16 pt-10 sm:px-6 sm:pb-20 md:px-8 md:pt-14 lg:px-10 lg:pb-24 xl:px-12">
<div className="mx-auto max-w-7xl">
<div className="grid items-start gap-10 xl:grid-cols-[minmax(0,1.08fr)_minmax(360px,460px)] xl:gap-12 2xl:grid-cols-[minmax(0,1.12fr)_minmax(390px,500px)]">
<div className="max-w-4xl">
<p className="text-[11px] uppercase tracking-[0.34em] text-cyan-300 sm:text-xs">
Business Workflow Inefficiency Scanner
</p>

<h1 className="hero-glow mt-5 max-w-4xl text-4xl font-bold leading-[1.02] text-white sm:text-5xl lg:text-6xl xl:text-[4.5rem]">
Find Workflow Friction
<br />
Before It Slows
<br />
Growth, Burns Time,
<br />
and Costs Revenue
</h1>

<p className="mt-6 max-w-3xl text-base leading-8 text-gray-300 sm:text-lg">
Ghostlayer helps businesses uncover broken handoffs, approval
bottlenecks, repeated manual work, and hidden operational drag so
teams can move faster with less waste.
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
className="rounded-2xl border border-cyan-400/35 bg-cyan-400/5 px-8 py-4 text-center text-base font-semibold text-cyan-300 transition hover:bg-cyan-400/10 hover:text-white"
>
See Live Dashboard
</Link>
</div>

<div className="mt-8 flex flex-col gap-3 text-sm text-gray-400 sm:flex-row sm:flex-wrap sm:gap-6">
<span>Reduce operational drag</span>
<span>Improve team accountability</span>
<span>Recover missed execution time</span>
</div>
</div>

<div className="w-full xl:-mt-2 2xl:-mt-6">
<div className="rounded-[2rem] border border-cyan-400/25 bg-white/5 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-sm sm:p-5">
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
<div className="min-w-0 rounded-3xl border border-cyan-400/20 bg-cyan-400/5 p-5">
<p className="text-[11px] uppercase tracking-[0.24em] text-cyan-300 sm:text-xs">
Workflow Risk
</p>
<p className="mt-3 break-words text-[2.2rem] font-bold leading-none text-white sm:text-[2.5rem] lg:text-[2.7rem]">
68/100
</p>
<p className="mt-3 text-sm leading-7 text-gray-300">
Elevated due to repeated approvals, weak ownership, and
broken handoffs.
</p>
</div>

<div className="min-w-0 rounded-3xl border border-red-500/25 bg-red-500/10 p-5">
<p className="text-[11px] uppercase tracking-[0.24em] text-red-200 sm:text-xs">
Estimated Loss
</p>
<p className="mt-3 flex items-baseline whitespace-nowrap text-white">
<span className="text-[2rem] font-bold leading-none sm:text-[2.3rem] lg:text-[2.45rem]">
$3,247
</span>
<span className="ml-1 text-[1.08rem] font-bold leading-none sm:text-[1.14rem] lg:text-[1.18rem]">
/mo
</span>
</p>
<p className="mt-3 text-sm leading-7 text-gray-300">
Estimated productivity drag from process friction and missed
follow-through.
</p>
</div>
</div>

<div className="mt-4 rounded-3xl border border-white/10 bg-black/25 p-5">
<p className="text-xs uppercase tracking-[0.24em] text-gray-300">
What Ghostlayer Finds
</p>

<ul className="mt-4 space-y-4 text-sm leading-7 text-gray-200 sm:text-[15px]">
<li>• Approval delays that stall delivery</li>
<li>• Handoffs losing key client or operational context</li>
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
<div className="mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm sm:p-8">
<div className="max-w-3xl">
<p className="text-[11px] uppercase tracking-[0.34em] text-cyan-300 sm:text-xs">
How It Works
</p>
<h2 className="mt-4 text-3xl font-bold sm:text-4xl">
A clean workflow intelligence experience for real businesses
</h2>
<p className="mt-4 text-base leading-8 text-gray-300">
Ghostlayer helps you spot where execution is slowing down, where
handoffs are breaking, and where repeated manual work is costing
time and revenue.
</p>
</div>

<div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
<div className="rounded-3xl border border-white/10 bg-black/30 p-6">
<p className="text-sm uppercase tracking-[0.22em] text-cyan-300">1. Capture</p>
<h3 className="mt-3 text-xl font-semibold">Bring consultations into one view</h3>
<p className="mt-3 text-sm leading-7 text-gray-400">
Ghostlayer connects booked business consultations to your workflow
view so you can see operational demand clearly.
</p>
</div>

<div className="rounded-3xl border border-white/10 bg-black/30 p-6">
<p className="text-sm uppercase tracking-[0.22em] text-cyan-300">2. Diagnose</p>
<h3 className="mt-3 text-xl font-semibold">Identify bottlenecks and drag</h3>
<p className="mt-3 text-sm leading-7 text-gray-400">
Surface approval delays, broken handoffs, repeated updates, and
workflow friction that slow delivery.
</p>
</div>

<div className="rounded-3xl border border-white/10 bg-black/30 p-6">
<p className="text-sm uppercase tracking-[0.22em] text-cyan-300">3. Improve</p>
<h3 className="mt-3 text-xl font-semibold">Turn visibility into action</h3>
<p className="mt-3 text-sm leading-7 text-gray-400">
Use the dashboard to prioritize issues, reduce waste, and tighten
business operations without guesswork.
</p>
</div>
</div>
</div>
</section>

<section id="who-it-helps" className="relative z-10 px-4 py-8 sm:px-6 md:px-8 lg:px-10 xl:px-12">
<div className="mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm sm:p-8">
<div className="max-w-3xl">
<p className="text-[11px] uppercase tracking-[0.34em] text-cyan-300 sm:text-xs">
Who It Helps
</p>
<h2 className="mt-4 text-3xl font-bold sm:text-4xl">
Built for businesses that need cleaner execution
</h2>
<p className="mt-4 text-base leading-8 text-gray-300">
Best for service businesses, agencies, operators, consultants, and
growing teams that need better handoffs, less manual waste, and
stronger operational visibility.
</p>
</div>

<div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
<div className="rounded-3xl border border-white/10 bg-black/30 p-6">
<h3 className="text-xl font-semibold">Agencies</h3>
<p className="mt-3 text-sm leading-7 text-gray-400">
Reduce handoff chaos between sales, onboarding, delivery, and support.
</p>
</div>
<div className="rounded-3xl border border-white/10 bg-black/30 p-6">
<h3 className="text-xl font-semibold">Consulting Firms</h3>
<p className="mt-3 text-sm leading-7 text-gray-400">
Improve intake quality, client follow-through, and internal execution.
</p>
</div>
<div className="rounded-3xl border border-white/10 bg-black/30 p-6">
<h3 className="text-xl font-semibold">Service Businesses</h3>
<p className="mt-3 text-sm leading-7 text-gray-400">
Spot where delivery slows down and where repeated admin work hurts margin.
</p>
</div>
<div className="rounded-3xl border border-white/10 bg-black/30 p-6">
<h3 className="text-xl font-semibold">Operations Leaders</h3>
<p className="mt-3 text-sm leading-7 text-gray-400">
Get a simple operational signal without turning the experience into clutter.
</p>
</div>
</div>
</div>
</section>

<section id="results" className="relative z-10 px-4 py-8 sm:px-6 md:px-8 lg:px-10 xl:px-12">
<div className="mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm sm:p-8">
<div className="max-w-3xl">
<p className="text-[11px] uppercase tracking-[0.34em] text-cyan-300 sm:text-xs">
Results
</p>
<h2 className="mt-4 text-3xl font-bold sm:text-4xl">
See the cost of friction before it compounds
</h2>
</div>

<div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
<div className="rounded-3xl border border-white/10 bg-black/30 p-6">
<p className="text-sm uppercase tracking-[0.2em] text-gray-300">Workflow Health</p>
<p className="mt-3 text-4xl font-bold">82%</p>
<p className="mt-3 text-sm text-gray-400">
Visibility and operational consistency across core business workflows.
</p>
</div>

<div className="rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-6">
<p className="text-sm uppercase tracking-[0.2em] text-gray-200">Risk Score</p>
<p className="mt-3 text-4xl font-bold">68/100</p>
<p className="mt-3 text-sm text-gray-300">
Higher scores indicate delays, repeated effort, weak ownership, and broken handoffs.
</p>
</div>

<div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6">
<p className="text-sm uppercase tracking-[0.2em] text-gray-200">Productivity Loss</p>
<p className="mt-3 text-4xl font-bold">$3,247/mo</p>
<p className="mt-3 text-sm text-gray-300">
Estimated monthly business cost caused by workflow drag and missed execution.
</p>
</div>

<div className="rounded-3xl border border-green-500/30 bg-green-500/10 p-6">
<p className="text-sm uppercase tracking-[0.2em] text-gray-200">Savings Opportunity</p>
<p className="mt-3 text-4xl font-bold">$4,200/mo</p>
<p className="mt-3 text-sm text-gray-300">
Potential monthly gain if workflow friction and repeated effort are reduced.
</p>
</div>
</div>
</div>
</section>

<section id="next-step" className="relative z-10 px-4 py-8 pb-16 sm:px-6 md:px-8 lg:px-10 lg:pb-24 xl:px-12">
<div className="mx-auto max-w-7xl rounded-[2rem] border border-cyan-400/20 bg-white/5 p-6 backdrop-blur-sm sm:p-8">
<div className="grid items-center gap-8 xl:grid-cols-[minmax(0,1fr)_auto]">
<div className="max-w-3xl">
<p className="text-[11px] uppercase tracking-[0.34em] text-cyan-300 sm:text-xs">
Next Step
</p>
<h2 className="mt-4 text-3xl font-bold sm:text-4xl">
Book a consultation and see where your workflow is leaking time and revenue
</h2>
<p className="mt-4 text-base leading-8 text-gray-300">
Ghostlayer is built to make operational friction visible, actionable,
and expensive to ignore. If the process is slowing growth, you should
see it immediately.
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
className="rounded-2xl border border-cyan-400/35 bg-cyan-400/5 px-8 py-4 text-center text-base font-semibold text-cyan-300 transition hover:bg-cyan-400/10 hover:text-white"
>
Open Live Dashboard
</Link>
</div>
</div>
</div>
</section>

<footer className="relative z-10 border-t border-white/10 bg-black/60 backdrop-blur">
<div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:px-8 lg:px-10">
<div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
<div className="max-w-md">
<Link
href="/"
className="inline-block text-[1.28rem] font-bold tracking-[0.14em] text-white [text-shadow:0_0_8px_rgba(255,255,255,1),0_0_18px_rgba(255,255,255,0.96),0_0_34px_rgba(96,165,250,0.95),0_0_58px_rgba(59,130,246,0.9),0_0_92px_rgba(147,51,234,0.76)] sm:text-[1.38rem]"
>
GHOSTLAYER
</Link>
<p className="mt-4 text-sm leading-7 text-gray-400">
Business workflow intelligence for clearer operations, stronger
follow-through, and faster execution.
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

<p className="mt-8 border-t border-white/10 pt-6 text-sm text-gray-500">
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
0 0 8px rgba(255, 255, 255, 0.72),
0 0 16px rgba(255, 255, 255, 0.68),
0 0 30px rgba(96, 165, 250, 0.72),
0 0 54px rgba(59, 130, 246, 0.62),
0 0 90px rgba(147, 51, 234, 0.52);
}

.sparkle {
position: absolute;
border-radius: 9999px;
background: white;
box-shadow:
0 0 10px rgba(255, 255, 255, 0.95),
0 0 18px rgba(96, 165, 250, 0.8),
0 0 30px rgba(147, 51, 234, 0.42);
animation-name: twinkle;
animation-timing-function: ease-in-out;
animation-iteration-count: infinite;
}

.orb {
position: absolute;
border-radius: 9999px;
filter: blur(80px);
opacity: 0.7;
}

.orb-cyan {
left: -10%;
top: -8%;
height: 30rem;
width: 30rem;
background: rgba(34, 211, 238, 0.12);
animation: floatSlow 16s ease-in-out infinite;
}

.orb-blue {
right: -10%;
top: 14%;
height: 28rem;
width: 28rem;
background: rgba(59, 130, 246, 0.1);
animation: floatSlower 19s ease-in-out infinite;
}

.orb-purple {
bottom: -12%;
left: 24%;
height: 26rem;
width: 26rem;
background: rgba(168, 85, 247, 0.1);
animation: floatSlow 20s ease-in-out infinite;
}

.smoke {
position: absolute;
border-radius: 9999px;
filter: blur(120px);
opacity: 0.16;
mix-blend-mode: screen;
}

.smoke-a {
left: -8%;
top: 24%;
width: 30rem;
height: 16rem;
background: linear-gradient(
90deg,
rgba(255, 255, 255, 0.05),
rgba(56, 189, 248, 0.12),
rgba(255, 255, 255, 0.02)
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
rgba(168, 85, 247, 0.04),
rgba(59, 130, 246, 0.12),
rgba(255, 255, 255, 0.03)
);
animation: driftTwo 26s ease-in-out infinite;
}

.smoke-c {
left: 20%;
bottom: 8%;
width: 38rem;
height: 14rem;
background: linear-gradient(
90deg,
rgba(255, 255, 255, 0.02),
rgba(6, 182, 212, 0.12),
rgba(168, 85, 247, 0.05)
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
opacity: 0.12;
mix-blend-mode: screen;
background: linear-gradient(
90deg,
rgba(255, 255, 255, 0),
rgba(255, 255, 255, 0.08),
rgba(96, 165, 250, 0.09),
rgba(255, 255, 255, 0.02)
);
}

.fog-a {
top: 12%;
animation: fogDriftOne 30s ease-in-out infinite;
}

.fog-b {
top: 42%;
animation: fogDriftTwo 36s ease-in-out infinite;
}

.fog-c {
bottom: 10%;
animation: fogDriftThree 34s ease-in-out infinite;
}

@keyframes heroPulse {
0%,
100% {
opacity: 0.92;
text-shadow:
0 0 6px rgba(255, 255, 255, 0.58),
0 0 12px rgba(255, 255, 255, 0.52),
0 0 24px rgba(96, 165, 250, 0.56),
0 0 42px rgba(59, 130, 246, 0.5),
0 0 70px rgba(147, 51, 234, 0.4);
}
50% {
opacity: 1;
text-shadow:
0 0 10px rgba(255, 255, 255, 0.92),
0 0 22px rgba(255, 255, 255, 0.88),
0 0 40px rgba(96, 165, 250, 0.9),
0 0 68px rgba(59, 130, 246, 0.78),
0 0 108px rgba(147, 51, 234, 0.62);
}
}

@keyframes twinkle {
0%,
100% {
transform: translateY(0px) scale(0.9);
opacity: 0.28;
}
25% {
transform: translateY(-6px) scale(1.08);
opacity: 1;
}
50% {
transform: translateY(0px) scale(0.95);
opacity: 0.55;
}
75% {
transform: translateY(4px) scale(1.04);
opacity: 0.82;
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

@keyframes fogDriftThree {
0%,
100% {
transform: translateX(-2%) translateY(0px) scaleX(1.02);
}
50% {
transform: translateX(7%) translateY(-6px) scaleX(1.08);
}
}
`}</style>
</main>
);
}
