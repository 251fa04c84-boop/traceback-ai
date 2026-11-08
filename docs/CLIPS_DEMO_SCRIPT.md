# TraceBack AI — Public Clips Demo Script

**Target length:** 90–120 seconds  
**Audience:** Builder.io Agent-Native Hackathon judges  
**Recording rule:** Show the real deployed application. Do not add mock overlays, fake terminal output, fabricated model responses, or claims of production recovery.

## Before recording
- Use the latest Preview URL: https://traceback-agent-native-preview-k793j7m08-hackathons8.vercel.app/demo
- Start signed out in a clean browser window.
- Close unrelated tabs and notifications.
- Use a desktop-width browser for the main walkthrough. Record a separate narrow-phone pass only after mobile viewport QA.
- If showing the authenticated recovery lab, sign in with the authorized account first. Never show passwords, email inboxes, API keys, environment variables, or account details.
- If the Gemini provider is unavailable, omit the agent-chat shot rather than faking a response.
- Keep all simulation and synthetic-data disclosures visible at least once.

## Shot-by-shot plan

### 0:00–0:10 — Hook / problem
**Screen:** Public TraceBack AI showcase header and benchmark overview.

**Narration:**
"During an incident, engineers need more than a chatbot summary. They need to see which signals, logs, and code changes support a diagnosis—and retain control over recovery."

### 0:10–0:25 — Three incident scenarios
**Screen:** Scroll through the three incident cards: checkout outage, session crash loop, database connection exhaustion.

**Narration:**
"TraceBack presents three reproducible incident scenarios. Each starts with sampled service metrics and concrete runtime evidence."

### 0:25–0:48 — Evidence graph
**Screen:** Focus on the checkout incident. Point to Signal, Runtime evidence, Change evidence, and Diagnosis. Expand the evidence details and show the log stack trace and suspect deployment diff.

**Narration:**
"Every diagnosis is inspectable. Follow the evidence from telemetry, to timestamped logs, to the suspect release and code diff. These are clearly labelled synthetic benchmark correlations—not claims of production causality."

### 0:48–1:00 — Safety boundary
**Screen:** Show the recovery proposal marked NOT EXECUTED and the public read-only notice.

**Narration:**
"The public showcase cannot execute changes. Recovery proposals remain proposals until a human authorizes the separate recovery workflow."

### 1:00–1:25 — Authenticated recovery lab (only if verified)
**Screen:** Sign in without showing credentials. Open the incident workspace. Show the recovery lab and the exact proposed action. Click **Approve & run recovery simulation** only after confirming it is the isolated benchmark simulator. Show before/after error rate and p99 latency, simulated verification status, and the audit trail.

**Narration:**
"In the authenticated workspace, the same typed Agent-Native action powers the recovery lab. The action is constrained to the selected scenario, runs in a fresh isolated simulator, and returns before-and-after metrics plus an audit trail. This is simulated verification, not a production health check."

**Important:** If the authenticated click-through has not been tested successfully, omit this section and do not imply it works live.

### 1:25–1:40 — Agent-Native approval (only if a real run succeeds)
**Screen:** Use the real Agent-Native assistant to inspect the incident. If it proposes recovery, show the actual framework approval request and the human decision. Do not trigger or narrate an approval if no approval UI appears.

**Narration:**
"The agent uses the same evidence actions as the interface. Its recovery capability is separately approval-gated; evidence is not treated as instructions."

**Important:** Gemini provider calls previously encountered 429/503 errors. Only include this shot after a real successful run. Otherwise omit it.

### 1:40–1:50 — Close / transparency
**Screen:** Return to the public demo footer and read-only disclosure.

**Narration:**
"TraceBack makes incident reasoning reviewable and recovery safer by design: evidence first, explicit human control, and honest simulation boundaries."

## Recording checklist
- [ ] Public Clips URL is accessible without sign-in.
- [ ] No credentials, secrets, customer data, or personal account details appear.
- [ ] Three scenarios and four-step evidence graph are shown.
- [ ] Expanded log and deployment diff are legible.
- [ ] Public read-only / synthetic-data disclosure is visible.
- [ ] Authenticated recovery shot is included only after a real successful test.
- [ ] Agent approval shot is included only after a real successful framework approval run.
- [ ] No production recovery or live telemetry claim is made.
- [ ] Final video playback is checked in a signed-out browser.
- [ ] Public Clips URL is added to `docs/SUBMISSION_DRAFT.md` and the official submission form.

## Short description for the Clips page
TraceBack AI is an evidence-first incident response workspace built on Agent-Native. It connects synthetic telemetry, runtime logs, and deployment diffs into an inspectable diagnosis, then uses an explicit approval boundary for isolated recovery simulations with before/after metrics and an audit trail.
