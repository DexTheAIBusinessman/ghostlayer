"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const [companyName, setCompanyName] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [bottleneck, setBottleneck] = useState("");
  const [saasSpend, setSaasSpend] = useState("");

  const [analysis, setAnalysis] = useState("No scan has been run yet.");
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  async function runScan() {
    setLoading(true);
    setSaveMessage("");
    setFeedbackMessage("");
    setAnalysis("Running AI scan...");

    setTimeout(() => {
      setAnalysis(
`🔍 WORKFLOW SCAN COMPLETE

Company:
${companyName || "Unknown Company"}

Team Size:
${teamSize || "Not provided"}

Biggest Workflow Bottleneck:
${bottleneck || "Not provided"}

Monthly Operational Cost Impact:
$${saasSpend || "0"}

Detected Workflow Risks:
- Task delays tied to ${bottleneck || "unclear workflow stages"}
- Duplicate effort across team responsibilities
- Handoff friction causing work to stall between owners

Estimated Impact:
~$3,200 - $5,000 in monthly productivity loss

Priority Fixes:
1. Clarify ownership at each workflow stage
2. Remove duplicated steps across teams
3. Add visibility at handoff points to prevent delays

GHOSTLAYER Confidence Score: 87%`
      );

      setLoading(false);
    }, 2000);
  }

  async function saveScan() {
    try {
      setSaveMessage("Saving scan...");

      const { error } = await supabase.from("scans").insert([
        {
          company_name: companyName || "Unknown Company",
          team_size: teamSize || "Not provided",
          bottleneck: bottleneck || "Not provided",
          saas_spend: saasSpend || "0",
          analysis,
        },
      ]);

      if (error) {
        setSaveMessage(`Failed to save scan: ${error.message}`);
        return;
      }

      setSaveMessage("Scan saved successfully.");
    } catch {
      setSaveMessage("Failed to save scan.");
    }
  }

  function downloadReport() {
    const report = `GHOSTLAYER WORKFLOW REPORT

Company: ${companyName || "Unknown Company"}
Team Size: ${teamSize || "Not provided"}
Biggest Workflow Bottleneck: ${bottleneck || "Not provided"}
Monthly Operational Cost Impact: $${saasSpend || "0"}

SUMMARY
GHOSTLAYER detected signs of workflow inefficiency across the business.

DETECTED RISKS
- Task delays tied to ${bottleneck || "unclear workflow stages"}
- Duplicate effort across team responsibilities
- Handoff friction causing work to stall between owners

ESTIMATED IMPACT
~$3,200 - $5,000 in monthly productivity loss

RECOMMENDED ACTIONS
1. Clarify ownership at each workflow stage
2. Remove duplicated steps across teams
3. Add visibility at handoff points to prevent delays

CONFIDENCE SCORE
87%
`;

    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `ghostlayer-report-${companyName || "company"}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  function submitFeedback() {
    if (!feedback.trim()) {
      setFeedbackMessage("Please enter feedback before submitting.");
      return;
    }

    setFeedbackMessage("Feedback submitted. Thank you.");
    setFeedback("");
  }

  return (
    <main className="min-h-screen bg-black text-white flex">
      <div className="hidden w-64 border-r border-white/10 p-6 md:block">
        <Link href="/" className="text-xl font-bold glow tracking-[0.2em]">
          GHOSTLAYER
        </Link>

        <nav className="mt-10 space-y-4 text-gray-400">
          <p className="cursor-pointer hover:text-white">Overview</p>
          <p className="cursor-pointer hover:text-white">Delay Hotspots</p>
          <p className="cursor-pointer hover:text-white">Broken Handoffs</p>
          <p className="cursor-pointer hover:text-white">Duplicate Work</p>
          <p className="cursor-pointer hover:text-white">Settings</p>
        </nav>
      </div>

      <div className="flex-1 p-6 md:p-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
              Workflow Inefficiency Dashboard
            </p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Run a Workflow Inefficiency Scan
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-gray-400 md:text-base">
              Enter workflow details and GHOSTLAYER will simulate where delays,
              duplicated work, and broken handoffs are hurting performance.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={runScan}
              disabled={loading}
              className="rounded-2xl bg-white px-5 py-3 font-semibold text-black transition hover:opacity-80 disabled:opacity-50"
            >
              {loading ? "Scanning..." : "Run AI Scan"}
            </button>

            <button
              onClick={saveScan}
              className="rounded-2xl border border-cyan-400/30 px-5 py-3 font-semibold text-cyan-300 transition hover:bg-cyan-400/10"
            >
              Save Scan
            </button>

            <button
              onClick={downloadReport}
              className="rounded-2xl border border-white/20 px-5 py-3 font-semibold text-white transition hover:bg-white hover:text-black"
            >
              Download Report
            </button>
          </div>
        </div>

        {saveMessage && (
          <p className="mt-4 text-sm text-cyan-300">{saveMessage}</p>
        )}

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-sm uppercase tracking-[0.2em] text-gray-400">
              Workflow Health
            </h3>
            <p className="mt-3 text-4xl font-bold">82%</p>
            <p className="mt-2 text-sm text-gray-500">
              Stable, but with visible inefficiency across key stages.
            </p>
          </div>

          <div className="rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-6">
            <h3 className="text-sm uppercase tracking-[0.2em] text-gray-200">
              Workflow Risk Score
            </h3>
            <p className="mt-3 text-4xl font-bold">68/100</p>
            <p className="mt-2 text-sm text-gray-300">
              Elevated due to delays, repeated effort, and weak handoffs.
            </p>
          </div>

          <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6">
            <h3 className="text-sm uppercase tracking-[0.2em] text-gray-200">
              Productivity Loss
            </h3>
            <p className="mt-3 text-4xl font-bold">$3,247/mo</p>
            <p className="mt-2 text-sm text-gray-300">
              Estimated cost from workflow drag and missed execution.
            </p>
          </div>

          <div className="rounded-3xl border border-green-500/30 bg-green-500/10 p-6">
            <h3 className="text-sm uppercase tracking-[0.2em] text-gray-200">
              Savings Opportunity
            </h3>
            <p className="mt-3 text-4xl font-bold">$4,200/mo</p>
            <p className="mt-2 text-sm text-gray-300">
              Potential gain if high-friction issues are corrected.
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-xl font-semibold">Workflow Input</h3>
          <p className="mt-2 text-sm text-gray-400">
            Enter the core details below to generate a workflow inefficiency scan.
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
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-semibold">Delay Hotspots</h3>
            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Operations Approval Queue</p>
                  <span className="text-sm text-red-400">High delay</span>
                </div>
                <p className="mt-2 text-sm text-gray-400">
                  Approval steps are causing tasks to wait too long before moving forward.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Client Onboarding</p>
                  <span className="text-sm text-yellow-400">Moderate delay</span>
                </div>
                <p className="mt-2 text-sm text-gray-400">
                  Work stalls when information collection is incomplete at intake.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-semibold">Broken Handoffs</h3>
            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Sales → Operations</p>
                  <span className="text-sm text-red-400">Missing context</span>
                </div>
                <p className="mt-2 text-sm text-gray-400">
                  Key information is not consistently passed when deals move into delivery.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Support → Product</p>
                  <span className="text-sm text-yellow-400">Weak ownership</span>
                </div>
                <p className="mt-2 text-sm text-gray-400">
                  Escalated issues lack a clear owner after being transferred.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-semibold">Duplicate Work Alerts</h3>
            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Reporting Tasks</p>
                  <span className="text-sm text-cyan-300">Duplicated weekly</span>
                </div>
                <p className="mt-2 text-sm text-gray-400">
                  Two teams are recreating similar reports in separate tools.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Manual Status Updates</p>
                  <span className="text-sm text-cyan-300">Repeated effort</span>
                </div>
                <p className="mt-2 text-sm text-gray-400">
                  Team members are updating the same progress in multiple places.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-cyan-400/20 bg-white/5 p-6">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-xl font-semibold text-cyan-300">AI Analysis</h3>
            <span className="text-xs uppercase tracking-[0.2em] text-gray-500">
              Beta Estimate
            </span>
          </div>

          <p className="mt-2 text-sm text-gray-500">
            These results are directional estimates and are improving over time.
          </p>

          <pre className="mt-4 whitespace-pre-wrap text-sm leading-7 text-gray-300">
            {analysis}
          </pre>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-xl font-semibold">Help us improve GHOSTLAYER</h3>
          <p className="mt-2 text-sm text-gray-400">
            What would make this 10x more useful for your business?
          </p>

          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Tell us what would make this more useful..."
            className="mt-6 min-h-[140px] w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-cyan-400/50"
          />

          <button
            onClick={submitFeedback}
            className="mt-4 rounded-2xl bg-white px-5 py-3 font-semibold text-black transition hover:opacity-85"
          >
            Submit Feedback
          </button>

          {feedbackMessage && (
            <p className="mt-4 text-sm text-cyan-300">{feedbackMessage}</p>
          )}
        </div>
      </div>
    </main>
  );
}
