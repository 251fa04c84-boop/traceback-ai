# TraceBack AI — Agent-Native Framework Migration Plan

**Date:** 2026-11-04  
**Target branch:** `codex/agent-native-integration`  
**Production safety:** This plan is isolated from `main`. Do not merge or deploy until the framework implementation and regression suite pass.

## Decision

Do not install the current `@agent-native/core` package directly into the existing Next.js 14 / React 18 app.

Verified current repository facts:
- `package.json` uses Next.js 14.2.15, React 18.3.1, and React DOM 18.3.1.
- The current official Core package is 0.223.0 and declares React and React DOM peer requirements of >=19.2.7.
- The current official Core package requires Node.js >=22.22.0.
- The official getting-started path scaffolds an Agent-Native app with the framework CLI and uses the shared action model: `defineAction` from `@agent-native/core/action`, plus `useActionQuery` from `@agent-native/core/client/hooks`.
- The current TraceBack app has a custom Zod registry/dispatcher in `lib/actions/`; this is not the official framework action runtime.

Sources:
- https://www.agent-native.com/docs/
- https://www.agent-native.com/docs/creating-templates/
- https://github.com/BuilderIO/agent-native/blob/main/packages/core/package.json
- https://github.com/BuilderIO/agent-native/blob/main/packages/core/docs/content/getting-started.mdx

## Recommended implementation strategy

Use a framework-supported Agent-Native scaffold as the migration target, then port TraceBack's domain logic and product UI into it. Do not replace the current deployed app until the new branch is green and manually verified.

### Phase A — preserve and extract the domain layer
1. Keep the existing `main` branch and Vercel deployment untouched.
2. Inventory every route, page, component, API endpoint, simulator scenario, action, and environment variable in TraceBack.
3. Separate pure incident-domain logic from Next.js route handlers and UI imports.
4. Preserve the three deterministic incident scenarios, evidence generation, approval state, action allowlist, and post-action verification.
5. Add regression tests for approval granted, approval denied, invalid action parameters, failed execution, and post-action health verification before moving code.

### Phase B — scaffold official framework in the isolated branch
1. Use Node.js 22.22+ and pnpm as required by the official guide.
2. Generate a standalone Agent-Native app with the official CLI and a supported template.
3. Confirm a clean install, dev boot, and production build before porting TraceBack code.
4. Confirm the framework discovers actions and the embedded agent panel can call a harmless read-only test action.
5. Keep any framework-specific files in the official expected locations; do not add unused `defineAction` wrappers just to satisfy a source search.

### Phase C — port TraceBack as real shared framework actions
1. Implement read-only actions for telemetry, service logs, deployment diff, and health checks using official `defineAction`.
2. Implement mutating actions for rollback, feature-flag changes, and service restart using official `defineAction`.
3. Keep server-side authorization/approval checks inside the action execution path. Never trust a client-supplied `userApprovalGranted: true` without a server-verifiable approval record.
4. Persist pending approvals and execution receipts in the framework-supported durable state/database; do not rely on process-local Maps or ephemeral JSON for production workflow state.
5. Make the agent and human UI call the exact same framework action definitions.
6. Preserve deterministic verification after every mutation and record the observed result separately from the proposed action.

### Phase D — regression and release gate
- Clean dependency installation succeeds from the committed lockfile.
- Typecheck, unit tests, production build, and CI all pass.
- All three incident scenarios work end-to-end.
- Both approve and reject paths work; rejected actions produce no mutation.
- Unapproved, malformed, unknown, and replayed actions are blocked server-side.
- Failed mutations never appear as successful remediation.
- Post-action verification confirms the resulting simulator state.
- Public deployment uses the exact tested commit and all required environment variables.
- The old production deployment remains available until the replacement is verified.

## Important implementation risks

- The current Next.js / React 18 stack is incompatible with the current Core package peer requirements. A framework-supported scaffold/migration is safer than a package-only install.
- The existing agent stores sessions in a process-local `Map`; this is not durable across serverless instances or restarts.
- The current API route accepts `userApprovalGranted` from the request body. Before any production-like mutation is enabled, approval must be derived from a server-verifiable approval record, not trusted directly from the client.
- The current `package-lock.json` root metadata identifies `cultureweave-ai` and does not mirror all dependencies in `package.json`. Regenerate the lockfile with the selected package manager during the migration; do not hand-edit lock metadata as a substitute.
- The live app currently has a custom action architecture. Do not claim official Agent-Native compliance until the framework runtime actually owns action discovery and execution.

## Submission honesty

Until the migration and release gate above are complete, describe the current deployed TraceBack build as a custom shared-action incident-response app. Do not claim full official Agent-Native framework integration.
