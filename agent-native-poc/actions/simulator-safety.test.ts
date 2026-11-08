import { beforeEach, describe, expect, it } from "vitest";

import { simulator } from "../../lib/simulator/engine";

describe("TraceBack recovery simulator safety", () => {
  beforeEach(() => {
    simulator.initialize();
  });

  it("rejects actions that are not required by the selected incident", () => {
    const before = simulator.getIncident("inc-8921")!;
    const result = simulator.executeAction(
      "inc-8921",
      "deleteDatabase",
      {},
      "agent",
    );

    expect(result.success).toBe(false);
    expect(result.resolved).toBe(false);
    expect(result.message).toContain("not allowlisted");
    expect(result.incident.scenario.activeRelease).toBe(before.scenario.activeRelease);
    expect(result.incident.auditTrail.at(-1)?.status).toBe("REJECTED");
  });

  it("rejects a rollback target that differs from the reviewed stable release", () => {
    const result = simulator.executeAction(
      "inc-8921",
      "rollbackDeployment",
      { releaseId: "v1.0.0" },
      "human",
    );

    expect(result.success).toBe(false);
    expect(result.incident.scenario.activeRelease).toBe("v2.4.1");
    expect(result.incident.appliedActions).toHaveLength(0);
    expect(result.incident.auditTrail.at(-1)?.status).toBe("REJECTED");
  });

  it("rejects unexpected extra parameters instead of silently accepting them", () => {
    const result = simulator.executeAction(
      "inc-8921",
      "rollbackDeployment",
      { releaseId: "v2.4.0", force: true },
      "human",
    );

    expect(result.success).toBe(false);
    expect(result.incident.scenario.activeRelease).toBe("v2.4.1");
    expect(result.incident.auditTrail.at(-1)?.status).toBe("REJECTED");
  });

  it("executes only the reviewed rollback and verifies recovery", () => {
    const result = simulator.executeAction(
      "inc-8921",
      "rollbackDeployment",
      { releaseId: "v2.4.0" },
      "human",
    );

    expect(result.success).toBe(true);
    expect(result.resolved).toBe(true);
    expect(result.incident.scenario.activeRelease).toBe("v2.4.0");
    expect(result.incident.currentHealth).toBe("HEALTHY");
    expect(result.incident.scenario.status).toBe("RESOLVED");
    expect(result.incident.auditTrail.at(-1)?.status).toBe("SUCCESS");
    expect(result.incident.scenario.metrics.at(-1)?.errorRate).toBe(0.01);
  });

  it("requires every reviewed action before declaring a multi-step incident resolved", () => {
    const first = simulator.executeAction(
      "inc-4402",
      "toggleFeatureFlag",
      { flagId: "FF_UNBOUNDED_SESSION_CACHE", enabled: false },
      "human",
    );

    expect(first.success).toBe(true);
    expect(first.resolved).toBe(false);
    expect(first.incident.scenario.status).toBe("RECOVERING");
    expect(first.incident.currentHealth).toBe("DEGRADED");

    const second = simulator.executeAction(
      "inc-4402",
      "restartService",
      { service: "session-auth-service" },
      "human",
    );

    expect(second.success).toBe(true);
    expect(second.resolved).toBe(true);
    expect(second.incident.scenario.status).toBe("RESOLVED");
    expect(second.incident.currentHealth).toBe("HEALTHY");
  });

  it("does not claim success for a restart targeting another service", () => {
    const result = simulator.executeAction(
      "inc-4402",
      "restartService",
      { service: "unrelated-service" },
      "human",
    );

    expect(result.success).toBe(false);
    expect(result.incident.appliedActions).toHaveLength(0);
    expect(result.incident.auditTrail.at(-1)?.status).toBe("REJECTED");
  });

  it("does not append healthy metrics more than once after resolution", () => {
    const first = simulator.executeAction(
      "inc-8921",
      "rollbackDeployment",
      { releaseId: "v2.4.0" },
      "human",
    );
    const metricCount = first.incident.scenario.metrics.length;

    const repeated = simulator.executeAction(
      "inc-8921",
      "rollbackDeployment",
      { releaseId: "v2.4.0" },
      "human",
    );

    expect(repeated.success).toBe(false);
    expect(repeated.incident.scenario.metrics).toHaveLength(metricCount);
    expect(repeated.incident.auditTrail.at(-1)?.status).toBe("REJECTED");
  });
});
