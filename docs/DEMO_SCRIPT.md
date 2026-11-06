# TraceBack AI — Public Clips Demo Runbook

Target length: 100–120 seconds. Record the actual Agent-Native app, not the legacy Next.js implementation.

## Mandatory preflight

- Use the latest Preview deployment:
  https://traceback-agent-native-preview-pxx24g3fv-hackathons8.vercel.app
- Sign in before recording if prompted.
- Verify the incident queue, all three evidence routes, and the Shared Agent-Native action layer.
- Verify at least one successful Agent-Native chat run that invokes the TraceBack actions. Current Gemini quota/rate-limit failures are known; do not record or claim a successful run until it is actually observed.
- If AI chat still fails, record only the working shared-action UI and five-stage brief, and accurately disclose that live model chat is unavailable. Do not fake tool activity or an AI response.
- Keep credentials, API keys, private account information, and browser developer tools out of frame.

## Shot list and narration

### 0:00–0:12 — Problem and product
**Screen:** TraceBack overview, then incident queue.

**Narration:** “When an outage happens, engineers need to connect service metrics, application logs, and recent code changes before deciding what to do. TraceBack AI turns that investigation into a structured, evidence-first workflow.”

### 0:12–0:28 — Three benchmark incidents
**Screen:** Show checkout outage, session crash loop, and database connection exhaustion.

**Narration:** “TraceBack includes three reproducible incident benchmarks: a checkout regression, a session-memory crash loop, and database connection exhaustion. These are clearly labelled simulated scenarios, not live customer infrastructure.”

### 0:28–0:50 — Evidence and correlation
**Screen:** Open `inc-8921`. Show metric samples, logs, suspect release and code diff.

**Narration:** “For the checkout outage, the workspace brings together sampled telemetry, timestamped application logs, and the suspect deployment diff. The investigation can point to the null-coupon regression and show the evidence behind that diagnosis.”

### 0:50–1:15 — Agent-Native shared capabilities
**Screen:** Show the Shared Agent-Native action layer and five-stage brief. If live chat has passed preflight, show the actual chat and its real action calls.

**Narration:** “The interface and the assistant use the same typed Agent-Native actions. They retrieve the incident evidence and build a five-stage investigation brief: observe, correlate, diagnose, prepare a recovery proposal, and stop for human approval.”

**If live chat has not passed preflight:** Do not show a fabricated chat. Say only: “The interface uses the same typed, read-only Agent-Native actions to load incident evidence and build this brief.”

### 1:15–1:38 — Recovery proposal and safety boundary
**Screen:** Show proposed recovery action and human approval gate.

**Narration:** “TraceBack prepares a specific recovery proposal and explains why it is recommended. This benchmark demo is read-only and is not connected to live infrastructure. No production action is executed, and the app does not claim that the incident is fixed.”

### 1:38–1:55 — Close
**Screen:** Return to overview with TraceBack name visible.

**Narration:** “TraceBack AI helps on-call engineers move from noisy incident evidence to a reviewable recovery decision, while keeping consequential decisions under human control.”

## Final recording checks

- Record only features that worked during preflight.
- Show actual UI and real action results; no fabricated AI responses or live infrastructure claims.
- Keep the text readable and avoid fast scrolling.
- Publish the clip with public access and test it in a signed-out/incognito browser.
- A Clips recording does not submit an entry. Submit the official form separately and verify its receipt.
