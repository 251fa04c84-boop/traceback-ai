import { NextRequest, NextResponse } from "next/server";
import { ACTION_REGISTRY, dispatchAction } from "@/lib/actions";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { actionId, input } = body ?? {};

    if (typeof actionId !== "string" || !actionId.trim()) {
      return NextResponse.json({ error: "Missing required parameter 'actionId'" }, { status: 400 });
    }

    const action = ACTION_REGISTRY[actionId];
    if (!action) {
      return NextResponse.json({ error: `Unknown action '${actionId}'` }, { status: 404 });
    }

    // This endpoint is intentionally read-only. Never accept approval authority,
    // execution identity, or mutation permission from an untrusted browser payload.
    if (action.isMutating) {
      return NextResponse.json(
        { error: "Mutating actions must use the explicit approval workflow." },
        { status: 403 }
      );
    }

    const incidentId = input?.incidentId;
    if (typeof incidentId !== "string" || !incidentId.trim()) {
      return NextResponse.json({ error: "Missing required parameter 'incidentId'" }, { status: 400 });
    }

    const result = await dispatchAction(actionId, input, {
      incidentId,
      source: "api",
      userApprovalGranted: false
    });

    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to execute action";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
