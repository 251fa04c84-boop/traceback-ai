import { defineAction } from "@agent-native/core/action";
import { z } from "zod";
import { SCENARIOS } from "../../lib/simulator/scenarios.js";

const stageSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.enum(["complete", "review-required"]),
  summary: z.string(),
  evidence: z.array(z.string()),
});

const outputSchema = z.object({
  incidentId: z.string(),
  title: z.string(),
  service: z.string(),
  simulationOnly: z.literal(true),
  stages: z.array(stageSchema).length(5),
  recommendedActions: z.array(
    z.object({
      actionId: z.string(),
      explanation: z.string(),
      parameters: z.string(),
    }),
  ),
  recommendedPrevention: z.string(),
});

export default defineAction({
  description:
    "Build a five-stage, evidence-grounded incident investigation brief from a TraceBack benchmark scenario. It observes telemetry, correlates logs and deployment diffs, diagnoses the scenario, prepares a recovery proposal, and explicitly stops at the human approval gate. Read-only; never executes remediation.",
  schema: z.object({
    incidentId: z
      .enum(["inc-8921", "inc-4402", "inc-7119"])
      .describe("TraceBack benchmark incident ID"),
  }),
  outputSchema,
  readOnly: true,
  http: { method: "GET" },
  run: async ({ incidentId }) => {
    const scenario = SCENARIOS.find((item) => item.id === incidentId);
    if (!scenario) throw new Error("Incident not found.");

    const latest = scenario.metrics[scenario.metrics.length - 1];
    const peakErrorRate = Math.max(...scenario.metrics.map((metric) => metric.errorRate));
    const peakLatency = Math.max(...scenario.metrics.map((metric) => metric.latencyP99));
    const connectionEvidence = latest.activeConnections
      ? ` Active database connections: ${latest.activeConnections}.`
      : "";
    const deployment = scenario.deployments.find((item) => !item.isStable) ?? scenario.deployments[0];

    const stages = [
      {
        id: "observe",
        title: "Observe",
        status: "complete" as const,
        summary: `Latest sample at ${latest.time}: ${latest.errorRate}% error rate and ${latest.latencyP99.toLocaleString()} ms p99 latency.${connectionEvidence}`,
        evidence: [
          `Severity: ${scenario.severity} · Service: ${scenario.service}`,
          `Peak sampled error rate: ${peakErrorRate}% · Peak p99 latency: ${peakLatency.toLocaleString()} ms`,
        ],
      },
      {
        id: "correlate",
        title: "Correlate evidence",
        status: "complete" as const,
        summary: `Compared ${scenario.logs.length} application log entries with the suspect deployment and its code diff.`,
        evidence: [
          ...scenario.logs.map((log) => `${log.id} · ${log.timestamp}: ${log.message}`),
          `Suspect release ${deployment.releaseId} · commit ${deployment.commitHash}: ${deployment.summary}`,
        ],
      },
      {
        id: "diagnose",
        title: "Diagnose",
        status: "complete" as const,
        summary: scenario.postMortemTemplate.rootCause,
        evidence: [
          `Trigger: ${scenario.postMortemTemplate.trigger}`,
          `Impact: ${scenario.postMortemTemplate.blastRadius}`,
        ],
      },
      {
        id: "plan",
        title: "Prepare recovery plan",
        status: "complete" as const,
        summary: `${scenario.requiredActions.length} allowlisted recovery proposal(s) prepared for human review. No action has been run.`,
        evidence: scenario.requiredActions.map((action) => action.explanation),
      },
      {
        id: "approval",
        title: "Human approval gate",
        status: "review-required" as const,
        summary:
          "Execution is locked. This public benchmark demo is not connected to live infrastructure; a server-authenticated approver and a separate execution/verification workflow are required before any real remediation.",
        evidence: [
          "No production service, feature flag, or deployment was changed.",
          "The incident evidence and proposed recovery actions are simulated benchmark data.",
        ],
      },
    ];

    return {
      incidentId: scenario.id,
      title: scenario.title,
      service: scenario.service,
      simulationOnly: true as const,
      stages,
      recommendedActions: scenario.requiredActions.map((action) => ({
        actionId: action.actionId,
        explanation: action.explanation,
        parameters: JSON.stringify(action.expectedParams),
      })),
      recommendedPrevention: scenario.postMortemTemplate.recommendedPrevention,
    };
  },
});
