# TraceBack AI — Final Clips Demo Script

**Target:** 90–120 seconds  
**Record only after the latest Agent-Native deployment is Ready and the complete flow has been manually tested.**

## 0:00–0:15 — Problem and product

**Screen:** TraceBack overview page, then incident queue.

**Narration:**
“During an outage, engineers need more than a chatbot summary. They need to connect service metrics, application logs, and the latest deployment evidence before deciding on a safe response. TraceBack AI turns that investigation into a reviewable workflow.”

## 0:15–0:35 — Select an incident

**Screen:** Open `inc-8921` — Checkout outage.

**Narration:**
“This checkout benchmark shows a sharp error-rate increase immediately after release v2.4.1. The incident page exposes the metric samples, timestamped application logs, and the deployment diff that introduced an unchecked optional coupon dereference.”

## 0:35–1:05 — Show the five stages

**Screen:** Scroll through the five-stage investigation brief.

**Narration:**
“The Agent-Native workflow moves through five stages: observe, correlate evidence, diagnose, prepare a recovery plan, and stop at the human approval gate. The interface and the agent use the same typed Agent-Native actions, so they inspect the same incident evidence and recovery proposal.”

## 1:05–1:25 — Show the recovery proposal and safety boundary

**Screen:** Highlight the proposed rollback to v2.4.0 and the approval gate.

**Narration:**
“TraceBack prepares a specific recovery proposal and explains why it is recommended. This public benchmark demo is read-only and is not connected to live infrastructure. No production action is executed, and the app does not claim that the incident is fixed.”

## 1:25–1:45 — Show the other scenarios

**Screen:** Return to the incident queue; briefly open the session and database scenarios.

**Narration:**
“The same workflow covers a JVM memory exhaustion incident and a database connection exhaustion incident. Each brief cites the supplied telemetry, logs, and suspect deployment evidence.”

## 1:45–2:00 — Close

**Screen:** Return to overview with the incident queue visible.

**Narration:**
“TraceBack AI gives engineers an evidence-first incident investigation partner while keeping consequential decisions under human control.”

## Recording checklist

- Record the actual Agent-Native app, not the legacy Next.js dashboard.
- Show the incident list, one full five-stage investigation, proposed recovery action, and explicit read-only approval gate.
- Briefly show all three incident scenarios.
- Do not show fake live telemetry, a successful production rollback, or a resolved incident.
- Keep personal credentials, API keys, private email addresses, and account details out of the recording.
- Publish the clip with public access and test it in a signed-out/incognito browser.
