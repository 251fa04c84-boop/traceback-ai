import { z } from "zod";
import { ActionDefinition } from "./types";
import { simulator } from "../simulator/engine";

export const toggleFeatureFlagSchema = z.object({
  incidentId: z.string().describe("ID of the incident"),
  flagId: z.string().describe("Identifier of the feature flag"),
  enabled: z.boolean().describe("Target state for the flag")
});

export const toggleFeatureFlag: ActionDefinition<z.infer<typeof toggleFeatureFlagSchema>> = {
  id: "toggleFeatureFlag",
  name: "Toggle Feature Flag",
  description: "Enables or disables an operational feature flag to isolate faulty application paths.",
  isMutating: true,
  requiresApproval: true,
  schema: toggleFeatureFlagSchema,
  async run(input, context) {
    if (!context.userApprovalGranted) {
      throw new Error("Action 'toggleFeatureFlag' is mutating and requires explicit human authorization.");
    }

    const result = simulator.executeAction(
      input.incidentId,
      "toggleFeatureFlag",
      { flagId: input.flagId, enabled: input.enabled },
      context.source
    );

    return {
      success: result.success,
      message: result.message,
      resolved: result.resolved,
      resultingHealth: result.incident.currentHealth
    };
  }
};

export const restartServiceSchema = z.object({
  incidentId: z.string().describe("ID of the incident"),
  service: z.string().describe("Service name to perform rolling restart on")
});

export const restartService: ActionDefinition<z.infer<typeof restartServiceSchema>> = {
  id: "restartService",
  name: "Restart Service",
  description: "Executes a rolling restart of service container replicas in the cluster.",
  isMutating: true,
  requiresApproval: true,
  schema: restartServiceSchema,
  async run(input, context) {
    if (!context.userApprovalGranted) {
      throw new Error("Action 'restartService' is mutating and requires explicit human authorization.");
    }

    const result = simulator.executeAction(
      input.incidentId,
      "restartService",
      { service: input.service },
      context.source
    );

    return {
      success: result.success,
      message: result.message,
      resolved: result.resolved,
      resultingHealth: result.incident.currentHealth
    };
  }
};
