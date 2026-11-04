import { defineAction } from "@agent-native/core/action";
import { z } from "zod";
import { SCENARIOS } from "../../lib/simulator/scenarios.js";

const incidentSchema = z.object({
  id: z.string(),
  title: z.string(),
  severity: z.enum(["CRITICAL", "HIGH", "MEDIUM"]),
  service: z.string(),
  description: z.string(),
  detectedAt: z.string(),
  activeRelease: z.string(),
  stableRelease: z.string(),
  status: z.string(),
});

const outputSchema = z.array(incidentSchema);

export default defineAction({
  description:
    "List the available TraceBack incident scenarios with severity, affected service, detected time, and active/stable release. This is read-only demo data.",
  schema: z.object({}),
  outputSchema,
  readOnly: true,
  http: { method: "GET" },
  run: async () =>
    SCENARIOS.map((scenario) => ({
      id: scenario.id,
      title: scenario.title,
      severity: scenario.severity,
      service: scenario.service,
      description: scenario.description,
      detectedAt: scenario.detectedAt,
      activeRelease: scenario.activeRelease,
      stableRelease: scenario.stableRelease,
      status: scenario.status,
    })),
});
