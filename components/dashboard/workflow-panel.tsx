"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  workflowNodes,
  workflowEdges,
  type WorkflowNode,
  type WorkflowEdge,
} from "@/lib/mock-data"
import {
  GitBranch,
  Play,
  Pause,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Bot,
  Zap,
  GitFork,
  CheckCircle2,
  ArrowRight,
  Settings,
  X,
} from "lucide-react"

const nodeTypeConfig: Record<string, { icon: typeof Zap; color: string; bg: string; border: string }> = {
  trigger: { icon: Zap, color: "text-warning", bg: "bg-warning/10", border: "border-warning/40" },
  condition: { icon: GitFork, color: "text-primary", bg: "bg-primary/10", border: "border-primary/40" },
  action: { icon: ArrowRight, color: "text-success", bg: "bg-success/10", border: "border-success/40" },
  llm: { icon: Bot, color: "text-chart-5", bg: "bg-chart-5/10", border: "border-chart-5/40" },
  output: { icon: CheckCircle2, color: "text-muted-foreground", bg: "bg-secondary", border: "border-border" },
}

const nodeStatusGlow: Record<string, string> = {
  idle: "",
  active: "ring-2 ring-primary/50 shadow-[0_0_15px_rgba(56,189,248,0.2)]",
  completed: "ring-2 ring-success/50",
  error: "ring-2 ring-destructive/50",
}

function WorkflowCanvas({
  nodes,
  edges,
  zoom,
  selectedNode,
  onSelectNode,
}: {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  zoom: number
  selectedNode: WorkflowNode | null
  onSelectNode: (node: WorkflowNode | null) => void
}) {
  const canvasRef = useRef<HTMLDivElement>(null)

  const getNodeCenter = useCallback(
    (nodeId: string) => {
      const node = nodes.find((n) => n.id === nodeId)
      if (!node) return { x: 0, y: 0 }
      return { x: node.x + 75, y: node.y + 30 }
    },
    [nodes]
  )

  return (
    <div
      ref={canvasRef}
      className="relative h-[420px] overflow-hidden rounded-lg border border-border bg-background"
      style={{ backgroundImage: "radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)", backgroundSize: `${20 * zoom}px ${20 * zoom}px` }}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }}
      >
        {edges.map((edge) => {
          const from = getNodeCenter(edge.from)
          const to = getNodeCenter(edge.to)
          const midX = (from.x + to.x) / 2
          const isActive = nodes.find((n) => n.id === edge.from)?.status === "completed" ||
            nodes.find((n) => n.id === edge.from)?.status === "active"

          return (
            <g key={edge.id}>
              <path
                d={`M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`}
                fill="none"
                stroke={isActive ? "oklch(0.72 0.19 195)" : "hsl(var(--border))"}
                strokeWidth={2}
                strokeDasharray={isActive ? "none" : "6 4"}
                className={isActive ? "animate-flow-dash" : ""}
                style={isActive ? { strokeDasharray: "10 10" } : {}}
              />
              {edge.label && (
                <text
                  x={midX}
                  y={(from.y + to.y) / 2 - 8}
                  textAnchor="middle"
                  className="fill-muted-foreground text-[10px]"
                >
                  {edge.label}
                </text>
              )}
            </g>
          )
        })}
      </svg>

      <div
        className="absolute inset-0"
        style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }}
      >
        {nodes.map((node) => {
          const cfg = nodeTypeConfig[node.type]
          const Icon = cfg.icon
          const isSelected = selectedNode?.id === node.id

          return (
            <button
              key={node.id}
              onClick={() => onSelectNode(isSelected ? null : node)}
              className={`absolute flex w-[150px] flex-col items-center gap-1.5 rounded-lg border ${cfg.border} ${cfg.bg} p-3 backdrop-blur-sm transition-all hover:scale-105 ${
                nodeStatusGlow[node.status || "idle"]
              } ${isSelected ? "ring-2 ring-primary" : ""}`}
              style={{ left: node.x, top: node.y }}
              aria-label={`Workflow node: ${node.label}`}
            >
              <div className="flex items-center gap-1.5">
                <Icon className={`h-3.5 w-3.5 ${cfg.color}`} />
                <span className={`text-xs font-medium ${cfg.color}`}>{node.type}</span>
              </div>
              <span className="text-xs font-semibold text-foreground">{node.label}</span>
              {node.status && node.status !== "idle" && (
                <span
                  className={`text-[10px] font-medium capitalize ${
                    node.status === "active"
                      ? "text-primary"
                      : node.status === "completed"
                        ? "text-success"
                        : "text-destructive"
                  }`}
                >
                  {node.status === "active" && (
                    <span className="mr-1 inline-block h-1 w-1 animate-pulse-glow rounded-full bg-primary" />
                  )}
                  {node.status}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function WorkflowPanel() {
  const [zoom, setZoom] = useState(1)
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null)
  const [isRunning, setIsRunning] = useState(true)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground text-balance">Visual Workflows</h1>
          <p className="text-sm text-muted-foreground">LangFlow-style pipeline editor for healing workflows</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              isRunning
                ? "bg-destructive/10 text-destructive border border-destructive/30 hover:bg-destructive/20"
                : "bg-success/10 text-success border border-success/30 hover:bg-success/20"
            }`}
          >
            {isRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {isRunning ? "Pause" : "Run"}
          </button>
          <button className="flex items-center gap-1.5 rounded-md border border-border bg-secondary/50 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* Workflow Info */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <GitBranch className="h-4 w-4 text-primary" />
              Incident Auto-Healing Pipeline
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1 border-primary/30 bg-primary/10 text-primary text-xs">
                <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-primary" />
                Live
              </Badge>
              <Badge variant="outline" className="font-mono text-xs">
                v2.4.1
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Canvas Controls */}
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setZoom((z) => Math.min(z + 0.1, 1.5))}
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label="Zoom in"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                onClick={() => setZoom((z) => Math.max(z - 0.1, 0.5))}
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label="Zoom out"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <button
                onClick={() => setZoom(1)}
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label="Reset zoom"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
              <span className="ml-2 font-mono text-xs text-muted-foreground">{Math.round(zoom * 100)}%</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-warning" /> Trigger</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary" /> Condition</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-success" /> Action</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-chart-5" /> LLM</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-muted-foreground" /> Output</span>
            </div>
          </div>

          <WorkflowCanvas
            nodes={workflowNodes}
            edges={workflowEdges}
            zoom={zoom}
            selectedNode={selectedNode}
            onSelectNode={setSelectedNode}
          />
        </CardContent>
      </Card>

      {/* Node Inspector */}
      {selectedNode && (
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Settings className="h-4 w-4 text-primary" />
                Node Inspector
              </CardTitle>
              <button
                onClick={() => setSelectedNode(null)}
                className="rounded-md p-1 text-muted-foreground hover:bg-secondary"
                aria-label="Close inspector"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Details</span>
                <div className="flex flex-col gap-1.5 font-mono text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">id</span>
                    <span className="text-foreground">{selectedNode.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">type</span>
                    <span className={nodeTypeConfig[selectedNode.type].color}>{selectedNode.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">status</span>
                    <span className="text-foreground">{selectedNode.status || "idle"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">position</span>
                    <span className="text-foreground">({selectedNode.x}, {selectedNode.y})</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Connections</span>
                <div className="flex flex-col gap-1.5 text-sm">
                  {workflowEdges
                    .filter((e) => e.from === selectedNode.id || e.to === selectedNode.id)
                    .map((e) => (
                      <div key={e.id} className="flex items-center gap-2 rounded bg-secondary/50 px-2 py-1">
                        <span className="font-mono text-xs text-muted-foreground">{e.from}</span>
                        <ArrowRight className="h-3 w-3 text-primary" />
                        <span className="font-mono text-xs text-muted-foreground">{e.to}</span>
                        {e.label && <Badge variant="outline" className="ml-auto text-[10px]">{e.label}</Badge>}
                      </div>
                    ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Configuration</span>
                {selectedNode.config ? (
                  <div className="flex flex-col gap-1.5 font-mono text-sm">
                    {Object.entries(selectedNode.config).map(([key, val]) => (
                      <div key={key} className="flex justify-between rounded bg-secondary/50 px-2 py-1">
                        <span className="text-xs text-muted-foreground">{key}</span>
                        <span className="text-xs text-primary">{val}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">No configuration</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Workflow Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Executions</span>
              <span className="text-xl font-bold text-foreground">1,247</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Avg Execution Time</span>
              <span className="text-xl font-bold text-foreground">4.2s</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Across all runs</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Success Rate</span>
              <span className="text-xl font-bold text-foreground">96.8%</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Auto-healed incidents</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
