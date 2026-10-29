import { SCENARIOS, IncidentScenario, MetricPoint } from "./scenarios";

interface ExecutionAuditEntry {
  id: string;
  timestamp: string;
  actionId: string;
  params: any;
  executedBy: "agent" | "human" | "api";
  status: "SUCCESS" | "FAILED" | "REJECTED";
  resultingHealth: "HEALTHY" | "DEGRADED" | "CRITICAL";
  notes: string;
}

interface IncidentRuntimeState {
  scenario: IncidentScenario;
  auditTrail: ExecutionAuditEntry[];
  appliedActions: string[];
  currentHealth: "HEALTHY" | "DEGRADED" | "CRITICAL";
}

class IncidentSimulator {
  private states: Map<string, IncidentRuntimeState> = new Map();

  constructor() {
    this.initialize();
  }

  public initialize() {
    this.states.clear();
    for (const scenario of SCENARIOS) {
      this.states.set(scenario.id, {
        scenario: JSON.parse(JSON.stringify(scenario)),
        auditTrail: [
          {
            id: `audit-init-${scenario.id}`,
            timestamp: scenario.detectedAt,
            actionId: "systemAlert",
            params: { severity: scenario.severity, trigger: scenario.description },
            executedBy: "api",
            status: "SUCCESS",
            resultingHealth: scenario.severity === "CRITICAL" ? "CRITICAL" : "DEGRADED",
            notes: `Automated pager alert triggered: ${scenario.title}`
          }
        ],
        appliedActions: [],
        currentHealth: scenario.severity === "CRITICAL" ? "CRITICAL" : "DEGRADED"
      });
    }
  }

  public getIncident(id: string): IncidentRuntimeState | null {
    if (!this.states.has(id)) {
      this.initialize();
    }
    return this.states.get(id) || null;
  }

  public listIncidents(): { id: string; title: string; severity: string; service: string; status: string; currentHealth: string }[] {
    const list: { id: string; title: string; severity: string; service: string; status: string; currentHealth: string }[] = [];
    this.states.forEach((state) => {
      list.push({
        id: state.scenario.id,
        title: state.scenario.title,
        severity: state.scenario.severity,
        service: state.scenario.service,
        status: state.scenario.status,
        currentHealth: state.currentHealth
      });
    });
    return list;
  }

  public resetIncident(id: string): IncidentRuntimeState | null {
    const original = SCENARIOS.find((s) => s.id === id);
    if (!original) return null;
    const newState: IncidentRuntimeState = {
      scenario: JSON.parse(JSON.stringify(original)),
      auditTrail: [
        {
          id: `audit-reset-${id}-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actionId: "systemReset",
          params: {},
          executedBy: "human",
          status: "SUCCESS",
          resultingHealth: original.severity === "CRITICAL" ? "CRITICAL" : "DEGRADED",
          notes: "Incident environment reset to original alert state."
        }
      ],
      appliedActions: [],
      currentHealth: original.severity === "CRITICAL" ? "CRITICAL" : "DEGRADED"
    };
    this.states.set(id, newState);
    return newState;
  }

  public executeAction(
    incidentId: string,
    actionId: string,
    params: any,
    source: "agent" | "human" | "api"
  ): {
    success: boolean;
    incident: IncidentRuntimeState;
    message: string;
    resolved: boolean;
  } {
    const state = this.getIncident(incidentId);
    if (!state) {
      throw new Error(`Incident ${incidentId} not found.`);
    }

    const timestamp = new Date().toISOString();
    let actionSucceeded = true;
    let message = "";

    // Handle Rollback Deployment
    if (actionId === "rollbackDeployment") {
      const targetRelease = params.releaseId;
      state.scenario.activeRelease = targetRelease;
      state.appliedActions.push(`rollbackDeployment:${targetRelease}`);
      message = `Successfully rolled back service ${state.scenario.service} to release ${targetRelease}.`;
    } 
    // Handle Feature Flag Toggle
    else if (actionId === "toggleFeatureFlag") {
      const flag = state.scenario.featureFlags.find((f) => f.id === params.flagId);
      if (flag) {
        flag.enabled = params.enabled;
        state.appliedActions.push(`toggleFeatureFlag:${params.flagId}=${params.enabled}`);
        message = `Feature flag ${flag.name} (${params.flagId}) set to ${params.enabled}.`;
      } else {
        actionSucceeded = false;
        message = `Feature flag ${params.flagId} not found.`;
      }
    } 
    // Handle Service Restart
    else if (actionId === "restartService") {
      state.appliedActions.push(`restartService:${params.service}`);
      message = `Rolling restart completed for service ${params.service}. Pod replicas healthy.`;
    } 
    // Unknown or Read-only actions
    else {
      message = `Action ${actionId} executed successfully.`;
    }

    // Run deterministic verification probe
    const isResolved = this.checkResolution(state);

    if (isResolved) {
      state.currentHealth = "HEALTHY";
      state.scenario.status = "RESOLVED";
      // Merge healthy metrics
      state.scenario.metrics = [...state.scenario.metrics, ...state.scenario.healthyMetrics];
    } else if (state.appliedActions.length > 0) {
      state.scenario.status = "RECOVERING";
    }

    state.auditTrail.push({
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp,
      actionId,
      params,
      executedBy: source,
      status: actionSucceeded ? "SUCCESS" : "FAILED",
      resultingHealth: state.currentHealth,
      notes: message
    });

    return {
      success: actionSucceeded,
      incident: state,
      message,
      resolved: isResolved
    };
  }

  private checkResolution(state: IncidentRuntimeState): boolean {
    const required = state.scenario.requiredActions;
    for (const req of required) {
      const matching = state.appliedActions.find((applied) => {
        if (req.actionId === "rollbackDeployment") {
          return applied === `rollbackDeployment:${req.expectedParams.releaseId}`;
        }
        if (req.actionId === "toggleFeatureFlag") {
          return applied === `toggleFeatureFlag:${req.expectedParams.flagId}=${req.expectedParams.enabled}`;
        }
        if (req.actionId === "restartService") {
          return applied === `restartService:${req.expectedParams.service}`;
        }
        return false;
      });
      if (!matching) {
        return false;
      }
    }
    return true;
  }

  public generatePostMortem(incidentId: string): string {
    const state = this.getIncident(incidentId);
    if (!state) return "# Incident not found";

    const s = state.scenario;
    const duration = "6 minutes";
    const auditRows = state.auditTrail
      .map(
        (a) =>
          `| ${new Date(a.timestamp).toLocaleTimeString()} | \`${a.actionId}\` | **${a.executedBy.toUpperCase()}** | \`${a.status}\` | ${a.notes} |`
      )
      .join("\n");

    return `# 🚨 Production Incident Post-Mortem: ${s.title}

**Incident ID:** \`${s.id}\`  
**Severity:** \`${s.severity}\` | **Service Impacted:** \`${s.service}\`  
**Detected At:** ${s.detectedAt}  
**Status:** **${s.status}** (${state.currentHealth})  
**Mean Time to Recovery (MTTR):** ${duration}  

---

## 1. Executive Summary
On ${s.detectedAt}, an automated alert flagged critical operational degradation in \`${s.service}\`. TraceBack AI initiated an autonomous investigation, inspected telemetry logs and deployment diffs, and synthesized a safe recovery plan. Human authorization was provided, and automated deterministic probes verified complete recovery.

---

## 2. Root Cause Analysis (RCA)
- **Direct Cause:** ${s.postMortemTemplate.rootCause}
- **Trigger Event:** ${s.postMortemTemplate.trigger}
- **Customer Blast Radius:** ${s.postMortemTemplate.blastRadius}

---

## 3. Verified Timeline & Audit Trail (Agent + Human Shared Actions)
| Time | Action | Initiator | Status | Outcome / Verification |
| :--- | :--- | :--- | :--- | :--- |
${auditRows}

---

## 4. Preventative Action Items
- ${s.postMortemTemplate.recommendedPrevention}
- Add synthetic canary tests to CI/CD pipeline prior to 100% traffic migration.
- Configure automatic circuit-breaking for downstream dependency faults.

*Generated by TraceBack AI — Builder.io Agent-Native Architecture*
`;
  }
}

// Global singleton instance
export const simulator = new IncidentSimulator();
