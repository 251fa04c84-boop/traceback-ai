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
      expect(result.stages[4].status).toBe("review-required");
      expect(result.stages[4].summary).toContain("Execution is locked");
      expect(result.recommendedActions.length).toBeGreaterThan(0);
      expect(result.recommendedPrevention).toBeTruthy();
      expect(buildInvestigationBrief.outputSchema.safeParse(result).success).toBe(true);
      expect(buildInvestigationBrief.readOnly).toBe(true);
    },
  );

  it("rejects unknown incident IDs at the input schema", () => {
    expect(
      getIncidentEvidence.schema.safeParse({ incidentId: "inc-unknown" }).success,
    ).toBe(false);
  });

  it("does not expose remediation controls through either read-only action", () => {
    expect(listIncidents.readOnly).toBe(true);
    expect(getIncidentEvidence.readOnly).toBe(true);
  });
});
