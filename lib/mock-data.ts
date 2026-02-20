// Self-healing DevOps platform mock data

export interface Service {
  id: string
  name: string
  status: "healthy" | "warning" | "critical" | "healing"
  uptime: number
  responseTime: number
  cpu: number
  memory: number
  lastIncident: string
  region: string
}

export interface Agent {
  id: string
  name: string
  type: "monitor" | "diagnostics" | "remediation" | "predictor"
  status: "active" | "idle" | "executing" | "cooldown"
  lastAction: string
  lastActionTime: string
  actionsToday: number
  successRate: number
  model: string
}

export interface Incident {
  id: string
  service: string
  severity: "low" | "medium" | "high" | "critical"
  title: string
  description: string
  status: "detected" | "diagnosing" | "healing" | "resolved" | "escalated"
  detectedAt: string
  resolvedAt?: string
  agent: string
  healingSteps: HealingStep[]
}

export interface HealingStep {
  id: string
  action: string
  status: "pending" | "running" | "completed" | "failed"
  timestamp: string
  duration?: string
  output?: string
}

export interface WorkflowNode {
  id: string
  type: "trigger" | "condition" | "action" | "llm" | "output"
  label: string
  x: number
  y: number
  config?: Record<string, string>
  status?: "idle" | "active" | "completed" | "error"
}

export interface WorkflowEdge {
  id: string
  from: string
  to: string
  label?: string
}

export interface MetricPoint {
  time: string
  value: number
}

export const services: Service[] = [
  {
    id: "svc-001",
    name: "API Gateway",
    status: "healthy",
    uptime: 99.97,
    responseTime: 42,
    cpu: 34,
    memory: 58,
    lastIncident: "3d ago",
    region: "us-east-1",
  },
  {
    id: "svc-002",
    name: "Auth Service",
    status: "healthy",
    uptime: 99.99,
    responseTime: 18,
    cpu: 22,
    memory: 41,
    lastIncident: "7d ago",
    region: "us-east-1",
  },
  {
    id: "svc-003",
    name: "Database Cluster",
    status: "warning",
    uptime: 99.85,
    responseTime: 156,
    cpu: 78,
    memory: 82,
    lastIncident: "12m ago",
    region: "us-west-2",
  },
  {
    id: "svc-004",
    name: "Message Queue",
    status: "healing",
    uptime: 98.2,
    responseTime: 340,
    cpu: 91,
    memory: 87,
    lastIncident: "now",
    region: "eu-west-1",
  },
  {
    id: "svc-005",
    name: "CDN Edge",
    status: "healthy",
    uptime: 99.99,
    responseTime: 8,
    cpu: 12,
    memory: 28,
    lastIncident: "14d ago",
    region: "global",
  },
  {
    id: "svc-006",
    name: "ML Pipeline",
    status: "critical",
    uptime: 95.4,
    responseTime: 2800,
    cpu: 96,
    memory: 94,
    lastIncident: "now",
    region: "us-west-2",
  },
  {
    id: "svc-007",
    name: "Cache Layer",
    status: "healthy",
    uptime: 99.98,
    responseTime: 3,
    cpu: 18,
    memory: 65,
    lastIncident: "5d ago",
    region: "us-east-1",
  },
  {
    id: "svc-008",
    name: "Log Aggregator",
    status: "healthy",
    uptime: 99.92,
    responseTime: 24,
    cpu: 45,
    memory: 72,
    lastIncident: "2d ago",
    region: "us-east-1",
  },
]

export const agents: Agent[] = [
  {
    id: "agent-001",
    name: "Sentinel",
    type: "monitor",
    status: "active",
    lastAction: "Health check on 8 services",
    lastActionTime: "2s ago",
    actionsToday: 4320,
    successRate: 99.9,
    model: "GPT-4o",
  },
  {
    id: "agent-002",
    name: "Sherlock",
    type: "diagnostics",
    status: "executing",
    lastAction: "Root cause analysis on ML Pipeline",
    lastActionTime: "now",
    actionsToday: 47,
    successRate: 94.2,
    model: "Claude 3.5",
  },
  {
    id: "agent-003",
    name: "Phoenix",
    type: "remediation",
    status: "executing",
    lastAction: "Auto-scaling Message Queue pods",
    lastActionTime: "now",
    actionsToday: 12,
    successRate: 91.7,
    model: "GPT-4o",
  },
  {
    id: "agent-004",
    name: "Oracle",
    type: "predictor",
    status: "idle",
    lastAction: "Predicted DB load spike in 2h",
    lastActionTime: "15m ago",
    actionsToday: 156,
    successRate: 87.3,
    model: "Custom LSTM",
  },
]

export const incidents: Incident[] = [
  {
    id: "inc-001",
    service: "ML Pipeline",
    severity: "critical",
    title: "OOM Kill on Training Worker",
    description: "Training worker pod exceeded memory limits causing OOM kill. Gradient accumulation buffer grew unbounded.",
    status: "diagnosing",
    detectedAt: "2m ago",
    agent: "Sherlock",
    healingSteps: [
      {
        id: "step-1",
        action: "Detected anomaly in memory usage pattern",
        status: "completed",
        timestamp: "2m ago",
        duration: "0.3s",
        output: "Memory usage at 94% and rising exponentially",
      },
      {
        id: "step-2",
        action: "Running root cause analysis via LLM",
        status: "running",
        timestamp: "1m ago",
        output: "Analyzing stack traces and memory profiles...",
      },
      {
        id: "step-3",
        action: "Apply memory limit patch",
        status: "pending",
        timestamp: "",
      },
      {
        id: "step-4",
        action: "Restart training worker with new config",
        status: "pending",
        timestamp: "",
      },
    ],
  },
  {
    id: "inc-002",
    service: "Message Queue",
    severity: "high",
    title: "Consumer Lag Exceeding Threshold",
    description: "Message consumer lag increased to 45,000 messages. Auto-scaling triggered.",
    status: "healing",
    detectedAt: "8m ago",
    agent: "Phoenix",
    healingSteps: [
      {
        id: "step-1",
        action: "Detected consumer lag spike",
        status: "completed",
        timestamp: "8m ago",
        duration: "0.1s",
        output: "Consumer lag: 45,000 msgs (threshold: 10,000)",
      },
      {
        id: "step-2",
        action: "Diagnosed: insufficient consumer instances",
        status: "completed",
        timestamp: "7m ago",
        duration: "2.1s",
        output: "Current: 3 consumers, Recommended: 8 consumers",
      },
      {
        id: "step-3",
        action: "Scaling consumer pods from 3 to 8",
        status: "running",
        timestamp: "6m ago",
        output: "5/5 new pods initializing...",
      },
      {
        id: "step-4",
        action: "Verify lag reduction",
        status: "pending",
        timestamp: "",
      },
    ],
  },
  {
    id: "inc-003",
    service: "Database Cluster",
    severity: "medium",
    title: "Slow Query Detected on Replica",
    description: "Read replica responding with p99 latency > 500ms due to unoptimized query pattern.",
    status: "resolved",
    detectedAt: "12m ago",
    resolvedAt: "4m ago",
    agent: "Phoenix",
    healingSteps: [
      {
        id: "step-1",
        action: "Detected p99 latency spike",
        status: "completed",
        timestamp: "12m ago",
        duration: "0.2s",
        output: "p99 latency: 520ms (threshold: 200ms)",
      },
      {
        id: "step-2",
        action: "Identified slow query via EXPLAIN ANALYZE",
        status: "completed",
        timestamp: "11m ago",
        duration: "1.5s",
        output: "SELECT * FROM events WHERE ... (full table scan)",
      },
      {
        id: "step-3",
        action: "Created covering index",
        status: "completed",
        timestamp: "8m ago",
        duration: "45s",
        output: "INDEX events_user_date_idx ON events(user_id, created_at)",
      },
      {
        id: "step-4",
        action: "Verified latency normalization",
        status: "completed",
        timestamp: "4m ago",
        duration: "120s",
        output: "p99 latency: 38ms - Within normal range",
      },
    ],
  },
  {
    id: "inc-004",
    service: "API Gateway",
    severity: "low",
    title: "Rate Limit Config Drift",
    description: "Rate limiting configuration drifted from desired state after deployment.",
    status: "resolved",
    detectedAt: "3d ago",
    resolvedAt: "3d ago",
    agent: "Phoenix",
    healingSteps: [
      {
        id: "step-1",
        action: "Config drift detected",
        status: "completed",
        timestamp: "3d ago",
        duration: "0.1s",
      },
      {
        id: "step-2",
        action: "Applied desired state configuration",
        status: "completed",
        timestamp: "3d ago",
        duration: "1.2s",
      },
    ],
  },
]

export const workflowNodes: WorkflowNode[] = [
  {
    id: "node-1",
    type: "trigger",
    label: "Alert Received",
    x: 60,
    y: 180,
    status: "completed",
  },
  {
    id: "node-2",
    type: "condition",
    label: "Severity Check",
    x: 280,
    y: 180,
    config: { threshold: "warning" },
    status: "completed",
  },
  {
    id: "node-3",
    type: "llm",
    label: "AI Diagnosis",
    x: 500,
    y: 100,
    config: { model: "gpt-4o", prompt: "Analyze root cause" },
    status: "active",
  },
  {
    id: "node-4",
    type: "action",
    label: "Auto-Remediate",
    x: 500,
    y: 260,
    config: { action: "apply_fix" },
    status: "idle",
  },
  {
    id: "node-5",
    type: "condition",
    label: "Verify Fix",
    x: 720,
    y: 180,
    status: "idle",
  },
  {
    id: "node-6",
    type: "output",
    label: "Close Incident",
    x: 940,
    y: 120,
    status: "idle",
  },
  {
    id: "node-7",
    type: "action",
    label: "Escalate",
    x: 940,
    y: 260,
    config: { channel: "pagerduty" },
    status: "idle",
  },
]

export const workflowEdges: WorkflowEdge[] = [
  { id: "edge-1", from: "node-1", to: "node-2" },
  { id: "edge-2", from: "node-2", to: "node-3", label: "high/critical" },
  { id: "edge-3", from: "node-2", to: "node-4", label: "low/medium" },
  { id: "edge-4", from: "node-3", to: "node-5" },
  { id: "edge-5", from: "node-4", to: "node-5" },
  { id: "edge-6", from: "node-5", to: "node-6", label: "pass" },
  { id: "edge-7", from: "node-5", to: "node-7", label: "fail" },
]

export function generateMetrics(points: number, base: number, variance: number): MetricPoint[] {
  const now = Date.now()
  return Array.from({ length: points }, (_, i) => {
    const time = new Date(now - (points - i) * 60000)
    return {
      time: `${time.getHours().toString().padStart(2, "0")}:${time.getMinutes().toString().padStart(2, "0")}`,
      value: Math.max(0, base + (Math.random() - 0.5) * variance * 2),
    }
  })
}

export const requestMetrics = generateMetrics(30, 2400, 400)
export const errorMetrics = generateMetrics(30, 12, 8)
export const latencyMetrics = generateMetrics(30, 45, 20)
export const cpuMetrics = generateMetrics(30, 55, 25)
