import { z } from "zod";
import { ActionDefinition } from "./types";
import { simulator } from "../simulator/engine";

export const getServiceLogsSchema = z.object({
  incidentId: z.string().describe("ID of the incident to inspect"),
  service: z.string().optional().describe("Service name to filter logs"),
  level: z.enum(["ALL", "ERROR", "WARN", "INFO"]).default("ALL").describe("Minimum log level"),
  limit: z.number().default(20).describe("Maximum number of log entries to retrieve")
});

export const getServiceLogs: ActionDefinition<z.infer<typeof getServiceLogsSchema>> = {
  id: "getServiceLogs",
  name: "Get Service Logs",
  description: "Fetches and filters live application container logs for the affected service.",
  isMutating: false,
  requiresApproval: false,
  schema: getServiceLogsSchema,
  async run(input) {
    const incidentState = simulator.getIncident(input.incidentId);
    if (!incidentState) {
      throw new Error(`Incident ${input.incidentId} not found.`);
    }

    let logs = incidentState.scenario.logs;
    if (input.service) {
      logs = logs.filter((l) => l.service.toLowerCase() === input.service!.toLowerCase());
    }
    if (input.level && input.level !== "ALL") {
      logs = logs.filter((l) => l.level === input.level);
    }

    return {
      incidentId: input.incidentId,
      totalCount: logs.length,
      logs: logs.slice(0, input.limit)
    };
  }
};
