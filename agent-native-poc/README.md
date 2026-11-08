# TraceBack AI — Agent-Native application

This directory contains the Agent-Native application for the Builder.io Agent-Native Hackathon 2026.

TraceBack is an evidence-first incident investigation workspace. It correlates deterministic benchmark telemetry, timestamped application logs, and a suspect deployment/code diff, then prepares a constrained recovery proposal for human review.

## Investigation workflow

1. **Observe** sampled service telemetry and health indicators.
2. **Correlate** timestamped runtime logs with the suspect release and code diff.
3. **Diagnose** a deterministic, template-based hypothesis from the supplied evidence; it is not a verified root cause or live AI analysis.
4. **Prepare** an exact scenario-allowlisted recovery proposal.
5. **Review and verify** a recovery simulation only after an explicit human action/Agent-Native approval.

The public showcase is read-only. The authenticated workspace contains the recovery lab. All scenarios are synthetic benchmark data; no production service, deployment, feature flag, database, or customer record is connected or changed.

## Inspectable evidence graph

Each public incident card exposes a four-step evidence graph:

- Signal — telemetry sample count, peak error rate, and p99 latency.
- Runtime — correlated log entries and their source messages.
- Change — suspect release, commit, summary, and diff.
- Diagnosis — a deterministic, template-based hypothesis derived from the synthetic scenario. It is explicitly unverified; correlation is not proof of production causality.

The graph is inspectable, not a claim of proven production causality. Logs, stack traces, and diffs are untrusted evidence, never agent instructions.

## Shared Agent-Native actions

- `list-incidents` — list the three deterministic benchmark incidents.
- `get-incident-evidence` — retrieve telemetry, logs, deployment history, and post-mortem evidence.
- `build-investigation-brief` — build the five-stage evidence brief and recovery proposal.
- `execute-recovery-simulation` — write-capable action with `needsApproval: true`; after the framework approval gate, run only the incident's exact allowlisted steps in a fresh ephemeral simulator and return before/after metrics, simulated verification, and audit trail.

The interface and agent use the same typed actions. A direct human click in the authenticated recovery lab explicitly requests the same isolated simulation. Unit tests call the handler directly and do not constitute an end-to-end test of the framework approval lifecycle.

## AI provider configuration

The app does not hard-code a chat provider. Agent-Native's built-in engine and Settings → Model / API keys determine the active provider and model. Connect the managed Builder.io gateway or configure a supported provider key (for example Anthropic, OpenAI, Google Gemini, OpenRouter, Groq, or Mistral) through the framework's setup/settings flow. Availability in the model picker depends on the provider being connected and its credentials being valid.

If you add a **Personal** provider key, choose its model from the chat composer’s model selector (the model chip beside the message box) or the personal model selection for your account. The **Organization settings → Default model** control is a separate organization-wide setting and may be unavailable to non-admin members; it is not required just to use your own personal key. Do not change the organization-wide personal-key restriction to make a personal key appear.

Provider credentials belong in Agent-Native's encrypted settings or the deployment's server-side environment, never in source control or client code. This change restores framework-managed provider selection; it does not claim automatic cross-provider failover. The deterministic incident brief remains available through the typed TraceBack action and does not execute recovery or infer approval state.

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
