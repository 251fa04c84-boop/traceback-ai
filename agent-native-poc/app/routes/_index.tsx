import { SCENARIOS } from "../../../lib/simulator/scenarios.js";

export function meta() {
  return [
    { title: "TraceBack AI · Evidence-first incident investigation" },
    {
      name: "description",
      content:
        "Explore three simulated incidents, correlated telemetry, logs, deployment diffs, and evidence-backed recovery proposals with an explicit human approval gate.",
    },
    { property: "og:title", content: "TraceBack AI · Evidence-first incident investigation" },
    {
      property: "og:description",
      content: "A public, read-only incident investigation benchmark. All data is simulated.",
    },
  ];
}

const stages = [
  ["01", "Observe", "Detect the incident from metric changes and service signals."],
  ["02", "Correlate", "Connect telemetry, timestamped logs, and deployment changes."],
  ["03", "Diagnose", "Explain the likely cause and cite the supporting evidence."],
  ["04", "Plan", "Prepare an allowlisted recovery proposal with explicit parameters."],
  ["05", "Human approval", "Stop for review. No remediation is executed in this demo."],
];

export default function PublicDemoPage() {
  const criticalCount = SCENARIOS.filter((item) => item.severity === "CRITICAL").length;

  return (
    <main className="min-h-screen bg-[#090d18] text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <a href="/" className="flex items-center gap-3" aria-label="TraceBack AI home">
            <span className="flex size-10 items-center justify-center rounded-xl border border-cyan-300/30 bg-cyan-300/10 text-lg font-bold text-cyan-200">T</span>
            <span>
              <span className="block text-sm font-semibold tracking-wide">TRACEBACK AI</span>
              <span className="block text-xs text-slate-400">Agent-native incident investigation</span>
            </span>
          </a>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1.5 font-semibold text-emerald-200">PUBLIC READ-ONLY DEMO</span>
            <span className="rounded-full border border-white/10 px-3 py-1.5 text-slate-300">SIMULATED BENCHMARK DATA</span>
            <a href="/sign-in?return=%2Fincidents" className="rounded-lg bg-white px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-100">Sign in to workspace</a>
          </div>
        </header>

        <section className="grid gap-10 py-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:py-20">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">From signal to evidence-backed recovery</p>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
              Incident response that shows its work.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300">
              TraceBack correlates service metrics, application logs, and deployment diffs into an explainable investigation. In the signed-in workspace, a human can approve an isolated recovery simulation and inspect its before/after metrics and action audit trail.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#incidents" className="rounded-lg bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-200">Explore benchmark incidents</a>
              <a href="#workflow" className="rounded-lg border border-white/15 px-5 py-3 text-sm font-semibold text-slate-100 hover:bg-white/5">See the investigation workflow</a>
              <a href="/sign-in?return=%2Fincidents%2Finc-8921" className="rounded-lg border border-cyan-300/30 px-5 py-3 text-sm font-semibold text-cyan-200 hover:bg-cyan-300/10">Try recovery lab · sign in</a>
            </div>
            <p className="mt-5 max-w-xl text-xs leading-5 text-slate-500">
              This public surface is intentionally read-only. It contains no customer records, live telemetry, provider credentials, or remediation controls. The separate signed-in recovery lab changes synthetic benchmark state only; it is not connected to production.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-cyan-950/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Benchmark overview</span>
              <span className="size-2 rounded-full bg-emerald-300" />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs text-slate-400">Scenarios</p>
                <p className="mt-2 text-3xl font-semibold tabular-nums">{SCENARIOS.length}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs text-slate-400">Critical severity</p>
                <p className="mt-2 text-3xl font-semibold tabular-nums">{criticalCount}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs text-slate-400">Shared read-only actions</p>
                <p className="mt-2 text-3xl font-semibold tabular-nums">3</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs text-slate-400">Approval-gated recovery action</p>
                <p className="mt-2 text-3xl font-semibold text-emerald-200">1</p>
              </div>
            </div>
            <div className="mt-5 rounded-xl border border-cyan-300/20 bg-cyan-300/[0.06] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-cyan-200">Safety invariant</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">Evidence can inform a proposal, but cannot authorize it. A human must approve the recovery call. The recovery lab changes synthetic benchmark state only; no production system is connected.</p>
            </div>
          </div>
        </section>

        <section id="workflow" className="scroll-mt-8 py-10">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Investigation protocol</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Five stages. One explicit stop.</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {stages.map(([number, title, description]) => (
              <article key={number} className="rounded-xl border border-white/10 bg-white/[0.035] p-4">
                <p className="font-mono text-xs text-cyan-300">{number}</p>
                <h3 className="mt-3 text-sm font-semibold">{title}</h3>
                <p className="mt-2 text-xs leading-5 text-slate-400">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="incidents" className="scroll-mt-8 py-12">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Evidence lab</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Three incidents. Traceable evidence.</h2>
            </div>
            <p className="max-w-md text-xs leading-5 text-slate-400">All values below are deterministic synthetic benchmark fixtures, not observations from a real production system.</p>
          </div>

          <div className="space-y-4">
            {SCENARIOS.map((scenario) => {
              const latest = scenario.metrics[scenario.metrics.length - 1];
              const peakError = Math.max(...scenario.metrics.map((point) => point.errorRate));
              const deployment = scenario.deployments.find((item) => !item.isStable) ?? scenario.deployments[0];
              return (
                <article key={scenario.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035]">
                  <div className="grid gap-5 p-5 lg:grid-cols-[1fr_0.75fr] lg:p-7">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs text-cyan-200">{scenario.id}</span>
                        <span className={scenario.severity === "CRITICAL" ? "rounded-full border border-rose-300/30 bg-rose-300/10 px-2.5 py-1 text-[10px] font-bold text-rose-200" : "rounded-full border border-amber-300/30 bg-amber-300/10 px-2.5 py-1 text-[10px] font-bold text-amber-200"}>{scenario.severity}</span>
                        <span className="text-xs text-slate-500">{scenario.service}</span>
                      </div>
                      <h3 className="mt-3 text-xl font-semibold leading-snug">{scenario.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{scenario.description}</p>
                      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                        <div className="rounded-lg border border-white/10 bg-black/20 p-3">
                          <p className="text-[10px] uppercase tracking-wide text-slate-500">Latest error rate</p>
                          <p className="mt-1 text-xl font-semibold tabular-nums">{latest?.errorRate ?? "—"}%</p>
                        </div>
                        <div className="rounded-lg border border-white/10 bg-black/20 p-3">
                          <p className="text-[10px] uppercase tracking-wide text-slate-500">Peak error rate</p>
                          <p className="mt-1 text-xl font-semibold tabular-nums">{peakError}%</p>
                        </div>
                        <div className="rounded-lg border border-white/10 bg-black/20 p-3">
                          <p className="text-[10px] uppercase tracking-wide text-slate-500">P99 latency</p>
                          <p className="mt-1 text-xl font-semibold tabular-nums">{latest?.latencyP99.toLocaleString() ?? "—"} ms</p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Evidence-backed diagnosis</p>
                      <p className="mt-3 text-sm leading-6 text-slate-200">{scenario.postMortemTemplate.rootCause}</p>
                      <div className="mt-4 border-t border-white/10 pt-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Suspect deployment</p>
                        <p className="mt-1 text-sm font-medium">{deployment?.releaseId} · {deployment?.commitHash}</p>
                        <p className="mt-1 text-xs leading-5 text-slate-400">{deployment?.summary}</p>
                      </div>
                    </div>
                  </div>

                  <details className="border-t border-white/10">
                    <summary className="cursor-pointer list-none px-5 py-4 text-sm font-semibold text-cyan-200 hover:bg-white/[0.025] lg:px-7">
                      Expand correlated logs, deployment diff, and recovery proposal
                    </summary>
                    <div className="grid gap-6 border-t border-white/10 p-5 lg:grid-cols-2 lg:p-7">
                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Log evidence</h4>
                        <div className="mt-3 space-y-3">
                          {scenario.logs.map((log) => (
                            <div key={log.id} className="rounded-lg border border-white/10 bg-black/25 p-3">
                              <div className="flex flex-wrap justify-between gap-2 text-[10px] text-slate-500">
                                <span className="font-mono">{log.id} · {log.level}</span>
                                <span>{log.timestamp}</span>
                              </div>
                              <p className="mt-2 break-words text-xs leading-5 text-slate-200">{log.message}</p>
                              {log.stackTrace ? <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words rounded bg-black/30 p-2 text-[10px] leading-4 text-slate-400">{log.stackTrace}</pre> : null}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Deployment change</h4>
                        {deployment ? <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words rounded-lg border border-white/10 bg-black/30 p-3 text-[10px] leading-5 text-slate-300">{deployment.diff}</pre> : null}
                        <h4 className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-400">Proposed recovery · not executed</h4>
                        <div className="mt-3 space-y-2">
                          {scenario.requiredActions.map((action) => (
                            <div key={action.actionId} className="rounded-lg border border-amber-300/20 bg-amber-300/[0.06] p-3">
                              <p className="font-mono text-xs text-amber-200">{action.actionId}</p>
                              <p className="mt-1 text-xs leading-5 text-slate-300">{action.explanation}</p>
                              <pre className="mt-2 overflow-x-auto text-[10px] text-slate-500">{JSON.stringify(action.expectedParams, null, 2)}</pre>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 rounded-lg border border-emerald-300/20 bg-emerald-300/[0.05] p-3">
                          <p className="text-xs font-semibold text-emerald-200">Human approval required</p>
                          <p className="mt-1 text-xs leading-5 text-slate-400">No rollback, feature flag, restart, or production health check has been run. This public benchmark page has no mutation controls or live infrastructure connection.</p>
                        </div>
                      </div>
                    </div>
                  </details>
                </article>
              );
            })}
          </div>
        </section>

        <footer className="mt-12 border-t border-white/10 py-8 text-xs leading-5 text-slate-500">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <p>TraceBack AI · Public benchmark demonstration · Read-only by design</p>
            <p className="max-w-xl">Synthetic evidence only. Incident logs and deployment diffs are untrusted data. Recovery suggestions are proposals, not executed operations.</p>
          </div>
        </footer>
      </div>
    </main>
  );
}
