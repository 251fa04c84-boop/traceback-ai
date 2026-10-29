# TraceBack AI — 2-Minute Demo Script & Narration Guide

**Target Duration:** 2 minutes 15 seconds  
**Demo Persona:** Site Reliability Engineer (SRE) handling a midnight production outage  
**Primary Scenario:** Incident #1 — "Checkout Outage: NullPointerException in v2.4.1"  

---

## Storyboard & Timing

### 0:00 – 0:25 | The Problem & Setup
- **Screen:** Open TraceBack AI dashboard. High-contrast dark mode.
- **Visual:** Red outage banner flashing: `INCIDENT #INC-8921: checkout-service HTTP 500 error spike (42.8%)`.
- **Narration:**
  > *"It’s 2 AM, and your checkout service is failing for 40% of paying customers. Traditional chatbots are useless here—they just paste generic suggestions. What engineers need is an agent-native co-pilot that shares the same tools, inspects real telemetry, proposes concrete recovery actions, and verifies the fix. This is TraceBack AI, built on Builder.io's Agent-Native architecture."*

### 0:25 – 0:55 | Autonomous Investigation & Shared Actions
- **Screen:** Click "Start Investigation".
- **Visual:** Right pane activates: Agent enters `INVESTIGATING` state.
  - Tool Invocation 1: `getTelemetryMetrics` -> Latency and error curves render in real-time.
  - Tool Invocation 2: `getServiceLogs` -> Filters 10,000 lines down to `NullPointerException in PaymentGatewayController.java:142`.
  - Tool Invocation 3: `inspectDeploymentDiff` -> Side-by-side git diff highlights commit `a7e89f` by `@dev-alex` deployed 12 minutes ago, showing an unchecked optional coupon code object.
- **Narration:**
  > *"TraceBack AI autonomously dispatches the exact same actions our engineers use—invoking `getServiceLogs` and `inspectDeploymentDiff` via shared `defineAction` primitives. Within seconds, it correlates the 500 errors directly to commit `a7e89f`, where a null check was omitted on line 142 of `PaymentGatewayController`."*

### 0:55 – 1:30 | The Recovery Plan & Human Approval Gate
- **Screen:** Agent proposes action. Modal pops up: `Action Authorization Required`.
- **Visual:**
  - Proposed Action: `rollbackDeployment(releaseId: 'v2.4.0')`
  - Blast Radius: Medium | Service: `checkout-service`
  - Supporting Evidence: Cited commit `a7e89f` + 42.8% error rate
  - Button: "Authorize Rollback (v2.4.0)"
- **Narration:**
  > *"Because this is an agent-native system designed for real production safety, the agent cannot execute mutating commands without human consent. TraceBack AI presents the exact proposed action, the supporting evidence chain, and the blast radius. As the engineer on call, I review the evidence and click 'Authorize Rollback'."*

### 1:30 – 1:55 | Execution & Deterministic Verification
- **Screen:** Human clicks "Authorize Rollback".
- **Visual:**
  - Action executes: Container image switches from `v2.4.1` back to `v2.4.0`.
  - Probes run: Deterministic health checks ping endpoints (`/healthz`, `/metrics`).
  - Error rate drops from `42.8%` to `0.01%`.
  - Banner turns vibrant green: `INCIDENT RESOLVED — System Healthy`.
- **Narration:**
  > *"The action is executed through our shared action layer. Crucially, the agent does NOT simply declare the incident resolved. TraceBack AI deterministically probes the live service telemetry. Only when error rates drop below 0.02% and health checks pass 200 OK does the incident state transition to Resolved."*

### 1:55 – 2:15 | Post-Mortem Audit & Conclusion
- **Screen:** Click "Generate Post-Mortem".
- **Visual:** Formatted markdown post-mortem with exact timeline of agent investigation, human approval timestamp, executed diffs, and MTTR (Mean Time to Recovery) of 4 minutes.
- **Narration:**
  > *"In under five minutes, we investigated, identified root cause, safely rolled back with human approval, verified resolution, and generated a complete audit post-mortem. TraceBack AI: bringing true Agent-Native power to mission-critical engineering."*

---

## Judge Q&A Cheat Sheet

**Q: How does this use Builder.io's Agent-Native framework?**  
*A: All operations (`getServiceLogs`, `inspectDeploymentDiff`, `rollbackDeployment`, `toggleFeatureFlag`) are declared once using `defineAction` with Zod validation. Both the human clicking buttons in the UI and the autonomous agent dispatching tools run the exact same underlying action functions and share application state.*

**Q: Is the resolution check real or does the LLM hallucinate it?**  
*A: It is strictly deterministic. The simulation engine runs an active probe after any mutating action. If the wrong action is executed, the health check fails and the incident remains unresolved.*

**Q: Can this be used with real Kubernetes/AWS infrastructure?**  
*A: Yes. Because actions are decoupled via `defineAction`, the simulated adapters can be swapped with real AWS SDK or Kubernetes client calls with zero changes to the UI or Agent orchestration logic.*
