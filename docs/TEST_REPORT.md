# TraceBack AI — Verification Report

**Last updated:** November 5, 2026  
**Scope:** Agent-Native application under `agent-native-poc/`

## Current status

**Not yet submission-ready.** Source changes are present, but the latest candidate still needs a clean CI run and deployed browser smoke test.

## Implemented checks

- Three deterministic benchmark scenarios are defined: `inc-8921`, `inc-4402`, and `inc-7119`.
- Agent-Native read-only actions exist for incident listing, evidence retrieval, and the five-stage investigation brief.
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
| Latest GitHub Actions run on the current PR head | Queued / not yet verified |
| Agent-Native typecheck | Pending current-head CI result |
| Agent-Native action tests | Added; pending current-head CI result |
| Agent-Native doctor | Pending current-head CI result |
| Agent-Native production build | Pending current-head CI result |
| Latest Vercel deployment | Pending after runtime dependency fix |
| Browser smoke test on latest deployment | Not yet completed |
| Agent chat with configured model provider | Not yet completed |
| Mobile viewport review | Not yet completed |
| Public Clips recording and signed-out access check | Not yet completed |

## Scope and honesty

The earlier legacy Next.js app had a user-reported manual test run through all five stages for the three benchmark scenarios. That is not a substitute for testing the Agent-Native deployment.

All supplied incident data is simulated benchmark data. The current Agent-Native actions are read-only. A recovery proposal is not an executed remediation, and no live infrastructure health probe or production resolution is claimed.
