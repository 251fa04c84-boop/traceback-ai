# TraceBack AI — Verification Report

**Last updated:** November 8, 2026  
**Current branch head:** `2189847f0a941c293841014bad97c9bd5fc00817`  
**Latest application code head with CI pass:** same SHA

## Current status

**GitHub CI is green.** Run #42457839580 passed both `verify` and `agent-native` jobs on commit `2189847`:
- Root dependency install, automated tests, and production build.
- Agent-Native dependency install, typecheck, action tests, doctor, and production build.

The latest Preview deployment for this exact SHA is currently QUEUED; do not claim the newest overflow fix is deployed until Vercel reports READY and the browser retest passes.

The prior code Preview at `b2a05a0` reached READY and its browser smoke test confirmed the public evidence graph and read-only controls, but reported horizontal scrollbars inside expanded log stack-trace and deployment-diff blocks. A second CSS adjustment is now committed at `2189847`: long code/log content uses `overflow-wrap:anywhere`, wrapping styles, and hidden horizontal overflow. This fix still needs a fresh deployed browser retest.

Production deployment has not been targeted. The Agent-Native Preview project uses a separate Neon project named `traceback-ai-preview`. Its read-only migration-history check showed 257 records, with the latest applied at 2026-11-05 15:30:28 UTC; no new migration record was added during the latest November 8 Preview build. The Vercel build invokes the migration runner against this Preview-specific database.

## Implemented product capabilities

- Three deterministic synthetic benchmark incidents: `inc-8921`, `inc-4402`, and `inc-7119`.
- Shared typed Agent-Native actions for incident listing, evidence retrieval, investigation brief generation, and approval-gated recovery simulation.
- Five-stage investigation: Observe, Correlate Evidence, Diagnose, Prepare Recovery Plan, Human Approval Gate.
- Public four-step inspectable evidence graph on each incident card: telemetry signal, runtime logs, deployment/code change, and likely diagnosis. The interface explicitly labels these as synthetic correlations, not proof of production causality.
- Authenticated recovery lab uses the shared `execute-recovery-simulation` action. The action declares `needsApproval: true`, enforces scenario-specific allowlisted steps, creates a fresh ephemeral simulator per invocation, and returns before/after metrics, simulated verification, and an audit trail.
- Recovery metric deltas show error-rate change in percentage points and p99 latency change in milliseconds, explicitly labelled simulated.
- Public showcase has no mutation or execution controls.

## CI verification — run #42457839580

Both jobs passed on commit `2189847`:
- `verify`: dependency install, root automated tests, root production build.
- `agent-native`: dependency install, Agent-Native typecheck, action tests, Agent-Native doctor, Agent-Native production build.

## Browser verification

### Public showcase — prior Preview `b2a05a0`
- All three incident cards rendered.
- All four evidence graph nodes rendered per card.
- Expanded first-incident details showed source logs, stack trace, deployment diff, and a recovery proposal marked NOT EXECUTED.
- Synthetic-data, correlation, and read-only disclosures were visible.
- No public execute/mutate/deploy controls were present.
- The main page body did not show horizontal overflow, but nested log and diff code blocks showed horizontal scrollbars. The latest `2189847` wrapping fix is awaiting deployment and retest.

### Signed-out access control — prior verified Preview
- Direct access to `/incidents/inc-8921` redirected to `/sign-in` and preserved the intended return route.
- The sign-in form rendered with empty credential fields.
- No demo credentials, API keys, or tokens were exposed.
- No credentials were entered and no sign-in was attempted.

### Mobile viewport
- Browser automation could not set or confirm a true 390×844 CSS-pixel mobile viewport.
- Dedicated mobile-device QA remains open. Desktop browser tests do not count as mobile verification.

## Remaining verification / submission gates

| Check | Status |
| --- | --- |
| Current-head GitHub Actions tests and builds | PASS |
| Latest `2189847` Preview deployment | QUEUED at last check |
| Latest overflow fix browser retest | Pending deployment |
| Public evidence graph and disclosures | PASS on prior Preview |
| Signed-out private-route redirect | PASS on prior Preview |
| True narrow mobile-device viewport QA | Pending; emulation unavailable in browser session |
| Authenticated recovery UI click-through | Not tested; requires authorized account sign-in |
| Actual Agent-Native framework approval lifecycle | Not yet end-to-end verified; unit tests call `run()` directly |
| Live model-provider chat/tool call | Not verified; prior Gemini requests returned quota/availability errors (429/503) |
| Public Clips recording and signed-out playback | Pending |
| Creator/team details and eligibility confirmation | User must confirm |
| Official rules acceptance, final submission, and receipt | User must complete |

## Scope and honesty

All supplied incident data is simulated benchmark data. Recovery simulation changes only a fresh in-memory simulator instance and cannot change production infrastructure. A `SIMULATED_HEALTHY` result is not a live infrastructure health check or proof of production remediation.

The recovery handler tests validate scenario allowlisting, output schema, expected simulated postconditions, caller provenance mapping, and per-invocation isolation. They do not test the framework's interactive approval lifecycle. Do not claim that the authenticated approval click-through, a successful live model call, a mobile-device test, or a public Clips demonstration has been completed until each is actually verified.
