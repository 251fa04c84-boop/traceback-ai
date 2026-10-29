import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const assetsDir = path.join(projectRoot, 'video_assets');
const outputDir = path.join(assetsDir, 'traceback_frames');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const tailwindPath = path.join(assetsDir, 'tailwind.js');
const tailwindScript = fs.existsSync(tailwindPath) ? fs.readFileSync(tailwindPath, 'utf-8') : '';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

function renderWorkspaceHTML({ activeTab = 'logs', agentState = 'idle', isResolved = false, showModal = false }) {
  const errorRate = isResolved ? '0.01%' : '42.8%';
  const errorColor = isResolved ? '#34d399' : '#f87171';
  const latency = isResolved ? '110ms' : '3450ms';
  const release = isResolved ? 'v2.4.0' : 'v2.4.1';
  const bannerBg = isResolved ? 'rgba(6, 78, 59, 0.25)' : 'rgba(136, 19, 55, 0.25)';
  const bannerBorder = isResolved ? 'rgba(52, 211, 153, 0.4)' : 'rgba(244, 63, 94, 0.4)';
  const statusText = isResolved ? 'VERIFIED RESOLVED — System Healthy' : 'CRITICAL OUTAGE — Active Degraded State';
  const statusBadge = isResolved ? 'bg-emerald-500' : 'bg-rose-500';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>TraceBack AI Workspace</title>
  <script>${tailwindScript}</script>
  <style>
    body {
      margin: 0;
      padding: 0;
      width: 1920px;
      height: 1080px;
      background: #020617;
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      overflow: hidden;
      box-sizing: border-box;
    }
    .font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
  </style>
</head>
<body class="flex flex-col h-full bg-slate-950 text-slate-100">
  <!-- Top Navigation -->
  <header class="border-b border-slate-800 bg-slate-900/90 px-8 py-4 flex items-center justify-between">
    <div class="flex items-center gap-3.5">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-rose-500 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-indigo-500/25">
        ⚡
      </div>
      <div>
        <div class="flex items-center gap-2.5">
          <h1 class="font-bold text-xl text-white tracking-tight">TraceBack AI</h1>
          <span class="text-[11px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
            Builder.io Agent-Native
          </span>
        </div>
        <p class="text-xs text-slate-400 mt-0.5">Production Incident Investigation & Recovery Workspace</p>
      </div>
    </div>

    <!-- Incident Switcher Tabs -->
    <div class="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
      <div class="px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-800 text-white shadow border border-slate-700 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full ${isResolved ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}"></span>
        <span>checkout-service (#INC-8921)</span>
      </div>
      <div class="px-3.5 py-2 rounded-lg text-xs font-medium text-slate-400 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
        <span>session-auth-service (#INC-4402)</span>
      </div>
      <div class="px-3.5 py-2 rounded-lg text-xs font-medium text-slate-400 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
        <span>postgres-analytics (#INC-7119)</span>
      </div>
    </div>

    <!-- Controls -->
    <div class="flex items-center gap-2.5">
      <div class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-950/40 text-purple-300 border border-purple-500/40 flex items-center gap-1.5">
        <span>✨ Engine: Live Gemini 1.5 Flash</span>
      </div>
      <div class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1.5">
        <span>🔄 Reset State</span>
      </div>
      ${isResolved ? `
      <div class="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 flex items-center gap-1.5">
        <span>📄 View Post-Mortem</span>
      </div>` : ''}
    </div>
  </header>

  <!-- Main Body Content (2 Columns) -->
  <main class="flex-1 flex p-6 gap-6 overflow-hidden">
    <!-- Left Column: Incident Telemetry & Evidence Explorer (60%) -->
    <div class="w-7/12 flex flex-col gap-5">
      <!-- Incident Status Banner -->
      <div class="p-5 rounded-2xl border transition-all" style="background: ${bannerBg}; border-color: ${bannerBorder};">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2.5">
            <span class="px-2.5 py-1 rounded text-xs font-black tracking-wide uppercase ${isResolved ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}">
              ${isResolved ? 'RESOLVED' : 'CRITICAL'}
            </span>
            <span class="text-xs font-mono text-slate-400">#INC-8921</span>
            <span class="text-xs px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono font-semibold">checkout-service</span>
          </div>
          <div class="text-xs text-slate-400 font-mono">Detected: 21:40:00 UTC (8m ago)</div>
        </div>

        <h2 class="text-lg font-black text-white mb-1.5">Checkout Outage: HTTP 500 Spike Following Release v2.4.1</h2>
        <p class="text-xs text-slate-300 mb-4 leading-relaxed">
          Critical payment gateway endpoint failing for customer checkouts immediately after container image activation. Downstream circuit breaker tripped.
        </p>

        <!-- KPI Grid -->
        <div class="grid grid-cols-4 gap-3 pt-3.5 border-t border-slate-800/80 text-xs">
          <div>
            <span class="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Active Release</span>
            <span class="font-mono font-bold text-white text-sm">${release}</span>
          </div>
          <div>
            <span class="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">5xx Error Rate</span>
            <span class="font-mono font-black text-sm" style="color: ${errorColor};">${errorRate}</span>
          </div>
          <div>
            <span class="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">p99 Latency</span>
            <span class="font-mono font-bold text-slate-200 text-sm">${latency}</span>
          </div>
          <div>
            <span class="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Health Status</span>
            <span class="font-bold text-xs uppercase" style="color: ${errorColor};">${statusText}</span>
          </div>
        </div>
      </div>

      <!-- Telemetry Tab Explorer -->
      <div class="flex-1 bg-slate-900/70 border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-xl">
        <div class="flex items-center justify-between border-b border-slate-800 px-5 bg-slate-900/90">
          <div class="flex items-center gap-2">
            <button class="px-4 py-3.5 text-xs font-bold border-b-2 ${activeTab === 'logs' ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5' : 'border-transparent text-slate-400'}">
              Container Logs (4)
            </button>
            <button class="px-4 py-3.5 text-xs font-bold border-b-2 ${activeTab === 'diff' ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5' : 'border-transparent text-slate-400'}">
              Deployment Diff
            </button>
            <button class="px-4 py-3.5 text-xs font-bold border-b-2 ${activeTab === 'actions' ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5' : 'border-transparent text-slate-400'}">
              ⚡ Symmetrical Actions
            </button>
          </div>
        </div>

        <div class="p-5 flex-1 overflow-hidden font-mono text-xs">
          ${activeTab === 'logs' ? `
            <div class="space-y-3">
              <div class="p-3.5 rounded-xl border bg-rose-950/30 border-rose-900/40 text-rose-200">
                <div class="flex items-center justify-between text-[11px] mb-1.5 font-bold">
                  <span class="px-1.5 py-0.5 rounded bg-rose-500/30 text-rose-300 uppercase">ERROR</span>
                  <span class="text-slate-400">21:40:15 UTC</span>
                </div>
                <div class="font-bold">Unhandled NullPointerException processing checkout order #cus_98412</div>
                <pre class="mt-2 p-2.5 rounded bg-slate-950/90 text-rose-300 text-[11px] border border-slate-800 whitespace-pre-wrap leading-relaxed">java.lang.NullPointerException: Cannot invoke "Coupon.getCode()" because "request.getCoupon()" is null
    at com.app.checkout.PaymentGatewayController.processOrder(PaymentGatewayController.java:142)
    at com.app.checkout.OrderDispatcher.dispatch(OrderDispatcher.java:88)</pre>
              </div>

              <div class="p-3 rounded-xl border bg-amber-950/20 border-amber-900/30 text-amber-200">
                <div class="flex items-center justify-between text-[11px] mb-1 font-bold">
                  <span class="px-1.5 py-0.5 rounded bg-amber-500/30 text-amber-300 uppercase">WARN</span>
                  <span class="text-slate-400">21:40:02 UTC</span>
                </div>
                <div>Circuit breaker TRIPPED for downstream payment gateway (failure threshold > 30%)</div>
              </div>
            </div>
          ` : activeTab === 'diff' ? `
            <div class="border border-slate-800 rounded-xl p-4 bg-slate-950/60">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-white text-sm">Release v2.4.1</span>
                  <span class="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px]">commit a7e89f2</span>
                  <span class="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[11px] font-bold border border-rose-500/30">INTRODUCED REGRESSION</span>
                </div>
                <span class="text-slate-400 text-xs">Author: Alex Rivera (@dev-alex)</span>
              </div>
              <p class="text-slate-300 text-xs mb-3 font-sans">feat(checkout): add promotional coupon auto-apply on cart payload</p>
              <pre class="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-emerald-400 leading-relaxed">--- a/src/main/java/com/app/checkout/PaymentGatewayController.java
+++ b/src/main/java/com/app/checkout/PaymentGatewayController.java
@@ -139,7 +139,7 @@ public class PaymentGatewayController {
     public OrderResult processOrder(CheckoutRequest request) {
-        String coupon = request.getCoupon() != null ? request.getCoupon().getCode() : "NONE";
+        String coupon = request.getCoupon().getCode(); // BUG: Unchecked null dereference when coupon omitted!
         PaymentIntent intent = paymentService.createIntent(request.getAmount(), coupon);
         return orderDispatcher.dispatch(intent);
     }</pre>
            </div>
          ` : `
            <div class="space-y-3 font-sans">
              <div class="p-3.5 bg-indigo-950/30 border border-indigo-500/30 rounded-xl text-slate-300 text-xs">
                <span class="font-bold text-white block mb-1">⚡ Symmetrical Agent-Native Actions</span>
                Capabilities are defined once with <code class="text-indigo-300 font-mono">defineAction</code>. Both human engineers and autonomous agents invoke the exact same action primitives.
              </div>

              <div class="grid grid-cols-2 gap-3 font-mono text-xs">
                <div class="p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-indigo-500/50">
                  <div class="flex items-center justify-between font-bold text-white">
                    <span>checkServiceHealth()</span>
                    <span class="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">READ</span>
                  </div>
                  <p class="text-[11px] text-slate-400 font-sans mt-1">Dispatches deterministic health probes against endpoint /healthz</p>
                </div>

                <div class="p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-indigo-500/50">
                  <div class="flex items-center justify-between font-bold text-white">
                    <span>inspectDeploymentDiff()</span>
                    <span class="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">READ</span>
                  </div>
                  <p class="text-[11px] text-slate-400 font-sans mt-1">Fetches git commit diff and author metadata for active release</p>
                </div>

                <div class="p-3 bg-slate-950 border border-rose-900/50 rounded-xl hover:border-rose-500/50">
                  <div class="flex items-center justify-between font-bold text-rose-300">
                    <span>rollbackDeployment()</span>
                    <span class="text-[10px] px-1.5 py-0.5 rounded bg-rose-950 text-rose-300">MUTATING</span>
                  </div>
                  <p class="text-[11px] text-slate-400 font-sans mt-1">Reverts container image to last known stable release v2.4.0</p>
                </div>

                <div class="p-3 bg-slate-950 border border-amber-900/50 rounded-xl hover:border-amber-500/50">
                  <div class="flex items-center justify-between font-bold text-amber-300">
                    <span>toggleFeatureFlag()</span>
                    <span class="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300">MUTATING</span>
                  </div>
                  <p class="text-[11px] text-slate-400 font-sans mt-1">Toggles operational feature flags in production cluster</p>
                </div>
              </div>
            </div>
          `}
        </div>
      </div>
    </div>

    <!-- Right Column: Autonomous Agent Co-Pilot Stream (40%) -->
    <div class="w-5/12 flex flex-col gap-5">
      <!-- Agent Co-Pilot Header Card -->
      <div class="bg-gradient-to-br from-slate-900 to-indigo-950/50 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="text-indigo-400 font-black">✦</span>
            <h3 class="font-bold text-sm text-white">Autonomous Agent Co-Pilot</h3>
          </div>
          <span class="text-[11px] px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold">
            Live AI: Gemini 1.5 Flash
          </span>
        </div>
        <p class="text-xs text-slate-300 leading-relaxed mb-3">
          Agent autonomously dispatches shared <code class="text-indigo-300 font-mono">defineAction</code> tools, correlates telemetry logs with git diffs, and intercepts for human approval.
        </p>

        ${agentState === 'idle' ? `
          <div class="w-full py-3 px-4 rounded-xl bg-indigo-600 text-white font-bold text-xs text-center shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2">
            <span>▶</span> Start Autonomous Investigation
          </div>
        ` : `
          <div class="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
            <div class="flex items-center gap-2 font-bold ${isResolved ? 'text-emerald-400' : 'text-amber-400'}">
              <span class="w-2.5 h-2.5 rounded-full ${isResolved ? 'bg-emerald-500' : 'bg-amber-400 animate-ping'}"></span>
              <span>${isResolved ? 'Resolution Verified Deterministically' : 'Human Approval Required'}</span>
            </div>
            <span class="text-xs text-slate-400 font-mono">5 Steps Completed</span>
          </div>
        `}
      </div>

      <!-- Human Approval Card (Prominently shown in step 4/5) -->
      ${agentState === 'approval' || agentState === 'investigating' ? `
        <div class="bg-amber-950/30 border-2 border-amber-500/60 rounded-2xl p-5 shadow-2xl animate-in">
          <div class="flex items-center gap-2 text-amber-400 mb-1.5 font-black text-xs uppercase tracking-wider">
            <span>🛡️</span> HUMAN APPROVAL GATE INTERCEPTION
          </div>
          <h4 class="text-white font-bold text-sm mb-1">
            Proposed Action: <code class="text-amber-300 font-mono">rollbackDeployment(releaseId: 'v2.4.0')</code>
          </h4>
          <p class="text-xs text-slate-300 mb-3">
            Revert checkout-service container from degraded v2.4.1 to stable release v2.4.0 to eliminate null-pointer exceptions.
          </p>

          <div class="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs font-mono mb-4">
            <div class="text-slate-400 text-[10px] uppercase font-bold">Execution Payload:</div>
            <div class="text-amber-200 mt-1">{ "service": "checkout-service", "releaseId": "v2.4.0" }</div>
            <div class="text-slate-400 text-[10px] uppercase font-bold mt-2">
              Blast Radius: <span class="text-rose-400 font-bold">HIGH (Cluster Pod Rescheduling)</span>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div class="flex-1 py-3 px-4 rounded-xl bg-emerald-600 text-white font-bold text-xs text-center shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2">
              <span>✓</span> Authorize & Execute Rollback
            </div>
            <div class="py-3 px-4 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs text-center border border-slate-700">
              Reject
            </div>
          </div>
        </div>
      ` : ''}

      <!-- Investigation Timeline Stream -->
      <div class="flex-1 bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col overflow-hidden">
        <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <span>📊</span> Investigation Stream & Evidence Citations
        </div>

        <div class="space-y-3.5 overflow-hidden text-xs">
          <div class="border-l-2 border-emerald-500 pl-4 py-0.5">
            <div class="font-bold text-slate-200">1. Analyze Real-Time Telemetry & Alert Thresholds</div>
            <div class="text-[10px] font-mono text-indigo-300 mt-0.5">dispatched: getTelemetryMetrics()</div>
            <div class="text-slate-300 text-[11px] mt-1 bg-slate-950/50 p-2 rounded-lg border border-slate-800">
              5xx Error Rate spiked to 42.8% on checkout-service. Alert threshold (>1%) exceeded.
            </div>
          </div>

          <div class="border-l-2 border-emerald-500 pl-4 py-0.5">
            <div class="font-bold text-slate-200">2. Query Container Logs & Extract Stack Traces</div>
            <div class="text-[10px] font-mono text-indigo-300 mt-0.5">dispatched: getServiceLogs(level: 'ERROR')</div>
            <div class="text-slate-300 text-[11px] mt-1 bg-slate-950/50 p-2 rounded-lg border border-slate-800">
              Extracted NullPointerException in PaymentGatewayController.java:142 on null coupon payload.
            </div>
          </div>

          <div class="border-l-2 border-emerald-500 pl-4 py-0.5">
            <div class="font-bold text-slate-200">3. Inspect Recent Deployments & Git Diffs</div>
            <div class="text-[10px] font-mono text-indigo-300 mt-0.5">dispatched: inspectDeploymentDiff()</div>
            <div class="text-slate-300 text-[11px] mt-1 bg-slate-950/50 p-2 rounded-lg border border-slate-800">
              Commit a7e89f2 by @Alex Rivera removed defensive null check on coupon object.
            </div>
          </div>

          <div class="border-l-2 border-emerald-500 pl-4 py-0.5">
            <div class="font-bold text-slate-200">4. Ground Root Cause Hypothesis with Cited Evidence</div>
            <div class="text-slate-300 text-[11px] mt-1 bg-slate-950/50 p-2 rounded-lg border border-slate-800">
              Hypothesis: v2.4.1 deployment introduced breaking NPE regression on carts without promo codes.
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>

  <!-- Post-Mortem Modal (Scene 7) -->
  ${showModal ? `
    <div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8">
      <div class="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        <div class="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950">
          <div class="flex items-center gap-3">
            <span class="text-xl">📄</span>
            <h3 class="font-bold text-base text-white">Production Incident Post-Mortem & Verified Audit Trail</h3>
          </div>
          <div class="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold shadow">
            Export Markdown
          </div>
        </div>

        <div class="p-6 overflow-auto font-mono text-xs text-slate-200 space-y-4 leading-relaxed">
          <div class="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <strong>Incident ID:</strong> #INC-8921 | <strong>Service:</strong> checkout-service<br/>
            <strong>Root Cause:</strong> NullPointerException in PaymentGatewayController.java:142 introduced in release v2.4.1 (commit a7e89f2).<br/>
            <strong>Mean Time to Recovery (MTTR):</strong> 4 minutes | <strong>Resolution:</strong> Deterministically verified via health probe (200 OK).
          </div>

          <table class="w-full text-left border-collapse border border-slate-800 text-[11px]">
            <tr class="bg-slate-800/60 text-slate-300">
              <th class="p-2 border border-slate-700">Time</th>
              <th class="p-2 border border-slate-700">Action Dispatched</th>
              <th class="p-2 border border-slate-700">Executed By</th>
              <th class="p-2 border border-slate-700">Status</th>
              <th class="p-2 border border-slate-700">Outcome / Verification</th>
            </tr>
            <tr>
              <td class="p-2 border border-slate-800">21:40:00</td>
              <td class="p-2 border border-slate-800">systemAlert</td>
              <td class="p-2 border border-slate-800 font-bold text-indigo-400">AGENT</td>
              <td class="p-2 border border-slate-800 text-emerald-400">SUCCESS</td>
              <td class="p-2 border border-slate-800">Automated pager alert triggered: HTTP 500 spike > 40%</td>
            </tr>
            <tr>
              <td class="p-2 border border-slate-800">21:40:30</td>
              <td class="p-2 border border-slate-800">getServiceLogs</td>
              <td class="p-2 border border-slate-800 font-bold text-indigo-400">AGENT</td>
              <td class="p-2 border border-slate-800 text-emerald-400">SUCCESS</td>
              <td class="p-2 border border-slate-800">Extracted NPE stack trace at line 142</td>
            </tr>
            <tr>
              <td class="p-2 border border-slate-800">21:41:00</td>
              <td class="p-2 border border-slate-800">inspectDeploymentDiff</td>
              <td class="p-2 border border-slate-800 font-bold text-indigo-400">AGENT</td>
              <td class="p-2 border border-slate-800 text-emerald-400">SUCCESS</td>
              <td class="p-2 border border-slate-800">Correlated with commit a7e89f2 by @Alex Rivera</td>
            </tr>
            <tr>
              <td class="p-2 border border-slate-800">21:42:00</td>
              <td class="p-2 border border-slate-800">rollbackDeployment</td>
              <td class="p-2 border border-slate-800 font-bold text-emerald-400">HUMAN (Lead SRE)</td>
              <td class="p-2 border border-slate-800 text-emerald-400">SUCCESS</td>
              <td class="p-2 border border-slate-800">Rolled back to v2.4.0 after human authorization</td>
            </tr>
            <tr>
              <td class="p-2 border border-slate-800">21:43:00</td>
              <td class="p-2 border border-slate-800">checkServiceHealth</td>
              <td class="p-2 border border-slate-800 font-bold text-indigo-400">AGENT</td>
              <td class="p-2 border border-slate-800 text-emerald-400">PASSED</td>
              <td class="p-2 border border-slate-800">Health probe 200 OK; error rate nominal (0.01%)</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  ` : ''}

  <!-- Footer -->
  <footer class="border-t border-slate-800/80 bg-slate-950 px-8 py-3 flex items-center justify-between text-xs text-slate-400">
    <span>TraceBack AI — Built for Builder.io Agent-Native Hackathon 2026</span>
    <div class="flex items-center gap-4 text-[11px]">
      <span>Symmetrical defineAction Primitives</span>
      <span>•</span>
      <span>Deterministic Probes</span>
      <span>•</span>
      <span>Human-in-the-Loop Safe</span>
    </div>
  </footer>
</body>
</html>
  `;
}

async function captureAllFrames() {
  console.log('🚀 Launching Chrome to render pixel-perfect TraceBack AI scenes...');
  const tempProfile = path.join(os.tmpdir(), 'chrome_tb_' + Date.now());
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    userDataDir: tempProfile,
    defaultViewport: { width: 1920, height: 1080, deviceScaleFactor: 1 },
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--no-first-run',
      '--no-default-browser-check'
    ]
  });

  const page = await browser.newPage();

  const sceneConfigs = [
    { name: 'scene1_problem.png', config: { activeTab: 'logs', agentState: 'idle', isResolved: false, showModal: false } },
    { name: 'scene2_diff.png', config: { activeTab: 'diff', agentState: 'idle', isResolved: false, showModal: false } },
    { name: 'scene3_actions.png', config: { activeTab: 'actions', agentState: 'idle', isResolved: false, showModal: false } },
    { name: 'scene4_investigation.png', config: { activeTab: 'diff', agentState: 'investigating', isResolved: false, showModal: false } },
    { name: 'scene5_approval.png', config: { activeTab: 'diff', agentState: 'approval', isResolved: false, showModal: false } },
    { name: 'scene6_resolved.png', config: { activeTab: 'actions', agentState: 'resolved', isResolved: true, showModal: false } },
    { name: 'scene7_postmortem.png', config: { activeTab: 'logs', agentState: 'resolved', isResolved: true, showModal: true } }
  ];

  for (const sc of sceneConfigs) {
    console.log(`  -> Rendering and capturing [${sc.name}]...`);
    const html = renderWorkspaceHTML(sc.config);
    await page.setContent(html, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 600));
    const outPath = path.join(outputDir, sc.name);
    await page.screenshot({ path: outPath, fullPage: false });
    console.log(`     ✅ Saved: ${outPath}`);
  }

  await browser.close();
  console.log('🎉 All 7 authentic TraceBack AI scenes generated with 100% fidelity!');
}

captureAllFrames().catch(err => {
  console.error('Fatal capture error:', err);
  process.exit(1);
});
