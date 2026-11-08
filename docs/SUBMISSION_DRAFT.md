# TraceBack AI — Builder.io Agent-Native Hackathon Submission Draft

## Project name
TraceBack AI

## One-line summary
An evidence-first incident response workspace where engineers and an AI agent share typed actions to correlate telemetry, logs, and deployment changes, then run an explicitly approved, isolated recovery simulation with before/after verification and an audit trail.

## Problem
Incident response is fragmented. On-call engineers switch between metrics, logs, and deployment history while trying to determine what changed, what failed, and which recovery option is safe. A generic chatbot can summarize text without grounding its conclusions in the application's actual evidence or making the approval boundary clear.

## Solution
TraceBack AI organizes an incident investigation into five stages:

1. Observe sampled service telemetry.
2. Correlate timestamped application logs with the suspect release and code diff.
3. Diagnose the likely failure from the supplied evidence.
4. Prepare an allowlisted recovery proposal for review.
5. Stop at a human approval gate; after approval, execute the exact scenario-allowlisted recovery plan only inside the isolated synthetic benchmark simulator, then verify its simulated postconditions.

The interface and Agent-Native assistant share the same typed `defineAction()` capabilities: `list-incidents`, `get-incident-evidence`, `build-investigation-brief`, and `execute-recovery-simulation`. The recovery action sets `needsApproval: true`, executes only the scenario's exact allowlisted actions in the deterministic simulator, and returns before/after metrics, verification evidence, and an audit trail. The incident workspace calls the same action through `useActionMutation`; agent-initiated calls pause for approval of that specific call.

## What is distinctive
- Evidence is visible and reviewable: metrics, log IDs/timestamps, release identifiers, and deployment diffs.
- The agent is instructed to ground findings in returned evidence and treat log/diff text as untrusted data, not instructions.
- The public showcase remains read-only. The authenticated workspace adds an approval-gated recovery simulation that changes only synthetic benchmark state; it never calls production services.
- Automated action tests cover all three scenarios, output schemas, invalid incident IDs, evidence correlation, five-stage structure, per-invocation simulator isolation, and caller provenance. The recovery handler tests call `run()` directly; they do not claim to test the framework approval lifecycle.
- The public showcase is read-only. Signed-out access to the private incident workspace redirects to sign-in. The recovery action is a separate authenticated, approval-gated capability; do not claim a direct HTTP status or approval integration test beyond what has actually been verified.

## Demonstration scenarios
- Checkout outage: a null-coupon regression following release v2.4.1.
- Session crash loop: JVM heap exhaustion associated with an unbounded in-memory session cache.
- Database connection exhaustion: PostgreSQL connection rejection and HikariPool acquisition timeouts.

## Links
- Public Preview showcase: https://traceback-agent-native-preview-git-codex-tra-134cf8-hackathons8.vercel.app/demo
- Preview root (redirects to showcase): https://traceback-agent-native-preview-git-codex-tra-134cf8-hackathons8.vercel.app/
- Source branch (Agent-Native app and latest hackathon changes): https://github.com/251fa04c84-boop/traceback-ai/tree/codex/traceback-agent-native-v2
- Reviewable draft PR: https://github.com/251fa04c84-boop/traceback-ai/pull/4
- Public Clips demo: [ADD THE FINAL PUBLIC CLIPS URL AFTER RECORDING]

## Technical implementation
- Official Agent-Native framework: `@agent-native/core@0.223.0` and `@agent-native/toolkit@0.223.0`.
- React 19 / React Router 8 application.
- Three typed, read-only evidence actions plus one shared `execute-recovery-simulation` action with `needsApproval: true`.
- Vercel Preview deployment using the Nitro Vercel preset.
- GitHub Actions run #42455373312 passed both `agent-native` and `verify` jobs on the current documentation head `609a212dc3eeb7924e1779dccc797892066d889d`. It includes frozen-lockfile install, root automated tests/build, Agent-Native typecheck/action tests/doctor/build. The code-hardening commit `04c3d8c` also passed the same checks in run #42455284945.
- Public browser QA confirmed all three scenarios, correlated logs, deployment diffs, and recovery proposals render; the public showcase has no mutation controls; narrow mobile layout has no clipping/overflow; and signed-out access to `/incidents/inc-8921` redirects to sign-in. The hardening code Preview on commit `609a212` reached READY and passed a fresh smoke test: all three incident cards render, the public showcase has no mutation controls, and signed-out private incident access redirects to sign-in. Later branch commits are documentation-only.

## Transparency and pre-existing work disclosure
The repository contains an earlier custom Next.js TraceBack implementation and deterministic incident simulator. The hackathon entry's Agent-Native app is in `agent-native-poc/`, adapted from the Agent-Native Chat starter template (`@agent-native/core@0.223.0`) and extended with TraceBack incident actions, evidence pages, a five-stage brief, and action tests. The earlier implementation and simulator are pre-existing project work; do not claim they were all created during the hackathon. Framework packages and dependencies remain subject to their own licenses.

The three incident scenarios are deterministic simulated benchmark data. The public showcase is read-only. The authenticated workspace can run an approval-gated recovery simulation, but each action invocation creates a fresh ephemeral simulator instance; it does not call production APIs, deploys, feature flags, databases, or customer records. Its postconditions are simulated, not live infrastructure health checks. A simulated recovery is not a completed production remediation. Execution provenance is derived from framework caller context; missing caller context is recorded as `unknown`, never as human.

Gemini free-tier requests have returned HTTP 429 quota errors and intermittent 503 high-demand errors. A successful live Agent-Native chat/tool-call has NOT been verified; do not claim it in the submission or video unless a fresh real run succeeds.

## Final fields to complete before submitting
- [ ] Confirm exact creator/team names and any teammates who must be listed.
- [ ] Confirm all team members meet the official age and eligibility rules and authorize the entry.
- [ ] Add the final public Clips URL.
- [ ] Verify the live Preview and public Clips link from a signed-out/incognito browser.
- [ ] Personally review and accept the current official rules on the submission form.
- [ ] Submit the official form and save the receipt/confirmation.
