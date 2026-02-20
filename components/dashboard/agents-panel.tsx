"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { agents, type Agent } from "@/lib/mock-data"
import {
  Bot,
  Brain,
  Clock,
  Eye,
  Settings,
  Sparkles,
  TrendingUp,
  Wrench,
  Zap,
  ChevronRight,
  BarChart3,
} from "lucide-react"

const typeConfig: Record<string, { icon: typeof Bot; color: string; bg: string }> = {
  monitor: { icon: Eye, color: "text-primary", bg: "bg-primary/10" },
  diagnostics: { icon: Brain, color: "text-chart-5", bg: "bg-chart-5/10" },
  remediation: { icon: Wrench, color: "text-success", bg: "bg-success/10" },
  predictor: { icon: Sparkles, color: "text-warning", bg: "bg-warning/10" },
}

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  active: { label: "Active", color: "text-success", bg: "bg-success/10", border: "border-success/30" },
  executing: { label: "Executing", color: "text-primary", bg: "bg-primary/10", border: "border-primary/30" },
  idle: { label: "Idle", color: "text-muted-foreground", bg: "bg-secondary", border: "border-border" },
  cooldown: { label: "Cooldown", color: "text-warning", bg: "bg-warning/10", border: "border-warning/30" },
}

function AgentTimeline({ agent }: { agent: Agent }) {
  const actions = [
    { time: "2s ago", action: agent.lastAction, status: "current" as const },
    { time: "15m ago", action: "Completed health check cycle #4319", status: "done" as const },
    { time: "30m ago", action: "Generated performance report", status: "done" as const },
    { time: "1h ago", action: "Detected latency anomaly (auto-resolved)", status: "done" as const },
    { time: "2h ago", action: "Updated service dependency graph", status: "done" as const },
  ]

  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-sm font-medium text-foreground">Recent Activity</h4>
      <div className="flex flex-col">
        {actions.map((a, i) => (
          <div key={i} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`h-2 w-2 rounded-full ${
                  a.status === "current" ? "bg-primary animate-pulse-glow" : "bg-border"
                }`}
              />
              {i < actions.length - 1 && <div className="w-px flex-1 bg-border" />}
            </div>
            <div className="flex flex-col gap-0.5 pb-4">
              <span className="text-sm text-foreground">{a.action}</span>
              <span className="text-xs text-muted-foreground">{a.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AgentsPanel() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground text-balance">AI Agents</h1>
          <p className="text-sm text-muted-foreground">LLM-powered agents monitoring and healing your infrastructure</p>
        </div>
        <button className="flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20">
          <Settings className="h-3.5 w-3.5" />
          Configure Agents
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{agents.length}</p>
              <p className="text-xs text-muted-foreground">Total Agents</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <Zap className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">4,535</p>
              <p className="text-xs text-muted-foreground">Actions Today</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
              <TrendingUp className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">93.3%</p>
              <p className="text-xs text-muted-foreground">Avg Success Rate</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-5/10">
              <BarChart3 className="h-5 w-5 text-chart-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">2</p>
              <p className="text-xs text-muted-foreground">Currently Executing</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        {/* Agent List */}
        <div className="flex flex-col gap-3 lg:col-span-2">
          {agents.map((agent) => {
            const type = typeConfig[agent.type]
            const status = statusConfig[agent.status]
            const Icon = type.icon
            const isSelected = selectedAgent?.id === agent.id

            return (
              <Card
                key={agent.id}
                className={`cursor-pointer border-border bg-card transition-all ${
                  isSelected ? "ring-1 ring-primary" : "hover:border-primary/30"
                }`}
                onClick={() => setSelectedAgent(agent)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${type.bg}`}>
                      <Icon className={`h-5 w-5 ${type.color}`} />
                    </div>
                    <div className="flex flex-1 flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-foreground">{agent.name}</span>
                          <Badge className={`${status.bg} ${status.color} ${status.border} text-xs`}>
                            {agent.status === "executing" && (
                              <span className="mr-1 h-1.5 w-1.5 animate-pulse-glow rounded-full bg-primary" />
                            )}
                            {status.label}
                          </Badge>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="text-xs text-muted-foreground capitalize">{agent.type} Agent</span>
                      <p className="text-xs text-muted-foreground">{agent.lastAction}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-muted-foreground">Success Rate</span>
                          <div className="flex items-center gap-1.5">
                            <Progress value={agent.successRate} className="h-1.5 w-20" />
                            <span className="text-xs font-medium text-foreground">{agent.successRate}%</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-muted-foreground">Model</span>
                          <span className="font-mono text-xs text-foreground">{agent.model}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Agent Detail */}
        <Card className="border-border bg-card lg:col-span-3">
          <CardContent className="p-5">
            {selectedAgent ? (
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${typeConfig[selectedAgent.type].bg}`}>
                    {(() => {
                      const Icon = typeConfig[selectedAgent.type].icon
                      return <Icon className={`h-6 w-6 ${typeConfig[selectedAgent.type].color}`} />
                    })()}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{selectedAgent.name}</h3>
                    <p className="text-sm capitalize text-muted-foreground">{selectedAgent.type} Agent</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg border border-border bg-secondary/30 p-3">
                    <p className="text-xs text-muted-foreground">Actions Today</p>
                    <p className="text-xl font-bold text-foreground">{selectedAgent.actionsToday}</p>
                  </div>
                  <div className="rounded-lg border border-border bg-secondary/30 p-3">
                    <p className="text-xs text-muted-foreground">Success Rate</p>
                    <p className="text-xl font-bold text-foreground">{selectedAgent.successRate}%</p>
                  </div>
                  <div className="rounded-lg border border-border bg-secondary/30 p-3">
                    <p className="text-xs text-muted-foreground">LLM Model</p>
                    <p className="text-base font-bold font-mono text-foreground">{selectedAgent.model}</p>
                  </div>
                </div>

                <AgentTimeline agent={selectedAgent} />

                <div className="rounded-lg border border-border bg-secondary/20 p-3">
                  <h4 className="mb-2 text-sm font-medium text-foreground">Agent Configuration</h4>
                  <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                    <div className="flex justify-between rounded bg-background/50 px-2 py-1">
                      <span className="text-muted-foreground">polling_interval</span>
                      <span className="text-primary">20s</span>
                    </div>
                    <div className="flex justify-between rounded bg-background/50 px-2 py-1">
                      <span className="text-muted-foreground">retry_count</span>
                      <span className="text-primary">3</span>
                    </div>
                    <div className="flex justify-between rounded bg-background/50 px-2 py-1">
                      <span className="text-muted-foreground">max_tokens</span>
                      <span className="text-primary">4096</span>
                    </div>
                    <div className="flex justify-between rounded bg-background/50 px-2 py-1">
                      <span className="text-muted-foreground">temperature</span>
                      <span className="text-primary">0.1</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full min-h-[400px] flex-col items-center justify-center gap-3 text-muted-foreground">
                <Bot className="h-12 w-12 opacity-30" />
                <p className="text-sm">Select an agent to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
