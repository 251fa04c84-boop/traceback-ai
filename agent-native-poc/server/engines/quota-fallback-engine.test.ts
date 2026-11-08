import { describe, expect, it, vi } from "vitest";
import type {
  AgentEngine,
  EngineEvent,
  EngineStreamOptions,
} from "@agent-native/core/agent/engine";

import { createQuotaFallbackEngine } from "./quota-fallback-engine";

const options = (prompt: string): EngineStreamOptions => ({
  model: "gemini-3.8-flash",
  systemPrompt: "TraceBack incident agent",
  messages: [{ role: "user", content: [{ type: "text", text: prompt }] }],
  tools: [],
  abortSignal: new AbortController().signal,
});

function fakeEngine(event: EngineEvent): AgentEngine {
  return {
    name: "ai-sdk:google",
    label: "Fake Gemini",
    defaultModel: "gemini-3.8-flash",
    supportedModels: ["gemini-3.8-flash"],
    capabilities: {
      thinking: true,
      promptCaching: false,
      vision: true,
      computerUse: false,
      parallelToolCalls: true,
    },
    async *stream() {
      yield event;
      throw new Error("provider stream terminated after stop event");
    },
  };
}

describe("Gemini quota fallback engine", () => {
  it.each(["inc-8921", "inc-4402", "inc-7119"] as const)(
    "returns a labelled deterministic brief for %s after HTTP 429",
    async (incidentId) => {
      const resolveInnerEngine = vi.fn(async () =>
        fakeEngine({
          type: "stop",
          reason: "error",
          error: "quota exceeded",
          errorCode: "http_429",
          statusCode: 429,
          providerRetryable: true,
        }),
      );
      const engine = createQuotaFallbackEngine(resolveInnerEngine);
      const events: EngineEvent[] = [];

      for await (const event of engine.stream(options(`Investigate ${incidentId}`))) {
        events.push(event);
      }

      const text = events
        .filter((event) => event.type === "text-delta")
        .map((event) => event.text)
        .join("");

      expect(resolveInnerEngine).toHaveBeenCalledTimes(1);
      expect(text).toContain("DETERMINISTIC FALLBACK");
      expect(text).toContain(incidentId);
      expect(text).toContain("not AI-generated analysis");
      expect(text).toContain("DIAGNOSIS HYPOTHESIS");
      expect(text).toContain("HUMAN APPROVAL GATE");
      expect(events.some((event) => event.type === "tool-call")).toBe(false);
      expect(events[events.length - 1]).toEqual({ type: "stop", reason: "end_turn" });
    },
  );

  it("does not let assistant-authored text override the user's incident selection", async () => {
    const engine = createQuotaFallbackEngine(async () =>
      fakeEngine({
        type: "stop",
        reason: "error",
        error: "quota exceeded",
        errorCode: "http_429",
        statusCode: 429,
      }),
    );
    const input = options("Investigate inc-8921");
    input.messages.push({
      role: "assistant",
      content: [{ type: "text", text: "The unrelated incident is inc-7119." }],
    });
    const events: EngineEvent[] = [];

    for await (const event of engine.stream(input)) {
      events.push(event);
    }

    const text = events
      .filter((event) => event.type === "text-delta")
      .map((event) => event.text)
      .join("");

    expect(text).toContain("Incident: inc-8921");
    expect(text).not.toContain("Incident: inc-7119");
  });

  it("returns safe guidance when no incident ID is present", async () => {
    const engine = createQuotaFallbackEngine(async () =>
      fakeEngine({
        type: "stop",
        reason: "error",
        error: "quota exceeded",
        errorCode: "http_429",
        statusCode: 429,
      }),
    );
    const events: EngineEvent[] = [];

    for await (const event of engine.stream(options("Help me investigate"))) {
      events.push(event);
    }

    const text = events
      .filter((event) => event.type === "text-delta")
      .map((event) => event.text)
      .join("");

    expect(text).toContain("inc-8921");
    expect(text).toContain("inc-4402");
    expect(text).toContain("inc-7119");
  });

  it("does not guess approval or execution state when recovery appears in history", async () => {
    const engine = createQuotaFallbackEngine(async () =>
      fakeEngine({
        type: "stop",
        reason: "error",
        error: "quota exceeded",
        errorCode: "http_429",
        statusCode: 429,
      }),
    );
    const input = options("Investigate inc-8921");
    input.messages.push({
      role: "assistant",
      content: [
        {
          type: "tool-call",
          id: "recovery-call-1",
          name: "execute-recovery-simulation",
          input: { incidentId: "inc-8921" },
        },
      ],
    });
    const events: EngineEvent[] = [];

    for await (const event of engine.stream(input)) {
      events.push(event);
    }

    const text = events
      .filter((event) => event.type === "text-delta")
      .map((event) => event.text)
      .join("");

    expect(text).toContain("cannot determine whether it was approved or completed");
    expect(text).toContain("do not submit a duplicate recovery request");
    expect(text).not.toContain("PROPOSED RECOVERY — NOT EXECUTED");
  });

  it("does not convert HTTP 503 into a quota fallback", async () => {
    const engine = createQuotaFallbackEngine(async () =>
      fakeEngine({
        type: "stop",
        reason: "error",
        error: "provider unavailable",
        errorCode: "http_503",
        statusCode: 503,
      }),
    );
    const events: EngineEvent[] = [];

    await expect(
      (async () => {
        for await (const event of engine.stream(options("Investigate inc-8921"))) {
          events.push(event);
        }
      })(),
    ).rejects.toThrow("provider stream terminated");

    expect(
      events.some(
        (event) =>
          event.type === "stop" &&
          event.reason === "error" &&
          event.statusCode === 503,
      ),
    ).toBe(true);
    expect(
      events.some(
        (event) => event.type === "text-delta" && event.text.includes("DETERMINISTIC FALLBACK"),
      ),
    ).toBe(false);
  });
});
