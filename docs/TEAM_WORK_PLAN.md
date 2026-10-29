# TraceBack AI — Team Work Plan & Task Allocation

**Team Size:** 4 Members  
**Lead:** Member 1  
**Target Completion:** November 3, 2026 (Internal Freeze) | Official Deadline: November 9, 2026  

---

## Member Ownership Matrix

| Member | Primary Role | Files & Modules Owned | Key Responsibilities |
| :--- | :--- | :--- | :--- |
| **Member 1** | Team Lead & DevOps | `app/layout.tsx`, `scripts/*`, `docs/*`, Vercel config, GitHub coordination | Requirements verification, architecture, test harness, deployment, demo coordination |
| **Member 2** | Frontend & UI/UX | `app/page.tsx`, `components/*`, `tailwind.config.js` | Incident dashboard, interactive timeline, human approval card, evidence drawer, mobile responsiveness |
| **Member 3** | Backend & Actions | `lib/actions/*`, `lib/simulator/*`, `app/api/actions/route.ts` | `defineAction` primitives, deterministic simulation engine, state machine, audit log |
| **Member 4** | Agent & Evaluation | `lib/agent/*`, `app/api/agent/route.ts`, `docs/DEMO_SCRIPT.md` | Investigation loop, evidence grounding, recovery plan synthesis, benchmark mode |

---

## Member 1 — Team Lead & Systems Integrator

### Responsibilities
- Architect and oversee the Agent-Native implementation.
- Setup GitHub repository and ensure no secrets or destructive actions occur.
- Write automated end-to-end test runner (`scripts/test-runner.js`).
- Configure continuous integration and zero-cost Vercel deployment.
- Coordinate final video demo recording and submission deliverables.

### Integration Interfaces
- Supplies: Environment configurations, test scripts, project documentation.
- Receives: Frontend components from Member 2, Action layer from Member 3, Agent engine from Member 4.

### Test Requirements
- Run `npm test` verifying all endpoints, simulation state transitions, and UI builds.
- Verify production deployment URL on desktop and mobile browsers.

### Copy-Paste Prompt for Member 1 (Claude / Antigravity):
```text
You are Member 1 (Team Lead & Systems Integrator) for TraceBack AI in the Builder.io Agent-Native Hackathon 2026.
Your focus:
1. Review docs/HACKATHON_REQUIREMENTS.md and docs/PROJECT_ARCHITECTURE.md.
2. Build and run the automated test suite in scripts/test-runner.js verifying all API routes (GET /api/incidents, POST /api/agent, POST /api/actions).
3. Validate mobile responsiveness and zero-secret client exposure.
4. Verify deployment to Vercel and ensure the live link is accessible without authentication.
5. Create docs/TEST_REPORT.md with verified evidence.
```

---

## Member 2 — Frontend & UI/UX Specialist

### Responsibilities
- Build the developer-grade Incident Investigation Workspace in `app/page.tsx` and UI components.
- Ensure 100% mobile responsiveness (using clean tabs or collapse for mobile devices).
- Implement:
  - Incident Status Banner (Severity badge, downtime duration counter, service health indicator).
  - Left Pane: Interactive Telemetry (Logs terminal with syntax highlighting, latency/error chart, deployment diff viewer).
  - Right Pane: Agent Investigation Stream (Step-by-step reasoning steps, hypothesis chips, evidence citations).
  - Human Approval Gate Modal: Clear action blast radius, proposed command, and Approve/Reject buttons.
  - Final Verification & Post-Mortem Export view.

### Integration Interfaces
- Consumes: `GET /api/incidents` (list & details), `POST /api/agent` (streaming steps), `POST /api/actions` (execute actions).
- Provides: Clean, accessible React UI without console errors or hydration mismatches.

### Test Requirements
- Loads cleanly on both 390px mobile viewports and 1440px desktop screens.
- Approval button triggers action execution and transitions state instantly.

### Copy-Paste Prompt for Member 2 (Claude / Antigravity):
```text
You are Member 2 (Frontend Specialist) for TraceBack AI in the Builder.io Agent-Native Hackathon 2026.
Your focus:
1. Build the incident response workspace in app/page.tsx using Next.js 14, Tailwind CSS, and Lucide React icons.
2. Structure the UI into:
   - Incident Switcher: 3 scenarios (Checkout 500 Outage, Memory Leak OOM, DB Connection Exhaustion).
   - Telemetry Explorer: Live logs with search/filter, commit diff viewer, and metrics bar.
   - Agent Co-Pilot Pane: Live investigation timeline with step status (analyzing, hypothesis, proposing action, verifying).
   - Human Approval Card: Highlight proposed recovery action with risk tier, blast radius, and one-click 'Approve & Execute' button.
   - Post-Mortem Drawer: Exportable markdown incident report.
3. Ensure crisp mobile layout with tabbed navigation for small screens.
```

---

## Member 3 — Backend & Agent-Native Actions Specialist

### Responsibilities
- Implement Builder.io's `defineAction` primitives in `lib/actions/` with strict Zod validation:
  - `getServiceLogs`: Filter simulated logs by level (`ERROR`, `WARN`, `INFO`), service, and time.
  - `inspectDeploymentDiff`: Return git commit diffs, commit authors, and modified lines.
  - `getTelemetryMetrics`: Return simulated CPU, memory, error rate, and p99 latency time-series.
  - `checkServiceHealth`: Deterministic health check probe.
  - `rollbackDeployment`: Rollback simulated container image or commit.
  - `toggleFeatureFlag`: Enable or disable feature flag.
  - `restartService`: Cycle pod replicas.
- Build the deterministic simulation state engine in `lib/simulator/` supporting the 3 production scenarios.
- Implement `app/api/actions/route.ts` and `app/api/incidents/route.ts`.

### Integration Interfaces
- Exposes: Typed actions callable by both UI buttons and the Agent orchestrator.
- Enforces: `requiresApproval: true` on mutating actions.

### Test Requirements
- Unit test each `defineAction` function with valid and invalid inputs.
- Verify simulation engine correctly updates system health metrics upon recovery action execution.

### Copy-Paste Prompt for Member 3 (Claude / Antigravity):
```text
You are Member 3 (Backend & Actions Specialist) for TraceBack AI in the Builder.io Agent-Native Hackathon 2026.
Your focus:
1. Implement the Agent-Native action library in lib/actions/ using defineAction and Zod schemas:
   - getServiceLogs, inspectDeploymentDiff, getTelemetryMetrics, checkServiceHealth, rollbackDeployment, toggleFeatureFlag, restartService.
2. Build the simulation engine in lib/simulator/scenarios.ts with 3 rich, deterministic incident scenarios:
   - Scenario 1: Checkout 500 Outage caused by NullPointerException in v2.4.1.
   - Scenario 2: Session Service OOMKilled caused by unevicted Redis cache.
   - Scenario 3: Postgres Connection Pool Exhaustion caused by FF_ASYNC_ANALYTICS_V2.
3. Expose API endpoints in app/api/actions/route.ts and app/api/incidents/route.ts.
4. Ensure mutating actions modify simulation state so health probes return 200 OK after correct recovery actions.
```

---

## Member 4 — Agent Workflow & Evaluation Specialist

### Responsibilities
- Implement the Agent Orchestrator in `lib/agent/engine.ts` and `app/api/agent/route.ts`.
- Orchestrate the multi-phase autonomous investigation pipeline:
  1. **Phase 1 — Ingestion:** Inspect active incident alert and initial error metrics.
  2. **Phase 2 — Evidence Gathering:** Dispatch `getServiceLogs` and `inspectDeploymentDiff`.
  3. **Phase 3 — Hypothesis Formulation:** Correlate stack traces with recent git commit changes.
  4. **Phase 4 — Recovery Planning:** Synthesize a concrete recovery action with expected blast radius.
  5. **Phase 5 — Human Gate:** Halt and request human authorization.
  6. **Phase 6 — Action Observation:** Await action completion and dispatch `checkServiceHealth`.
  7. **Phase 7 — Verdict & Audit:** Generate final incident post-mortem with evidence citations.
- Implement resilient dual-mode execution (Live LLM with fallback benchmark mode for guaranteed judging stability).
- Write `docs/DEMO_SCRIPT.md` detailing the 2–3 minute video presentation.

### Integration Interfaces
- Consumes: Action primitives from Member 3 (`lib/actions`).
- Supplies: Formatted investigation steps, hypotheses, and post-mortem reports to Member 2's UI.

### Test Requirements
- Verify the agent reaches correct root-cause conclusions across all 3 scenarios without hallucinating nonexistent errors.
- Ensure zero errors if external AI API keys are not supplied.

### Copy-Paste Prompt for Member 4 (Claude / Antigravity):
```text
You are Member 4 (Agent Workflow & Evaluation Specialist) for TraceBack AI in the Builder.io Agent-Native Hackathon 2026.
Your focus:
1. Build the agent orchestration engine in lib/agent/engine.ts and app/api/agent/route.ts.
2. Implement the 7-phase agentic loop: Ingest -> Gather Evidence -> Formulate Hypothesis -> Propose Recovery -> Human Approval Gate -> Observe -> Generate Post-Mortem.
3. Ensure every hypothesis cites exact evidence (e.g. 'PaymentGatewayController.java line 142 in commit a7e89f').
4. Implement resilient dual-mode support: use live model if GEMINI_API_KEY / ANTHROPIC_API_KEY is present; fallback to deterministic benchmark reasoning if offline.
5. Create docs/DEMO_SCRIPT.md with a step-by-step 2-minute judge walkthrough.
```
