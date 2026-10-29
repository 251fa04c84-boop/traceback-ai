import { NextRequest, NextResponse } from "next/server";
import { simulator } from "@/lib/simulator/engine";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const incidentId = searchParams.get("id");

    if (incidentId) {
      const state = simulator.getIncident(incidentId);
      if (!state) {
        return NextResponse.json({ error: `Incident ${incidentId} not found` }, { status: 404 });
      }
      return NextResponse.json({ incident: state });
    }

    const incidents = simulator.listIncidents();
    return NextResponse.json({ incidents });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch incidents" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, incidentId } = body;

    if (action === "reset" && incidentId) {
      const resetState = simulator.resetIncident(incidentId);
      return NextResponse.json({ success: true, incident: resetState });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Operation failed" }, { status: 500 });
  }
}
