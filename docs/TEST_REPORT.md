# TraceBack AI — Verification Report

**Last updated:** November 8, 2026  
**Scope:** Agent-Native application under `agent-native-poc/`

## Current status

**CI-verified hardening candidate.** GitHub Actions run #42455284945 passed both `verify` and `agent-native` jobs on commit `04c3d8cefc93a183cb1369cb8e73b71ceef1c4be`. This includes frozen-lockfile installation, typecheck, action tests, Agent-Native doctor, and both production builds. The Vercel Preview for the hardening code reached READY on commit `609a212dc3eeb7924e1779dccc797892066d889d`. A fresh public browser smoke test passed all three incident cards, the read-only boundary, signed-out redirect to sign-in, and mobile layout. Later commits after `609a` are documentation-only; their Preview redeploys may still be queued.

## Implemented checks

- Three deterministic benchmark scenarios are defined: `inc-8921`, `inc-4402`, and `inc-7119`.
- Agent-Native actions exist for incident listing, evidence retrieval, the five-stage investigation brief, and an approval-gated synthetic recovery simulation.
- Action tests cover the incident catalog, schema-valid evidence for each incident, unknown IDs, five-stage output, and the read-only boundary.
- The five-stage action returns Observe, Correlate Evidence, Diagnose, Prepare Recovery Plan, and Human Approval Gate.
- The Agent-Native detail route displays the same investigation brief returned by the shared action.
- The generic legacy Next.js action API rejects mutating actions; the old approval endpoint fails closed.

## Issues found and addressed

### Checkout metric explanation
The dashboard time series records 42.8% at 21:40, a 44.1% peak at 21:42, and 43.5% at 21:45. The scenario summary and deterministic fallback now explain these values as initial, peak, and latest samples rather than presenting them as conflicting measurements.

### Database connection evidence
The Postgres scenario records 100/100 active connections, PostgreSQL SQLSTATE 53300, and a HikariPool timeout after 30,005 ms. The root-cause explanation now connects server-side connection exhaustion with application-side pool acquisition timeouts.

### Agent-Native runtime packaging
The first hosted runtime smoke test failed because the deployment could not resolve the `yjs` package imported by a framework component. `yjs@13.6.33` was added as a direct dependency and locked. A fresh deployment must still prove that this fixes the runtime failure.

## Verification still required

| Check | Status |
| --- | --- |
| GitHub Actions on prior PR head `fc4dacb` | Passed: `verify` and `agent-native` jobs |
| Frozen lockfile install, typecheck, action tests, doctor, root tests, and both builds on hardening head | Passed in run #42455284945 |
| GitHub Actions on November 8 hardening head `04c3d8c` | Passed: `verify` and `agent-native` jobs (run #42455284945) |
| Agent-Native typecheck | Pending current-head CI result |
| Agent-Native action tests | Added; pending current-head CI result |
| Agent-Native doctor | Pending current-head CI result |
| Agent-Native production build | Pending current-head CI result |
| Latest Vercel deployment | Pending after runtime dependency fix |
| Public demo browser QA | Passed on READY hardening Preview: all three incident cards, logs/diffs, recovery proposals, public read-only boundary, signed-out redirect, and narrow mobile layout |
| Hardening code Preview (`609a`) | READY; latest public smoke test passed. Later branch commits are documentation-only. |
| Browser smoke test of the authenticated recovery action | Pending; requires user sign-in |
| Agent chat with configured model provider | Not yet completed |
| Mobile viewport review | Not yet completed |
| Public Clips recording and signed-out access check | Not yet completed |

## Scope and honesty

The earlier legacy Next.js app had a user-reported manual test run through all five stages for the three benchmark scenarios. That is not a substitute for testing the Agent-Native deployment.

All supplied incident data is simulated benchmark data. Three Agent-Native evidence actions are read-only; the separate recovery action is approval-gated and changes only a fresh ephemeral in-memory simulator instance per invocation. Its handler unit tests call `run()` directly and therefore do not test the framework approval lifecycle. They verify provenance mapping (`tool` → agent, `frontend` → human, missing context → unknown) and concurrent per-invocation isolation. The framework approval behavior is provided by Agent-Native `needsApproval`; no live infrastructure health probe or production resolution is claimed.
