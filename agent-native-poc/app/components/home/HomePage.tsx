import { useActionQuery } from "@agent-native/core/client/hooks";
import { useSetPageTitle } from "@agent-native/toolkit/app-shell";

export default function HomePage() {
  useSetPageTitle("Overview");
  const { data, isLoading, error } = useActionQuery("list-incidents", {});

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 p-4 sm:p-6 lg:p-8">
      <header className="relative overflow-hidden rounded-2xl border bg-card p-6 sm:p-9">
        <div className="pointer-events-none absolute -right-16 -top-20 size-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative max-w-3xl space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            TraceBack AI · Incident command
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
            From incident signal to evidence-backed recovery.
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Investigate outages by connecting telemetry, application logs, and deployment changes.
            Review the agent's diagnosis and recovery proposal before any action is considered.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="/incidents"
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Open incident workspace
            </a>
            <span className="inline-flex min-h-11 items-center rounded-lg border px-4 py-2.5 text-xs font-semibold text-muted-foreground">
              Read-only benchmark environment
            </span>
          </div>
        </div>
      </header>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Incident queue</p>
            <h2 className="text-xl font-semibold">Scenarios ready to investigate</h2>
          </div>
          <a href="/incidents" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
            View all incidents
          </a>
        </div>

        {isLoading ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3" aria-label="Loading incident queue">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-48 animate-pulse rounded-xl border bg-muted/30" />
            ))}
          </div>
        ) : error ? (
          <p role="alert" className="rounded-lg border border-destructive/40 p-4 text-sm text-destructive">
            Unable to load incidents: {error.message}
          </p>
        ) : !data?.length ? (
          <p className="rounded-lg border p-4 text-sm text-muted-foreground">No benchmark incidents are available.</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {data.map((incident) => (
              <a
                key={incident.id}
                href={`/incidents/${incident.id}`}
                className="group flex min-h-48 flex-col gap-4 rounded-xl border bg-card p-5 transition-colors hover:border-primary/50 hover:bg-muted/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-xs text-muted-foreground">{incident.id}</span>
                  <span className="rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-wide">
                    {incident.severity}
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-semibold leading-snug group-hover:text-primary">{incident.title}</h3>
                  <p className="text-sm text-muted-foreground">{incident.description}</p>
                </div>
                <div className="mt-auto flex items-center justify-between gap-3 border-t pt-3 text-xs text-muted-foreground">
                  <span>{incident.service}</span>
                  <span className="font-mono">{incident.activeRelease}</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        <article className="rounded-xl border p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">01 · Evidence</p>
          <h3 className="mt-2 text-sm font-semibold">Shared incident actions</h3>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">The interface and agent read the same validated incident, telemetry, log, and deployment evidence.</p>
        </article>
        <article className="rounded-xl border p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">02 · Investigation</p>
          <h3 className="mt-2 text-sm font-semibold">Five-stage reasoning flow</h3>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Observe, correlate, diagnose, prepare a plan, and stop at the human approval gate.</p>
        </article>
        <article className="rounded-xl border p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">03 · Safety</p>
          <h3 className="mt-2 text-sm font-semibold">No hidden production actions</h3>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">All supplied scenarios are simulated. The public demo does not connect to or modify live services.</p>
        </article>
      </section>
    </main>
  );
}
