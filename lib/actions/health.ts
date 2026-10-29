import { z } from "zod";
import { ActionDefinition } from "./types";
import { simulator } from "../simulator/engine";

export const checkServiceHealthSchema = z.object({
  incidentId: z.string().describe("ID of the incident")
});

export const checkServiceHealth: ActionDefinition<z.infer<typeof checkServiceHealthSchema>> = {
  id: "checkServiceHealth",
  name: "Check Service Health",
  description: "Dispatches deterministic health probes against application endpoints and cluster pods.",
  isMutating: false,
  requiresApproval: false,
  schema: checkServiceHealthSchema,
  async run(input) {
    const incidentState = simulator.getIncident(input.incidentId);
    if (!incidentState) {
      throw new Error(`Incident ${input.incidentId} not found.`);
    }

    const isHealthy = incidentState.currentHealth === "HEALTHY";
    const status = incidentState.scenario.status;
    const latestMetric = incidentState.scenario.metrics[incidentState.scenario.metrics.length - 1];

    return {
      incidentId: input.incidentId,
      service: incidentState.scenario.service,
      overallStatus: incidentState.currentHealth,
      incidentStatus: status,
      endpointCheck: isHealthy ? "200 OK" : "500 Internal Server Error",
      errorRate: latestMetric.errorRate,
      latencyP99: latestMetric.latencyP99,
      activeRelease: incidentState.scenario.activeRelease,
      isResolved: status === "RESOLVED",
      timestamp: new Date().toISOString()
    };
  }
};
