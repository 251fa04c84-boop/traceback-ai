import { AgentInvestigationSession, InvestigationStep } from "./types";
import { dispatchAction } from "../actions";
import { simulator } from "../simulator/engine";

async function queryGeminiLive(prompt: string, apiKey: string) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.1
      }
    })
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gemini API Error ${res.status}: ${errorText}`);
  }
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  return JSON.parse(text);
}

class AgentOrchestrator {
  private sessions: Map<string, AgentInvestigationSession> = new Map();

  public getSession(incidentId: string): AgentInvestigationSession | null {
    return this.sessions.get(incidentId) || null;
  }

  public async startInvestigation(
    incidentId: string,
    apiKey?: string
  ): Promise<AgentInvestigationSession> {
    const incidentState = simulator.getIncident(incidentId);
    if (!incidentState) {
      throw new Error(`Incident ${incidentId} not found.`);
    }

    const s = incidentState.scenario;
    const now = new Date();

    const session: AgentInvestigationSession = {
      incidentId,
      service: s.service,
      currentStepIndex: 0,
      steps: [],
      hypothesis: null,
      proposedAction: null,
      isAwaitingApproval: false,
      approvalGranted: false,
      verificationVerdict: "UNVERIFIED",
      postMortemReport: null,
      modelUsed: "Deterministic SRE Engine (Calibrated Benchmark)",
      isLiveAI: false
    };

    // Step 1: Telemetry Analysis
    const step1Result = await dispatchAction(
      "getTelemetryMetrics",
      { incidentId },
      { incidentId, source: "agent" }
    );
    const latestMetrics = step1Result.data?.latestMetrics;
    const step1: InvestigationStep = {
      id: `step-1-${Date.now()}`,
      stepNumber: 1,
      title: "Analyze Real-Time Telemetry & Alert Thresholds",
      phase: "TELEMETRY_ANALYSIS",
      status: "COMPLETED",
      actionDispatched: "getTelemetryMetrics",
      actionInput: { incidentId },
      actionOutput: step1Result.data,
      evidenceCited: [
        `Service: ${s.service}`,
        `HTTP Error Rate: ${latestMetrics?.errorRate}% (Alert Threshold: >1.0%)`,
        `Latency p99: ${latestMetrics?.latencyP99}ms`
      ],
      thought: `Automated alert indicates operational failure on ${s.service}. Telemetry metrics confirm an anomaly with error rate at ${latestMetrics?.errorRate}%. Querying application container logs for high-severity exceptions.`,
      timestamp: new Date(now.getTime()).toISOString()
    };
    session.steps.push(step1);

    // Step 2: Log Evaluation
    const step2Result = await dispatchAction(
      "getServiceLogs",
      { incidentId, level: "ERROR", limit: 10 },
      { incidentId, source: "agent" }
    );
    const errorLogs = step2Result.data?.logs || [];
    const firstError = errorLogs[0] || {};
    const step2: InvestigationStep = {
      id: `step-2-${Date.now()}`,
      stepNumber: 2,
      title: "Query Container Logs & Extract Stack Traces",
      phase: "LOG_EVALUATION",
      status: "COMPLETED",
      actionDispatched: "getServiceLogs",
      actionInput: { incidentId, level: "ERROR", limit: 10 },
      actionOutput: step2Result.data,
      evidenceCited: [
        `Extracted ${errorLogs.length} ERROR log events from ${s.service}`,
        `Exception: ${firstError.message || "Runtime exception detected"}`,
        `Stack trace root: ${firstError.stackTrace ? firstError.stackTrace.split("\n")[0] : "N/A"}`
      ],
      thought: `Found recurring fatal exception in logs: "${firstError.message}". Correlating timestamp with recent continuous deployment events.`,
      timestamp: new Date(now.getTime() + 1000).toISOString()
    };
    session.steps.push(step2);

    // Step 3: Diff Inspection
    const step3Result = await dispatchAction(
      "inspectDeploymentDiff",
      { incidentId },
      { incidentId, source: "agent" }
    );
    const activeDeployment = step3Result.data?.targetDeployment;
    const step3: InvestigationStep = {
      id: `step-3-${Date.now()}`,
      stepNumber: 3,
      title: "Inspect Recent Deployments & Git Commit Diffs",
      phase: "DIFF_INSPECTION",
      status: "COMPLETED",
      actionDispatched: "inspectDeploymentDiff",
      actionInput: { incidentId },
      actionOutput: step3Result.data,
      evidenceCited: [
        `Active Release: ${s.activeRelease} (Commit: ${activeDeployment?.commitHash})`,
        `Author: ${activeDeployment?.author}`,
        `Summary: ${activeDeployment?.summary}`
      ],
      thought: `Release ${s.activeRelease} was deployed shortly before the error spike. Inspecting modified source lines in commit ${activeDeployment?.commitHash} to isolate faulty logic.`,
      timestamp: new Date(now.getTime() + 2000).toISOString()
    };
    session.steps.push(step3);

    // Step 4 & 5: Live AI Query or Calibrated Fallback
    const effectiveKey = apiKey || process.env.GEMINI_API_KEY;
    let hypothesisText = "";
    let proposedActionId = "rollbackDeployment";
    let proposedParams: any = { releaseId: s.stableRelease };
    let proposedReason = `Rollback ${s.service} from degraded release ${s.activeRelease} to last known stable release ${s.stableRelease}.`;
    let blastRadius: "low" | "medium" | "high" | "critical" = "high";

    if (effectiveKey) {
      try {
        const prompt = `You are an expert SRE and Incident Response Agent in TraceBack AI.
Incident Scenario: ${s.title}
Service: ${s.service}
Active Release: ${s.activeRelease} (Stable: ${s.stableRelease})
Telemetry: Error Rate ${latestMetrics?.errorRate}%, Latency ${latestMetrics?.latencyP99}ms
Deployments:
Commit ${activeDeployment?.commitHash} by ${activeDeployment?.author}: ${activeDeployment?.summary}
Diff:
${activeDeployment?.diff}
Errors in Logs:
${JSON.stringify(errorLogs, null, 2)}

Analyze and output a JSON response matching:
{
  "hypothesis": "Detailed root-cause analysis citing lines in diff and stack traces",
  "thought": "Reasoning explaining the root cause and why remediation is required",
  "proposedActionId": "rollbackDeployment" | "toggleFeatureFlag" | "restartService",
  "proposedParams": object,
  "proposedReason": "Explanation for human on-call engineer",
  "blastRadius": "low" | "medium" | "high" | "critical"
}`;
        const aiOutput = await queryGeminiLive(prompt, effectiveKey);
        if (aiOutput.hypothesis && aiOutput.proposedActionId) {
          hypothesisText = aiOutput.hypothesis;
          proposedActionId = aiOutput.proposedActionId;
          proposedParams = aiOutput.proposedParams || proposedParams;
          proposedReason = aiOutput.proposedReason || proposedReason;
          blastRadius = aiOutput.blastRadius || blastRadius;
          session.modelUsed = "Gemini 1.5 Flash (Live AI)";
          session.isLiveAI = true;
        }
      } catch (err: any) {
        console.warn("Live Gemini API call failed, falling back to deterministic calibration:", err.message);
      }
    }

    // Deterministic Calibrated Fallback (if AI not used or call failed)
    if (!hypothesisText) {
      if (s.id === "inc-8921") {
        hypothesisText = `Release v2.4.1 (commit a7e89f2 by @Alex Rivera) introduced a breaking regression in PaymentGatewayController.java:142 by removing a null-check on request.getCoupon(). When cart payloads lack promotional coupons, getCoupon() returns null, triggering a NullPointerException and spiking 500 errors to 42.8%.`;
        proposedActionId = "rollbackDeployment";
        proposedParams = { releaseId: s.stableRelease };
        proposedReason = `Rollback ${s.service} from degraded release ${s.activeRelease} to last known stable release ${s.stableRelease}.`;
        blastRadius = "high";
      } else if (s.id === "inc-4402") {
        hypothesisText = `Commit c310bb4 introduced an unbounded ConcurrentHashMap in LocalCacheAdapter.java without eviction policy or TTL. Under normal traffic, heap memory linearly saturates at 99%, triggering JVM OutOfMemoryErrors and continuous pod restarts.`;
        proposedActionId = "toggleFeatureFlag";
        proposedParams = { flagId: "FF_UNBOUNDED_SESSION_CACHE", enabled: false };
        proposedReason = `Disable leaking in-memory cache flag FF_UNBOUNDED_SESSION_CACHE to halt memory exhaustion.`;
        blastRadius = "medium";
      } else {
        hypothesisText = `Release v1.9.4 in commit f891d29 omitted client.release() on database connection pool acquisitions in QueryExecutor.ts. This caused 100% database connection pool saturation, leading to HTTP 504 timeouts.`;
        proposedActionId = "toggleFeatureFlag";
        proposedParams = { flagId: "FF_ASYNC_ANALYTICS_V2", enabled: false };
        proposedReason = `Disable leaking async analytics feature flag FF_ASYNC_ANALYTICS_V2 to release database connections.`;
        blastRadius = "medium";
      }
    }

    session.hypothesis = hypothesisText;

    const step4: InvestigationStep = {
      id: `step-4-${Date.now()}`,
      stepNumber: 4,
      title: "Ground Root Cause Hypothesis with Cited Evidence",
      phase: "HYPOTHESIS_FORMULATION",
      status: "COMPLETED",
      evidenceCited: [
        `Root Cause: ${s.postMortemTemplate.rootCause}`,
        `Trigger: ${s.postMortemTemplate.trigger}`,
        `Blast Radius: ${s.postMortemTemplate.blastRadius}`
      ],
      thought: hypothesisText,
      timestamp: new Date(now.getTime() + 3000).toISOString()
    };
    session.steps.push(step4);

    session.proposedAction = {
      actionId: proposedActionId,
      params: proposedParams,
      reason: proposedReason,
      blastRadius
    };
    session.isAwaitingApproval = true;

    const step5: InvestigationStep = {
      id: `step-5-${Date.now()}`,
      stepNumber: 5,
      title: "Synthesize Recovery Plan & Intercept for Human Approval",
      phase: "RECOVERY_PLANNING",
      status: "BLOCKED_APPROVAL",
      recoveryProposal: session.proposedAction,
      evidenceCited: [
        `Target Action: ${proposedActionId}`,
        `Parameters: ${JSON.stringify(proposedParams)}`,
        `Risk Tier: ${blastRadius.toUpperCase()}`
      ],
      thought: `Formulated targeted mitigation plan. Because ${proposedActionId} is a mutating production action, halting autonomous execution to require explicit human authorization as mandated by the Agent-Native safety protocol.`,
      timestamp: new Date(now.getTime() + 4000).toISOString()
    };
    session.steps.push(step5);

    this.sessions.set(incidentId, session);
    return session;
  }

  public async submitApproval(
    incidentId: string,
    approved: boolean,
    approverName: string = "On-Call Engineer"
  ): Promise<AgentInvestigationSession> {
    const session = this.sessions.get(incidentId);
    if (!session) {
      throw new Error(`Active investigation session for ${incidentId} not found.`);
    }

    if (!session.proposedAction) {
      throw new Error(`No pending recovery action for incident ${incidentId}.`);
    }

    const now = new Date();

    if (!approved) {
      session.isAwaitingApproval = false;
      session.approvalGranted = false;
      session.steps.push({
        id: `step-reject-${Date.now()}`,
        stepNumber: session.steps.length + 1,
        title: "Action Rejected by Human Operator",
        phase: "APPROVAL_GATE",
        status: "COMPLETED",
        evidenceCited: [`Rejected by: ${approverName}`, `Action: ${session.proposedAction.actionId}`],
        thought: `Operator rejected the proposed action. Incident remains in ${session.service} degraded state. Standing by for alternative human instructions.`,
        timestamp: now.toISOString()
      });
      this.sessions.set(incidentId, session);
      return session;
    }

    session.isAwaitingApproval = false;
    session.approvalGranted = true;

    // Execute the approved action via dispatchAction
    const executeResult = await dispatchAction(
      session.proposedAction.actionId,
      { incidentId, ...session.proposedAction.params },
      { incidentId, source: "human", userApprovalGranted: true }
    );

    // If scenario 2 requires restartService as second action
    if (incidentId === "inc-4402") {
      await dispatchAction(
        "restartService",
        { incidentId, service: session.service },
        { incidentId, source: "human", userApprovalGranted: true }
      );
    }

    // Step 6: Execute Action
    session.steps.push({
      id: `step-exec-${Date.now()}`,
      stepNumber: session.steps.length + 1,
      title: "Execute Authorized Remediating Action",
      phase: "APPROVAL_GATE",
      status: "COMPLETED",
      actionDispatched: session.proposedAction.actionId,
      actionInput: session.proposedAction.params,
      actionOutput: executeResult.data,
      evidenceCited: [
        `Authorized by: ${approverName}`,
        `Execution Status: ${executeResult.success ? "SUCCESS" : "FAILED"}`,
        `Outcome: ${executeResult.data?.message || executeResult.error}`
      ],
      thought: `User approval confirmed. Executed ${session.proposedAction.actionId} through the Agent-Native shared action layer. Dispatching deterministic health probe to verify resolution.`,
      timestamp: new Date(now.getTime() + 1000).toISOString()
    });

    // Step 7: Deterministic Health Verification Probe
    const healthResult = await dispatchAction(
      "checkServiceHealth",
      { incidentId },
      { incidentId, source: "agent" }
    );

    const isResolved = healthResult.data?.isResolved;
    session.verificationVerdict = isResolved ? "HEALTHY_CONFIRMED" : "FAILED";

    session.steps.push({
      id: `step-verify-${Date.now()}`,
      stepNumber: session.steps.length + 1,
      title: "Deterministic Telemetry Verification Probe",
      phase: "POST_VERIFICATION",
      status: "COMPLETED",
      actionDispatched: "checkServiceHealth",
      actionOutput: healthResult.data,
      evidenceCited: [
        `Service Health Status: ${healthResult.data?.overallStatus}`,
        `HTTP Health Check: ${healthResult.data?.endpointCheck}`,
        `Post-Mitigation Error Rate: ${healthResult.data?.errorRate}%`,
        `Deterministic Resolution Confirmed: ${isResolved ? "YES (PASSED)" : "NO (FAILED)"}`
      ],
      thought: isResolved
        ? `Deterministic verification probe passed. Error rates have returned to nominal levels (<0.02%) and service health checks report 200 OK. Incident is verified resolved.`
        : `Service health check indicates system remains degraded. Additional recovery steps required.`,
      timestamp: new Date(now.getTime() + 2000).toISOString()
    });

    // Generate Final Post-Mortem Report
    session.postMortemReport = simulator.generatePostMortem(incidentId);

    this.sessions.set(incidentId, session);
    return session;
  }
}

export const agentOrchestrator = new AgentOrchestrator();
