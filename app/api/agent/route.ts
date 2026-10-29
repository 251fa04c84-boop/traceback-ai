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
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to retrieve session" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, incidentId, approved, approverName, apiKey } = body;

    if (!incidentId) {
      return NextResponse.json({ error: "Missing required 'incidentId'" }, { status: 400 });
    }

    if (action === "start") {
      const session = await agentOrchestrator.startInvestigation(incidentId, apiKey);
      return NextResponse.json({ success: true, session });
    }

    if (action === "approve") {
      if (typeof approved !== "boolean") {
        return NextResponse.json({ error: "Parameter 'approved' must be boolean" }, { status: 400 });
      }
      const session = await agentOrchestrator.submitApproval(incidentId, approved, approverName);
      return NextResponse.json({ success: true, session });
    }

    return NextResponse.json({ error: `Unsupported agent action: ${action}` }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Agent operation failed" }, { status: 500 });
  }
}
