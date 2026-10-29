"use client";

import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Terminal,
  GitCommit,
  Activity,
  ShieldAlert,
  ShieldCheck,
  RotateCcw,
  Play,
  ArrowRight,
  Server,
  FileCode,
  Check,
  X,
  FileText,
  Copy,
  ExternalLink,
  Cpu,
  Layers,
  ChevronRight,
  Sparkles,
  Key,
  Settings,
  Zap
} from "lucide-react";

interface IncidentSummary {
  id: string;
  title: string;
  severity: string;
  service: string;
  status: string;
  currentHealth: string;
}

interface IncidentDetail {
  id: string;
  title: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  service: string;
  description: string;
  detectedAt: string;
  activeRelease: string;
  stableRelease: string;
  status: string;
  metrics: {
    time: string;
    errorRate: number;
    latencyP99: number;
    cpuUsage: number;
    memoryUsage: number;
    activeConnections?: number;
  }[];
  logs: {
    id: string;
    timestamp: string;
    level: "ERROR" | "WARN" | "INFO";
    service: string;
    message: string;
    stackTrace?: string;
  }[];
  deployments: {
    releaseId: string;
    commitHash: string;
    author: string;
    timestamp: string;
    service: string;
    summary: string;
    diff: string;
    isStable: boolean;
  }[];
  featureFlags: {
    id: string;
    name: string;
    description: string;
    enabled: boolean;
    service: string;
  }[];
}

interface AgentSession {
  incidentId: string;
  service: string;
  currentStepIndex: number;
  steps: {
    id: string;
    stepNumber: number;
    title: string;
    phase: string;
    status: string;
    actionDispatched?: string;
    actionOutput?: any;
    evidenceCited: string[];
    thought: string;
    timestamp: string;
    recoveryProposal?: {
      actionId: string;
      params: any;
      reason: string;
      blastRadius: "low" | "medium" | "high" | "critical";
    };
  }[];
  hypothesis: string | null;
  proposedAction: {
    actionId: string;
    params: any;
    reason: string;
    blastRadius: "low" | "medium" | "high" | "critical";
  } | null;
  isAwaitingApproval: boolean;
  approvalGranted: boolean;
  verificationVerdict: "UNVERIFIED" | "HEALTHY_CONFIRMED" | "FAILED" | null;
  postMortemReport: string | null;
  modelUsed?: string;
  isLiveAI?: boolean;
}

export default function TraceBackWorkspace() {
  const [incidents, setIncidents] = useState<IncidentSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string>("inc-8921");
  const [activeIncident, setActiveIncident] = useState<IncidentDetail | null>(null);
  const [agentSession, setAgentSession] = useState<AgentSession | null>(null);
  const [isInvestigating, setIsInvestigating] = useState(false);
  const [telemetryTab, setTelemetryTab] = useState<"logs" | "diff" | "metrics" | "actions">("logs");
  const [logFilter, setLogFilter] = useState<"ALL" | "ERROR" | "WARN">("ALL");
  const [showPostMortemModal, setShowPostMortemModal] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [geminiKey, setGeminiKey] = useState<string>("");
  const [copiedReport, setCopiedReport] = useState(false);
  const [manualActionOutput, setManualActionOutput] = useState<string | null>(null);
  const [isExecutingManual, setIsExecutingManual] = useState(false);

  // Fetch all incidents
  const loadIncidents = async () => {
    try {
      const res = await fetch("/api/incidents");
      const data = await res.json();
      if (data.incidents) {
        setIncidents(data.incidents);
      }
    } catch (e) {
      console.error("Failed to load incidents:", e);
    }
  };

  // Fetch single incident details
  const loadIncidentDetail = async (id: string) => {
    try {
      const res = await fetch(`/api/incidents?id=${id}`);
      const data = await res.json();
      if (data.incident) {
        setActiveIncident(data.incident.scenario);
      }
    } catch (e) {
      console.error("Failed to load incident detail:", e);
    }
  };

  // Fetch agent session
  const loadAgentSession = async (id: string) => {
    try {
      const res = await fetch(`/api/agent?incidentId=${id}`);
      const data = await res.json();
      if (data.session) {
        setAgentSession(data.session);
      } else {
        setAgentSession(null);
      }
    } catch (e) {
      console.error("Failed to load agent session:", e);
    }
  };

  useEffect(() => {
    loadIncidents();
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("tb_gemini_key");
      if (saved) setGeminiKey(saved);
    }
  }, []);

  useEffect(() => {
    if (selectedId) {
      loadIncidentDetail(selectedId);
      loadAgentSession(selectedId);
    }
  }, [selectedId]);

  const saveGeminiKey = (key: string) => {
    setGeminiKey(key);
    if (typeof window !== "undefined") {
      localStorage.setItem("tb_gemini_key", key);
    }
    setShowKeyModal(false);
  };

  // Start Autonomous Investigation
  const handleStartInvestigation = async () => {
    if (!selectedId) return;
    setIsInvestigating(true);
    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "start",
          incidentId: selectedId,
          apiKey: geminiKey || undefined
        })
      });
      const data = await res.json();
      if (data.session) {
        setAgentSession(data.session);
      }
    } catch (e) {
      console.error("Investigation failed:", e);
    } finally {
      setIsInvestigating(false);
    }
  };

  // Human Manual Action Dispatch (demonstrating symmetrical defineAction capabilities)
  const executeManualAction = async (actionId: string, inputParams: any = {}) => {
    if (!selectedId) return;
    setIsExecutingManual(true);
    setManualActionOutput(null);
    try {
      const res = await fetch("/api/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actionId,
          input: { incidentId: selectedId, ...inputParams },
          source: "human",
          userApprovalGranted: true
        })
      });
      const data = await res.json();
      setManualActionOutput(JSON.stringify(data, null, 2));
      await loadIncidentDetail(selectedId);
      await loadIncidents();
    } catch (e: any) {
      setManualActionOutput(`Error: ${e.message}`);
    } finally {
      setIsExecutingManual(false);
    }
  };

  // Human Approval Action
  const handleApproval = async (approved: boolean) => {
    if (!selectedId) return;
    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "approve",
          incidentId: selectedId,
          approved,
          approverName: "Alex Rivera (Lead SRE)"
        })
      });
      const data = await res.json();
      if (data.session) {
        setAgentSession(data.session);
        await loadIncidentDetail(selectedId);
        await loadIncidents();
      }
    } catch (e) {
      console.error("Approval submit failed:", e);
    }
  };

  // Reset Incident Scenario
  const handleReset = async () => {
    if (!selectedId) return;
    try {
      await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset", incidentId: selectedId })
      });
      setAgentSession(null);
      await loadIncidentDetail(selectedId);
      await loadIncidents();
    } catch (e) {
      console.error("Reset failed:", e);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  const currentMetrics = activeIncident?.metrics?.[activeIncident.metrics.length - 1];
  const isHealthy = activeIncident?.status === "RESOLVED";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-40 px-4 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-indigo-600 to-rose-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg text-white tracking-tight">TraceBack AI</h1>
              <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Agent-Native
              </span>
            </div>
            <p className="text-xs text-slate-400">Builder.io Incident Investigation & Recovery Workspace</p>
          </div>
        </div>

        {/* Global Incident Switcher */}
        <div className="flex items-center gap-2 bg-slate-950/60 p-1 rounded-lg border border-slate-800">
          {incidents.map((inc) => (
            <button
              key={inc.id}
              onClick={() => setSelectedId(inc.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-2 ${
                selectedId === inc.id
                  ? "bg-slate-800 text-white shadow border border-slate-700"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  inc.status === "RESOLVED"
                    ? "bg-emerald-500"
                    : inc.severity === "CRITICAL"
                    ? "bg-rose-500 animate-pulse"
                    : "bg-amber-500"
                }`}
              />
              <span className="truncate max-w-[120px] lg:max-w-none">{inc.service}</span>
            </button>
          ))}
        </div>

        {/* Reset & AI Model & Docs links */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowKeyModal(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border transition ${
              geminiKey
                ? "bg-purple-950/40 text-purple-300 border-purple-500/40 hover:bg-purple-900/50"
                : "bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700"
            }`}
            title="Configure Live Gemini API Key or use Deterministic Engine"
          >
            <Key className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">{geminiKey ? "Gemini Live" : "AI Mode"}</span>
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset State
          </button>
          {agentSession?.postMortemReport && (
            <button
              onClick={() => setShowPostMortemModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition"
            >
              <FileText className="w-3.5 h-3.5" />
              Post-Mortem
            </button>
          )}
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="flex-1 flex flex-col lg:flex-row p-4 lg:p-6 gap-6 max-w-7xl mx-auto w-full">
        {/* Left Column: Live Incident Context & Telemetry Explorer */}
        <div className="w-full lg:w-7/12 flex flex-col gap-5">
          {/* Active Incident Banner */}
          {activeIncident && (
            <div
              className={`p-5 rounded-xl border backdrop-blur transition-all ${
                isHealthy
                  ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-100"
                  : "bg-rose-950/20 border-rose-500/30 text-rose-100"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`px-2.5 py-1 rounded text-xs font-bold tracking-wide uppercase ${
                      isHealthy
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                    }`}
                  >
                    {activeIncident.severity}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{activeIncident.id}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                    {activeIncident.service}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-400">Detected:</span>
                  <span className="font-mono text-slate-300">
                    {new Date(activeIncident.detectedAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              <h2 className="text-base lg:text-lg font-bold text-white mb-2">{activeIncident.title}</h2>
              <p className="text-xs lg:text-sm text-slate-300 mb-4">{activeIncident.description}</p>

              {/* Status and Active Release Pill Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-800/60 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Active Release</span>
                  <span className="font-mono font-semibold text-white">{activeIncident.activeRelease}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">HTTP Error Rate</span>
                  <span
                    className={`font-mono font-bold ${
                      (currentMetrics?.errorRate || 0) > 1 ? "text-rose-400" : "text-emerald-400"
                    }`}
                  >
                    {currentMetrics?.errorRate}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">p99 Latency</span>
                  <span className="font-mono font-semibold text-slate-200">{currentMetrics?.latencyP99}ms</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Health Status</span>
                  <span
                    className={`font-semibold uppercase text-[11px] ${
                      isHealthy ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {isHealthy ? "Verified Resolved" : "Degraded (Outage)"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Telemetry Tabs Section */}
          <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 px-4 bg-slate-900/90">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setTelemetryTab("logs")}
                  className={`px-3.5 py-3 text-xs font-semibold border-b-2 transition flex items-center gap-2 ${
                    telemetryTab === "logs"
                      ? "border-indigo-500 text-indigo-400 bg-indigo-500/5"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  Service Logs ({activeIncident?.logs.length || 0})
                </button>
                <button
                  onClick={() => setTelemetryTab("diff")}
                  className={`px-3.5 py-3 text-xs font-semibold border-b-2 transition flex items-center gap-2 ${
                    telemetryTab === "diff"
                      ? "border-indigo-500 text-indigo-400 bg-indigo-500/5"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <GitCommit className="w-3.5 h-3.5" />
                  Deployment Diff
                </button>
                <button
                  onClick={() => setTelemetryTab("metrics")}
                  className={`px-3.5 py-3 text-xs font-semibold border-b-2 transition flex items-center gap-2 ${
                    telemetryTab === "metrics"
                      ? "border-indigo-500 text-indigo-400 bg-indigo-500/5"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  Metrics Timeseries
                </button>
                <button
                  onClick={() => setTelemetryTab("actions")}
                  className={`px-3.5 py-3 text-xs font-semibold border-b-2 transition flex items-center gap-2 ${
                    telemetryTab === "actions"
                      ? "border-indigo-500 text-indigo-400 bg-indigo-500/5"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Shared Actions
                </button>
              </div>

              {telemetryTab === "logs" && (
                <div className="flex items-center gap-1.5 text-[11px]">
                  <button
                    onClick={() => setLogFilter("ALL")}
                    className={`px-2 py-0.5 rounded ${
                      logFilter === "ALL" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setLogFilter("ERROR")}
                    className={`px-2 py-0.5 rounded ${
                      logFilter === "ERROR" ? "bg-rose-500/20 text-rose-300 font-bold" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Errors
                  </button>
                </div>
              )}
            </div>

            {/* Tab Contents */}
            <div className="p-4 flex-1 overflow-auto max-h-[460px] font-mono text-xs">
              {/* Tab 1: Logs */}
              {telemetryTab === "logs" && (
                <div className="space-y-3">
                  {activeIncident?.logs
                    .filter((log) => (logFilter === "ALL" ? true : log.level === logFilter))
                    .map((log) => (
                      <div
                        key={log.id}
                        className={`p-3 rounded-lg border transition ${
                          log.level === "ERROR"
                            ? "bg-rose-950/20 border-rose-900/40 text-rose-200"
                            : log.level === "WARN"
                            ? "bg-amber-950/20 border-amber-900/40 text-amber-200"
                            : "bg-slate-950/40 border-slate-800 text-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] mb-1.5">
                          <span
                            className={`px-1.5 py-0.2 rounded font-bold uppercase ${
                              log.level === "ERROR"
                                ? "bg-rose-500/30 text-rose-300"
                                : log.level === "WARN"
                                ? "bg-amber-500/30 text-amber-300"
                                : "bg-slate-700 text-slate-300"
                            }`}
                          >
                            {log.level}
                          </span>
                          <span className="text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p className="font-semibold">{log.message}</p>
                        {log.stackTrace && (
                          <pre className="mt-2 p-2.5 rounded bg-slate-950/80 border border-slate-800/80 text-[10.5px] text-rose-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                            {log.stackTrace}
                          </pre>
                        )}
                      </div>
                    ))}
                </div>
              )}

              {/* Tab 2: Deployment Diff */}
              {telemetryTab === "diff" && activeIncident?.deployments && (
                <div className="space-y-4">
                  {activeIncident.deployments.map((dep) => (
                    <div key={dep.releaseId} className="border border-slate-800 rounded-lg p-3 bg-slate-950/40">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{dep.releaseId}</span>
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                            {dep.commitHash}
                          </span>
                          {dep.releaseId === activeIncident.activeRelease && (
                            <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 text-[10px] font-semibold border border-indigo-500/30">
                              ACTIVE IN PROD
                            </span>
                          )}
                        </div>
                        <span className="text-slate-400 text-[11px]">{dep.author}</span>
                      </div>
                      <p className="text-slate-300 text-xs mb-2.5">{dep.summary}</p>
                      <pre className="p-3 rounded bg-slate-950 border border-slate-800/80 text-[11px] text-emerald-400 overflow-x-auto whitespace-pre leading-relaxed">
                        {dep.diff}
                      </pre>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 3: Metrics */}
              {telemetryTab === "metrics" && activeIncident?.metrics && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-lg">
                      <span className="text-[10px] text-slate-400 block uppercase font-semibold">Latest Error Rate</span>
                      <span className="text-lg font-bold text-rose-400">{currentMetrics?.errorRate}%</span>
                    </div>
                    <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-lg">
                      <span className="text-[10px] text-slate-400 block uppercase font-semibold">p99 Latency</span>
                      <span className="text-lg font-bold text-amber-400">{currentMetrics?.latencyP99}ms</span>
                    </div>
                    <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-lg">
                      <span className="text-[10px] text-slate-400 block uppercase font-semibold">CPU Utilization</span>
                      <span className="text-lg font-bold text-indigo-400">{currentMetrics?.cpuUsage}%</span>
                    </div>
                    <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-lg">
                      <span className="text-[10px] text-slate-400 block uppercase font-semibold">Memory Usage</span>
                      <span className="text-lg font-bold text-purple-400">{currentMetrics?.memoryUsage}%</span>
                    </div>
                  </div>

                  {/* Timeseries table */}
                  <div className="border border-slate-800 rounded-lg overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-800/40 text-slate-400 text-[10px] uppercase">
                          <th className="p-2.5">Time</th>
                          <th className="p-2.5">Error Rate</th>
                          <th className="p-2.5">p99 Latency</th>
                          <th className="p-2.5">CPU %</th>
                          <th className="p-2.5">Memory %</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-slate-300">
                        {activeIncident.metrics.map((m, idx) => (
                          <tr key={idx} className="hover:bg-slate-800/20">
                            <td className="p-2.5 font-mono">{m.time}</td>
                            <td className="p-2.5 font-mono font-bold text-rose-400">{m.errorRate}%</td>
                            <td className="p-2.5 font-mono">{m.latencyP99}ms</td>
                            <td className="p-2.5 font-mono">{m.cpuUsage}%</td>
                            <td className="p-2.5 font-mono">{m.memoryUsage}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 4: Shared Actions (Manual Human Dispatch) */}
              {telemetryTab === "actions" && activeIncident && (
                <div className="space-y-4 font-sans text-xs">
                  <div className="p-3 bg-indigo-950/20 border border-indigo-500/20 rounded-lg text-slate-300">
                    <p className="font-semibold text-white mb-1 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      Agent-Native Symmetrical Actions
                    </p>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      These are the exact same <code className="text-indigo-300 font-mono">defineAction</code>{" "}
                      functions invoked by the autonomous agent. Human engineers can execute them directly, or let the
                      agent orchestrate them with human-in-the-loop safety.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      onClick={() => executeManualAction("checkServiceHealth")}
                      disabled={isExecutingManual}
                      className="p-3 text-left rounded-lg bg-slate-950/70 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 transition group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono font-bold text-white text-[11px]">checkServiceHealth()</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">READ</span>
                      </div>
                      <p className="text-[11px] text-slate-400">Run deterministic health checks against service endpoints.</p>
                    </button>

                    <button
                      onClick={() => executeManualAction("inspectDeploymentDiff")}
                      disabled={isExecutingManual}
                      className="p-3 text-left rounded-lg bg-slate-950/70 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 transition group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono font-bold text-white text-[11px]">inspectDeploymentDiff()</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">READ</span>
                      </div>
                      <p className="text-[11px] text-slate-400">Retrieve git commit diff and author details for active release.</p>
                    </button>

                    <button
                      onClick={() => executeManualAction("rollbackDeployment", { releaseId: activeIncident.stableRelease })}
                      disabled={isExecutingManual}
                      className="p-3 text-left rounded-lg bg-slate-950/70 border border-slate-800 hover:border-rose-500/50 hover:bg-slate-900 transition group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono font-bold text-rose-300 text-[11px]">rollbackDeployment()</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-950/60 text-rose-300 font-mono">MUTATING</span>
                      </div>
                      <p className="text-[11px] text-slate-400">Rollback to stable release <code className="text-white font-mono">{activeIncident.stableRelease}</code>.</p>
                    </button>

                    {activeIncident.featureFlags.map((flag) => (
                      <button
                        key={flag.id}
                        onClick={() => executeManualAction("toggleFeatureFlag", { flagId: flag.id, enabled: !flag.enabled })}
                        disabled={isExecutingManual}
                        className="p-3 text-left rounded-lg bg-slate-950/70 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-900 transition group"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono font-bold text-amber-300 text-[11px]">toggleFeatureFlag()</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950/60 text-amber-300 font-mono">MUTATING</span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Set <code className="text-white font-mono">{flag.id}</code> to {flag.enabled ? "false (Disable)" : "true (Enable)"}.
                        </p>
                      </button>
                    ))}
                  </div>

                  {/* Manual Action Terminal Output */}
                  {manualActionOutput && (
                    <div className="mt-3 p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px]">
                      <div className="flex items-center justify-between text-slate-400 mb-1 text-[10px] uppercase font-semibold">
                        <span>Action Execution Response:</span>
                        <button onClick={() => setManualActionOutput(null)} className="text-slate-500 hover:text-white">Clear</button>
                      </div>
                      <pre className="text-emerald-400 whitespace-pre-wrap overflow-x-auto max-h-48 leading-relaxed">
                        {manualActionOutput}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Agent-Native Investigation & Co-Pilot */}
        <div className="w-full lg:w-5/12 flex flex-col gap-5">
          {/* Action Trigger Card */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-slate-800 rounded-xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold text-sm text-white">Autonomous Agent Co-Pilot</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium">
                Symmetrical Tools
              </span>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              TraceBack AI leverages Builder.io’s <code className="text-indigo-300 font-mono">defineAction</code>{" "}
              primitives. The AI dispatches the exact same actions engineers use: inspecting logs, diffs, proposing
              remediation, and intercepting for human authorization.
            </p>

            {!agentSession ? (
              <button
                onClick={handleStartInvestigation}
                disabled={isInvestigating}
                className="w-full py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
              >
                {isInvestigating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Autonomous Agent Triaging...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    Start Autonomous Investigation
                  </>
                )}
              </button>
            ) : (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        agentSession.verificationVerdict === "HEALTHY_CONFIRMED"
                          ? "bg-emerald-500"
                          : agentSession.isAwaitingApproval
                          ? "bg-amber-400 animate-ping"
                          : "bg-indigo-400"
                      }`}
                    />
                    <span className="font-semibold text-white">
                      {agentSession.verificationVerdict === "HEALTHY_CONFIRMED"
                        ? "Resolution Verified Deterministically"
                        : agentSession.isAwaitingApproval
                        ? "Awaiting Human Authorization"
                        : "Investigation in Progress"}
                    </span>
                  </div>
                  <button
                    onClick={handleStartInvestigation}
                    className="text-xs text-indigo-400 hover:text-indigo-300 underline font-medium"
                  >
                    Re-analyze
                  </button>
                </div>

                {/* Model Engine Provenance Badge */}
                <div className="flex items-center justify-between px-3 py-1.5 rounded-md bg-slate-950/40 border border-slate-800/80 text-[11px]">
                  <span className="text-slate-400">Reasoning Engine:</span>
                  <span className={`inline-flex items-center gap-1.5 font-medium px-2 py-0.5 rounded text-[10.5px] ${
                    agentSession.isLiveAI 
                      ? "bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold"
                      : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono"
                  }`}>
                    {agentSession.isLiveAI ? <Sparkles className="w-3 h-3 text-purple-400" /> : <Cpu className="w-3 h-3 text-cyan-400" />}
                    {agentSession.modelUsed || "Deterministic SRE Engine (Calibrated)"}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Human Approval Card (When blocked on approval) */}
          {agentSession?.isAwaitingApproval && agentSession.proposedAction && (
            <div className="bg-amber-950/20 border-2 border-amber-500/50 rounded-xl p-5 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-2 text-amber-400 mb-2 font-bold text-xs uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4" />
                Human Approval Gate Required
              </div>

              <h4 className="text-white font-bold text-sm mb-1.5">
                Proposed Action: <code className="text-amber-300">{agentSession.proposedAction.actionId}</code>
              </h4>
              <p className="text-xs text-slate-300 mb-3">{agentSession.proposedAction.reason}</p>

              <div className="bg-slate-950/80 rounded p-2.5 mb-4 border border-slate-800 text-xs font-mono">
                <div className="text-slate-400 text-[10px] uppercase font-semibold">Execution Payload:</div>
                <div className="text-amber-200 mt-1">{JSON.stringify(agentSession.proposedAction.params, null, 2)}</div>
                <div className="mt-2 text-[10px] text-slate-400">
                  Blast Radius:{" "}
                  <span className="font-bold text-rose-400 uppercase">
                    {agentSession.proposedAction.blastRadius}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleApproval(true)}
                  className="flex-1 py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/30"
                >
                  <Check className="w-4 h-4" />
                  Authorize & Execute
                </button>
                <button
                  onClick={() => handleApproval(false)}
                  className="py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition flex items-center justify-center gap-1.5 border border-slate-700"
                >
                  <X className="w-4 h-4" />
                  Reject
                </button>
              </div>
            </div>
          )}

          {/* Investigation Timeline Stream */}
          <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col overflow-hidden">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-indigo-400" />
              Agent Investigation Stream
            </h4>

            {agentSession?.steps ? (
              <div className="space-y-4 overflow-auto max-h-[500px] pr-1">
                {agentSession.steps.map((step) => (
                  <div key={step.id} className="relative pl-6 pb-2 border-l-2 border-slate-800 last:border-transparent">
                    {/* Circle Node */}
                    <div
                      className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 bg-slate-950 flex items-center justify-center ${
                        step.status === "COMPLETED"
                          ? "border-emerald-500 text-emerald-400"
                          : step.status === "BLOCKED_APPROVAL"
                          ? "border-amber-400 text-amber-400 animate-pulse"
                          : "border-indigo-500 text-indigo-400"
                      }`}
                    >
                      {step.status === "COMPLETED" && <Check className="w-2.5 h-2.5" />}
                    </div>

                    <div className="text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-200">{step.title}</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(step.timestamp).toLocaleTimeString()}
                        </span>
                      </div>

                      {/* Dispatched Action badge */}
                      {step.actionDispatched && (
                        <div className="mb-2">
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-800/40">
                            <Terminal className="w-2.5 h-2.5" />
                            dispatched: {step.actionDispatched}()
                          </span>
                        </div>
                      )}

                      <p className="text-slate-300 text-[11px] leading-relaxed mb-2 bg-slate-950/40 p-2.5 rounded border border-slate-800/60">
                        {step.thought}
                      </p>

                      {/* Evidence citations */}
                      {step.evidenceCited && step.evidenceCited.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                            Cited Evidence:
                          </span>
                          {step.evidenceCited.map((ev, i) => (
                            <div
                              key={i}
                              className="text-[10.5px] font-mono text-emerald-300/90 bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-900/30"
                            >
                              • {ev}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-500">
                <Terminal className="w-10 h-10 mb-3 stroke-[1.5] text-slate-600" />
                <p className="text-xs font-medium text-slate-400 mb-1">No Active Investigation</p>
                <p className="text-[11px] max-w-[240px]">
                  Select an incident and click "Start Autonomous Investigation" to observe the agent-native loop.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Post-Mortem Report Modal */}
      {showPostMortemModal && agentSession?.postMortemReport && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/60">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-sm text-white">Production Incident Post-Mortem & Audit Trail</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(agentSession.postMortemReport!)}
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition border border-slate-700"
                >
                  {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedReport ? "Copied!" : "Copy Markdown"}
                </button>
                <button
                  onClick={() => setShowPostMortemModal(false)}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-auto font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
              {agentSession.postMortemReport}
            </div>
          </div>
        </div>
      )}

      {/* AI Key Configuration Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full flex flex-col shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/60">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-purple-400" />
                <h3 className="font-bold text-sm text-white">AI Engine Configuration</h3>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 text-xs text-slate-300 space-y-4">
              <div className="p-3 bg-purple-950/30 border border-purple-500/20 rounded-lg">
                <span className="font-semibold text-purple-200 block mb-1">Dual-Mode Architecture:</span>
                <p className="text-[11px] text-purple-300/80 leading-relaxed">
                  TraceBack AI ships with a 100% deterministic, calibrated SRE reasoning benchmark for guaranteed zero-dependency judging.
                  You can optionally provide a Google Gemini API key to test live dynamic LLM reasoning.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Google Gemini API Key (Optional)
                </label>
                <input
                  type="password"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => saveGeminiKey("")}
                  className="text-xs text-rose-400 hover:text-rose-300 underline"
                >
                  Clear Key (Use Calibrated Safe Mode)
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowKeyModal(false)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => saveGeminiKey(geminiKey)}
                    className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-600/30"
                  >
                    Save & Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 px-6 py-3.5 text-center text-xs text-slate-400 flex flex-wrap items-center justify-between gap-4">
        <span>TraceBack AI — Built with Builder.io Agent-Native Architecture for Hackathon 2026</span>
        <div className="flex items-center gap-4 text-[11px]">
          <span>Symmetrical Tools & Actions</span>
          <span>•</span>
          <span>Deterministic Probes</span>
          <span>•</span>
          <span>Human-in-the-Loop Safe</span>
        </div>
      </footer>
    </div>
  );
}
