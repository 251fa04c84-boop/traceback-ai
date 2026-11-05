# TraceBack AI — Official Hackathon Submission Draft

> **Draft only. Do not submit until the live app, AI interaction, public Clips video, and submission links have been verified.**

## Project title

**TraceBack AI — Evidence-First Incident Investigation**

## Tagline

Turn outage signals into traceable root-cause evidence and a human-reviewed recovery plan.

## Live application

https://traceback-agent-native-preview-hackathons8.vercel.app

*Verify the deployment is Ready, publicly reachable, and that the current commit is the one being demonstrated before using this URL in the form.*

## Source code

https://github.com/251fa04c84-boop/traceback-ai

## Public Clips demonstration

**[Add the final public Clips URL here after recording and verifying that it opens without login.]**

## Project description

When a production incident occurs, on-call engineers must connect noisy telemetry, application logs, and recent code changes before deciding what to do. TraceBack AI turns that investigation into a structured workflow.

The Agent-Native app presents three realistic benchmark incidents: a checkout regression caused by a null coupon dereference, a session service crash loop caused by an unbounded cache, and database connection exhaustion associated with unreleased pooled clients.

The engineer can inspect the same evidence the agent uses. TraceBack's shared Agent-Native actions retrieve the incident catalog and evidence, then build a five-stage investigation brief:

1. Observe telemetry and service symptoms.
2. Correlate timestamped logs with deployment metadata and code diffs.
3. Diagnose the likely cause using the supplied evidence.
4. Prepare a concrete, allowlisted recovery proposal.
5. Stop at a human approval gate.

The goal is not to let an LLM claim that an outage is fixed. TraceBack makes the evidence and proposed next step visible, while clearly showing that approval and execution are separate from investigation.

## What makes it Agent-Native

TraceBack uses `defineAction()` from `@agent-native/core`. The UI and the Agent-Native assistant share the same typed incident actions:

- `list-incidents`
- `get-incident-evidence`
- `build-investigation-brief`

The interface displays the five-stage brief returned by the shared action, and the agent is instructed to use those actions, cite evidence, distinguish benchmark data from live telemetry, and respect the approval boundary.

## Safety and limitations

The current public demo uses deterministic simulated benchmark data. It is **not connected to live Kubernetes, cloud, database, or customer infrastructure**. The domain actions are read-only. Recovery steps are proposals only; no rollback, feature-flag change, restart, or production remediation is executed. Do not describe the benchmark scenarios as live production telemetry or claim that an incident was fixed.

## Built with

- Builder.io Agent-Native / `@agent-native/core`
- Agent-Native Toolkit
- TypeScript, React 19, React Router, Vite, and Zod
- Vercel for hosting
- Neon Postgres for the isolated hosted app database

## Originality and third-party work disclosure

The repository contains an earlier custom Next.js incident workspace and deterministic incident scenarios. That earlier work is retained as prior project work.

For this hackathon, the Agent-Native Chat starter template from `@agent-native/core@0.223.0` was adapted into the TraceBack incident workspace. The project-specific additions include incident actions, the five-stage evidence brief, incident pages, agent instructions, and action tests. Other third-party packages are listed in `agent-native-poc/package.json`; their licenses apply.

Before submission, enter the accurate dates and extent of pre-existing work, all creators/team members, and any third-party assets in the official form.

## Creator / team information

- Creator name(s): **[Confirm exact creator/team names]**
- Contact email: **[Enter the contact email in the official form]**
- Team members and agreed prize allocation, if applicable: **[Confirm with all members]**

## Submission reminder

Official submission form: https://www.builder.io/hackathon/submit

The entry is not submitted until the form is completed and the receipt is verified.
