# TraceBack AI — Evidence-First Incident Investigation

TraceBack AI helps an on-call engineer move from noisy incident evidence to a clear, reviewable recovery proposal. It combines a human-facing incident workspace with an Agent-Native assistant that uses the same typed actions and benchmark data.

**Built for the Builder.io Agent-Native Hackathon 2026.**

## The workflow

1. **Observe** — inspect error rate, p99 latency, resource usage, and connection counts.
2. **Correlate evidence** — connect timestamped application logs to the suspect release and code diff.
3. **Diagnose** — form an evidence-grounded explanation and show the trigger and impact.
4. **Prepare a recovery plan** — present allowlisted recovery proposals and their parameters for review.
5. **Human approval gate** — stop before execution. This public benchmark app is read-only and is not connected to production infrastructure.

The incident UI and the Agent-Native assistant share the official framework actions. The agent can inspect the same incident records and build the same five-stage investigation brief shown in the interface.

## Demonstration scenarios

| Incident | Evidence | Proposed response |
| --- | --- | --- |
| `inc-8921` — Checkout outage | Null coupon dereference after release `v2.4.1`; error rate peaked at 44.1% in the supplied time series | Review rollback to `v2.4.0` |
| `inc-4402` — Session crash loop | JVM heap exhaustion, OOMKilled pods, and an unbounded in-memory session cache | Review disabling `FF_UNBOUNDED_SESSION_CACHE`; separately assess service restart |
| `inc-7119` — Database connection exhaustion | 100/100 active connections, PostgreSQL SQLSTATE 53300, and HikariPool acquisition timeouts | Review disabling `FF_ASYNC_ANALYTICS_V2` |

**Important:** These are deterministic benchmark scenarios, not live production telemetry. The app does not connect to customer infrastructure and does not execute rollbacks, feature-flag changes, or restarts. A proposed action is not a completed action.

## Agent-Native implementation

The Agent-Native application lives in `agent-native-poc/` and is the intended hackathon app entry point.

- `@agent-native/core` 0.223.0 and `@agent-native/toolkit` 0.223.0.
- React 19 and React Router 8.
- `defineAction()` read-only capabilities shared by the UI and agent:
  - `list-incidents`
  - `get-incident-evidence`
  - `build-investigation-brief`
- The agent instructions require evidence-based findings, disclosure of benchmark data, and strict respect for the human approval gate.

The repository also retains an earlier custom Next.js implementation at the repository root. It is preserved as prior project work and for comparison; it is not the Agent-Native runtime entry point for the hackathon deployment.

## Deployment to Vercel

The Agent-Native app must use the Nitro Vercel preset so the framework server plugins and action endpoints are deployed with the UI. The isolated Vercel project uses `agent-native-poc/` as its root and `agent-native-poc/vercel.json` for the build configuration.

The equivalent release sequence is:

```bash
pnpm migrate:production
NITRO_PRESET=vercel pnpm build
npx vercel deploy --prebuilt
```

Keep `DATABASE_URL`, `BETTER_AUTH_SECRET`, and `CRON_SECRET` in Vercel's encrypted environment settings. Never commit them.

## Run locally

Requirements: Node.js 22.22 or newer and pnpm 10.29.1.

```bash
cd agent-native-poc
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Open the local URL printed by the Agent-Native CLI.

## Verification

From `agent-native-poc/`:

```bash
pnpm typecheck
pnpm test
pnpm agent-native:doctor
pnpm build
```

The GitHub Actions workflow also runs checks for the Agent-Native app. Passing a build is not, by itself, proof that the deployed runtime or the complete user journey works; use the public preview and test each incident before submission.

## Hackathon work disclosure

- **Existing project work:** the repository contains an earlier TraceBack Next.js incident workspace and its deterministic incident simulator. That work is retained as prior project work, not represented as newly authored Agent-Native framework code.
- **Hackathon development:** the Agent-Native application scaffold was adapted into TraceBack, including incident-list and evidence actions, a five-stage investigation action, shared agent instructions, incident routes, and action contract tests.
- **Framework template:** the Agent-Native Chat starter template from `@agent-native/core@0.223.0` was used as the starting point and modified for this incident-investigation domain.
- **Third-party code:** framework packages and other dependencies are declared in `agent-native-poc/package.json` and locked in `agent-native-poc/pnpm-lock.yaml`. Their respective licenses apply. Do not imply the framework starter or third-party packages were authored by this project.

Before submitting, disclose the dates and extent of any pre-existing work accurately in the official form.

## Submission checklist

- [ ] Verify the public deployment and all three incident routes.
- [ ] Verify the agent can use the shared incident actions with an AI provider configured.
- [ ] Record a public Clips demonstration that can be viewed without login.
- [ ] Include the project description, repository, deployment, and public Clips URL in the official form.
- [ ] Confirm the submission receipt.

Official rules: https://www.builder.io/hackathon/rules  
Submission form: https://www.builder.io/hackathon/submit  
Clips: https://clips.agent-native.com/

**A project is not submitted merely by publishing this repository or recording a Clips video. Submit the form and verify receipt before the deadline.**
