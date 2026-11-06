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
  useSetPageTitle("Incident evidence");

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
  const stages = [
    {
      id: "observe",
      title: "Observe",
      summary: latest
        ? `Latest sample at ${latest.time}: ${latest.errorRate}% error rate and ${latest.latencyP99.toLocaleString()} ms p99 latency.`
        : "No telemetry sample is available.",
      evidence: [
        `Severity: ${scenario.severity} · Service: ${scenario.service}`,
        `Peak sampled error rate: ${peakErrorRate}% · Peak p99 latency: ${peakLatency.toLocaleString()} ms`,
      ],
    },
    {
      id: "correlate",
      title: "Correlate evidence",
      summary: `Compared ${scenario.logs.length} application log entries with the suspect deployment and its code diff.`,
      evidence: [
        ...scenario.logs.map((log) => `${log.id} · ${log.timestamp}: ${log.message}`),
        ...(deployment ? [`Suspect release ${deployment.releaseId} · commit ${deployment.commitHash}: ${deployment.summary}`, `Deployment diff: ${deployment.diff}`] : []),
      ],
    },
    {
      id: "diagnose",
      title: "Diagnose",
      summary: scenario.postMortemTemplate.rootCause,
      evidence: [
        `Trigger: ${scenario.postMortemTemplate.trigger}`,
        `Impact: ${scenario.postMortemTemplate.blastRadius}`,
      ],
    },
    {
      id: "plan",
      title: "Prepare recovery plan",
      summary: `${scenario.requiredActions.length} allowlisted recovery proposal(s) prepared for human review. No action has been run.`,
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

      <section className="space-y-4 rounded-xl border bg-card p-4 sm:p-5" aria-labelledby="investigation-title">
        <header className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Agent-Native workflow</p>
          <h2 id="investigation-title" className="text-xl font-semibold">Five-stage investigation</h2>
          <p className="text-sm text-muted-foreground">Read-only evidence from the local benchmark scenario. Agent actions remain separately available through the Agent-Native action registry.</p>
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
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-semibold">Proposed recovery actions</h3>
            {scenario.requiredActions.map((action) => (
              <div key={action.actionId} className="mt-3 border-t pt-3 first:border-0 first:pt-0">
                <p className="font-mono text-xs font-semibold">{action.actionId}</p>
                <p className="mt-1 text-sm text-muted-foreground">{action.explanation}</p>
                <p className="mt-2 break-all font-mono text-[11px] text-muted-foreground">Parameters: {JSON.stringify(action.expectedParams)}</p>
              </div>
            ))}
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-semibold">Prevention recommendation</h3>
            <p className="mt-2 text-sm text-muted-foreground">{scenario.postMortemTemplate.recommendedPrevention}</p>
            <p className="mt-3 rounded-md border border-amber-500/40 bg-amber-500/5 p-3 text-xs leading-relaxed text-muted-foreground">
              Human approval is required. This benchmark demo is read-only and is not connected to live infrastructure. No recovery action has been executed.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-3 rounded-xl border bg-card p-4 sm:p-5">
          <h2 className="text-lg font-semibold">Application logs</h2>
          {scenario.logs.map((log) => (
            <article key={log.id} className="space-y-2 border-t pt-3 first:border-0 first:pt-0">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold">{log.level}</span>
                <time className="text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</time>
              </div>
              <p className="text-sm">{log.message}</p>
              {log.stackTrace ? <pre className="overflow-x-auto whitespace-pre-wrap rounded-md bg-muted p-3 text-xs">{log.stackTrace}</pre> : null}
            </article>
          ))}
        </div>
        <div className="space-y-3 rounded-xl border bg-card p-4 sm:p-5">
          <h2 className="text-lg font-semibold">Deployment evidence</h2>
          {scenario.deployments.map((item) => (
            <article key={item.releaseId} className="space-y-2 border-t pt-3 first:border-0 first:pt-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-sm font-semibold">{item.releaseId}</span>
                <span className="text-xs text-muted-foreground">{item.isStable ? "Stable" : "Active / suspect"}</span>
              </div>
              <p className="text-sm">{item.summary}</p>
              <p className="text-xs text-muted-foreground">{item.commitHash} · {item.author}</p>
              <pre className="overflow-x-auto whitespace-pre-wrap rounded-md bg-muted p-3 text-xs">{item.diff}</pre>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-3 rounded-xl border bg-card p-4 sm:p-5">
        <h2 className="text-lg font-semibold">Evidence summary</h2>
        <dl className="space-y-3 text-sm">
          <div><dt className="font-semibold">Root cause</dt><dd className="mt-1 text-muted-foreground">{scenario.postMortemTemplate.rootCause}</dd></div>
          <div><dt className="font-semibold">Trigger</dt><dd className="mt-1 text-muted-foreground">{scenario.postMortemTemplate.trigger}</dd></div>
          <div><dt className="font-semibold">Blast radius</dt><dd className="mt-1 text-muted-foreground">{scenario.postMortemTemplate.blastRadius}</dd></div>
        </dl>
      </section>
    </main>
  );
}
