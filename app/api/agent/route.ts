import { NextRequest, NextResponse } from "next/server";
import { agentOrchestrator } from "@/lib/agent/engine";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const incidentId = searchParams.get("incidentId");

    if (!incidentId) {
      return NextResponse.json({ error: "Missing 'incidentId' parameter" }, { status: 400 });
    }

    const session = agentOrchestrator.getSession(incidentId);
    return NextResponse.json({ session });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to retrieve session";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, incidentId, apiKey } = body ?? {};

    if (typeof incidentId !== "string" || !incidentId.trim()) {
      return NextResponse.json({ error: "Missing required 'incidentId'" }, { status: 400 });
    }

    if (action === "start") {
      const session = await agentOrchestrator.startInvestigation(incidentId, apiKey);
      return NextResponse.json({ success: true, session });
    }

    if (action === "approve") {
      // Fail closed: browser-provided booleans and display names are not
      // authenticated approval authority. Keep execution disabled until a
      // server-authenticated approver and one-time approval challenge exist.
      return NextResponse.json(
        { error: "Approval execution is temporarily disabled until server-side approver authentication is configured." },
        { status: 403 }
      );
    }

    return NextResponse.json({ error: `Unsupported agent action: ${action}` }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Agent operation failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
