import { defineAction } from "@agent-native/core/action";
import { z } from "zod";
import { SCENARIOS } from "../../lib/simulator/scenarios.js";

const outputSchema = z.object({
  incidentId: z.string(),
  title: z.string(),
  service: z.string(),
  metrics: z.array(
    z.object({
      time: z.string(),
      errorRate: z.number(),
      latencyP99: z.number(),
      cpuUsage: z.number(),
      memoryUsage: z.number(),
    }),
  ),
  logs: z.array(
    z.object({
      id: z.string(),
      timestamp: z.string(),
      level: z.enum(["ERROR", "WARN", "INFO"]),
      service: z.string(),
      message: z.string(),
      stackTrace: z.string().optional(),
    }),
  ),
  deployments: z.array(
    z.object({
      releaseId: z.string(),
      commitHash: z.string(),
      author: z.string(),
      timestamp: z.string(),
      service: z.string(),
      summary: z.string(),
      diff: z.string(),
      isStable: z.boolean(),
    }),
  ),
  rootCause: z.string(),
  trigger: z.string(),
  blastRadius: z.string(),
});

export default defineAction({
  description:
    "Read the telemetry, application logs, deployment history and post-mortem evidence for one TraceBack incident. Does not execute remediation.",
  schema: z.object({
    incidentId: z
      .enum(["inc-8921", "inc-4402", "inc-7119"])
      .describe("TraceBack incident ID: inc-8921, inc-4402, or inc-7119"),
  }),
  outputSchema,
  readOnly: true,
  http: { method: "GET" },
  run: async ({ incidentId }) => {
    const scenario = SCENARIOS.find((item) => item.id === incidentId);
    if (!scenario) {
      throw new Error("Incident not found.");
    }

    return {
      incidentId: scenario.id,
      title: scenario.title,
      service: scenario.service,
      metrics: scenario.metrics.map(({ time, errorRate, latencyP99, cpuUsage, memoryUsage }) => ({
        time,
        errorRate,
        latencyP99,
        cpuUsage,
        memoryUsage,
      })),
      logs: scenario.logs.map(({ id, timestamp, level, service, message, stackTrace }) => ({
        id,
        timestamp,
        level,
        service,
        message,
        ...(stackTrace ? { stackTrace } : {}),
      })),
      deployments: scenario.deployments.map(
        ({ releaseId, commitHash, author, timestamp, service, summary, diff, isStable }) => ({
          releaseId,
          commitHash,
          author,
          timestamp,
          service,
          summary,
          diff,
          isStable,
        }),
      ),
      rootCause: scenario.postMortemTemplate.rootCause,
      trigger: scenario.postMortemTemplate.trigger,
      blastRadius: scenario.postMortemTemplate.blastRadius,
    };
  },
});
