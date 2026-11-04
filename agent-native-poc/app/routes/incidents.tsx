import { useActionQuery } from "@agent-native/core/client/hooks";
import { useSetPageTitle } from "@agent-native/toolkit/app-shell";
import { Link } from "react-router";

export function meta() {
  return [{ title: "Incidents · TraceBack AI" }];
}

export default function IncidentsPage() {
  useSetPageTitle("Incidents");
  const { data, isLoading, error } = useActionQuery("list-incidents", {});

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 p-4 sm:p-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Incident command
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Active incident scenarios</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Investigate benchmark incidents using shared Agent-Native actions. Evidence shown here is simulated training data, not live production telemetry.
        </p>
      </header>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-label="Loading incidents">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-48 animate-pulse rounded-xl border bg-muted/30" />
          ))}
        </div>
      ) : error ? (
        <p role="alert" className="rounded-lg border border-destructive/40 p-4 text-sm text-destructive">
          Unable to load incidents: {error.message}
        </p>
      ) : !data?.length ? (
        <p className="rounded-lg border p-4 text-sm text-muted-foreground">No incident scenarios are available.</p>
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.map((incident) => (
            <article key={incident.id} className="flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-xs text-muted-foreground">{incident.id}</span>
                <span className="rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide">
                  {incident.severity}
                </span>
              </div>
              <div className="space-y-2">
                <h2 className="text-lg font-semibold leading-snug">{incident.title}</h2>
                <p className="text-sm text-muted-foreground">{incident.description}</p>
              </div>
              <dl className="grid grid-cols-2 gap-3 text-xs">
                <div><dt className="text-muted-foreground">Service</dt><dd className="mt-1 font-medium">{incident.service}</dd></div>
                <div><dt className="text-muted-foreground">Detected</dt><dd className="mt-1 font-medium">{new Date(incident.detectedAt).toLocaleString()}</dd></div>
                <div><dt className="text-muted-foreground">Active release</dt><dd className="mt-1 font-mono">{incident.activeRelease}</dd></div>
                <div><dt className="text-muted-foreground">Stable release</dt><dd className="mt-1 font-mono">{incident.stableRelease}</dd></div>
              </dl>
              <Link
                to={`/incidents/${incident.id}`}
                className="mt-auto inline-flex min-h-10 items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Review evidence
              </Link>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
