export interface InvestigationStep {
  id: string;
  stepNumber: number;
  title: string;
  phase:
    | "TELEMETRY_ANALYSIS"
    | "LOG_EVALUATION"
    | "DIFF_INSPECTION"
    | "HYPOTHESIS_FORMULATION"
    | "RECOVERY_PLANNING"
    | "APPROVAL_GATE"
    | "POST_VERIFICATION";
  status: "PENDING" | "RUNNING" | "COMPLETED" | "BLOCKED_APPROVAL";
  actionDispatched?: string;
  actionInput?: any;
  actionOutput?: any;
  evidenceCited: string[];
  thought: string;
  timestamp: string;
  recoveryProposal?: {
    actionId: string;
    params: any;
    reason: string;
    blastRadius: "low" | "medium" | "high" | "critical";
  };
}

export interface AgentInvestigationSession {
  incidentId: string;
  service: string;
  currentStepIndex: number;
  steps: InvestigationStep[];
  hypothesis: string | null;
  proposedAction: {
    actionId: string;
    params: any;
    reason: string;
    blastRadius: "low" | "medium" | "high" | "critical";
  } | null;
  isAwaitingApproval: boolean;
  approvalGranted: boolean;
  verificationVerdict: "UNVERIFIED" | "HEALTHY_CONFIRMED" | "FAILED" | null;
  postMortemReport: string | null;
  modelUsed: string;
  isLiveAI: boolean;
}
