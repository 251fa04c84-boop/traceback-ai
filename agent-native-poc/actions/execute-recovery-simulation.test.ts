import { describe, expect, it } from "vitest";

import executeRecoverySimulation from "./execute-recovery-simulation";

describe("approval-gated recovery simulation action", () => {
  it("requires the Agent-Native human approval gate", () => {
    expect(executeRecoverySimulation.needsApproval).toBe(true);
    expect(executeRecoverySimulation.readOnly).not.toBe(true);
  });

  it.each(["inc-8921", "inc-4402", "inc-7119"] as const)(
    "executes and verifies only the benchmark recovery plan for %s",
    async (incidentId) => {
      const result = await executeRecoverySimulation.run({ incidentId });

      expect(result.simulationOnly).toBe(true);
      expect(result.executionTarget).toBe("isolated-benchmark");
      expect(result.incidentId).toBe(incidentId);
      expect(result.actions.length).toBeGreaterThan(0);
      expect(result.actions.every((action) => action.success)).toBe(true);
      expect(result.verification.status).toBe("SIMULATED_HEALTHY");
      expect(result.verification.allRequiredActionsApplied).toBe(true);
      expect(result.after.health).toBe("HEALTHY");
      expect(result.after.status).toBe("RESOLVED");
      expect(result.after.latestErrorRate).toBeLessThan(result.before.latestErrorRate);
      expect(result.after.latestP99Latency).toBeLessThan(result.before.latestP99Latency);
      expect(result.auditTrail.some((entry) => entry.status === "SUCCESS")).toBe(true);
      expect(result.safetyNotice).toContain("no production service");
      expect(executeRecoverySimulation.outputSchema.safeParse(result).success).toBe(true);
    },
  );

  it("rejects unknown incident IDs before execution", () => {
    expect(
      executeRecoverySimulation.schema.safeParse({ incidentId: "inc-unknown" }).success,
    ).toBe(false);
  });
});
