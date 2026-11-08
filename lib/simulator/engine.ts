import { SCENARIOS, IncidentScenario } from "./scenarios";

type ExecutionSource = "agent" | "human" | "api";
type HealthState = "HEALTHY" | "DEGRADED" | "CRITICAL";
type AuditStatus = "SUCCESS" | "FAILED" | "REJECTED";

interface ExecutionAuditEntry {
  id: string;
  timestamp: string;
  actionId: string;
  params: Record<string, unknown>;
  executedBy: ExecutionSource;
  status: AuditStatus;
  resultingHealth: HealthState;
  notes: string;
}

interface IncidentRuntimeState {
  scenario: IncidentScenario;
  auditTrail: ExecutionAuditEntry[];
  appliedActions: string[];
  currentHealth: HealthState;
}

function cloneScenario(scenario: IncidentScenario): IncidentScenario {
  return JSON.parse(JSON.stringify(scenario)) as IncidentScenario;
}

function sameExpectedParams(
  supplied: Record<string, unknown>,
  expected: Record<string, unknown>,
): boolean {
  const suppliedKeys = Object.keys(supplied).sort();
  const expectedKeys = Object.keys(expected).sort();
  return (
    suppliedKeys.length === expectedKeys.length &&
    suppliedKeys.every((key, index) => key === expectedKeys[index] && supplied[key] === expected[key])
  );
}

export class IncidentSimulator {
  private states: Map<string, IncidentRuntimeState> = new Map();

  constructor() {
    this.initialize();
  }

  public initialize() {
    this.states.clear();
    for (const scenario of SCENARIOS) {
      this.states.set(scenario.id, {
        scenario: cloneScenario(scenario),
        auditTrail: [
          {
            id: `audit-init-${scenario.id}`,
            timestamp: scenario.detectedAt,
            actionId: "systemAlert",
            params: { severity: scenario.severity, trigger: scenario.description },
            executedBy: "api",
            status: "SUCCESS",
            resultingHealth: scenario.severity === "CRITICAL" ? "CRITICAL" : "DEGRADED",
            notes: `Automated pager alert triggered: ${scenario.title}`,
          },
        ],
        appliedActions: [],
        currentHealth: scenario.severity === "CRITICAL" ? "CRITICAL" : "DEGRADED",
      });
    }
  }

  public getIncident(id: string): IncidentRuntimeState | null {
    if (!this.states.has(id)) this.initialize();
    return this.states.get(id) || null;
  }

  public listIncidents(): {
    id: string;
    title: string;
    severity: string;
    service: string;
    status: string;
    currentHealth: string;
  }[] {
    return Array.from(this.states.values(), (state) => ({
      id: state.scenario.id,
      title: state.scenario.title,
      severity: state.scenario.severity,
      service: state.scenario.service,
      status: state.scenario.status,
      currentHealth: state.currentHealth,
    }));
  }

  public resetIncident(id: string): IncidentRuntimeState | null {
    const original = SCENARIOS.find((scenario) => scenario.id === id);
    if (!original) return null;

    const state: IncidentRuntimeState = {
      scenario: cloneScenario(original),
      auditTrail: [
        {
          id: `audit-reset-${id}-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actionId: "systemReset",
          params: {},
          executedBy: "human",
          status: "SUCCESS",
          resultingHealth: original.severity === "CRITICAL" ? "CRITICAL" : "DEGRADED",
          notes: "Incident simulation reset to its original benchmark state.",
        },
      ],
      appliedActions: [],
      currentHealth: original.severity === "CRITICAL" ? "CRITICAL" : "DEGRADED",
    };
    this.states.set(id, state);
    return state;
  }

  public executeAction(
    incidentId: string,
    actionId: string,
    params: Record<string, unknown>,
    source: ExecutionSource,
  ): {
    success: boolean;
    incident: IncidentRuntimeState;
    message: string;
    resolved: boolean;
  } {
    const state = this.getIncident(incidentId);
    if (!state) throw new Error(`Incident ${incidentId} not found.`);

    const timestamp = new Date().toISOString();
    const safeParams =
      params && typeof params === "object" && !Array.isArray(params) ? params : {};
    const requirement = state.scenario.requiredActions.find((item) => item.actionId === actionId);

    // The scenario itself is the action allowlist. Unknown actions, extra parameters,
    // and values other than the exact reviewed recovery target are rejected.
    let actionSucceeded = false;
    let status: AuditStatus = "REJECTED";
    let message = "";

    if (state.scenario.status === "RESOLVED") {
      message = "Incident is already resolved. Reset the simulation before running another recovery.";
    } else if (!requirement) {
      message = `Action ${actionId} is not allowlisted for incident ${incidentId}.`;
    } else if (!sameExpectedParams(safeParams, requirement.expectedParams)) {
      message = `Parameters for ${actionId} do not match the scenario's approved recovery target.`;
    } else if (state.appliedActions.includes(this.actionKey(actionId, requirement.expectedParams))) {
      actionSucceeded = true;
      status = "SUCCESS";
      message = `The approved action ${actionId} was already applied; no duplicate mutation was made.`;
    } else {
      if (actionId === "rollbackDeployment") {
        const targetRelease = String(requirement.expectedParams.releaseId);
        const knownRelease = state.scenario.deployments.some(
          (deployment) => deployment.releaseId === targetRelease && deployment.isStable,
        );
        if (knownRelease) {
          state.scenario.activeRelease = targetRelease;
          state.appliedActions.push(this.actionKey(actionId, requirement.expectedParams));
          message = `Simulation rolled back ${state.scenario.service} to stable release ${targetRelease}.`;
          actionSucceeded = true;
        } else {
          message = "Rollback target is not a known stable release for this incident.";
          status = "FAILED";
        }
      } else if (actionId === "toggleFeatureFlag") {
        const flagId = String(requirement.expectedParams.flagId);
        const flag = state.scenario.featureFlags.find((item) => item.id === flagId);
        if (flag) {
          flag.enabled = requirement.expectedParams.enabled as boolean;
          state.appliedActions.push(this.actionKey(actionId, requirement.expectedParams));
          message = `Simulation set feature flag ${flag.name} (${flagId}) to ${String(flag.enabled)}.`;
          actionSucceeded = true;
        } else {
          message = `Feature flag ${flagId} does not exist in this incident.`;
          status = "FAILED";
        }
      } else if (actionId === "restartService") {
        const service = String(requirement.expectedParams.service);
        if (service === state.scenario.service) {
          state.appliedActions.push(this.actionKey(actionId, requirement.expectedParams));
          message = `Simulation completed a rolling restart for ${service}.`;
          actionSucceeded = true;
        } else {
          message = "Restart target does not match the affected service.";
          status = "FAILED";
        }
      } else {
        // A newly added action must have an explicit implementation above.
        message = `Action ${actionId} has no simulator implementation and was not executed.`;
        status = "REJECTED";
      }

      if (actionSucceeded) status = "SUCCESS";
    }

    const wasResolved = state.scenario.status === "RESOLVED";
    const isResolved = actionSucceeded && this.checkResolution(state);

    if (isResolved) {
      state.currentHealth = "HEALTHY";
      state.scenario.status = "RESOLVED";
      if (!wasResolved) {
        state.scenario.metrics = [...state.scenario.metrics, ...state.scenario.healthyMetrics];
      }
    } else if (actionSucceeded && state.appliedActions.length > 0) {
      state.scenario.status = "RECOVERING";
    }

    state.auditTrail.push({
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp,
      actionId,
      params: { ...safeParams },
      executedBy: source,
      status,
      resultingHealth: state.currentHealth,
      notes: message,
    });

    return { success: actionSucceeded, incident: state, message, resolved: isResolved };
  }

  private actionKey(actionId: string, params: Record<string, unknown>): string {
    if (actionId === "rollbackDeployment") return `rollbackDeployment:${String(params.releaseId)}`;
    if (actionId === "toggleFeatureFlag") {
      return `toggleFeatureFlag:${String(params.flagId)}=${String(params.enabled)}`;
    }
    if (actionId === "restartService") return `restartService:${String(params.service)}`;
    return `unsupported:${actionId}`;
  }

  private checkResolution(state: IncidentRuntimeState): boolean {
    return state.scenario.requiredActions.every((requirement) =>
      state.appliedActions.includes(this.actionKey(requirement.actionId, requirement.expectedParams)),
    );
  }

  public generatePostMortem(incidentId: string): string {
    const state = this.getIncident(incidentId);
    if (!state) return "# Incident not found";

    const scenario = state.scenario;
    const duration = "Not measured in this simulation";
    const auditRows = state.auditTrail
      .map(
        (entry) =>
          `| ${new Date(entry.timestamp).toLocaleTimeString()} | \`${entry.actionId}\` | **${entry.executedBy.toUpperCase()}** | \`${entry.status}\` | ${entry.notes} |`,
      )
      .join("\n");

    return `# Simulated Incident Post-Mortem: ${scenario.title}

**Incident ID:** \`${scenario.id}\`  
**Severity:** \`${scenario.severity}\` | **Service:** \`${scenario.service}\`  
**Detected At:** ${scenario.detectedAt}  
**Status:** **${scenario.status}** (${state.currentHealth})  
**Mean Time to Recovery (MTTR):** ${duration}  

> This report describes deterministic benchmark data only. No production infrastructure was changed.

---

## 1. Executive Summary
TraceBack analyzed the benchmark incident, correlated telemetry with logs and deployment evidence, and recorded the recovery actions and verification state shown below. The audit trail distinguishes successful, failed, and rejected actions.

## 2. Root Cause
- **Direct cause:** ${scenario.postMortemTemplate.rootCause}
- **Trigger:** ${scenario.postMortemTemplate.trigger}
- **Impact:** ${scenario.postMortemTemplate.blastRadius}

## 3. Recovery Audit Trail
| Time | Action | Initiator | Status | Outcome |
| :--- | :--- | :--- | :--- | :--- |
${auditRows}

## 4. Prevention
- ${scenario.postMortemTemplate.recommendedPrevention}
- Add synthetic canary tests before full traffic migration.
- Configure circuit-breaking for downstream dependency faults.

*Generated by TraceBack AI — isolated incident simulation.*
`;
  }
}

export const simulator = new IncidentSimulator();
