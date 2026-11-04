# TraceBack AI — Agent-Native Compliance and Release Audit

**Audit date:** November 4, 2026  
**Repository reviewed:** `251fa04c84-boop/traceback-ai`  
**Base branch:** `main`

## Executive finding

TraceBack has a useful incident-response workflow and a custom shared action layer. The human-facing application and agent orchestrator both dispatch project-defined actions from `lib/actions/`. The current repository does **not** implement the official Builder Agent-Native framework API.

The official getting-started guide defines actions with `defineAction` from `@agent-native/core/action` and calls the same action from the UI and agent. The current `package.json` does not include `@agent-native/core`; the custom `ActionDefinition` interface is not the official API.

**Official framework compliance remains unverified and is a submission blocker until the real framework runtime is integrated and tested.**

## Verified repository facts

- Next.js 14.2.15 and React 18.3.1.
- Custom Zod registry and dispatcher in `lib/actions/`.
- Three deterministic incident scenarios.
- Agent investigation, approval/rejection flow, allowlisted simulator actions, and deterministic health verification.
- CI runs `npm ci`, `npm test`, and `npm run build` on Node 22.22.
- Agent sessions and simulator state are held in process-local Maps and are not durable across serverless instances or restarts.

## Security remediation in this branch

The generic `/api/actions` endpoint is now read-only:
- It looks up the action in the server-owned registry.
- It rejects mutating actions with HTTP 403.
- It does not accept client-supplied `userApprovalGranted` or `source`.
- It labels generic API calls as `api` and always dispatches with approval false.

This closes the direct `/api/actions` approval-flag bypass. It does **not** establish user identity or make the public `/api/agent` approval endpoint production-secure. The app currently has no authentication/authorization layer, so the approval UX must be described as a demo workflow, not production identity verification. Do not connect these simulated actions to real infrastructure.

## Framework compatibility and migration

The official getting-started guide currently requires Node.js 22.22 or later. Current package metadata has React peer requirements newer than this app's React 18 stack. A blind package install is unsafe.

Recommended route:
1. Scaffold a framework-supported Agent-Native app on an isolated branch using the official CLI.
2. Port the incident domain and UI while preserving the old deployment.
3. Define the actual read-only and mutating capabilities with official `defineAction`.
4. Ensure the framework runtime owns action discovery and both UI/agent invoke the same definitions.
5. Use durable storage and real authentication/authorization for pending approvals.
6. Run clean install, tests, build, and three-scenario end-to-end checks before deployment.

Official guide: https://github.com/BuilderIO/agent-native/blob/main/packages/core/docs/content/getting-started.mdx

## Remaining release gates

- [ ] Integrate official `@agent-native/core` runtime and action definitions.
- [ ] Add authentication/authorization before claiming secure human approvals.
- [ ] Replace process-local workflow state with durable storage for multi-instance deployment.
- [ ] Regenerate and validate the lockfile.
- [ ] Run clean `npm ci`, `npm test`, and `npm run build` on the exact candidate commit.
- [ ] Verify all three scenarios, approval/rejection, blocked unapproved actions, and post-action verification.
- [ ] Deploy only the tested commit and smoke-test the live deployment.
- [ ] Public Clips demo and official submission are intentionally excluded from this engineering task.

## Submission honesty

Until the official runtime migration is complete, describe the current app as a custom shared-action incident-response app, not a fully integrated official Agent-Native app.
