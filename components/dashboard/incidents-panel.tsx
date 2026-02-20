"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { incidents, type Incident, type HealingStep } from "@/lib/mock-data"
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Loader2,
  XCircle,
  ChevronDown,
  ChevronRight,
  Shield,
  Bot,
  ArrowRight,
  Stethoscope,
  Wrench,
  Filter,
} from "lucide-react"

const severityConfig: Record<string, { color: string; bg: string; border: string }> = {
  low: { color: "text-muted-foreground", bg: "bg-secondary", border: "border-border" },
  medium: { color: "text-warning", bg: "bg-warning/10", border: "border-warning/30" },
  high: { color: "text-chart-4", bg: "bg-chart-4/10", border: "border-chart-4/30" },
  critical: { color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/30" },
}

const statusConfig: Record<string, { icon: typeof Clock; color: string; label: string }> = {
  detected: { icon: AlertTriangle, color: "text-warning", label: "Detected" },
  diagnosing: { icon: Stethoscope, color: "text-chart-5", label: "Diagnosing" },
  healing: { icon: Wrench, color: "text-primary", label: "Healing" },
  resolved: { icon: CheckCircle2, color: "text-success", label: "Resolved" },
  escalated: { icon: XCircle, color: "text-destructive", label: "Escalated" },
}

const stepStatusIcon: Record<string, { icon: typeof Clock; color: string }> = {
  pending: { icon: Clock, color: "text-muted-foreground" },
  running: { icon: Loader2, color: "text-primary" },
  completed: { icon: CheckCircle2, color: "text-success" },
  failed: { icon: XCircle, color: "text-destructive" },
}

function HealingPipeline({ steps }: { steps: HealingStep[] }) {
  return (
    <div className="flex flex-col gap-0">
      {steps.map((step, i) => {
        const cfg = stepStatusIcon[step.status]
        const Icon = cfg.icon
        return (
          <div key={step.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                  step.status === "running"
                    ? "border-primary bg-primary/10"
                    : step.status === "completed"
                      ? "border-success bg-success/10"
                      : step.status === "failed"
                        ? "border-destructive bg-destructive/10"
                        : "border-border bg-secondary"
                }`}
              >
                <Icon
                  className={`h-3 w-3 ${cfg.color} ${step.status === "running" ? "animate-spin" : ""}`}
                />
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`w-px flex-1 min-h-6 ${
                    step.status === "completed" ? "bg-success/50" : "bg-border"
                  }`}
                />
              )}
            </div>
            <div className="flex flex-col gap-1 pb-4">
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-medium ${
                    step.status === "pending" ? "text-muted-foreground" : "text-foreground"
                  }`}
                >
                  {step.action}
                </span>
                {step.duration && (
                  <span className="font-mono text-xs text-muted-foreground">{step.duration}</span>
                )}
              </div>
              {step.output && (
                <div className="rounded-md border border-border bg-secondary/30 px-3 py-1.5">
                  <code className="font-mono text-xs text-muted-foreground">{step.output}</code>
                </div>
              )}
              {step.timestamp && (
                <span className="text-xs text-muted-foreground">{step.timestamp}</span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function IncidentCard({
  incident,
  isExpanded,
  onToggle,
}: {
  incident: Incident
  isExpanded: boolean
  onToggle: () => void
}) {
  const severity = severityConfig[incident.severity]
  const status = statusConfig[incident.status]
  const StatusIcon = status.icon

  return (
    <Card
      className={`border-border bg-card transition-all ${
        incident.status !== "resolved" ? "border-l-2 border-l-primary" : ""
      }`}
    >
      <CardContent className="p-0">
        <button
          onClick={onToggle}
          className="flex w-full items-start gap-3 p-4 text-left"
          aria-expanded={isExpanded}
        >
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
            <StatusIcon className={`h-4 w-4 ${status.color}`} />
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">{incident.title}</span>
              <Badge className={`${severity.bg} ${severity.color} ${severity.border} text-xs capitalize`}>
                {incident.severity}
              </Badge>
              <Badge className={`text-xs ${
                incident.status === "resolved"
                  ? "bg-success/10 text-success border-success/30"
                  : incident.status === "healing"
                    ? "bg-primary/10 text-primary border-primary/30"
                    : "bg-warning/10 text-warning border-warning/30"
              }`}>
                {status.label}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{incident.description}</p>
            <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                {incident.service}
              </span>
              <span className="flex items-center gap-1">
                <Bot className="h-3 w-3" />
                {incident.agent}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {incident.detectedAt}
              </span>
              {incident.resolvedAt && (
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-success" />
                  Resolved {incident.resolvedAt}
                </span>
              )}
            </div>
          </div>
          {isExpanded ? (
            <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
          )}
        </button>

        {isExpanded && (
          <div className="border-t border-border px-4 py-4">
            <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
              <ArrowRight className="h-3.5 w-3.5 text-primary" />
              Healing Pipeline
            </h4>
            <HealingPipeline steps={incident.healingSteps} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function IncidentsPanel() {
  const [expandedId, setExpandedId] = useState<string | null>("inc-001")
  const [filter, setFilter] = useState("all")

  const filtered =
    filter === "all"
      ? incidents
      : filter === "active"
        ? incidents.filter((i) => i.status !== "resolved")
        : incidents.filter((i) => i.status === "resolved")

  const activeCount = incidents.filter((i) => i.status !== "resolved").length
  const healingCount = incidents.filter((i) => i.status === "healing").length

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground text-balance">Incidents</h1>
          <p className="text-sm text-muted-foreground">Track detected issues and self-healing pipeline status</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{activeCount}</p>
              <p className="text-xs text-muted-foreground">Active Incidents</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Wrench className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{healingCount}</p>
              <p className="text-xs text-muted-foreground">Currently Healing</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <CheckCircle2 className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">96.8%</p>
              <p className="text-xs text-muted-foreground">Auto-Heal Success</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">4.2m</p>
              <p className="text-xs text-muted-foreground">Avg Resolution Time</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        {["all", "active", "resolved"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
              filter === f
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Incident List */}
      <div className="flex flex-col gap-3">
        {filtered.map((incident) => (
          <IncidentCard
            key={incident.id}
            incident={incident}
            isExpanded={expandedId === incident.id}
            onToggle={() =>
              setExpandedId(expandedId === incident.id ? null : incident.id)
            }
          />
        ))}
      </div>
    </div>
  )
}
