# TraceBack AI — Agent-Native Migration Status

**Updated:** November 5, 2026  
**Branch:** `codex/traceback-agent-native-v2`

## Decision

The existing root app is Next.js 14 / React 18, while Agent-Native Core 0.223.0 expects the newer React runtime and its own Vite/React Router integration. The project therefore keeps the legacy app intact and runs the official Agent-Native app from a separate folder and Vercel project.

## Completed in the isolated branch

- Added the official Agent-Native Chat starter under `agent-native-poc/`.
- Adapted the starter branding and navigation for TraceBack.
- Added read-only `defineAction()` actions for listing incidents and retrieving evidence.
- Added a shared five-stage `build-investigation-brief` action.
- Connected the five-stage brief to the incident detail UI and the Agent-Native chat tool list.
- Added action contract tests for all three benchmark incidents and the read-only gate.
- Replaced stale README and submission documentation with accurate descriptions and disclosure.
- Created a separate Vercel project rooted at `agent-native-poc/` and a dedicated Neon Free-plan database.

## Remaining before submission

1. Confirm the latest Agent-Native CI run passes typecheck, action tests, doctor, and build.
2. Verify a fresh Vercel deployment after adding `yjs@13.6.33` as a direct runtime dependency.
3. Verify app authentication and configure an AI provider for the agent chat.
4. Manually test all three incidents on the Agent-Native deployment.
5. Verify mobile layout and runtime errors.
6. Record and publish a Clips demo showing the actual Agent-Native app.
7. Submit the form and verify receipt.

## Explicit scope limits

The Agent-Native domain actions are read-only. The five-stage workflow prepares a recovery proposal and stops at the approval gate. No production system is connected. Building authenticated approval execution and real remediation is out of scope for this public benchmark demo and must not be implied in the submission.
