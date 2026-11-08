# Builder.io Agent-Native Hackathon 2026 — Requirements and Readiness

**Last checked:** November 8, 2026  
**Official rules:** https://www.builder.io/hackathon/rules  
**Hackathon overview:** https://www.builder.io/hackathon  
**Submission form:** https://www.builder.io/hackathon/submit  
**Clips:** https://clips.agent-native.com/

## Deadline

**Monday, November 9, 2026 at 11:59 PM Pacific Time**  
Equivalent to **Tuesday, November 10 at 07:59 UTC / 13:29 India Standard Time**.

Submit before the deadline and verify the confirmation receipt. A public repository or recorded Clips video does not, by itself, submit an entry.

## Official entry requirements

1. Build a functional application using Agent-Native.
2. Submit original work or meaningful new development completed during the hackathon (which began October 27, 2026).
3. Identify pre-existing work, templates, libraries, third-party assets, and what changed during the event.
4. Provide a project description, creator/team details, contact information, and an accessible demonstration.
5. Record a **public Clips demonstration** showing the actual application in use. The recording must be viewable without a login or access request.
6. Submit the required details and public Clips URL through the official project submission form.
7. Agree to the Official Rules and confirm eligibility. Every participant must be at least 18 or the age of legal majority in their jurisdiction, whichever is higher.

## Judging rubric

| Criterion | Weight | TraceBack focus |
| --- | ---: | --- |
| Usefulness and Execution | 40% | Complete evidence-led incident investigation, reviewable recovery plan, and verified simulated outcome |
| Creativity and Design | 20% | Focused incident command workspace with inspectable provenance and human control |
| Innovation | 20% | Agent correlates operational evidence and prepares a constrained recovery plan |
| Cleverness and Use of Agent-Native | 20% | Shared typed actions used by both UI and agent, with explicit approval boundary |

## TraceBack implementation disclosure

### Existing project work
The repository retains an earlier custom Next.js incident workspace and deterministic incident scenarios. This is pre-existing project work and must not be represented as newly authored Agent-Native framework code.

### Hackathon development
The Agent-Native app under `agent-native-poc/` adapts the official Chat starter template for TraceBack. It includes:
- `list-incidents`: read-only incident catalog.
- `get-incident-evidence`: read-only telemetry, logs, deployment and evidence retrieval.
- `build-investigation-brief`: read-only five-stage evidence-grounded brief.
- `execute-recovery-simulation`: shared write-capable action with `needsApproval: true`, restricted to an isolated synthetic simulator.

The interface and agent use the same typed action layer. Agent-initiated recovery calls rely on the Agent-Native framework's approval flow. Each recovery handler invocation creates a fresh simulator instance; it does not mutate a process-wide shared simulator.

## Current readiness audit — November 8, 2026

| Requirement | Status | Evidence / remaining work |
| --- | --- | --- |
| Official Agent-Native implementation | Implemented | Four typed `defineAction` actions under `agent-native-poc/actions/` |
| Five-stage investigation brief | CI-tested | Observe, Correlate, Diagnose, Plan, Human Approval Gate |
| Three incident scenarios | Implemented and browser-checked | All three public cards, metrics, logs, diffs, and proposals render |
| Public evidence graph | Preview QA passed | Four inspectable nodes per incident, source evidence expandable, synthetic-correlation disclosure visible |
| Recovery simulation safety | Implemented and unit-tested | Scenario allowlists, exact parameters, per-invocation simulator, caller provenance, concurrency isolation, and `needsApproval: true` |
| Latest branch-head GitHub Actions | Passed | Run #42463146365 on `1e54a72`: both `verify` and `agent-native` jobs passed; root tests/build plus Agent-Native typecheck/action tests/doctor/build |
| Latest Preview | READY | Deployment `dpl_JBjBTBFbo9gS6KAyjVfxt1A9zSvy` for branch head `1e54a72`; app source remains browser-tested commit `2189847` |
| Public showcase access | Passed | All three cards, four-stage graph, expanded evidence, disclosures, and no public mutation controls |
| Signed-out private-route protection | Passed | Direct incident URL redirects to sign-in and preserves return route |
| Narrow mobile viewport | Pending | Browser session could not emulate 390×844 CSS pixels |
| Authenticated recovery UI | Pending | Requires authorized account sign-in and a real click-through |
| Actual Agent-Native framework approval lifecycle | Pending | Unit tests call `run()` directly and do not test interactive approval |
| Live Agent-Native model chat | Not verified | Gemini provider previously returned 429/503; do not claim success without a real successful run |
| Public Clips video | Not complete | Record actual app, publish clip, and verify signed-out playback |
| Official submission | Not complete | User must confirm team/eligibility, accept rules, submit, and save receipt |

## Build notes

The Preview build completed, with non-blocking warnings for a large client JavaScript chunk and overlapping H3 `preMerge` route rules (the compiler fell back to plain compilation). Review code splitting and the route-rule warning before a Production release.

The Agent-Native Preview project uses a dedicated Neon project named `traceback-ai-preview`. Its migration history was inspected read-only; the latest migration record predates the November 8 Preview build. No Production deployment was triggered.

## Scope and honesty

All three incident scenarios are deterministic synthetic benchmark data. The public showcase is read-only. The recovery simulation changes only a fresh ephemeral in-memory benchmark instance; it does not call production APIs, deployments, feature flags, databases, or customer records. Its postconditions are simulated, not a live infrastructure health check.

The recovery handler unit tests call `run()` directly and do not exercise the framework approval lifecycle. They verify action behavior, caller attribution, and concurrency isolation. The framework approval gate is declared using `needsApproval: true`; the signed-in UI/agent approval path still requires a real authenticated click-through.

## Submission links

- Rules: https://www.builder.io/hackathon/rules
- Submission form: https://www.builder.io/hackathon/submit
- Clips: https://clips.agent-native.com/
- Recording script: `docs/CLIPS_DEMO_SCRIPT.md`

Do not mark any item complete until the exact current deployment, real recording, or submission receipt has been checked.
