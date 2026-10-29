/**
 * TraceBack AI — Live Server E2E Integration Suite
 * Tests actual HTTP responses from local Next.js server
 */

const BASE_URL = process.env.TEST_URL || "http://localhost:3000";

async function fetchJSON(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status} on ${endpoint}: ${text}`);
  }
  return res.json();
}

async function runE2E() {
  console.log(`\n🚀 Testing live server at: ${BASE_URL}\n`);

  // Test 1: GET /api/incidents
  console.log("👉 [1/6] GET /api/incidents...");
  const incidentsRes = await fetchJSON("/api/incidents");
  if (!incidentsRes.incidents || incidentsRes.incidents.length !== 3) {
    throw new Error(`Expected 3 incidents, received ${incidentsRes.incidents?.length}`);
  }
  console.log(`   ✅ Retrieved ${incidentsRes.incidents.length} scenarios successfully.`);

  // Test 2: GET /api/incidents?id=inc-8921
  console.log("👉 [2/6] GET /api/incidents?id=inc-8921...");
  const detailRes = await fetchJSON("/api/incidents?id=inc-8921");
  if (detailRes.incident.scenario.service !== "checkout-service") {
    throw new Error(`Expected service checkout-service, got ${detailRes.incident.scenario.service}`);
  }
  console.log("   ✅ Retrieved incident details for checkout-service.");

  // Test 3: POST /api/agent (Start Investigation)
  console.log("👉 [3/6] POST /api/agent (Start Investigation)...");
  const agentStart = await fetchJSON("/api/agent", {
    method: "POST",
    body: JSON.stringify({ action: "start", incidentId: "inc-8921" })
  });
  if (agentStart.session.steps.length !== 5) {
    throw new Error(`Expected 5 investigation steps, got ${agentStart.session.steps.length}`);
  }
  if (!agentStart.session.isAwaitingApproval) {
    throw new Error("Agent should be awaiting human approval at step 5");
  }
  console.log("   ✅ Agent completed 5 investigation phases and paused at human approval gate.");

  // Test 4: POST /api/agent (Approve Action)
  console.log("👉 [4/6] POST /api/agent (Approve Remediating Action)...");
  const agentApprove = await fetchJSON("/api/agent", {
    method: "POST",
    body: JSON.stringify({ action: "approve", incidentId: "inc-8921", approved: true })
  });
  if (agentApprove.session.verificationVerdict !== "HEALTHY_CONFIRMED") {
    throw new Error(`Expected verification verdict HEALTHY_CONFIRMED, got ${agentApprove.session.verificationVerdict}`);
  }
  if (!agentApprove.session.postMortemReport) {
    throw new Error("Post-mortem report missing in approved session");
  }
  console.log("   ✅ Remediating action executed; deterministic probe verified resolution.");

  // Test 5: POST /api/actions (Direct Action Dispatch)
  console.log("👉 [5/6] POST /api/actions (Direct Action Execution)...");
  const actionRes = await fetchJSON("/api/actions", {
    method: "POST",
    body: JSON.stringify({
      actionId: "checkServiceHealth",
      input: { incidentId: "inc-8921" }
    })
  });
  if (!actionRes.success || !actionRes.data.isResolved) {
    throw new Error("Direct action dispatch failed or resolution check did not pass");
  }
  console.log("   ✅ Direct defineAction execution verified successfully.");

  // Test 6: GET / (Homepage HTML)
  console.log("👉 [6/6] GET / (Homepage Workspace UI)...");
  const htmlRes = await fetch(`${BASE_URL}/`);
  const htmlText = await htmlRes.text();
  if (!htmlText.includes("TraceBack AI")) {
    throw new Error("Homepage HTML does not contain 'TraceBack AI'");
  }
  console.log("   ✅ Homepage loaded with TraceBack AI brand and workspace UI.");

  console.log("\n🎉 ALL LIVE SERVER E2E TESTS PASSED!\n");
}

runE2E().catch((err) => {
  console.error("❌ E2E Test Failure:", err.message);
  process.exit(1);
});
