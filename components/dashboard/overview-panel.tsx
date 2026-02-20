"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  services,
  agents,
  incidents,
  requestMetrics,
  errorMetrics,
  latencyMetrics,
  cpuMetrics,
} from "@/lib/mock-data"
import {
  Activity,
  Bot,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Zap,
  Server,
  TrendingUp,
} from "lucide-react"
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"

const statusColor: Record<string, string> = {
  healthy: "text-success",
  warning: "text-warning",
  critical: "text-destructive",
  healing: "text-primary",
}

const statusBg: Record<string, string> = {
  healthy: "bg-success",
  warning: "bg-warning",
  critical: "bg-destructive",
  healing: "bg-primary",
}

function MetricCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
}: {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <Card className="border-border bg-card">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{title}</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        </div>
        <div className="mt-2 flex items-end gap-2">
          <span className="text-2xl font-bold text-foreground">{value}</span>
          <span
            className={`mb-0.5 flex items-center gap-0.5 text-xs font-medium ${
              trend === "up" ? "text-success" : "text-destructive"
            }`}
          >
            {trend === "up" ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {change}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

function MiniChart({
  data,
  title,
  color,
  unit,
}: {
  data: { time: string; value: number }[]
  title: string
  color: string
  unit: string
}) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id={`grad-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
                width={30}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                  color: "hsl(var(--foreground))",
                  fontSize: "12px",
                }}
                formatter={(val: number) => [`${val.toFixed(1)} ${unit}`, title]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                fill={`url(#grad-${title})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function OverviewPanel() {
  const healthyCount = services.filter((s) => s.status === "healthy").length
  const activeIncidents = incidents.filter((i) => i.status !== "resolved")
  const activeAgents = agents.filter((a) => a.status === "active" || a.status === "executing")

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground text-balance">Platform Overview</h1>
          <p className="text-sm text-muted-foreground">Real-time health and performance metrics</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>Last updated: just now</span>
          <span className="h-2 w-2 animate-pulse-glow rounded-full bg-success" />
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Services"
          value={services.length.toString()}
          change={`${healthyCount} healthy`}
          trend="up"
          icon={Server}
        />
        <MetricCard
          title="Active Agents"
          value={activeAgents.length.toString()}
          change={`${agents.length} total`}
          trend="up"
          icon={Bot}
        />
        <MetricCard
          title="Open Incidents"
          value={activeIncidents.length.toString()}
          change="1 healing"
          trend="down"
          icon={AlertTriangle}
        />
        <MetricCard
          title="Avg Response Time"
          value="42ms"
          change="-12% vs 1h"
          trend="up"
          icon={Zap}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <MiniChart
          data={requestMetrics}
          title="Requests / min"
          color="oklch(0.72 0.19 195)"
          unit="req/min"
        />
        <MiniChart
          data={latencyMetrics}
          title="P99 Latency"
          color="oklch(0.75 0.18 155)"
          unit="ms"
        />
        <MiniChart
          data={errorMetrics}
          title="Error Rate"
          color="oklch(0.65 0.2 25)"
          unit="errors/min"
        />
        <MiniChart
          data={cpuMetrics}
          title="CPU Utilization"
          color="oklch(0.80 0.15 85)"
          unit="%"
        />
      </div>

      {/* Service Health Grid */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Activity className="h-4 w-4 text-primary" />
              Service Health Matrix
            </CardTitle>
            <Badge variant="outline" className="font-mono text-xs">
              {services.length} services
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((svc) => (
              <div
                key={svc.id}
                className="flex flex-col gap-2 rounded-lg border border-border bg-secondary/30 p-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{svc.name}</span>
                  <span className={`h-2 w-2 rounded-full ${statusBg[svc.status]}`} />
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`border-transparent text-xs capitalize ${statusColor[svc.status]} bg-transparent`}
                  >
                    {svc.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{svc.region}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>CPU</span>
                      <span>{svc.cpu}%</span>
                    </div>
                    <Progress value={svc.cpu} className="h-1" />
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>MEM</span>
                      <span>{svc.memory}%</span>
                    </div>
                    <Progress value={svc.memory} className="h-1" />
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{svc.responseTime}ms</span>
                  <span>{svc.uptime}% uptime</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Agent Activity */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <ShieldCheck className="h-4 w-4 text-primary" />
              AI Agent Activity
            </CardTitle>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5 text-success" />
              <span>93.3% avg success rate</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="flex items-start gap-3 rounded-lg border border-border bg-secondary/30 p-3"
              >
                <div
                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    agent.status === "executing"
                      ? "bg-primary/20 text-primary"
                      : agent.status === "active"
                        ? "bg-success/20 text-success"
                        : "bg-secondary text-muted-foreground"
                  }`}
                >
                  <Bot className="h-4 w-4" />
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{agent.name}</span>
                    <Badge
                      variant="outline"
                      className={`text-xs capitalize ${
                        agent.status === "executing"
                          ? "border-primary/30 bg-primary/10 text-primary"
                          : agent.status === "active"
                            ? "border-success/30 bg-success/10 text-success"
                            : "border-border text-muted-foreground"
                      }`}
                    >
                      {agent.status}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">{agent.lastAction}</span>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{agent.actionsToday} actions today</span>
                    <span>{agent.successRate}% success</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
