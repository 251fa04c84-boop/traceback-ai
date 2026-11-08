import { describe, expect, it } from "vitest";

import executeRecoverySimulation from "./execute-recovery-simulation";

describe("recovery simulation action handler (unit tests; direct run() calls bypass framework approval dispatch)", () => {
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
      // Direct handler tests have no framework request context; never label that as human.
      expect(result.auditTrail.every((entry) => entry.executedBy === "unknown")).toBe(true);
      expect(result.safetyNotice).toContain("no production service");
      expect(executeRecoverySimulation.outputSchema.safeParse(result).success).toBe(true);
    },
  );


  it("keeps concurrent recovery executions isolated from each other", async () => {
    const [first, second] = await Promise.all([
      executeRecoverySimulation.run({ incidentId: "inc-8921" }),
      executeRecoverySimulation.run({ incidentId: "inc-8921" }),
    ]);

    expect(first.after).toEqual(second.after);
    // One reset event plus the single allowlisted rollback in each independent run.
    expect(first.auditTrail).toHaveLength(2);
    expect(second.auditTrail).toHaveLength(2);
    expect(first.auditTrail).not.toBe(second.auditTrail);
  });

  it("rejects unknown incident IDs before execution", () => {
    expect(
      executeRecoverySimulation.schema.safeParse({ incidentId: "inc-unknown" }).success,
    ).toBe(false);
  });
});
