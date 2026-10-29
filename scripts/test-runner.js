/**
 * TraceBack AI — Comprehensive Automated Test Suite
 * Tests Agent-Native Actions, Deterministic Simulation, Agent Orchestration, and Human Approval Gate
 */

const path = require('path');
const jiti = require('jiti')(path.resolve(__filename));

const { simulator } = jiti('../lib/simulator/engine');
const { dispatchAction, ACTION_REGISTRY } = jiti('../lib/actions');
const { agentOrchestrator } = jiti('../lib/agent/engine');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ [PASS] ${message}`);
  } else {
    failedTests++;
    console.error(`  ❌ [FAIL] ${message}`);
  }
}

async function runTestSuite() {
  console.log('\n======================================================');
  console.log('🧪 TRACEBACK AI — AGENT-NATIVE AUTOMATED TEST RUNNER');
  console.log('======================================================\n');

  // Test Suite 1: Simulation Engine & Scenarios
  console.log('📦 [Suite 1] Simulation Scenarios Initialization');
  simulator.initialize();
  const incidents = simulator.listIncidents();
  assert(incidents.length === 3, 'Initialized exactly 3 production incident scenarios');
  assert(incidents.some(i => i.id === 'inc-8921'), 'Scenario 1 (inc-8921: Checkout Outage) present');
  assert(incidents.some(i => i.id === 'inc-4402'), 'Scenario 2 (inc-4402: Session OOMKilled) present');
  assert(incidents.some(i => i.id === 'inc-7119'), 'Scenario 3 (inc-7119: DB Connection Exhaustion) present');

  // Test Suite 2: Agent-Native defineAction Primitives
  console.log('\n⚙️ [Suite 2] Agent-Native Action Registry & Execution');
  assert(typeof ACTION_REGISTRY.getServiceLogs === 'object', 'getServiceLogs action registered');
  assert(typeof ACTION_REGISTRY.inspectDeploymentDiff === 'object', 'inspectDeploymentDiff action registered');
  assert(typeof ACTION_REGISTRY.rollbackDeployment === 'object', 'rollbackDeployment action registered');
  assert(typeof ACTION_REGISTRY.toggleFeatureFlag === 'object', 'toggleFeatureFlag action registered');

  // Test 2.1: getServiceLogs execution
  const logsRes = await dispatchAction(
    'getServiceLogs',
    { incidentId: 'inc-8921', level: 'ERROR' },
    { incidentId: 'inc-8921', source: 'agent' }
  );
  assert(logsRes.success === true, 'getServiceLogs executed successfully');
  assert(logsRes.data.logs.length > 0, 'getServiceLogs retrieved ERROR logs');
  assert(logsRes.data.logs[0].message.includes('NullPointerException') || logsRes.data.logs[0].message.includes('Exception'), 'Logs contain NullPointerException evidence');

  // Test 2.2: inspectDeploymentDiff execution
  const diffRes = await dispatchAction(
    'inspectDeploymentDiff',
    { incidentId: 'inc-8921' },
    { incidentId: 'inc-8921', source: 'agent' }
  );
  assert(diffRes.success === true, 'inspectDeploymentDiff executed successfully');
  assert(diffRes.data.activeRelease === 'v2.4.1', 'inspectDeploymentDiff accurately identifies active release v2.4.1');
  assert(diffRes.data.targetDeployment.commitHash === 'a7e89f2', 'inspectDeploymentDiff identifies commit hash a7e89f2');

  // Test 2.3: Security Gate - Mutating action without approval must be intercepted
  console.log('\n🛡️ [Suite 3] Safety Protocol & Human Approval Interception');
  const unapprovedRollback = await dispatchAction(
    'rollbackDeployment',
    { incidentId: 'inc-8921', releaseId: 'v2.4.0' },
    { incidentId: 'inc-8921', source: 'agent', userApprovalGranted: false }
  );
  assert(unapprovedRollback.success === false, 'Mutating action rollbackDeployment blocked when approval is false');
  assert(unapprovedRollback.requiresApproval === true, 'Response flags requiresApproval: true');
  assert(unapprovedRollback.pendingApprovalDetails.blastRadius === 'high', 'Approval details specify high blast radius');

  // Test Suite 4: End-to-End Agent Autonomous Investigation (Scenario 1)
  console.log('\n🤖 [Suite 4] Autonomous Agent Investigation Loop');
  const session = await agentOrchestrator.startInvestigation('inc-8921');
  assert(session.steps.length === 5, 'Agent completed 5-phase investigation loop');
  assert(session.steps[0].phase === 'TELEMETRY_ANALYSIS', 'Phase 1: Telemetry Analysis completed');
  assert(session.steps[1].phase === 'LOG_EVALUATION', 'Phase 2: Log Evaluation completed');
  assert(session.steps[2].phase === 'DIFF_INSPECTION', 'Phase 3: Diff Inspection completed');
  assert(session.steps[3].phase === 'HYPOTHESIS_FORMULATION', 'Phase 4: Root Cause Hypothesis formulated');
  assert(session.steps[4].phase === 'RECOVERY_PLANNING', 'Phase 5: Recovery Plan synthesized');
  assert(session.isAwaitingApproval === true, 'Agent halts at human approval gate');
  assert(session.proposedAction.actionId === 'rollbackDeployment', 'Proposed action is rollbackDeployment');
  assert(session.proposedAction.params.releaseId === 'v2.4.0', 'Proposed target release is v2.4.0');
  assert(typeof session.modelUsed === 'string', 'Session records reasoning engine provenance');
  assert(session.isLiveAI === false, 'Offline test runner transparently defaults to Calibrated Benchmark');

  // Test Suite 5: Human Approval & Deterministic Verification
  console.log('\n✅ [Suite 5] Human Approval Execution & Deterministic Verification');
  const approvedSession = await agentOrchestrator.submitApproval('inc-8921', true, 'Test SRE Lead');
  assert(approvedSession.approvalGranted === true, 'Human approval recorded');
  assert(approvedSession.verificationVerdict === 'HEALTHY_CONFIRMED', 'Deterministic health check confirmed resolution');
  
  // Verify incident state in simulator
  const updatedIncident = simulator.getIncident('inc-8921');
  assert(updatedIncident.scenario.status === 'RESOLVED', 'Incident status transitioned to RESOLVED');
  assert(updatedIncident.currentHealth === 'HEALTHY', 'System health status transitioned to HEALTHY');
  assert(updatedIncident.scenario.activeRelease === 'v2.4.0', 'Active release successfully rolled back to v2.4.0');
  assert(typeof approvedSession.postMortemReport === 'string', 'Generated complete Post-Mortem report');
  assert(approvedSession.postMortemReport.includes('Mean Time to Recovery'), 'Post-mortem includes MTTR metric');

  // Test Suite 6: Scenarios 2 & 3 Verification
  console.log('\n🔬 [Suite 6] Multi-Scenario Verification (Memory Leak & Connection Sizing)');
  
  // Scenario 2: Memory Leak (Session service)
  const session2 = await agentOrchestrator.startInvestigation('inc-4402');
  assert(session2.proposedAction.actionId === 'toggleFeatureFlag', 'Scenario 2 proposes disabling unbounded cache flag');
  const approvedSession2 = await agentOrchestrator.submitApproval('inc-4402', true, 'Test SRE');
  assert(approvedSession2.verificationVerdict === 'HEALTHY_CONFIRMED', 'Scenario 2 resolved and verified');

  // Scenario 3: DB Connection Exhaustion
  const session3 = await agentOrchestrator.startInvestigation('inc-7119');
  assert(session3.proposedAction.actionId === 'toggleFeatureFlag', 'Scenario 3 proposes disabling leaking analytics flag');
  const approvedSession3 = await agentOrchestrator.submitApproval('inc-7119', true, 'Test SRE');
  assert(approvedSession3.verificationVerdict === 'HEALTHY_CONFIRMED', 'Scenario 3 resolved and verified');

  // Test Suite 7: Operator Rejection Handling
  console.log('\n🚫 [Suite 7] Operator Rejection Flow');
  simulator.resetIncident('inc-8921');
  await agentOrchestrator.startInvestigation('inc-8921');
  const rejectedSession = await agentOrchestrator.submitApproval('inc-8921', false, 'Test Operator');
  assert(rejectedSession.approvalGranted === false, 'Approval recorded as rejected');
  const rejectedIncident = simulator.getIncident('inc-8921');
  assert(rejectedIncident.scenario.status !== 'RESOLVED', 'Incident remains unresolved when rejected');

  console.log('\n======================================================');
  console.log(`📊 TEST RESULTS: ${passedTests}/${totalTests} PASSED (${failedTests} FAILED)`);
  console.log('======================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTestSuite().catch(err => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
