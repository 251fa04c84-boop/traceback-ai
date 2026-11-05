# TraceBack AI — Agent-Native Compliance and Release Audit

**Updated:** November 5, 2026  
**Candidate branch:** `codex/traceback-agent-native-v2`  
**Legacy production app:** `main` / root Next.js project  
**Agent-Native app:** `agent-native-poc/`  
**Candidate Vercel project:** `traceback-agent-native-preview` (separate project; does not replace the legacy site)

## Executive finding

The repository now contains a real Agent-Native application under `agent-native-poc/`. It uses `@agent-native/core@0.223.0`, the framework Vite/React Router integration, and official `defineAction()` actions. Its UI and Agent-Native chat load the same domain actions through the framework action registry.

The earlier root Next.js application remains a separate custom implementation. It is not the official Agent-Native runtime and is retained as prior work/reference. The separate Agent-Native app is the intended hackathon entry point.

## Framework implementation

The Agent-Native app includes:

- `list-incidents` — read-only incident catalog.
- `get-incident-evidence` — read-only telemetry, log, deployment, and post-mortem evidence.
- `build-investigation-brief` — read-only five-stage investigation brief.
- Incident catalog and incident evidence routes using `useActionQuery`.
- A TraceBack overview page and incident navigation.
- Agent instructions that require evidence citations, benchmark disclosure, and respect for the approval gate.
- Action contract tests for the three benchmark incidents, output schemas, invalid IDs, and read-only behavior.

## Safety boundary

The Agent-Native public demo uses deterministic benchmark scenarios. It is not connected to live infrastructure.

- The three TraceBack domain actions are read-only.
- Recovery actions are displayed as proposals only.
- The approval stage explicitly states that execution is locked.
- No rollback, feature-flag change, restart, or live health probe is performed by this app.
- The earlier custom Next.js API rejects mutating generic actions and its approval endpoint fails closed.

Do not describe the approval card as a production-grade authenticated approval system. Authenticated approver identity, one-time server challenges, execution receipts, and durable audit workflow for real mutations are not implemented.

## Deployment architecture

A separate Vercel project named `traceback-agent-native-preview` was created and linked to the repository with `agent-native-poc/` as its root directory. It uses a dedicated Neon project on the Free plan, separate from the user's RAJ database and separate from the legacy production project.

The first runtime smoke test found a missing `yjs` package. The package was added as a direct dependency and the lockfile updated. A fresh deployment must still verify that the issue is resolved.

## Remaining release gates

- [ ] Latest Agent-Native GitHub Actions run passes typecheck, action tests, doctor, and build.
- [ ] Fresh Vercel deployment is Ready on the latest PR head.
- [ ] Runtime smoke test confirms no missing module/server crash.
- [ ] Public sign-up/sign-in works and the app opens without Vercel SSO.
- [ ] Configure an AI provider and verify the agent can call shared incident actions.
- [ ] Test all three incident routes and all five investigation stages on the deployed app.
- [ ] Verify the app is usable on mobile and desktop.
- [ ] Record a public Clips video and verify signed-out access.
- [ ] Complete the official submission form and verify receipt.

## Submission honesty

The framework integration exists in the separate Agent-Native app. The legacy root Next.js app remains custom. The public Agent-Native demo is benchmark-only and read-only. Do not claim live production diagnostics, production remediation, or deterministic live resolution.
