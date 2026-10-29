# Builder.io Agent-Native Hackathon 2026 — Official Requirements & Audit

**Access Date:** October 28, 2026  
**Primary Source:** [Builder.io Hackathon](https://www.builder.io/hackathon/)  
**Framework Repository:** [BuilderIO/agent-native](https://github.com/BuilderIO/agent-native)  

---

## 1. Verified Hackathon Overview

| Item | Official Specification | Verification Status | Source URL |
| :--- | :--- | :--- | :--- |
| **Event Name** | Builder.io Agent-Native Hackathon | Verified | [builder.io/hackathon](https://www.builder.io/hackathon/) |
| **Start Date** | October 27, 2026 (open immediately) | Verified | [builder.io/hackathon](https://www.builder.io/hackathon/) |
| **Kickoff Webinar** | Thursday, October 29, 2026 at 8:30 AM PT | Verified | [builder.io/hackathon](https://www.builder.io/hackathon/) |
| **Submission Deadline** | **November 9, 2026 at 11:59 PM PT** (Nov 10, 1:29 PM IST) | Verified | [builder.io/hackathon](https://www.builder.io/hackathon/) |
| **Prize Pool** | $10,000 USD total across 5 cash tiers + community spotlights | Verified | [builder.io/hackathon](https://www.builder.io/hackathon/) |
| **Team Size** | Teams permitted (our team: 4 members) | Verified | [builder.io/hackathon](https://www.builder.io/hackathon/) |
| **Eligibility** | Global, age 18+ or age of majority, free to enter | Verified | [builder.io/hackathon](https://www.builder.io/hackathon/) |

> [!NOTE]  
> **Deadline Clarification:** The initial prompt referenced November 2, 2026. Official verification of `builder.io/hackathon` confirms the official submission deadline is **November 9, 2026 at 11:59 PM PT**. We will target internal feature completion by November 3, 2026 to ensure ample testing and buffer.

---

## 2. Official Judging Criteria & Weights

| Criterion | Weight | Official Description / Judge Intent | How TraceBack AI Aligns | Status |
| :--- | :---: | :--- | :--- | :---: |
| **Usefulness & Execution** | **40%** | Solving a clear, real-world problem with a complete, robust, working experience rather than an unfinished prototype. | Solves production downtime triage. Provides realistic incident scenarios, live tool diagnostics, deterministic health verifications, and post-mortem audit generation. | In Progress |
| **Creativity & Design** | **20%** | Distinctive, thoughtful product idea and user interaction model that feels polished and purpose-built. | Developer-grade incident response workspace: incident timeline, live agent thought process, interactive evidence explorer, diff inspector, and human approval gates. | In Progress |
| **Innovation** | **20%** | Leveraging the AI agent to meaningfully improve the overall workflow beyond generic chatbots. | Agent acts as an active peer SRE: gathers evidence across logs/metrics/deployments, hypothesizes root causes, proposes concrete actions, and awaits human authorization. | In Progress |
| **Cleverness & Use of Agent-Native** | **20%** | Resourcefully utilizing the Agent-Native framework (`defineAction`, shared state between agent and UI, peer collaboration). | All actions (`getServiceLogs`, `inspectDeploymentDiff`, `checkServiceHealth`, `rollbackDeployment`, `toggleFeatureFlag`) are defined once via `defineAction` with Zod validation. Both human UI clicks and the AI agent execute the exact same action primitives. | In Progress |

---

## 3. Technology & Framework Requirements

### Core Mandate: Builder.io Agent-Native Architecture
- **Framework Package:** `@agent-native/core` (`import { defineAction } from "@agent-native/core/action"`)
- **Core Primitive:** `defineAction` with Zod validation schemas.
- **Architectural Tenet:** Actions must not be isolated chatbot tools; they must be unified application actions usable interchangeably by the UI and the AI agent.
- **State Synchronization:** Bidirectional visibility—when the agent inspects or proposes an action, the UI updates; when the human approves or triggers an action, the agent observes the outcome.

---

## 4. Mandatory Submission Deliverables

1. **Working Application:** Fully deployed, interactive web application accessible publicly by judges without paywalls or required credentials.
2. **Video Demo:** Public video demo clip (2–3 minutes) walking through the working app and agent-native workflow.
3. **Source Code:** Public GitHub repository containing clear documentation, architecture diagrams, and reproduction steps.
4. **Devpost / Portal Submission Form:** Written pitch, architecture summary, and tool usage explanations.

---

## 5. Audit Matrix: Requirements vs. Implementation

| Requirement | Required Evidence | Current Status | Remaining Work | Risk & Mitigation |
| :--- | :--- | :--- | :--- | :--- |
| **Agent-Native Architecture** | Implementation of `defineAction` with Zod schemas for all tools and UI triggers | Architecture Planned | Implement shared action suite in `lib/actions/` | Low. `@agent-native/core` patterns are well documented. |
| **Realistic Incident Scenarios** | 3 deterministic incident simulations with realistic logs, metrics, and git diffs | Designed | Build scenario database and state engine | Low. Deterministic simulation prevents flaky demos. |
| **Human-in-the-Loop Safety** | Consequential actions require explicit human approval panel before execution | Architecture Planned | Build interactive approval modal & audit log | Zero risk. Strictly enforced by server-side gate. |
| **Deterministic Verification** | System state checked after action; LLM cannot self-certify resolution | Architecture Planned | Implement automated health-check probe after action | Zero risk. Deterministic rules decide resolution state. |
| **Zero-Cost Deployment** | Publicly accessible on Vercel or Render free tier | Planned | Deploy Next.js full-stack app to Vercel | Low. Keep API keys server-side with sensible fallbacks. |

