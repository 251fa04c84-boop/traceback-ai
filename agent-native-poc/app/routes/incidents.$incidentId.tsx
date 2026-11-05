import { useActionQuery } from "@agent-native/core/client/hooks";
import { useSetPageTitle } from "@agent-native/toolkit/app-shell";
import { Link, useParams } from "react-router";

const INCIDENT_IDS = ["inc-8921", "inc-4402", "inc-7119"] as const;

export function meta() {
  return [{ title: "Incident evidence · TraceBack AI" }];
}

export default function IncidentEvidencePage() {
  const { incidentId = "" } = useParams();
  const validIncidentId = INCIDENT_IDS.find((id) => id === incidentId);
  useSetPageTitle("Incident evidence");
  const { data, isLoading, error } = useActionQuery("get-incident-evidence", {
    incidentId: validIncidentId ?? "inc-8921",
  });
  const {
    data: brief,
    isLoading: briefLoading,
    error: briefError,
  } = useActionQuery("build-investigation-brief", {
    incidentId: validIncidentId ?? "inc-8921",
  });

  if (!validIncidentId) {
    return (
      <main className="mx-auto max-w-4xl space-y-4 p-6">
        <h1 className="text-2xl font-semibold">Incident not found</h1>
        <Link className="text-sm underline" to="/incidents">Back to incidents</Link>
      </main>
    );
  }

  if (isLoading || briefLoading) {
    return <main className="mx-auto max-w-4xl space-y-4 p-6"><div className="h-8 w-2/3 animate-pulse rounded bg-muted" /><div className="h-56 animate-pulse rounded-xl bg-muted/40" /></main>;
  }

  if (error || !data || briefError || !brief) {
    return (
      <main className="mx-auto max-w-4xl space-y-4 p-6">
        <p role="alert" className="text-sm text-destructive">Unable to load incident evidence: {error?.message ?? briefError?.message ?? "No data returned."}</p>
        <Link className="text-sm underline" to="/incidents">Back to incidents</Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 p-4 sm:p-6">
      <Link to="/incidents" className="text-sm text-muted-foreground underline underline-offset-4">← All incidents</Link>
      <header className="space-y-2">
        <p className="font-mono text-xs text-muted-foreground">{data.incidentId} · {data.service}</p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{data.title}</h1>
        <p className="text-sm text-muted-foreground">Simulated benchmark evidence. No live infrastructure is connected.</p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {data.metrics.map((metric) => (
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
          <p className="text-sm text-muted-foreground">A shared read-only action builds the same evidence brief for the interface and the agent.</p>
        </header>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {brief.stages.map((stage, index) => (
            <article key={stage.id} className="min-w-0 rounded-lg border p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs text-muted-foreground">0{index + 1}</span>
                <span className={stage.status === "review-required" ? "rounded-full border border-amber-500/40 px-2 py-1 text-[10px] font-semibold text-amber-700" : "rounded-full border px-2 py-1 text-[10px] font-semibold text-muted-foreground"}>
                  {stage.status === "review-required" ? "REVIEW GATE" : "EVIDENCE READY"}
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
            {brief.recommendedActions.map((action) => (
              <div key={action.actionId + action.parameters} className="mt-3 border-t pt-3 first:border-0 first:pt-0">
                <p className="font-mono text-xs font-semibold">{action.actionId}</p>
                <p className="mt-1 text-sm text-muted-foreground">{action.explanation}</p>
                <p className="mt-2 break-all font-mono text-[11px] text-muted-foreground">Parameters: {action.parameters}</p>
              </div>
            ))}
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-semibold">Prevention recommendation</h3>
            <p className="mt-2 text-sm text-muted-foreground">{brief.recommendedPrevention}</p>
            <p className="mt-3 rounded-md border border-amber-500/40 bg-amber-500/5 p-3 text-xs leading-relaxed text-muted-foreground">
              Human approval is required. This benchmark demo is read-only and is not connected to live infrastructure. No recovery action has been executed.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-3 rounded-xl border bg-card p-4 sm:p-5">
          <h2 className="text-lg font-semibold">Application logs</h2>
          {data.logs.map((log) => (
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
          {data.deployments.map((deployment) => (
            <article key={deployment.releaseId} className="space-y-2 border-t pt-3 first:border-0 first:pt-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-sm font-semibold">{deployment.releaseId}</span>
                <span className="text-xs text-muted-foreground">{deployment.isStable ? "Stable" : "Active / suspect"}</span>
              </div>
              <p className="text-sm">{deployment.summary}</p>
              <p className="text-xs text-muted-foreground">{deployment.commitHash} · {deployment.author}</p>
              <pre className="overflow-x-auto whitespace-pre-wrap rounded-md bg-muted p-3 text-xs">{deployment.diff}</pre>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-3 rounded-xl border bg-card p-4 sm:p-5">
        <h2 className="text-lg font-semibold">Evidence summary</h2>
        <dl className="space-y-3 text-sm">
          <div><dt className="font-semibold">Root cause</dt><dd className="mt-1 text-muted-foreground">{data.rootCause}</dd></div>
          <div><dt className="font-semibold">Trigger</dt><dd className="mt-1 text-muted-foreground">{data.trigger}</dd></div>
          <div><dt className="font-semibold">Blast radius</dt><dd className="mt-1 text-muted-foreground">{data.blastRadius}</dd></div>
        </dl>
      </section>
    </main>
  );
}
