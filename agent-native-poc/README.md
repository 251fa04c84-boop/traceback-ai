# TraceBack AI — Agent-Native application

This directory is the Agent-Native application deployed for the Builder.io Agent-Native Hackathon 2026.

TraceBack helps on-call engineers investigate incidents by connecting benchmark telemetry, application logs, and deployment diffs. The UI and agent use the same official Agent-Native actions.

## Five-stage workflow

1. Observe telemetry and service health.
2. Correlate timestamped logs with the suspect deployment and code diff.
3. Diagnose the failure from the supplied evidence.
4. Prepare an allowlisted recovery proposal for review.
5. Stop at the human approval gate.

The app uses deterministic benchmark scenarios. It is not connected to production infrastructure. All incident actions are read-only; recovery proposals are not executed.

## Shared Agent-Native actions

- `list-incidents` — read the three available benchmark scenarios.
- `get-incident-evidence` — retrieve telemetry, logs, deployment history, and post-mortem evidence.
- `build-investigation-brief` — build the five-stage evidence brief displayed in the UI and available to the agent.

The agent instructions require it to cite concrete evidence, identify benchmark data as simulated, and never claim that a proposed recovery was executed.

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

The app uses `DATABASE_URL` for hosted PostgreSQL and `BETTER_AUTH_SECRET` for server-side authentication. Keep both values in your deployment environment; never commit secrets. Do not disable authentication for a shared or public deployment.
