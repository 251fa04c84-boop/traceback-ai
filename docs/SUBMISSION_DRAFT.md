# TraceBack AI — Builder.io Agent-Native Hackathon Submission Draft

## Project name
TraceBack AI

## One-line summary
An evidence-first incident response workspace where engineers and an AI agent correlate telemetry, runtime logs, and deployment changes, then request human approval for an isolated recovery simulation with before/after verification and an audit trail.

## Problem
Incident response is fragmented. On-call engineers switch between metrics, logs, and deployment history while trying to determine what changed, what failed, and which recovery option is safe. A generic chatbot can summarize text without grounding its conclusions in inspectable application evidence or making the approval boundary clear.

## Solution
TraceBack AI organizes an incident investigation into five stages:

1. Observe sampled service telemetry.
2. Correlate timestamped application logs with the suspect release and code diff.
3. Diagnose the likely failure from the supplied evidence.
4. Prepare an exact scenario-allowlisted recovery proposal.
5. Stop at a human approval gate; after approval, execute the recovery only inside an isolated synthetic benchmark simulator, then verify its simulated postconditions.

The interface and Agent-Native assistant share four typed `defineAction()` capabilities: `list-incidents`, `get-incident-evidence`, `build-investigation-brief`, and `execute-recovery-simulation`. The recovery action declares `needsApproval: true`, accepts only a known incident ID, applies only that scenario's required actions, creates a fresh simulator per invocation, and returns before/after metrics, simulated verification, and an audit trail. The incident workspace invokes the same action through `useActionMutation`.

## What is distinctive
- **Inspectable evidence graph:** each public incident card exposes telemetry signals, correlated runtime logs, the suspect deployment/code change, and the likely diagnosis, with expandable source evidence.
- **Evidence integrity:** the agent is instructed to ground findings in returned evidence and treat log/diff text as untrusted data, not instructions.
- **Human-controlled recovery:** the public showcase is read-only. The authenticated workspace has an approval-gated simulation; it never calls production services.
- **Quantified simulation:** before/after error-rate percentage-point and p99 latency deltas are shown and explicitly labelled simulated.
- **Safety tests:** automated tests cover all three scenarios, output schemas, invalid incident IDs, scenario allowlists, per-invocation simulator isolation, and caller provenance. Handler tests call `run()` directly and do not test the framework approval lifecycle.

## Demonstration scenarios
- Checkout outage: a null-coupon regression following release v2.4.1.
- Session crash loop: JVM heap exhaustion associated with an unbounded in-memory session cache.
- Database connection exhaustion: PostgreSQL connection rejection and HikariPool acquisition timeouts.

## Links
- Latest verified Preview showcase: https://traceback-agent-native-preview-k793j7m08-hackathons8.vercel.app/demo
- Source branch: https://github.com/251fa04c84-boop/traceback-ai/tree/codex/traceback-agent-native-v2
- Draft PR: https://github.com/251fa04c84-boop/traceback-ai/pull/4
- Public Clips script: `docs/CLIPS_DEMO_SCRIPT.md`
- Public Clips demo: [ADD THE FINAL PUBLIC CLIPS URL AFTER RECORDING]

## Technical implementation and verification
- Official Agent-Native framework: `@agent-native/core@0.223.0` and `@agent-native/toolkit@0.223.0`.
- React 19 / React Router 8 application; Vercel Preview deployment using the Nitro Vercel preset.
- GitHub Actions run **#42457839580** passed both `verify` and `agent-native` jobs on application code head `2189847f0a941c293841014bad97c9bd5fc00817`: root tests/build, Agent-Native typecheck/action tests/doctor/build.
- Preview deployment `dpl_DXUfRhJapGJ8H8S4QYsKANW99rko` reached READY for that same code head.
- Fresh signed-out public browser QA passed: all three cards, four-step evidence graphs, expandable source evidence, visible synthetic/read-only disclosures, and no public mutation controls.
- Expanded checkout incident logs, stack traces, deployment diff, and recovery JSON wrap correctly; no horizontal scrollbars or clipped characters were observed.
- Signed-out direct access to `/incidents/inc-8921` redirected to sign-in and preserved the return route; no credentials or secrets were exposed.
- Dedicated mobile-device viewport QA remains pending; the browser session could not emulate a true 390×844 viewport.
- Authenticated recovery UI click-through and the real Agent-Native approval lifecycle remain unverified because they require an authorized sign-in. A successful live Gemini chat/tool call is also not claimed; prior free-tier requests returned quota/availability errors (429/503).
- Non-blocking build warnings remain: a 2.63 MB raw root client chunk (652 KB gzip) and an H3 overlapping route-rule preMerge warning. Both builds still completed successfully.

## Transparency and pre-existing work disclosure
The repository contains an earlier custom Next.js TraceBack implementation and deterministic incident simulator. This is pre-existing project work and must not be represented as newly authored during the hackathon. The Agent-Native app in `agent-native-poc/` adapts the Agent-Native Chat starter template and extends it with TraceBack incident actions, evidence pages, the five-stage brief, recovery simulation, and tests. Framework packages, templates, and third-party dependencies remain subject to their upstream licenses.

All three incident scenarios are deterministic synthetic benchmark data. The public showcase is read-only. The authenticated workspace can run an approval-gated recovery simulation, but each action invocation creates a fresh ephemeral simulator instance; it does not call production APIs, deployments, feature flags, databases, or customer records. Its postconditions are simulated, not live infrastructure health checks. A simulated recovery is not a completed production remediation. Execution provenance is derived from framework caller context; missing caller context is recorded as `unknown`, never as human.

## Final fields to complete before submitting
- [ ] Confirm exact creator/team names and any teammates who must be listed.
- [ ] Confirm all team members meet the official age and eligibility rules and authorize the entry.
- [ ] Record and publish a public Clips demonstration; verify signed-out playback and add the URL.
- [ ] Complete authenticated recovery and agent approval demonstration if the model provider is available.
- [ ] Verify a true narrow mobile viewport.
- [ ] Personally review and accept the current official rules on the submission form.
- [ ] Submit the official form and save the receipt/confirmation.
