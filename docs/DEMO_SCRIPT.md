# TraceBack AI — Public Clips Demo Runbook

Target length: 100–120 seconds. Record the actual Agent-Native app and the public synthetic showcase, not the legacy Next.js implementation.

## Mandatory preflight

- Use the latest Preview deployment:
  https://traceback-agent-native-preview-git-codex-tra-134cf8-hackathons8.vercel.app/demo
- Confirm the deployment is READY. The root URL redirects to `/demo`.
- Open the public demo in a signed-out/incognito browser. It must show all three synthetic scenarios, correlated logs, deployment diffs, and proposed recovery actions.
- Confirm that `/incidents`, `/home`, and the three `/_agent-native/actions/*` endpoints do not expose private workspace/action data without authentication.
- Sign in with the user's own account and open `/incidents/inc-8921`. Confirm the new “Approve & run recovery simulation” control is visible and the result shows before/after metrics, every required action, verification evidence, and the audit trail.
- The recovery action is a deterministic synthetic benchmark simulation. It does not connect to production, and its verification is not a live infrastructure health check.
- Gemini free-tier chat has previously returned HTTP 429 quota errors and intermittent 503 errors. A successful live Agent-Native chat/tool-call has NOT been verified. Do not record or claim a successful live agent call until it is actually observed.
- If live chat is unavailable, record the real UI-triggered recovery simulation and accurately describe `execute-recovery-simulation` as the shared Agent-Native action; do not pretend the assistant invoked it in the clip.
- Keep credentials, API keys, private account information, and browser developer tools out of frame.

## Shot list and narration

### 0:00–0:12 — Problem and product
**Screen:** Open the public demo at `/demo`; show the TraceBack AI hero and read-only label.

**Narration:** “When an outage happens, engineers need to connect service metrics, application logs, and recent code changes before deciding what to do. TraceBack AI turns that investigation into a structured, evidence-first workflow.”

### 0:12–0:30 — Three benchmark incidents
**Screen:** Scroll through checkout outage, session crash loop, and database connection exhaustion.

**Narration:** “TraceBack includes three reproducible incident benchmarks: a checkout regression, a session-memory crash loop, and database connection exhaustion. These are deterministic synthetic scenarios, not live customer infrastructure.”

### 0:30–0:55 — Evidence and correlation
**Screen:** Expand `inc-8921`. Show metric samples, timestamped logs, suspect release, and code diff.

**Narration:** “For the checkout outage, the showcase brings together sampled telemetry, timestamped application logs, and the suspect deployment diff. The evidence points to a null-coupon regression in PaymentGatewayController.java, and the underlying log and diff are visible for review.”

### 0:55–1:15 — Cross-incident diagnosis
**Screen:** Show `inc-4402` and `inc-7119` evidence and their different proposed recovery actions.

**Narration:** “The other scenarios demonstrate different failure modes: an unbounded session cache exhausting JVM heap, and a database connection leak exhausting the pool. Each diagnosis is tied to its own evidence.”

### 1:15–1:38 — Human approval and verified simulation
**Screen:** In the signed-in workspace, click “Approve & run recovery simulation”. Show before/after error rate and p99 latency, the applied allowlisted actions, the simulated verification verdict, and expand the audit trail.

**Narration:** “After reviewing the recovery proposal, a human explicitly approves a deterministic simulation. TraceBack applies only the actions allowlisted for this incident, checks every required step, and returns before/after metrics with an audit trail. This is a synthetic benchmark—not a production rollback or live health check.”

### 1:38–1:55 — Agent-Native implementation
**Screen:** Show the `execute-recovery-simulation` action definition with `needsApproval: true`. If a real chat call has been verified, show its approval affordance; otherwise do not imply that the model invoked it. Finish on the public showcase.

**Narration:** “The UI and in-app agent share the same typed recovery action. Agent-initiated recovery calls require approval of that specific call; the UI button is an explicit human action. Public evidence remains read-only, and the recovery lab is limited to synthetic benchmark state.”

## Final recording checks

- Record only features that worked during preflight.
- Show actual UI and real action results; no fabricated AI responses or live infrastructure claims.
- Keep the text readable and avoid fast scrolling.
- Publish the clip with public access and test it in a signed-out/incognito browser.
- A Clips recording does not submit an entry. Submit the official form separately and verify its receipt.
