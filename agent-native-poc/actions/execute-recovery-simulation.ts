import { defineAction, type ActionRunContext } from "@agent-native/core/action";
import { z } from "zod";

import { SCENARIOS } from "../../lib/simulator/scenarios.js";
import { IncidentSimulator } from "../../lib/simulator/engine.js";

const incidentIds = ["inc-8921", "inc-4402", "inc-7119"] as const;

const outputSchema = z.object({
  incidentId: z.enum(incidentIds),
  simulationOnly: z.literal(true),
  executionTarget: z.literal("isolated-benchmark"),
  title: z.string(),
  service: z.string(),
  before: z.object({
    health: z.enum(["HEALTHY", "DEGRADED", "CRITICAL"]),
    status: z.string(),
    activeRelease: z.string(),
    latestErrorRate: z.number(),
    latestP99Latency: z.number(),
  }),
  actions: z.array(
    z.object({
      actionId: z.string(),
      parameters: z.record(z.string(), z.unknown()),
      success: z.boolean(),
      message: z.string(),
    }),
  ),
  after: z.object({
    health: z.enum(["HEALTHY", "DEGRADED", "CRITICAL"]),
    status: z.string(),
    activeRelease: z.string(),
    latestErrorRate: z.number(),
    latestP99Latency: z.number(),
  }),
  verification: z.object({
    status: z.enum(["SIMULATED_HEALTHY", "SIMULATED_NOT_RESOLVED"]),
    allRequiredActionsApplied: z.boolean(),
    evidence: z.array(z.string()),
  }),
  auditTrail: z.array(
    z.object({
      id: z.string(),
      timestamp: z.string(),
      actionId: z.string(),
      executedBy: z.enum(["agent", "human", "api", "unknown"]),
      status: z.enum(["SUCCESS", "FAILED", "REJECTED"]),
      resultingHealth: z.enum(["HEALTHY", "DEGRADED", "CRITICAL"]),
      notes: z.string(),
    }),
  ),
  safetyNotice: z.string(),
});

export default defineAction({
  description:
    "After a human approves this specific call, execute the incident's exact scenario-allowlisted recovery plan inside an isolated deterministic benchmark simulator, then verify the simulated postconditions and return the before/after metrics and audit trail. This never connects to or changes production infrastructure.",
  schema: z.object({
    incidentId: z
      .enum(incidentIds)
      .describe("Incident to recover in the isolated benchmark: inc-8921, inc-4402, or inc-7119."),
  }),
  outputSchema,
  needsApproval: true,
  http: { method: "POST" },
  run: async ({ incidentId }, ctx?: ActionRunContext) => {
    // Missing caller metadata is never attributed to a human.
    const executionSource = ctx?.caller === "tool" ? "agent"
      : ctx?.caller === "frontend" ? "human"
      : ctx?.caller ? "api" : "unknown";
    // Each approved call gets its own ephemeral simulator; concurrent users cannot mutate shared process state.
    const simulator = new IncidentSimulator();
    const scenario = SCENARIOS.find((item) => item.id === incidentId);
    if (!scenario) throw new Error("Incident not found.");

    const initial = simulator.resetIncident(incidentId, executionSource);
    if (!initial) throw new Error("Unable to initialize the isolated incident simulation.");

    const initialMetric = initial.scenario.metrics[initial.scenario.metrics.length - 1];
    if (!initialMetric) throw new Error("The benchmark incident has no initial metric sample.");

    const before = {
      health: initial.currentHealth,
      status: initial.scenario.status,
      activeRelease: initial.scenario.activeRelease,
      latestErrorRate: initialMetric.errorRate,
      latestP99Latency: initialMetric.latencyP99,
    };

    const actionResults = [];
    for (const requirement of scenario.requiredActions) {
      const result = simulator.executeAction(
        incidentId,
        requirement.actionId,
        requirement.expectedParams,
        executionSource,
      );
      actionResults.push({
        actionId: requirement.actionId,
        parameters: requirement.expectedParams,
        success: result.success,
        message: result.message,
      });
      if (!result.success) {
        throw new Error(
          `The isolated simulator rejected the reviewed recovery step ${requirement.actionId}: ${result.message}`,
        );
      }
    }

    const finalState = simulator.getIncident(incidentId);
    if (!finalState) throw new Error("The isolated incident simulation state is unavailable.");

    const finalMetric = finalState.scenario.metrics[finalState.scenario.metrics.length - 1];
    if (!finalMetric) throw new Error("The simulator did not produce a post-recovery metric sample.");

    const resolved = finalState.scenario.status === "RESOLVED" && finalState.currentHealth === "HEALTHY";

    return {
      incidentId,
      simulationOnly: true as const,
      executionTarget: "isolated-benchmark" as const,
      title: scenario.title,
      service: scenario.service,
      before,
      actions: actionResults,
      after: {
        health: finalState.currentHealth,
        status: finalState.scenario.status,
        activeRelease: finalState.scenario.activeRelease,
        latestErrorRate: finalMetric.errorRate,
        latestP99Latency: finalMetric.latencyP99,
      },
      verification: {
        status: resolved ? ("SIMULATED_HEALTHY" as const) : ("SIMULATED_NOT_RESOLVED" as const),
        allRequiredActionsApplied:
          scenario.requiredActions.every((requirement) =>
            finalState.appliedActions.includes(
              requirement.actionId === "rollbackDeployment"
                ? `rollbackDeployment:${String(requirement.expectedParams.releaseId)}`
                : requirement.actionId === "toggleFeatureFlag"
                  ? `toggleFeatureFlag:${String(requirement.expectedParams.flagId)}=${String(requirement.expectedParams.enabled)}`
                  : requirement.actionId === "restartService"
                    ? `restartService:${String(requirement.expectedParams.service)}`
                    : "unsupported",
            ),
          ),
        evidence: [
          `Simulator health changed from ${before.health} to ${finalState.currentHealth}.`,
          `Simulated error rate changed from ${before.latestErrorRate}% to ${finalMetric.errorRate}%.`,
          `Simulated p99 latency changed from ${before.latestP99Latency} ms to ${finalMetric.latencyP99} ms.`,
          `Applied ${actionResults.length} scenario-allowlisted recovery step(s).`,
        ],
      },
      auditTrail: finalState.auditTrail.map((entry) => ({
        id: entry.id,
        timestamp: entry.timestamp,
        actionId: entry.actionId,
        executedBy: entry.executedBy,
        status: entry.status,
        resultingHealth: entry.resultingHealth,
        notes: entry.notes,
      })),
      safetyNotice:
        "This action is configured with Agent-Native needsApproval: true; agent-initiated calls must pass the framework approval flow. This result is a deterministic simulation using synthetic benchmark data; no production service, deployment, feature flag, database, or customer record was changed. Simulated health verification is not a live infrastructure health check.",
    };
  },
});
