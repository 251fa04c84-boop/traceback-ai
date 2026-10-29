import { z } from "zod";
import { ActionDefinition } from "./types";
import { simulator } from "../simulator/engine";

export const getTelemetryMetricsSchema = z.object({
  incidentId: z.string().describe("ID of the incident")
});

export const getTelemetryMetrics: ActionDefinition<z.infer<typeof getTelemetryMetricsSchema>> = {
  id: "getTelemetryMetrics",
  name: "Get Telemetry Metrics",
  description: "Retrieves live timeseries metrics (CPU, Memory, Latency p99, and HTTP 5xx error rate).",
  isMutating: false,
  requiresApproval: false,
  schema: getTelemetryMetricsSchema,
  async run(input) {
    const incidentState = simulator.getIncident(input.incidentId);
    if (!incidentState) {
      throw new Error(`Incident ${input.incidentId} not found.`);
    }

    const metrics = incidentState.scenario.metrics;
    const latest = metrics[metrics.length - 1];

    return {
      incidentId: input.incidentId,
      service: incidentState.scenario.service,
      latestMetrics: latest,
      timeseries: metrics
    };
  }
};
