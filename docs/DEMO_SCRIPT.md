# TraceBack AI — Final Clips Demo Script

**Target:** 100–120 seconds  
**Record only after the latest Agent-Native deployment is Ready, the AI provider is configured, and the complete flow has been manually tested.**

## 0:00–0:12 — Problem and product

**Screen:** TraceBack overview page, then incident queue.

**Narration:**
“When an outage happens, engineers need to connect service metrics, application logs, and recent code changes before deciding what to do. TraceBack AI turns that investigation into a structured, evidence-first workflow.”

## 0:12–0:30 — Select an incident

**Screen:** Open `inc-8921` — Checkout outage.

**Narration:**
“This checkout benchmark shows an error-rate increase after release v2.4.1. The workspace exposes the time-series metrics, timestamped application logs, and deployment diff that introduced an unchecked optional coupon dereference.”

## 0:30–0:52 — Show the actual Agent-Native agent

**Screen:** Open the Agent Chat. Enter:

```text
Investigate incident inc-8921. Use the TraceBack incident actions, compare the telemetry samples, correlate the application log with the deployment diff, and explain the safest proposed next step. Do not execute anything.
```

**Narration:**
“The assistant uses the same typed Agent-Native actions as the interface. It retrieves the incident evidence and builds a structured investigation brief rather than relying on an unsupported guess.”

**Recording requirement:** Show the actual tool/action activity and the agent's response. Do not stage or fake a tool call.

## 0:52–1:18 — Show the five stages

**Screen:** Return to the incident detail page and scroll through the five-stage brief.

**Narration:**
“The investigation moves through five stages: observe, correlate evidence, diagnose, prepare a recovery proposal, and stop at the human approval gate. The same evidence is visible in the UI, including the exact metrics, logs, and suspect code diff.”

## 1:18–1:35 — Show the recovery proposal and safety boundary

**Screen:** Highlight the proposed rollback to v2.4.0 and the approval gate.

**Narration:**
“TraceBack prepares a specific recovery proposal and explains why it is recommended. This benchmark demo is read-only and is not connected to live infrastructure. No production action is executed, and the app does not claim that the incident is fixed.”

## 1:35–1:52 — Show the other scenarios

**Screen:** Return to the incident queue; briefly open the session and database scenarios.

**Narration:**
“The same workflow covers JVM memory exhaustion and database connection exhaustion. Each investigation correlates the supplied logs with the relevant deployment evidence.”

## 1:52–2:00 — Close

**Screen:** Return to overview.

**Narration:**
“TraceBack AI gives on-call engineers an evidence-first incident investigation partner while keeping consequential decisions under human control.”

## Recording checklist

- Record the actual Agent-Native app, not the legacy Next.js dashboard.
- Show the real Agent-Native chat tool calls; never fake or stage them.
- Show the incident list, one full five-stage investigation, proposed recovery action, and explicit read-only approval gate.
- Briefly show all three incident scenarios.
- Do not show fake live telemetry, a successful production rollback, or a resolved incident.
- Keep personal credentials, API keys, private email addresses, and account details out of the recording.
- Publish the clip with public access and test it in a signed-out/incognito browser.
