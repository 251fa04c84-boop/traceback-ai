import { NextRequest, NextResponse } from "next/server";
import { dispatchAction } from "@/lib/actions";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { actionId, input, source = "human", userApprovalGranted = false } = body;

    if (!actionId) {
      return NextResponse.json({ error: "Missing required parameter 'actionId'" }, { status: 400 });
    }

    const incidentId = input?.incidentId || body.incidentId;
    if (!incidentId) {
      return NextResponse.json({ error: "Missing required parameter 'incidentId'" }, { status: 400 });
    }

    const result = await dispatchAction(
      actionId,
      input,
      {
        incidentId,
        source,
        userApprovalGranted
      }
    );

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to execute action" }, { status: 500 });
  }
}
