import { z } from "zod";
import { ActionDefinition } from "./types";
import { simulator } from "../simulator/engine";

export const inspectDeploymentDiffSchema = z.object({
  incidentId: z.string().describe("ID of the incident"),
  releaseId: z.string().optional().describe("Specific release ID to inspect (defaults to active release)")
});

export const inspectDeploymentDiff: ActionDefinition<z.infer<typeof inspectDeploymentDiffSchema>> = {
  id: "inspectDeploymentDiff",
  name: "Inspect Deployment Diff",
  description: "Retrieves git commit history, author, timestamp, and code diff for recent releases.",
  isMutating: false,
  requiresApproval: false,
  schema: inspectDeploymentDiffSchema,
  async run(input) {
    const incidentState = simulator.getIncident(input.incidentId);
    if (!incidentState) {
      throw new Error(`Incident ${input.incidentId} not found.`);
    }

    const deployments = incidentState.scenario.deployments;
    const target = input.releaseId
      ? deployments.find((d) => d.releaseId === input.releaseId)
      : deployments.find((d) => d.releaseId === incidentState.scenario.activeRelease) || deployments[0];

    return {
      incidentId: input.incidentId,
      activeRelease: incidentState.scenario.activeRelease,
      targetDeployment: target || null,
      allDeployments: deployments
    };
  }
};

export const rollbackDeploymentSchema = z.object({
  incidentId: z.string().describe("ID of the incident to remediate"),
  releaseId: z.string().describe("Target stable release ID to rollback to")
});

export const rollbackDeployment: ActionDefinition<z.infer<typeof rollbackDeploymentSchema>> = {
  id: "rollbackDeployment",
  name: "Rollback Deployment",
  description: "Triggers an automated rollback of container images to a previous stable release.",
  isMutating: true,
  requiresApproval: true,
  schema: rollbackDeploymentSchema,
  async run(input, context) {
    if (!context.userApprovalGranted) {
      throw new Error("Action 'rollbackDeployment' is mutating and requires explicit human authorization.");
    }

    const result = simulator.executeAction(
      input.incidentId,
      "rollbackDeployment",
      { releaseId: input.releaseId },
      context.source
    );

    return {
      success: result.success,
      message: result.message,
      resolved: result.resolved,
      activeRelease: result.incident.scenario.activeRelease,
      resultingHealth: result.incident.currentHealth
    };
  }
};
