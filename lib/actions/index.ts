import { ActionDefinition, ActionContext, ActionResult } from "./types";
import { getServiceLogs } from "./logs";
import { inspectDeploymentDiff, rollbackDeployment } from "./deployment";
import { getTelemetryMetrics } from "./metrics";
import { checkServiceHealth } from "./health";
import { toggleFeatureFlag, restartService } from "./flags";

export const ACTION_REGISTRY: Record<string, ActionDefinition> = {
  getServiceLogs,
  inspectDeploymentDiff,
  getTelemetryMetrics,
  checkServiceHealth,
  rollbackDeployment,
  toggleFeatureFlag,
  restartService
};

export async function dispatchAction(
  actionId: string,
  input: any,
  context: ActionContext
): Promise<ActionResult> {
  const action = ACTION_REGISTRY[actionId];
  const timestamp = new Date().toISOString();

  if (!action) {
    return {
      success: false,
      actionId,
      executedBy: context.source,
      timestamp,
      error: `Unknown action '${actionId}' in Agent-Native registry.`
    };
  }

  // Schema Validation via Zod
  const validation = action.schema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      actionId,
      executedBy: context.source,
      timestamp,
      error: `Validation error for action '${actionId}': ${validation.error.message}`
    };
  }

  // Intercept mutating actions if human approval is required and not yet granted
  if (action.isMutating && action.requiresApproval && !context.userApprovalGranted) {
    let reason = "Mutating action alters production service state.";
    let blastRadius: "low" | "medium" | "high" | "critical" = "medium";

    if (actionId === "rollbackDeployment") {
      reason = `Rolls back service container to release ${input.releaseId}.`;
      blastRadius = "high";
    } else if (actionId === "toggleFeatureFlag") {
      reason = `Changes live feature flag ${input.flagId} to ${input.enabled}.`;
      blastRadius = "medium";
    } else if (actionId === "restartService") {
      reason = `Performs rolling restart of pods for service ${input.service}.`;
      blastRadius = "medium";
    }

    return {
      success: false,
      actionId,
      executedBy: context.source,
      timestamp,
      requiresApproval: true,
      pendingApprovalDetails: {
        actionId,
        input,
        reason,
        blastRadius,
        description: action.description
      }
    };
  }

  try {
    const data = await action.run(validation.data, context);
    return {
      success: true,
      actionId,
      executedBy: context.source,
      timestamp,
      data
    };
  } catch (err: any) {
    return {
      success: false,
      actionId,
      executedBy: context.source,
      timestamp,
      error: err.message || "Action execution failed"
    };
  }
}

export * from "./types";
export * from "./logs";
export * from "./deployment";
export * from "./metrics";
export * from "./health";
export * from "./flags";
