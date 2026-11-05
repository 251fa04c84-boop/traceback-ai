import { describe, expect, it } from "vitest";

import getIncidentEvidence from "./get-incident-evidence";
import listIncidents from "./list-incidents";
import buildInvestigationBrief from "./build-investigation-brief";

describe("TraceBack Agent-Native read-only actions", () => {
  it("lists all three known incident scenarios with the expected metadata", async () => {
    const result = await listIncidents.run({});

    expect(result).toHaveLength(3);
    expect(result.map((incident) => incident.id)).toEqual([
      "inc-8921",
      "inc-4402",
      "inc-7119",
    ]);
    expect(result.every((incident) => incident.title && incident.service)).toBe(true);
    expect(listIncidents.outputSchema.safeParse(result).success).toBe(true);
  });

  it.each(["inc-8921", "inc-4402", "inc-7119"] as const)(
    "returns schema-valid evidence for %s",
    async (incidentId) => {
      const result = await getIncidentEvidence.run({ incidentId });

      expect(result.incidentId).toBe(incidentId);
      expect(result.metrics.length).toBeGreaterThan(0);
      expect(result.logs.length).toBeGreaterThan(0);
      expect(result.deployments.length).toBeGreaterThan(0);
      expect(result.rootCause).toBeTruthy();
      expect(result.trigger).toBeTruthy();
      expect(result.blastRadius).toBeTruthy();
      expect(getIncidentEvidence.outputSchema.safeParse(result).success).toBe(true);
    },
  );


  it.each(["inc-8921", "inc-4402", "inc-7119"] as const)(
    "builds a five-stage, read-only investigation brief for %s",
    async (incidentId) => {
      const result = await buildInvestigationBrief.run({ incidentId });

      expect(result.incidentId).toBe(incidentId);
      expect(result.simulationOnly).toBe(true);
      expect(result.stages.map((stage) => stage.id)).toEqual([
        "observe",
        "correlate",
        "diagnose",
        "plan",
        "approval",
      ]);
      const approvalStage = result.stages.find((stage) => stage.id === "approval");
      expect(approvalStage?.status).toBe("review-required");
      expect(approvalStage?.summary).toContain("Execution is locked");
      expect(result.recommendedActions.length).toBeGreaterThan(0);
      expect(result.recommendedPrevention).toBeTruthy();
      expect(buildInvestigationBrief.outputSchema.safeParse(result).success).toBe(true);
      expect(buildInvestigationBrief.readOnly).toBe(true);
    },
  );


  it("reports checkout initial, peak, and latest error-rate samples distinctly", async () => {
    const result = await buildInvestigationBrief.run({ incidentId: "inc-8921" });
    const observation = result.stages.find((stage) => stage.id === "observe");
    const correlation = result.stages.find((stage) => stage.id === "correlate");
    expect(observation?.summary).toContain("43.5%");
    expect(observation?.evidence.join(" ")).toContain("44.1%");
    expect(correlation?.evidence.join(" ")).toContain("PaymentGatewayController.java");
  });

  it("correlates PostgreSQL connection rejection with HikariPool wait timeout", async () => {
    const result = await buildInvestigationBrief.run({ incidentId: "inc-7119" });
    const correlation = result.stages.find((stage) => stage.id === "correlate");
    const diagnosis = result.stages.find((stage) => stage.id === "diagnose");
    const evidence = correlation?.evidence.join(" ") ?? "";
    expect(evidence).toContain("state: 53300");
    expect(evidence).toContain("HikariPool-1");
    expect(evidence).toContain("QueryExecutor.ts");
    expect(diagnosis?.summary).toContain("client.release()");
  });

  it("includes the suspect deployment diff for the session memory incident", async () => {
    const result = await buildInvestigationBrief.run({ incidentId: "inc-4402" });
    const correlation = result.stages.find((stage) => stage.id === "correlate");
    const evidence = correlation?.evidence.join(" ") ?? "";
    expect(evidence).toContain("ConcurrentHashMap");
    expect(evidence).toContain("LocalCacheAdapter.java");
  });

  it("rejects unknown incident IDs at the input schema", () => {
    expect(
      getIncidentEvidence.schema.safeParse({ incidentId: "inc-unknown" }).success,
    ).toBe(false);
    expect(
      buildInvestigationBrief.schema.safeParse({ incidentId: "inc-unknown" }).success,
    ).toBe(false);
  });

  it("does not expose remediation controls through either read-only action", () => {
    expect(listIncidents.readOnly).toBe(true);
    expect(getIncidentEvidence.readOnly).toBe(true);
    expect(buildInvestigationBrief.readOnly).toBe(true);
  });
});
