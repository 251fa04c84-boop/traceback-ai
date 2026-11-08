# TraceBack AI — Verification Report

**Last updated:** November 8, 2026  
**Latest documentation branch head:** `a77b768d48b34bd54473d9278e96ac8a9c89c496`  
**Verified application code:** `2189847f0a941c293841014bad97c9bd5fc00817`  
**Latest report commit before this refresh:** `a77b768d48b34bd54473d9278e96ac8a9c89c496`

## Current status

**Application CI is green; the exact code Preview is READY and public smoke-tested.** GitHub Actions run #42457839580 passed both `verify` and `agent-native` jobs on application code commit `2189847`; latest branch-head CI run #42458208405 also passed.:
- Root dependency install, automated tests, and production build.
- Agent-Native dependency install, typecheck, action tests, doctor, and production build.

The exact application-code Preview deployment `dpl_DXUfRhJapGJ8H8S4QYsKANW99rko` remains the browser-tested build. The latest documentation-only Preview deployment `dpl_GS4F2cizGmMNfzpf1TX3sERT64ex` also reached READY for branch head `a77b768d`; its Vercel checks passed for both the Agent-Native Preview and root project. The application source remains unchanged from the exact code tested above. The docs-only Preview is available at:

https://traceback-agent-native-preview-3cy7uak1i-hackathons8.vercel.app/demo

The latest GitHub Actions run previously recorded for branch head `5d9b300` passed; later commits only corrected documentation. The application source remains unchanged from the exact code tested above.

Production deployment has not been targeted. The Agent-Native Preview project uses a separate Neon project named `traceback-ai-preview`. A read-only migration-history check showed 257 records, with the latest applied at 2026-11-05 15:30:28 UTC; no new migration record was added during the latest November 8 Preview build. The Vercel build invokes the migration runner against this Preview-specific database.

## Implemented product capabilities

- Three deterministic synthetic benchmark incidents: `inc-8921`, `inc-4402`, and `inc-7119`.
- Shared typed Agent-Native actions for incident listing, evidence retrieval, investigation brief generation, and approval-gated recovery simulation.
- Five-stage investigation: Observe, Correlate Evidence, Diagnose, Prepare Recovery Plan, Human Approval Gate.
- Public four-step inspectable evidence graph on each incident card: telemetry signal, runtime logs, deployment/code change, and likely diagnosis. The interface explicitly labels these as synthetic correlations, not proof of production causality.
- Authenticated recovery lab uses the shared `execute-recovery-simulation` action. The action declares `needsApproval: true`, enforces scenario-specific allowlisted steps, creates a fresh ephemeral simulator per invocation, and returns before/after metrics, simulated verification, and an audit trail.
- Recovery metric deltas show error-rate change in percentage points and p99 latency change in milliseconds, explicitly labelled simulated.
- Public showcase has no mutation or execution controls.

## CI verification — run #42457839580

Both jobs passed on application code commit `2189847`:
- `verify`: dependency install, root automated tests, root production build.
- `agent-native`: dependency install, Agent-Native typecheck, action tests, Agent-Native doctor, Agent-Native production build.

## Live Preview browser verification — November 8, 2026

**Public showcase: PASS**
- Exact deployment for commit `2189847` loaded.
- All three incident cards rendered with the expected severity and service.
- All three cards showed the four-step evidence graph.
- First incident expanded successfully; correlated logs, full stack traces, deployment diff, and recovery proposal were legible.
- Long stack traces, diff text, and recovery JSON wrapped inside their containers. No horizontal scrollbars or clipped characters were observed.
- Evidence-source disclosures were visible and expandable.
- Synthetic-data, correlation, and read-only disclosures were visible.
- No public execute/mutate/deploy controls were present.
- Only a normal vertical page scrollbar was observed.

**Signed-out access control: PASS on prior verified Preview**
- Direct access to `/incidents/inc-8921` redirected to `/sign-in` and preserved the intended return route.
- The sign-in form rendered with empty credential fields.
- No demo credentials, API keys, or tokens were exposed.
- No credentials were entered and no sign-in was attempted.

**Mobile viewport: NOT VERIFIED**
- Browser automation could not set or confirm a true 390×844 CSS-pixel mobile viewport.
- The latest visual smoke test was desktop. Dedicated mobile-device QA remains open.

## Build warnings (non-blocking)

- Vite reported a client root chunk of approximately 2.63 MB raw / 652 KB gzip and a 775 KB raw data chunk. This is a performance/code-splitting follow-up, not a failed build.
- H3 reported partially overlapping preMerge rules for `/icon-*.svg` and `/agent-native-*.svg`, then fell back to plain compilation. The deployment still completed successfully. This framework/configuration warning should be reviewed before production release.

## Remaining verification / submission gates

| Check | Status |
| --- | --- |
| Application code GitHub Actions tests and builds | PASS — run #42457839580 |
| Exact application code Preview | READY — deployment `dpl_DXUfRhJapGJ8H8S4QYsKANW99rko` |
| Public demo evidence graph, expanded logs/diff, disclosures | PASS |
| Long-text wrapping / horizontal scroll regression | PASS on latest code Preview |
| Signed-out private-route redirect | PASS on prior verified Preview |
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
