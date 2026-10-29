import { z } from "zod";

export interface ActionContext {
  incidentId: string;
  source: "agent" | "human" | "api";
  userApprovalGranted?: boolean;
}

export interface ActionDefinition<TInput = any, TOutput = any> {
  id: string;
  name: string;
  description: string;
  isMutating: boolean;
  requiresApproval: boolean;
  schema: z.ZodType<TInput>;
  run: (input: TInput, context: ActionContext) => Promise<TOutput>;
}

export interface ActionResult<T = any> {
  success: boolean;
  actionId: string;
  executedBy: "agent" | "human" | "api";
  timestamp: string;
  data?: T;
  error?: string;
  requiresApproval?: boolean;
  pendingApprovalDetails?: {
    actionId: string;
    input: any;
    reason: string;
    blastRadius: "low" | "medium" | "high" | "critical";
    description: string;
  };
}
