import { useActionMutation, useActionQuery } from "@agent-native/core/client/hooks";
import { useSetPageTitle } from "@agent-native/toolkit/app-shell";
import { useParams } from "react-router";
import { SCENARIOS } from "../../../lib/simulator/scenarios.js";

const INCIDENT_IDS = ["inc-8921", "inc-4402", "inc-7119"] as const;

export function meta() {
  return [{ title: "Incident evidence · TraceBack AI" }];
}

export default function IncidentEvidencePage() {
  const { incidentId = "" } = useParams();
  const validIncidentId = INCIDENT_IDS.find((id) => id === incidentId);
  const selectedIncidentId = validIncidentId ?? "inc-8921";
  useSetPageTitle("Incident evidence");

  // The UI reads the same official Agent-Native actions exposed to the agent.
  // Local benchmark rendering remains available if the action service is offline.
  const {
    data: actionEvidence,
    isLoading: evidenceLoading,
    error: evidenceError,
  } = useActionQuery("get-incident-evidence", { incidentId: selectedIncidentId });
  const {
    data: actionBrief,
    isLoading: briefLoading,
    error: briefError,
  } = useActionQuery("build-investigation-brief", { incidentId: selectedIncidentId });

  // This UI control and the agent chat call the exact same approval-gated action.
  const recovery = useActionMutation("execute-recovery-simulation");

  const scenario = validIncidentId
    ? SCENARIOS.find((item) => item.id === validIncidentId)
    : undefined;

  if (!scenario) {
    return (
      <main className="mx-auto max-w-4xl space-y-4 p-6">
        <h1 className="text-2xl font-semibold">Incident not found</h1>
        <a className="text-sm underline" href="/incidents">Back to incidents</a>
      </main>
    );
  }

  const latest = scenario.metrics[scenario.metrics.length - 1];
  const deployment = scenario.deployments.find((item) => !item.isStable) ?? scenario.deployments[0];
  const peakErrorRate = Math.max(...scenario.metrics.map((metric) => metric.errorRate));
  const peakLatency = Math.max(...scenario.metrics.map((metric) => metric.latencyP99));
  const evidenceChain = [
    {
      id: "telemetry",
      label: "1 · Signal",
      title: scenario.metrics.length + " telemetry samples",
      detail: "Peak error rate " + peakErrorRate + "% · peak p99 " + peakLatency.toLocaleString() + " ms",
      sources: scenario.metrics.map((metric) => metric.time + " · " + metric.errorRate + "% errors · " + metric.latencyP99.toLocaleString() + " ms p99"),
    },
    {
      id: "logs",
      label: "2 · Runtime evidence",
      title: scenario.logs.length + " correlated log entries",
      detail: "Application errors and warnings from " + scenario.service,
      sources: scenario.logs.map((log) => log.id + " · " + log.level + " · " + log.message),
    },
    {
      id: "change",
      label: "3 · Change evidence",
      title: deployment?.releaseId ? deployment.releaseId + " · " + deployment.commitHash : "No deployment record",
      detail: deployment?.summary ?? "No deployment record available",
      sources: deployment ? [deployment.diff] : [],
    },
    {
      id: "diagnosis",
      label: "4 · Diagnosis",
      title: "Template-based hypothesis",
      detail: "Deterministic Fallback — template-based hypothesis, not a verified root cause. " + scenario.postMortemTemplate.rootCause,
      sources: ["Trigger hypothesis: " + scenario.postMortemTemplate.trigger, "Potential impact: " + scenario.postMortemTemplate.blastRadius, "Synthetic benchmark evidence; correlation does not establish production causality."],
    },
  ];
  const fallbackStages = [
    {
      id: "observe",
      title: "Observe",
      summary: latest
        ? "Latest sample at " + latest.time + ": " + latest.errorRate + "% error rate and " + latest.latencyP99.toLocaleString() + " ms p99 latency."
        : "No telemetry sample is available.",
      evidence: [
        "Severity: " + scenario.severity + " · Service: " + scenario.service,
        "Peak sampled error rate: " + peakErrorRate + "% · Peak p99 latency: " + peakLatency.toLocaleString() + " ms",
      ],
    },
    {
      id: "correlate",
      title: "Correlate evidence",
      summary: "Compared " + scenario.logs.length + " application log entries with the suspect deployment and its code diff.",
      evidence: [
        ...scenario.logs.map((log) => log.id + " · " + log.timestamp + ": " + log.message),
        ...(deployment ? ["Suspect release " + deployment.releaseId + " · commit " + deployment.commitHash + ": " + deployment.summary, "Deployment diff: " + deployment.diff] : []),
      ],
    },
    {
      id: "diagnose",
      title: "Diagnose",
      summary: "Deterministic Fallback — template-based hypothesis, not a verified root cause. " + scenario.postMortemTemplate.rootCause,
      evidence: [
        "This diagnosis comes from the benchmark scenario template, not live AI analysis or independent causal verification.",
        "Trigger hypothesis: " + scenario.postMortemTemplate.trigger,
        "Potential impact: " + scenario.postMortemTemplate.blastRadius,
        "Synthetic benchmark evidence; correlation does not establish production causality.",
      ],
    },
    {
      id: "plan",
      title: "Prepare recovery plan",
      summary: scenario.requiredActions.length + " allowlisted recovery proposal(s) prepared for human review. No action has been run.",
      evidence: scenario.requiredActions.map((action) => action.explanation),
    },
    {
      id: "approval",
      title: "Human approval gate",
      summary: "Execution is locked. This public benchmark demo is not connected to live infrastructure; a server-authenticated approver and a separate execution/verification workflow are required before any real remediation.",
      evidence: [
        "No production service, feature flag, or deployment was changed.",
        "The incident evidence and proposed recovery actions are simulated benchmark data.",
      ],
    },
  ];
  const stages = actionBrief?.stages ?? fallbackStages;

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 p-4 sm:p-6">
      <a href="/incidents" className="text-sm text-muted-foreground underline underline-offset-4">← All incidents</a>
      <header className="space-y-2">
        <p className="font-mono text-xs text-muted-foreground">{scenario.id} · {scenario.service}</p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{scenario.title}</h1>
        <p className="text-sm text-muted-foreground">Simulated benchmark evidence. No live infrastructure is connected.</p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {scenario.metrics.map((metric) => (
          <article key={metric.time} className="rounded-xl border bg-card p-4">
            <p className="text-xs text-muted-foreground">{metric.time}</p>
            <p className="mt-2 text-xl font-semibold">{metric.errorRate}%</p>
            <p className="text-xs text-muted-foreground">Error rate</p>
            <p className="mt-3 text-sm font-medium">{metric.latencyP99.toLocaleString()} ms p99</p>
            <p className="mt-1 text-xs text-muted-foreground">CPU {metric.cpuUsage}% · Memory {metric.memoryUsage}%</p>
          </article>
        ))}
      </section>

      <section className="space-y-4 rounded-xl border bg-card p-4 sm:p-5" aria-labelledby="evidence-chain-title">
        <header className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">Evidence graph · inspectable provenance</p>
          <h2 id="evidence-chain-title" className="text-xl font-semibold">How TraceBack formed this hypothesis</h2>
          <p className="text-sm text-muted-foreground">The diagnosis is a deterministic template hypothesis, not a verified root cause. Follow the synthetic benchmark evidence from observed signals to the suspected change; correlation is not proof of production causality.</p>
        </header>
        <ol className="grid gap-3 lg:grid-cols-4">
          {evidenceChain.map((node, index) => (
            <li key={node.id} className="min-w-0 rounded-lg border p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-cyan-700">{node.label}</span>
                {index < evidenceChain.length - 1 ? <span className="text-xs text-muted-foreground">leads to →</span> : <span className="text-xs text-muted-foreground">assessment</span>}
              </div>
              <h3 className="mt-3 text-sm font-semibold">{node.title}</h3>
              <p className="mt-2 break-words text-xs leading-relaxed text-muted-foreground">{node.detail}</p>
              <details className="mt-3 border-t pt-3">
                <summary className="cursor-pointer text-xs font-semibold">Inspect source evidence ({node.sources.length})</summary>
                <ul className="mt-2 max-h-56 space-y-2 overflow-y-auto text-xs text-muted-foreground">
                  {node.sources.map((source, sourceIndex) => (
                    <li key={node.id + "-source-" + sourceIndex} className="break-words rounded-md bg-muted/50 p-2">{source}</li>
                  ))}
                </ul>
              </details>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-3 rounded-xl border bg-card p-4 sm:p-5" aria-labelledby="shared-actions-title">
        <header className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Shared Agent-Native action layer</p>
          <h2 id="shared-actions-title" className="text-lg font-semibold">Live action results</h2>
          <p className="text-sm text-muted-foreground">The interface and assistant share the same typed actions; recovery is a separate approval-gated operation.</p>
        </header>
        <div className="grid gap-3 sm:grid-cols-2">
          <article className="rounded-lg border p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">get-incident-evidence</p>
            {evidenceLoading ? (
              <p className="mt-2 text-sm text-muted-foreground">Loading evidence action…</p>
            ) : actionEvidence ? (
              <p className="mt-2 text-sm">Action returned {actionEvidence.metrics.length} telemetry samples, {actionEvidence.logs.length} logs, and {actionEvidence.deployments.length} deployment records.</p>
            ) : evidenceError ? (
              <p className="mt-2 text-sm text-muted-foreground">Action unavailable. The clearly labelled local benchmark view remains available.</p>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">Waiting for action response.</p>
            )}
          </article>
          <article className="rounded-lg border p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">build-investigation-brief</p>
            {briefLoading ? (
              <p className="mt-2 text-sm text-muted-foreground">Building five-stage brief…</p>
            ) : actionBrief ? (
              <p className="mt-2 text-sm">Action returned all {actionBrief.stages.length} stages and {actionBrief.recommendedActions.length} recovery proposal(s). Execution remains locked.</p>
            ) : briefError ? (
              <p className="mt-2 text-sm text-muted-foreground">Action unavailable. Showing the local benchmark investigation instead.</p>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">Waiting for action response.</p>
            )}
          </article>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-cyan-500/30 bg-card p-4 sm:p-5" aria-labelledby="recovery-simulation-title">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">Human-controlled recovery lab</p>
            <h2 id="recovery-simulation-title" className="text-xl font-semibold">Execute and verify a recovery plan</h2>
            <p className="text-sm text-muted-foreground">
              Your click explicitly approves this isolated benchmark simulation. The agent can propose the same action, but its call pauses for human approval first.
            </p>
          </div>
          <button
            type="button"
            onClick={() => recovery.mutate({ incidentId: selectedIncidentId })}
            disabled={recovery.isPending}
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {recovery.isPending ? "Running simulation…" : "Approve & run recovery simulation"}
          </button>
        </header>
        {recovery.error ? (
          <p role="alert" className="rounded-lg border border-destructive/40 p-3 text-sm text-destructive">
            Simulation could not run: {recovery.error.message}
          </p>
        ) : null}
        {recovery.data ? (
          <div className="space-y-4 border-t pt-4">
            {(() => {
              const errorDelta = recovery.data.before.latestErrorRate - recovery.data.after.latestErrorRate;
              const latencyDelta = recovery.data.before.latestP99Latency - recovery.data.after.latestP99Latency;
              return (
                <div className="grid gap-3 sm:grid-cols-2" aria-label="Simulated recovery metric deltas">
                  <article className="rounded-lg border p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Error-rate change</p>
                    <p className={errorDelta >= 0 ? "mt-2 text-2xl font-semibold text-emerald-700" : "mt-2 text-2xl font-semibold text-rose-700"}>
                      {errorDelta > 0 ? "−" : errorDelta < 0 ? "+" : ""}{Math.abs(errorDelta).toFixed(2)} percentage points
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{errorDelta >= 0 ? "Simulated improvement" : "Simulated regression"} · before minus after</p>
                  </article>
                  <article className="rounded-lg border p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">P99 latency change</p>
                    <p className={latencyDelta >= 0 ? "mt-2 text-2xl font-semibold text-emerald-700" : "mt-2 text-2xl font-semibold text-rose-700"}>
                      {latencyDelta > 0 ? "−" : latencyDelta < 0 ? "+" : ""}{Math.abs(latencyDelta).toLocaleString()} ms
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{latencyDelta >= 0 ? "Simulated improvement" : "Simulated regression"} · before minus after</p>
                  </article>
                </div>
              );
            })()}
            <div className="grid gap-3 sm:grid-cols-2">
              <article className="rounded-lg border p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Before · {recovery.data.before.health}</p>
                <p className="mt-2 text-2xl font-semibold">{recovery.data.before.latestErrorRate}%</p>
                <p className="text-xs text-muted-foreground">Error rate</p>
                <p className="mt-2 text-sm">{recovery.data.before.latestP99Latency.toLocaleString()} ms p99</p>
                <p className="mt-1 text-xs text-muted-foreground">Release {recovery.data.before.activeRelease}</p>
              </article>
              <article className="rounded-lg border border-emerald-500/40 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">After · {recovery.data.after.health}</p>
                <p className="mt-2 text-2xl font-semibold">{recovery.data.after.latestErrorRate}%</p>
                <p className="text-xs text-muted-foreground">Simulated error rate</p>
                <p className="mt-2 text-sm">{recovery.data.after.latestP99Latency.toLocaleString()} ms p99</p>
                <p className="mt-1 text-xs text-muted-foreground">Release {recovery.data.after.activeRelease}</p>
              </article>
            </div>
            <div className="min-w-0 rounded-lg border p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold">Recovery execution and verification</h3>
                <span className="rounded-full border border-emerald-500/40 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  {recovery.data.verification.status}
                </span>
              </div>
              <ul className="mt-3 space-y-2 text-sm">
                {recovery.data.actions.map((action, index) => (
                  <li key={action.actionId + "-" + index} className="border-t pt-2 first:border-0 first:pt-0">
                    <p className="font-mono text-xs font-semibold">{action.actionId} · {action.success ? "SUCCESS" : "FAILED"}</p>
                    <p className="mt-1 text-muted-foreground">{action.message}</p>
                  </li>
                ))}
              </ul>
              <ul className="mt-3 space-y-1 border-t pt-3 text-xs text-muted-foreground">
                {recovery.data.verification.evidence.map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            </div>
            <details className="rounded-lg border p-4">
              <summary className="cursor-pointer text-sm font-semibold">View action audit trail ({recovery.data.auditTrail.length} entries)</summary>
              <ol className="mt-3 space-y-2">
                {recovery.data.auditTrail.map((entry) => (
                  <li key={entry.id} className="border-t pt-2 first:border-0 first:pt-0">
                    <p className="text-xs font-semibold">{entry.actionId} · {entry.status} · {entry.resultingHealth}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{entry.timestamp} · {entry.executedBy}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{entry.notes}</p>
                  </li>
                ))}
              </ol>
            </details>
            <p className="rounded-lg border border-amber-500/40 bg-amber-500/5 p-3 text-xs leading-relaxed text-muted-foreground">
              {recovery.data.safetyNotice}
            </p>
          </div>
        ) : (
          <p className="border-t pt-3 text-xs text-muted-foreground">
            No recovery has been run in this session. The simulator only changes synthetic benchmark state; it cannot reach production services.
          </p>
        )}
      </section>

      <section className="space-y-4 rounded-xl border bg-card p-4 sm:p-5" aria-labelledby="investigation-title">
        <header className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Agent-Native workflow</p>
          <h2 id="investigation-title" className="text-xl font-semibold">Five-stage investigation</h2>
          <p className="text-sm text-muted-foreground">Action-backed results are shown when available; the deterministic local benchmark remains as a transparent fallback.</p>
        </header>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {stages.map((stage, index) => (
            <article key={stage.id} className="min-w-0 rounded-lg border p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs text-muted-foreground">0{index + 1}</span>
                <span className={stage.id === "approval" ? "rounded-full border border-amber-500/40 px-2 py-1 text-[10px] font-semibold text-amber-700" : "rounded-full border px-2 py-1 text-[10px] font-semibold text-muted-foreground"}>
                  {stage.id === "approval" ? "REVIEW GATE" : "EVIDENCE READY"}
                </span>
              </div>
              <h3 className="mt-3 text-sm font-semibold">{stage.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{stage.summary}</p>
              <ul className="mt-3 space-y-2 border-t pt-3 text-xs text-muted-foreground">
                {stage.evidence.map((item, evidenceIndex) => (
                  <li key={stage.id + "-" + evidenceIndex} className="break-words">{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="grid min-w-0 gap-4 lg:grid-cols-2">
          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-semibold">Proposed recovery actions</h3>
            {(actionBrief?.recommendedActions ?? scenario.requiredActions.map((action) => ({
              actionId: action.actionId,
              explanation: action.explanation,
              parameters: JSON.stringify(action.expectedParams),
            }))).map((action) => (
              <div key={action.actionId} className="mt-3 border-t pt-3 first:border-0 first:pt-0">
                <p className="font-mono text-xs font-semibold">{action.actionId}</p>
                <p className="mt-1 text-sm text-muted-foreground">{action.explanation}</p>
                <p className="mt-2 break-all font-mono text-[11px] text-muted-foreground">Parameters: {action.parameters}</p>
              </div>
            ))}
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-semibold">Prevention recommendation</h3>
            <p className="mt-2 text-sm text-muted-foreground">{actionBrief?.recommendedPrevention ?? scenario.postMortemTemplate.recommendedPrevention}</p>
            <p className="mt-3 rounded-md border border-amber-500/40 bg-amber-500/5 p-3 text-xs leading-relaxed text-muted-foreground">
              {recovery.data ? "The isolated recovery simulation completed above. Its health result is synthetic and does not confirm any live infrastructure recovery." : "Human approval is required. This benchmark view is not connected to live infrastructure. No recovery action has been executed."}
            </p>
          </div>
        </div>
      </section>

      <section className="grid min-w-0 gap-5 lg:grid-cols-2">
        <div className="min-w-0 space-y-3 rounded-xl border bg-card p-4 sm:p-5">
          <h2 className="text-lg font-semibold">Application logs</h2>
          {(actionEvidence?.logs ?? scenario.logs).map((log) => (
            <article key={log.id} className="min-w-0 space-y-2 border-t pt-3 first:border-0 first:pt-0">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold">{log.level}</span>
                <time className="text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</time>
              </div>
              <p className="break-words text-sm">{log.message}</p>
              {log.stackTrace ? <pre style={{ overflowWrap: "anywhere" }} className="min-w-0 max-w-full overflow-x-hidden whitespace-pre-wrap break-all rounded-md bg-muted p-3 text-xs">{log.stackTrace}</pre> : null}
            </article>
          ))}
        </div>
        <div className="space-y-3 rounded-xl border bg-card p-4 sm:p-5">
          <h2 className="text-lg font-semibold">Deployment evidence</h2>
          {(actionEvidence?.deployments ?? scenario.deployments).map((item) => (
            <article key={item.releaseId} className="min-w-0 space-y-2 border-t pt-3 first:border-0 first:pt-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-sm font-semibold">{item.releaseId}</span>
                <span className="text-xs text-muted-foreground">{item.isStable ? "Stable" : "Active / suspect"}</span>
              </div>
              <p className="break-words text-sm">{item.summary}</p>
              <p className="text-xs text-muted-foreground">{item.commitHash} · {item.author}</p>
              <pre style={{ overflowWrap: "anywhere" }} className="min-w-0 max-w-full overflow-x-hidden whitespace-pre-wrap break-all rounded-md bg-muted p-3 text-xs">{item.diff}</pre>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-3 rounded-xl border bg-card p-4 sm:p-5">
        <h2 className="text-lg font-semibold">Evidence summary</h2>
        <dl className="space-y-3 text-sm">
          <div><dt className="font-semibold">Root cause</dt><dd className="mt-1 text-muted-foreground">{actionEvidence?.rootCause ?? scenario.postMortemTemplate.rootCause}</dd></div>
          <div><dt className="font-semibold">Trigger</dt><dd className="mt-1 text-muted-foreground">{actionEvidence?.trigger ?? scenario.postMortemTemplate.trigger}</dd></div>
          <div><dt className="font-semibold">Blast radius</dt><dd className="mt-1 text-muted-foreground">{actionEvidence?.blastRadius ?? scenario.postMortemTemplate.blastRadius}</dd></div>
        </dl>
      </section>
    </main>
  );
}
