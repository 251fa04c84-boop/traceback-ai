# TraceBack AI — Verification Report

**Last updated:** November 8, 2026  
**Scope:** Agent-Native application under `agent-native-poc/`  
**Verified code head:** `b48c0d793184125a00704b8a95b4b483f583888e`

## Current status

**CI green; latest Preview deployed and public smoke-tested.** GitHub Actions run #42456448902 passed both `verify` and `agent-native` jobs on the verified code head. The Vercel Preview deployment `dpl_7ZBhs5sUfzeH4AvTfuE6hhssEzQi` reached READY and was tested at:

https://traceback-agent-native-preview-13x0hk875-hackathons8.vercel.app/demo

Production remains untouched. PR #4 is still open and draft; no merge has been performed.

## Implemented product capabilities

- Three deterministic synthetic benchmark incidents: `inc-8921`, `inc-4402`, and `inc-7119`.
- Shared typed Agent-Native actions for incident listing, evidence retrieval, investigation brief generation, and approval-gated recovery simulation.
- Five-stage investigation: Observe, Correlate Evidence, Diagnose, Prepare Recovery Plan, Human Approval Gate.
- Public four-step inspectable evidence graph on each incident card: telemetry signal, runtime logs, deployment/code change, and likely diagnosis. The interface explicitly labels these as synthetic correlations, not proof of production causality.
- Authenticated recovery lab uses the shared `execute-recovery-simulation` action. The action declares `needsApproval: true`, enforces scenario-specific allowlisted steps, creates a fresh ephemeral simulator per invocation, and returns before/after metrics, simulated verification, and an audit trail.
- Recovery metric deltas show error-rate change in percentage points and p99 latency change in milliseconds, explicitly labeled simulated.
- Public showcase has no mutation or execution controls.

## CI verification — run #42456448902

Both jobs completed successfully:

- `verify`: dependency install, root automated tests, root production build.
- `agent-native`: dependency install, Agent-Native typecheck, action tests, Agent-Native doctor, Agent-Native production build.

## Live Preview browser verification — November 8, 2026

**Public demo: PASS**
- Page loaded without visible runtime errors.
- All three incident cards rendered.
- All three cards showed the four-step evidence graph.
- Expanded first-incident details showed source logs, stack trace, deployment diff, and a recovery proposal marked NOT EXECUTED.
- Synthetic-data, correlation, and read-only disclosures were visible.
- No public execute/mutate/deploy controls were present.
- No clipping/overflow was observed in the tested viewport. The automation report did not unambiguously establish a true narrow-device emulation, so dedicated mobile viewport QA remains open.

**Signed-out access control: PASS**
- Direct access to `/incidents/inc-8921` redirected to `/sign-in` and preserved the intended return route.
- The sign-in form rendered with empty credential fields.
- No demo credentials, API keys, or tokens were exposed.
- No credentials were entered and no sign-in was attempted.

## Remaining verification / submission gates

| Check | Status |
| --- | --- |
| Current-head GitHub Actions tests and builds | PASS |
| Latest code Preview READY | PASS |
| Public demo evidence graph and disclosures | PASS |
| Signed-out private-route redirect | PASS |
| Authenticated recovery UI click-through | Not tested; requires an authorized account sign-in |
| Actual Agent-Native framework approval lifecycle | Not yet end-to-end verified; unit tests call `run()` directly |
| Live model-provider chat/tool call | Not verified; prior Gemini requests returned quota/availability errors (429/503) |
| True narrow mobile-device viewport QA | Pending |
| Public Clips recording and signed-out playback | Pending |
| Creator/team details and eligibility confirmation | User must confirm |
| Official rules acceptance, final submission, and receipt | User must complete |

## Scope and honesty

All supplied incident data is simulated benchmark data. Recovery simulation changes only a fresh in-memory simulator instance and cannot change production infrastructure. A `SIMULATED_HEALTHY` result is not a live infrastructure health check or proof of production remediation.

The recovery handler tests validate scenario allowlisting, output schema, expected simulated postconditions, caller provenance mapping, and per-invocation isolation. They do not test the framework's interactive approval lifecycle. Do not claim that the authenticated approval click-through, a successful live model call, or a public Clips demonstration has been completed until each is actually verified.
