'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

export default function DashboardPage() {
const [activeSection, setActiveSection] = useState('overview');

function scrollToSection(id: string) {
document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
setActiveSection(id);
}

return (
<main className="min-h-screen bg-[#05070b] text-white">
<h1 style={{ color: 'red' }}>NEW DASHBOARD BUILD</h1>

<div className="flex">
{/* ================= SIDEBAR ================= */}
<aside className="w-[250px] border-r border-white/10 p-4 hidden md:block">
<div className="ghostlayerLogo">GHOSTLAYER</div>

<div className="mt-6 space-y-2">
{[
'overview',
'priority-issues',
'intelligence-summary',
'run-scan',
'bookings',
'delay-hotspots',
'broken-handoffs',
'duplicate-work',
].map((id) => (
<button
key={id}
onClick={() => scrollToSection(id)}
className={`block w-full text-left px-3 py-2 rounded-xl ${
activeSection === id
? 'bg-cyan-400/10 text-white'
: 'text-gray-400 hover:text-white'
}`}
>
{id.replace('-', ' ')}
</button>
))}
</div>

{/* ENVIRONMENT */}
<div className="mt-8 p-3 border border-white/10 rounded-xl">
<p className="text-xs text-gray-500">Environment</p>
<p className="signal-green font-semibold">Live</p>
</div>
</aside>

{/* ================= MAIN ================= */}
<div className="flex-1 p-6 max-w-7xl mx-auto">
{/* ================= OVERVIEW ================= */}
<section id="overview">
<h1 className="dashboardHeadlineGlow text-3xl font-bold">
Detect execution drag before it compounds
</h1>
</section>

{/* ================= PRIORITY ================= */}
<section id="priority-issues" className="mt-8 grid md:grid-cols-3 gap-4">
{/* CARD */}
<div className="card">
<div className="flex justify-between">
<h3>Execution delay risk</h3>
<span className="signal High">High</span>
</div>
<p>Workflow slowdown detected</p>
</div>

<div className="card">
<div className="flex justify-between">
<h3>Handoff context loss</h3>
<span className="signal Medium">Medium</span>
</div>
<p>Information degrading across steps</p>
</div>

<div className="card">
<div className="flex justify-between">
<h3>Duplicate manual reporting</h3>
<span className="signal Medium">Medium</span>
</div>
<p>Redundant effort detected</p>
</div>
</section>

{/* ================= INTELLIGENCE (TOP) ================= */}
<section id="intelligence-summary" className="mt-8 card">
<h2>Workflow Intelligence Summary</h2>
<p className="mt-2 text-gray-400">
System-generated operational insights.
</p>
</section>

{/* ================= RUN SCAN (TOP) ================= */}
<section id="run-scan" className="mt-6 card">
<h2>Run a New Workflow Scan</h2>
<button className="mt-4 bg-white text-black px-4 py-2 rounded-xl">
Run Scan
</button>
</section>

{/* ================= BOOKINGS ================= */}
<section id="bookings" className="mt-8 card">
<h2>Recent Bookings</h2>
</section>

{/* ================= DELAY ================= */}
<section id="delay-hotspots" className="mt-8 card">
<h2>Delay Hotspots</h2>
<span className="signal High">High</span>
</section>

{/* ================= HANDOFF ================= */}
<section id="broken-handoffs" className="mt-8 card">
<h2>Broken Handoffs</h2>
<span className="signal-red">Missing context</span>
<br />
<span className="signal-yellow">Weak ownership</span>
</section>

{/* ================= DUPLICATE ================= */}
<section id="duplicate-work" className="mt-8 card">
<h2>Duplicate Work</h2>
<span className="signal-cyan">Repeated effort</span>
<br />
<span className="signal-cyan">Duplicate work</span>
</section>
</div>
</div>

{/* ================= GLOBAL STYLES ================= */}
<style jsx global>{`
.card {
border: 1px solid rgba(255, 255, 255, 0.08);
background: rgba(255, 255, 255, 0.02);
padding: 18px;
border-radius: 18px;
}

.ghostlayerLogo {
font-weight: 700;
letter-spacing: 0.1em;
animation: logoPulse 2.5s infinite;
}

@keyframes logoPulse {
0%,
100% {
text-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
}
50% {
text-shadow: 0 0 20px rgba(255, 255, 255, 0.9);
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
text-shadow: 0 0 20px rgba(239, 68, 68, 0.8);
}
}

@keyframes pulseYellow {
0%,
100% {
text-shadow: 0 0 4px rgba(245, 158, 11, 0.3);
}
50% {
text-shadow: 0 0 20px rgba(245, 158, 11, 0.8);
}
}

@keyframes pulseCyan {
0%,
100% {
text-shadow: 0 0 4px rgba(34, 211, 238, 0.3);
}
50% {
text-shadow: 0 0 20px rgba(34, 211, 238, 0.8);
}
}

@keyframes pulseGreen {
0%,
100% {
text-shadow: 0 0 4px rgba(34, 197, 94, 0.3);
}
50% {
text-shadow: 0 0 20px rgba(34, 197, 94, 0.8);
}
}

.dashboardHeadlineGlow {
animation: headlinePulse 6s infinite;
}

@keyframes headlinePulse {
0%,
100% {
text-shadow: 0 0 5px rgba(255, 255, 255, 0.2);
}
50% {
text-shadow: 0 0 25px rgba(96, 165, 250, 0.5);
}
}
`}</style>
</main>
);
}
