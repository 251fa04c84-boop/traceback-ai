# 🏆 Devpost / Official Submission Draft: TraceBack AI

## Project Title
**TraceBack AI — Agent-Native Incident Investigation & Recovery Workspace**

## Tagline (Pitch)
Autonomous AI agent and on-call engineers operating as equal peers on shared actions, telemetry data, and deterministic recovery verification.

---

## Public Demo URL
https://traceback-ai.vercel.app

## Public GitHub Repository
https://github.com/251fa04c84-boop/cultureweave-ai *(or target repo: https://github.com/your-team/traceback-ai)*

---

## 💡 Inspiration & The Problem
> *"At 2 AM during a production outage, traditional AI chatbots are completely useless."*

When critical services fail, engineering teams don’t need an AI that just generates conversational text in a side panel. Chatbots:
1. Cannot execute real application actions.
2. Have zero awareness of live telemetry, recent git diffs, or container logs.
3. Hallucinate that an incident is "resolved" without checking system health.
4. Cannot be trusted to execute dangerous mutations without structured human authorization.

We built **TraceBack AI** to demonstrate what true **Agent-Native** incident management looks like—unifying the human engineer and the AI agent around shared tools, evidence-grounded hypotheses, strict human safety gates, and deterministic health verification.

---

## 🚀 What It Does
TraceBack AI is an end-to-end incident investigation and remediation workspace:
1. **Interactive Incident Switcher:** Ships with 3 realistic production failure scenarios:
   - *Checkout Outage (`inc-8921`):* NullPointerException in `v2.4.1` spiking HTTP 500 error rates to 42.8%.
   - *Session CrashLoop (`inc-4402`):* Unbounded in-memory cache causing JVM heap exhaustion (`OOMKilled`).
   - *DB Connection Exhaustion (`inc-7119`):* Unreleased Postgres connection pool client on error paths.
2. **Autonomous Multi-Phase Investigation:** The agent dispatches shared `defineAction` primitives:
   - Fetches and filters container logs with error stack traces.
   - Inspects git commit diffs, commit hashes, and commit authors.
   - Formulates a root-cause hypothesis with cited, immutable evidence lines.
   - Synthesizes a concrete recovery action.
3. **Human Approval Gate:** Mutating actions (`rollbackDeployment`, `toggleFeatureFlag`, `restartService`) are intercepted. The user is presented with a clear blast-radius warning, target parameters, and one-click authorization.
4. **Deterministic Health Verification:** The agent does *not* self-certify resolution. Instead, an active health probe tests endpoints, error rates, and pod states. Only when metrics return to nominal thresholds does the system transition to `RESOLVED`.
5. **Automated Post-Mortem Generator:** Produces an exportable Markdown post-mortem with exact timeline, MTTR metrics, and preventative action items.

---

## 🛠️ How We Built It (Agent-Native Architecture)
- **Agent-Native Core (`@agent-native/core` Pattern):**
  All capabilities (`getServiceLogs`, `inspectDeploymentDiff`, `getTelemetryMetrics`, `checkServiceHealth`, `rollbackDeployment`, `toggleFeatureFlag`, `restartService`) are declared once using `defineAction` with Zod validation. Both the human clicking UI buttons and the autonomous AI agent execute the exact same underlying action functions.
- **Frontend & UI:** Next.js 14 App Router, React 18, Tailwind CSS, Lucide React icons. Fully responsive across mobile (390px) and desktop command screens.
- **Deterministic Simulation Engine:** In-memory state machine modeling realistic container clusters, synthetic logs, and timeseries telemetry.
- **Automated Verification Suite:** Custom test runner (`scripts/test-runner.js`) with 41 passing automated unit, integration, and security checks (100% pass rate).

---

## 🎥 Demo Video & Subtitles
- **Video File:** `TraceBack_AI_Builder_Hackathon_Demo.mp4` (Duration: 1m 21s, 1080p Full HD)
- **Subtitles (SRT):** `TraceBack_AI_Builder_Hackathon_Demo.srt`
- **Builder.io Clips / Video URL:** Uploaded via Builder.io Clips dashboard. *See [Submission Checklist](../docs/SUBMISSION_CHECKLIST.md) for step-by-step upload guide.*

---

## ⚡ Challenges We Ran Into
1. **Preventing Agent Self-Certification:** Large Language Models frequently claim a bug is "fixed" as soon as an action is recommended. We decoupled the verdict from the LLM, enforcing that resolution can only be confirmed by deterministic health probes against system metrics.
2. **Safe Mutating Action Interception:** Ensuring that mutating operations cannot be bypassed by an autonomous agent. We implemented a strict approval gate in the action dispatcher that halts execution and emits `requiresApproval: true` until an explicit human token is granted.
3. **Mobile Responsive SRE Experience:** On-call engineers frequently respond from mobile phones. We designed a clean, responsive layout with accessible telemetry tabs and one-click approval buttons.

---

## 🏅 Accomplishments We're Proud Of
- **Genuine Agent-Native Implementation:** Not a chatbot wrapper. The AI agent and the human engineer share the same action primitives and live application state.
- **100% Automated Test Coverage:** 41 out of 41 automated tests passing with 0 failures across all scenarios and action primitives.
- **Zero-Dependency Judge Usability:** Completely functional out of the box with zero external configuration or paid API keys required.

---

## 🧰 Built With
- `agent-native`
- `builder-io`
- `nextjs`
- `react`
- `typescript`
- `zod`
- `tailwindcss`
