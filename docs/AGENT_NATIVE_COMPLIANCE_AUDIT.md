# TraceBack AI — Agent-Native Compliance and Release Audit

**Audit date:** November 4, 2026  
**Repository reviewed:** `251fa04c84-boop/traceback-ai`  
**Base branch:** `main`  
**Purpose:** Correct the submission claims and record the verified work still required before representing this project as an official Agent-Native implementation.

## Executive finding

TraceBack has a useful incident-response workflow and a custom shared action layer. The human-facing application and the agent orchestrator both dispatch the same project-defined actions from `lib/actions/`. However, the current repository does **not** implement the official Builder Agent-Native framework API.

The official hackathon rules require a functional application built using Agent-Native. The official Builder example imports `defineAction` from `@agent-native/core/action`. The current `package.json` contains no `@agent-native/core` dependency, and the source has no import of that package. The project-defined `ActionDefinition` interface in `lib/actions/types.ts` is not the official API.

**Result: official framework compliance is not verified and must be treated as a submission blocker until implemented and tested.** Do not claim that TraceBack currently uses official `defineAction`.

## Verified repository facts

- The app is built with Next.js 14.2.15 and React 18.3.1.
- Action schemas are defined with Zod in `lib/actions/`.
- `lib/actions/index.ts` owns a custom `ACTION_REGISTRY` and `dispatchAction` function.
- The agent orchestrator calls `dispatchAction` for telemetry, logs, and deployment inspection.
- The API action route also calls `dispatchAction`.
- Mutating handlers independently check `userApprovalGranted` before changing simulator state.
- The simulator provides three deterministic incident scenarios.
- The GitHub Actions workflow runs `npm ci`, `npm test`, and `npm run build` on Node 22.22.0.
- PR #1 added the CI workflow and is merged into `main`.

## Official framework compatibility risk

The official framework repository currently documents Node.js 22.22 or later and its current package metadata declares React 19.2.7 or later as a peer dependency. TraceBack currently uses React 18.3.1 with Next.js 14.2.15.

Installing the current framework package blindly may introduce peer-dependency conflicts and a large dependency surface. A package-only change is not enough: official action definitions must be wired into the actual human and agent execution paths, and the result must pass a clean dependency install, all tests, a production build, and a live deployment smoke test.

Do not merge a dependency migration until those checks pass. If a compatible integration cannot be completed safely, migrate the app to a framework-supported starter on a separate branch while preserving the current deployment as a fallback.

## Additional release-integrity issues to verify

1. The repository's `package-lock.json` root metadata currently identifies the package as `cultureweave-ai`, while `package.json` identifies it as `traceback-ai`.
2. The lockfile root dependency list does not exactly mirror the current `package.json` dependency list. Because CI runs `npm ci`, verify a clean install from the current branch rather than relying on an earlier workflow result.
3. The README badge and `docs/TEST_REPORT.md` contain historical test-count claims. The checked-in test runner's printed summary must be reconciled with those claims by running the exact current commit.
4. The README references a local MP4 file, but the official rules require a public Clips demonstration that judges can view without a login or access request. A repository video alone does not establish that requirement.
5. A deployed URL and a successful GitHub build do not prove the public Clips recording or hackathon submission has been completed.

## Required completion checklist

- [ ] Integrate the official `@agent-native/core` `defineAction` API, or migrate to a framework-supported Agent-Native application architecture.
- [ ] Ensure the official action definitions are the actual shared execution layer for both UI and agent; do not create unused wrapper definitions solely to satisfy a code search.
- [ ] Preserve server-side approval checks and deterministic post-action health verification.
- [ ] Regenerate and commit a consistent lockfile.
- [ ] Run clean `npm ci`, `npm test`, and `npm run build` in GitHub Actions.
- [ ] Verify all three incident scenarios and both approval and rejection flows in the deployed app.
- [ ] Verify the deployed commit matches the tested commit.
- [ ] Record and publish the required public Clips demonstration.
- [ ] Submit the project through the official form before the deadline and verify receipt.

## Sources

- Official rules: https://www.builder.io/hackathon/rules
- Hackathon overview and scoring: https://www.builder.io/hackathon
- Official framework repository: https://github.com/BuilderIO/agent-native
- Framework getting-started guide: https://github.com/BuilderIO/agent-native/blob/main/packages/core/docs/content/getting-started.mdx

## Submission honesty note

Until the checklist above is complete, describe the current implementation as a **custom shared-action incident-response app**, not as a fully integrated official Agent-Native app. This is a compliance and credibility safeguard, not a judgment that the product idea has no value.
