import { describe, expect, it } from "vitest";

import buildInvestigationBrief from "./build-investigation-brief";

describe("investigation brief diagnosis disclosure", () => {
  it.each(["inc-8921", "inc-4402", "inc-7119"] as const)(
    "labels the diagnosis for %s as an unverified deterministic hypothesis",
    async (incidentId) => {
      const result = await buildInvestigationBrief.run({ incidentId });
      const diagnosis = result.stages.find((stage) => stage.id === "diagnose");

      expect(diagnosis).toBeDefined();
      expect(diagnosis?.status).toBe("review-required");
      expect(diagnosis?.summary).toContain("Deterministic Fallback");
      expect(diagnosis?.summary).toContain("not a verified root cause");
      expect(diagnosis?.evidence.join(" ")).toContain("not from a live AI analysis");
      expect(diagnosis?.evidence.join(" ")).toContain("synthetic benchmark evidence");
      expect(result.simulationOnly).toBe(true);
      expect(buildInvestigationBrief.outputSchema.safeParse(result).success).toBe(true);
    },
  );
});
