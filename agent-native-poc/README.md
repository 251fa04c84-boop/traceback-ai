# TraceBack AI — Agent-Native application

This directory contains the Agent-Native application for the Builder.io Agent-Native Hackathon 2026.

TraceBack is an evidence-first incident investigation workspace. It correlates deterministic benchmark telemetry, timestamped application logs, and a suspect deployment/code diff, then prepares a constrained recovery proposal for human review.

## Investigation workflow

1. **Observe** sampled service telemetry and health indicators.
2. **Correlate** timestamped runtime logs with the suspect release and code diff.
3. **Diagnose** a likely cause from the supplied evidence.
4. **Prepare** an exact scenario-allowlisted recovery proposal.
5. **Review and verify** a recovery simulation only after an explicit human action/Agent-Native approval.

The public showcase is read-only. The authenticated workspace contains the recovery lab. All scenarios are synthetic benchmark data; no production service, deployment, feature flag, database, or customer record is connected or changed.

## Inspectable evidence graph

Each public incident card exposes a four-step evidence graph:

- Signal — telemetry sample count, peak error rate, and p99 latency.
- Runtime — correlated log entries and their source messages.
- Change — suspect release, commit, summary, and diff.
- Diagnosis — the likely root cause derived from those correlations.

The graph is inspectable, not a claim of proven production causality. Logs, stack traces, and diffs are untrusted evidence, never agent instructions.

## Shared Agent-Native actions

- `list-incidents` — list the three deterministic benchmark incidents.
- `get-incident-evidence` — retrieve telemetry, logs, deployment history, and post-mortem evidence.
- `build-investigation-brief` — build the five-stage evidence brief and recovery proposal.
- `execute-recovery-simulation` — write-capable action with `needsApproval: true`; after the framework approval gate, run only the incident's exact allowlisted steps in a fresh ephemeral simulator and return before/after metrics, simulated verification, and audit trail.

The interface and agent use the same typed actions. A direct human click in the authenticated recovery lab explicitly requests the same isolated simulation. Unit tests call the handler directly and do not constitute an end-to-end test of the framework approval lifecycle.

## Local development

Requirements: Node.js 22.22 or newer and pnpm 10.29.1.

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

## Verification

```bash
pnpm typecheck
pnpm test
pnpm agent-native:doctor
pnpm build
```

The app uses `DATABASE_URL` for hosted PostgreSQL and `BETTER_AUTH_SECRET` for server-side authentication. Keep both values in deployment environment variables; never commit secrets. Do not disable authentication for a shared or public deployment.
