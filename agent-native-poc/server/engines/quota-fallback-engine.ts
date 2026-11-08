import {
  createAISDKEngine,
  type AgentEngine,
  type EngineEvent,
  type EngineStreamOptions,
} from "@agent-native/core/agent/engine";
import { resolveEngine } from "@agent-native/core/server";

import buildInvestigationBrief from "../../actions/build-investigation-brief.js";

const googleMetadata = createAISDKEngine("google", {
  // This instance supplies metadata only. Actual requests are delegated to
  // Agent-Native's credential-aware registry inside the active request.
  apiKey: "",
  allowEnvFallback: false,
});

const INCIDENT_ID_PATTERN = /\binc-(?:8921|4402|7119)\b/gi;

function incidentIdFromMessages(
  messages: EngineStreamOptions["messages"],
): "inc-8921" | "inc-4402" | "inc-7119" | undefined {
  const text = messages
    .filter((message) => message.role === "user")
    .flatMap((message) => message.content)
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("\n");
  const matches = [...text.matchAll(INCIDENT_ID_PATTERN)];
  const last = matches[matches.length - 1]?.[0]?.toLowerCase();
  return last === "inc-8921" || last === "inc-4402" || last === "inc-7119"
    ? last
    : undefined;
}

function recoveryActionInHistory(
  messages: EngineStreamOptions["messages"],
): boolean {
  return messages.some((message) =>
    message.content.some(
      (part) =>
        (part.type === "tool-call" && part.name === "execute-recovery-simulation") ||
        (part.type === "tool-result" && part.toolName === "execute-recovery-simulation"),
    ),
  );
}

async function deterministicFallback(
  messages: EngineStreamOptions["messages"],
): Promise<string> {
  const incidentId = incidentIdFromMessages(messages);
  const recoveryNote = recoveryActionInHistory(messages)
    ? "A recovery action appears in this conversation history. This fallback cannot determine whether it was approved or completed. Use the actual Agent-Native approval card and Activity/audit result as the source of truth; do not submit a duplicate recovery request."
    : "This fallback emits no recovery tool calls. Any recovery execution remains behind the actual Agent-Native human approval flow.";
  if (!incidentId) {
    return [
      "DETERMINISTIC FALLBACK — Gemini is rate-limited (HTTP 429).",
      "AI chat could not complete this turn, and this turn will not retry the exhausted provider.",
      "I can still prepare a deterministic, template-based incident brief from the synthetic benchmark data. Choose one incident: inc-8921 (checkout), inc-4402 (session/auth), or inc-7119 (analytics database).",
      "This fallback is not live AI analysis.",
      recoveryNote,
    ].join("\n\n");
  }

  const brief = await buildInvestigationBrief.run({ incidentId });
  const observe = brief.stages.find((stage) => stage.id === "observe");
  const correlate = brief.stages.find((stage) => stage.id === "correlate");
  const diagnose = brief.stages.find((stage) => stage.id === "diagnose");
  const plan = brief.stages.find((stage) => stage.id === "plan");
  const approval = brief.stages.find((stage) => stage.id === "approval");

  return [
    "DETERMINISTIC FALLBACK — Gemini is rate-limited (HTTP 429).",
    "AI chat could not complete this turn. The following brief was assembled deterministically from the app's synthetic benchmark fixtures; it is not AI-generated analysis or a verified production diagnosis.",
    `Incident: ${brief.incidentId} — ${brief.title} (${brief.service})`,
    observe ? `OBSERVE\n${observe.summary}\n${observe.evidence.join("\n")}` : "",
    correlate ? `CORRELATE\n${correlate.summary}\n${correlate.evidence.join("\n")}` : "",
    diagnose ? `DIAGNOSIS HYPOTHESIS\n${diagnose.summary}\n${diagnose.evidence.join("\n")}` : "",
    plan ? `PROPOSED RECOVERY\n${plan.summary}\n${plan.evidence.join("\n")}` : "",
    approval ? `HUMAN APPROVAL GATE\n${approval.summary}` : "",
    "All incident evidence is synthetic. No production infrastructure was changed by this fallback.",
    recoveryNote,
  ]
    .filter(Boolean)
    .join("\n\n");
}

export function createQuotaFallbackEngine(
  resolveInnerEngine: () => Promise<AgentEngine> = () =>
    resolveEngine({ engineOption: "ai-sdk:google" }),
): AgentEngine {
  return {
    name: googleMetadata.name,
    label: "Google Gemini (quota-aware)",
    defaultModel: googleMetadata.defaultModel,
    supportedModels: googleMetadata.supportedModels,
    ...(googleMetadata.acceptsCustomModels !== undefined
      ? { acceptsCustomModels: googleMetadata.acceptsCustomModels }
      : {}),
    ...(googleMetadata.preserveCustomModels !== undefined
      ? { preserveCustomModels: googleMetadata.preserveCustomModels }
      : {}),
    capabilities: googleMetadata.capabilities,
    async *stream(options: EngineStreamOptions): AsyncIterable<EngineEvent> {
      const innerEngine = await resolveInnerEngine();
      let quotaLimited = false;

      try {
        for await (const event of innerEngine.stream(options)) {
          if (
            event.type === "stop" &&
            event.reason === "error" &&
            (event.statusCode === 429 || event.errorCode === "http_429")
          ) {
            // The AI SDK engine emits this structured stop before rethrowing.
            // Consume it here so the framework does not repeat an exhausted
            // daily-quota request or enter a continuation loop.
            quotaLimited = true;
            break;
          }
          yield event;
        }
      } catch (error) {
        if (!quotaLimited) throw error;
      }

      if (quotaLimited) {
        const fallbackText = await deterministicFallback(options.messages);
        yield { type: "text-delta", text: fallbackText };
        yield {
          type: "assistant-content",
          parts: [{ type: "text", text: fallbackText }],
        };
        yield { type: "stop", reason: "end_turn" };
      }
    },
  };
}
