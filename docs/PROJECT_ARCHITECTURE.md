# TraceBack AI — Project Architecture

## Current hackathon app

The Agent-Native app is in `agent-native-poc/` and is deployed as a separate Vercel project with that directory as its root.

- **Framework:** `@agent-native/core@0.223.0` and `@agent-native/toolkit@0.223.0`
- **UI/runtime:** React 19, React Router 8, Vite
- **Actions:** official `defineAction()` definitions with Zod input/output schemas
- **Data:** deterministic benchmark scenarios imported from the shared TraceBack scenario module
- **Hosting:** Vercel
- **Hosted database:** dedicated Neon project for framework application state and auth

## Shared Agent-Native actions

| Action | Purpose | Access |
| --- | --- | --- |
| `list-incidents` | List three benchmark incident scenarios | Read-only |
| `get-incident-evidence` | Read metrics, logs, deployments, and post-mortem evidence | Read-only |
| `build-investigation-brief` | Return the five-stage investigation and recovery proposal | Read-only |

The incident detail UI and the Agent-Native chat use the same action registry. The agent prompt instructs it to cite evidence, distinguish benchmark data from live telemetry, and stop at the approval gate.

## Five-stage investigation

1. Observe telemetry.
2. Correlate logs and deployment evidence.
3. Diagnose the likely cause.
4. Prepare an allowlisted recovery proposal.
5. Stop for human review.

## Safety and scope

The current app is a read-only benchmark demo. It is not connected to live production systems. Proposed rollback/flag/restart operations are not executed. The approval gate is a safety disclosure, not a production-grade authorization workflow.

## Legacy implementation

The repository root also contains an earlier custom Next.js / React 18 implementation with a custom action registry and simulator. It is retained as prior project work and reference material. It is not the Agent-Native runtime entry point used by the separate hackathon deployment.
