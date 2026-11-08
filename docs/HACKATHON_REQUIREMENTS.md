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
| Usefulness and Execution | 40% | Complete incident investigation, evidence correlation, reviewable recovery plan, and verified simulated outcome |
| Creativity and Design | 20% | Focused incident command workspace with clear evidence and human control |
| Innovation | 20% | Agent helps correlate operational evidence and prepare a safe recovery plan |
| Cleverness and Use of Agent-Native | 20% | Shared typed actions used by both the UI and the in-app agent, with an explicit approval gate |

## TraceBack implementation disclosure

### Existing project work
The repository retains an earlier custom Next.js incident workspace and deterministic incident scenarios. This is pre-existing project work and must not be represented as newly authored Agent-Native framework code.

### Hackathon development
The Agent-Native app under `agent-native-poc/` adapts the official Chat starter template for TraceBack. The app includes:
- `list-incidents`: read-only incident catalog.
- `get-incident-evidence`: read-only telemetry, logs, deployment and evidence retrieval.
- `build-investigation-brief`: read-only five-stage evidence-grounded brief.
- `execute-recovery-simulation`: shared write-capable action with `needsApproval: true`, restricted to an isolated synthetic simulator.

The interface and agent use the same typed action layer. Agent-initiated recovery calls rely on the Agent-Native framework's approval flow. Each recovery handler invocation creates a fresh simulator instance; it does not mutate a process-wide shared simulator.

### Template and third-party dependencies
The app uses the Agent-Native Chat starter from `@agent-native/core@0.223.0`, plus the framework Toolkit and packages declared in `agent-native-poc/package.json`. Their upstream licenses apply. Disclose the template and third-party packages in the entry.

## Current readiness audit — November 8

| Requirement | Status | Evidence / remaining work |
| --- | --- | --- |
| Official Agent-Native implementation | Implemented | `agent-native-poc/actions/` contains four typed `defineAction` actions; the Agent-Native app is the isolated Vercel project entrypoint |
| Five-stage investigation brief | Implemented and tested | Observe, Correlate, Diagnose, Plan, Human Approval Gate; tests cover all three benchmark incidents |
| Three incident scenarios | Implemented and browser-checked | Public Preview shows all three IDs, metrics, logs, deployment diffs, and recovery proposals |
| Recovery simulation safety | Implemented and unit-tested | Scenario allowlists, exact parameters, per-invocation simulator, caller provenance, concurrency isolation, and `needsApproval: true` |
| Dependency compatibility | Verified | `@agent-native/otel` pinned to 0.1.30; lockfile peer metadata supports core 0.223.0; frozen install passes |
| GitHub Actions | Passed | Run #42455373312 on current documentation head passed both `verify` and `agent-native` jobs: tests, typecheck, doctor, and production builds |
| Vercel Preview | In progress on current head | Previous hardening Preview commit reached READY and passed public smoke tests; the latest deployment is building and must reach READY before recording |
| Public showcase access | Passed on previous hardening Preview | All three cards expand; public surface is read-only; signed-out private incident route redirects to sign-in |
| Mobile layout | Passed on previous hardening Preview | Narrow viewport check found no horizontal overflow or clipped content |
| Authenticated recovery UI | Not yet user-verified | User must sign in and click the recovery simulation in the current Preview; do not share passwords in chat |
| Live Agent-Native model chat | Not yet verified | Gemini provider previously returned quota/availability errors. Do not claim a successful live assistant/tool call until a real run succeeds |
| Public Clips video | Not complete | Record the actual Agent-Native app, publish the clip, and verify public signed-out playback |
| Official submission | Not complete | Complete the form, accept rules, submit, and confirm receipt |

## Scope and honesty

All three incident scenarios are deterministic synthetic benchmark data. The public showcase is read-only. The recovery simulation changes only a fresh ephemeral in-memory benchmark instance; it does not call production APIs, deploys, feature flags, databases, or customer records. Its postconditions are simulated, not a live infrastructure health check.

The recovery handler unit tests call `run()` directly and do not exercise the framework approval lifecycle. They verify action behavior, caller attribution, and concurrency isolation. The framework approval gate is declared using `needsApproval: true`; the signed-in UI/agent approval path still requires a real authenticated click-through.

## Submission links

- Rules: https://www.builder.io/hackathon/rules
- Submission form: https://www.builder.io/hackathon/submit
- Clips: https://clips.agent-native.com/

Do not mark any item complete until the exact current deployment, real recording, or submission receipt has been checked.
