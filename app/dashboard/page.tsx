'use client';

import { useEffect, useState } from 'react';

export default function Dashboard() {
const [isScanning, setIsScanning] = useState(false);
const [scanMode, setScanMode] = useState<'idle' | 'running' | 'complete'>('idle');
const [progress, setProgress] = useState(0);

const [health, setHealth] = useState(91);
const [risk, setRisk] = useState(58);
const [loss, setLoss] = useState(2840);

const [healthDelta, setHealthDelta] = useState('+1.8%');
const [riskDelta, setRiskDelta] = useState('-1.2');
const [lossDelta, setLossDelta] = useState('-$210');

function runScan() {
if (isScanning) return;

setIsScanning(true);
setScanMode('running');
setProgress(0);
}

useEffect(() => {
if (!isScanning) return;

if (progress >= 100) {
setIsScanning(false);
setScanMode('complete');

setHealth(h => Math.min(96, h + 1));
setRisk(r => Math.max(50, r - 1));
setLoss(l => Math.max(2000, l - 120));

setHealthDelta(`+${(Math.random() * 2 + 1).toFixed(1)}%`);
setRiskDelta(`-${(Math.random() * 1.5 + 0.5).toFixed(1)}`);
setLossDelta(`-$${Math.floor(Math.random() * 200 + 80)}`);

setTimeout(() => setScanMode('idle'), 1400);
return;
}

const t = setTimeout(() => setProgress(p => p + 10), 120);
return () => clearTimeout(t);
}, [isScanning, progress]);

return (
<main className={`page ${scanMode}`}>

{/* HEADER */}
<div className="header">
<h1 className="logo">GHOSTLAYER</h1>

<button onClick={runScan} className="scanBtn">
{isScanning ? `${progress}%` : 'Run Scan'}
</button>
</div>

{/* HERO */}
<section className="hero">
<h2 className="headline">
Detect execution drag before it compounds across the workflow layer
</h2>
</section>

{/* METRICS */}
<section className="grid">

<div className="card">
<p>Workflow Health</p>
<h3>{health}%</h3>
<span className="delta green">{healthDelta}</span>
</div>

<div className="card">
<p>Risk Score</p>
<h3>{risk}/100</h3>
<span className="delta cyan">{riskDelta}</span>
</div>

<div className="card">
<p>Monthly Loss</p>
<h3>${loss}</h3>
<span className="delta red">{lossDelta}</span>
</div>

</section>

{/* CHART */}
<section className="chart card">
<p>Workflow Trend</p>
<div className="chartFake" />
</section>

{/* SIDEBAR RAIL */}
<div className="rail">
<span className="dot green" />
<span className="dot cyan" />
<span className="dot yellow" />
<span className="dot red" />
</div>

<style jsx>{`

.page {
background:#05070b;
color:white;
min-height:100vh;
padding:24px;
}

.header {
display:flex;
justify-content:space-between;
align-items:center;
}

.logo {
font-weight:700;
letter-spacing:.1em;
animation:logoPulse 3s infinite;
}

.scanBtn {
background:white;
color:black;
padding:8px 14px;
border-radius:10px;
font-weight:600;
}

.hero {
margin-top:40px;
}

.headline {
font-size:28px;
animation:headlineGlow 6s infinite;
}

.grid {
display:grid;
grid-template-columns:repeat(auto-fit,minmax(200px,1fr));
gap:16px;
margin-top:30px;
}

.card {
background:#0a0d14;
padding:20px;
border-radius:20px;
border:1px solid rgba(255,255,255,.08);
transition:.25s;
}

.card:hover {
transform:translateY(-4px);
box-shadow:0 0 20px rgba(0,255,255,.15);
}

.delta {
display:inline-block;
margin-top:10px;
font-size:12px;
}

.green { color:#86efac }
.cyan { color:#7dd3fc }
.red { color:#fca5a5 }

.chartFake {
height:140px;
margin-top:10px;
background:linear-gradient(to right, transparent, rgba(0,255,255,.3), transparent);
animation:chartMove 4s infinite linear;
}

.rail {
position:fixed;
right:20px;
top:50%;
display:flex;
flex-direction:column;
gap:10px;
}

.dot {
width:10px;
height:10px;
border-radius:50%;
animation:pulse 2s infinite;
}

.dot.green { background:#86efac }
.dot.cyan { background:#7dd3fc }
.dot.yellow { background:#fde68a }
.dot.red { background:#f87171 }

/* SCAN MODE */
.running {
box-shadow:0 0 40px rgba(0,255,255,.1) inset;
}

.complete {
box-shadow:0 0 40px rgba(0,255,150,.1) inset;
}

/* ANIMATIONS */
@keyframes pulse {
50% { transform:scale(1.3); opacity:1 }
}

@keyframes logoPulse {
50% { text-shadow:0 0 20px rgba(255,255,255,.6) }
}

@keyframes headlineGlow {
50% { text-shadow:0 0 20px rgba(0,200,255,.5) }
}

@keyframes chartMove {
from { transform:translateX(-20%) }
to { transform:translateX(20%) }
}

/* MOBILE FIX */
@media(max-width:768px){
.page { padding:16px }
.headline { font-size:22px }
}

`}</style>
</main>
);
}
