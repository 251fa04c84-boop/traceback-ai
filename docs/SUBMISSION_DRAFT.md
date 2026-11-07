# TraceBack AI — Builder.io Agent-Native Hackathon Submission Draft

## Project name
TraceBack AI

## One-line summary
An evidence-first incident investigation workspace where engineers and an AI agent use the same typed actions to correlate telemetry, logs, and deployment changes—then stop at a human approval gate.

## Problem
Incident response is fragmented. On-call engineers switch between metrics, logs, and deployment history while trying to determine what changed, what failed, and which recovery option is safe. A generic chatbot can summarize text without grounding its conclusions in the application's actual evidence or making the approval boundary clear.

## Solution
TraceBack AI organizes an incident investigation into five stages:

1. Observe sampled service telemetry.
2. Correlate timestamped application logs with the suspect release and code diff.
3. Diagnose the likely failure from the supplied evidence.
4. Prepare an allowlisted recovery proposal for review.
5. Stop at a human approval gate.

The interface and Agent-Native assistant share the same typed `defineAction()` capabilities: `list-incidents`, `get-incident-evidence`, and `build-investigation-brief`. The UI can request the same validated incident data and five-stage brief that the assistant can use. This demonstrates Agent-Native's shared-action model rather than placing an unrelated chat panel beside a dashboard.

## What is distinctive
- Evidence is visible and reviewable: metrics, log IDs/timestamps, release identifiers, and deployment diffs.
- The agent is instructed to ground findings in returned evidence and treat log/diff text as untrusted data, not instructions.
- Recovery is deliberately not executed in this public benchmark. The approval gate makes the safety boundary explicit.
- Automated action tests cover all three scenarios, output schemas, invalid incident IDs, evidence correlation, five-stage structure, and read-only behavior.
- Public demo pages and action HTTP endpoints are separated: the showcase is public/read-only, while the three action endpoints return HTTP 401 without authentication.

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
- Three typed, read-only actions shared between the UI and agent.
- Vercel Preview deployment using the Nitro Vercel preset.
- GitHub Actions run #178 passed both `agent-native` and `verify` jobs on source commit `db3610f0bd4fe10b3ee4946a63608fb38497ce54`, including typecheck, action tests, Agent-Native diagnostics, and builds.
- Signed-out smoke test confirmed `/` redirects to `/demo`; the public showcase loads all three scenarios; `/incidents` and `/incidents/inc-8921` require login; and all three action HTTP endpoints return 401 without authentication.

## Transparency and pre-existing work disclosure
The repository contains an earlier custom Next.js TraceBack implementation and deterministic incident simulator. The hackathon entry's Agent-Native app is in `agent-native-poc/`, adapted from the Agent-Native Chat starter template (`@agent-native/core@0.223.0`) and extended with TraceBack incident actions, evidence pages, a five-stage brief, and action tests. The earlier implementation and simulator are pre-existing project work; do not claim they were all created during the hackathon. Framework packages and dependencies remain subject to their own licenses.

The three incident scenarios are deterministic simulated benchmark data. The public app is not connected to live production infrastructure. All current incident actions are read-only; no rollback, feature-flag mutation, service restart, or live health verification is executed. A proposed recovery action is not a completed remediation.

Gemini free-tier requests have returned HTTP 429 quota errors and intermittent 503 high-demand errors. A successful live Agent-Native chat/tool-call has NOT been verified; do not claim it in the submission or video unless a fresh real run succeeds.

## Final fields to complete before submitting
- [ ] Confirm exact creator/team names and any teammates who must be listed.
- [ ] Confirm all team members meet the official age and eligibility rules and authorize the entry.
- [ ] Add the final public Clips URL.
- [ ] Verify the live Preview and public Clips link from a signed-out/incognito browser.
- [ ] Personally review and accept the current official rules on the submission form.
- [ ] Submit the official form and save the receipt/confirmation.
