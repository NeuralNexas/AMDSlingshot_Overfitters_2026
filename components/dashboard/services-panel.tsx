"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { services, type Service, generateMetrics } from "@/lib/mock-data"
import {
  Activity,
  Clock,
  Cpu,
  Globe,
  HardDrive,
  RefreshCw,
  Server,
  TrendingUp,
  X,
  Zap,
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

const statusConfig: Record<string, { color: string; bg: string; border: string; label: string }> = {
  healthy: { color: "text-success", bg: "bg-success/10", border: "border-success/30", label: "Healthy" },
  warning: { color: "text-warning", bg: "bg-warning/10", border: "border-warning/30", label: "Warning" },
  critical: { color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/30", label: "Critical" },
  healing: { color: "text-primary", bg: "bg-primary/10", border: "border-primary/30", label: "Healing" },
}

function ServiceDetailSheet({ service, onClose }: { service: Service; onClose: () => void }) {
  const metrics = generateMetrics(20, service.responseTime, service.responseTime * 0.3)

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-border bg-card shadow-2xl">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-3">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${statusConfig[service.status].bg}`}>
            <Server className={`h-4 w-4 ${statusConfig[service.status].color}`} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">{service.name}</h3>
            <p className="text-xs text-muted-foreground">{service.id}</p>
          </div>
        </div>
        <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:bg-secondary" aria-label="Close detail panel">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <Badge className={`${statusConfig[service.status].bg} ${statusConfig[service.status].color} ${statusConfig[service.status].border}`}>
              {statusConfig[service.status].label}
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Globe className="h-3 w-3" />
              {service.region}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 rounded-lg border border-border bg-secondary/30 p-3">
              <span className="text-xs text-muted-foreground">Uptime</span>
              <span className="text-lg font-bold text-foreground">{service.uptime}%</span>
            </div>
            <div className="flex flex-col gap-1 rounded-lg border border-border bg-secondary/30 p-3">
              <span className="text-xs text-muted-foreground">Response Time</span>
              <span className="text-lg font-bold text-foreground">{service.responseTime}ms</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-medium text-foreground">Resource Usage</h4>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-muted-foreground"><Cpu className="h-3 w-3" /> CPU</span>
                  <span className="font-medium text-foreground">{service.cpu}%</span>
                </div>
                <Progress value={service.cpu} className="h-2" />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-muted-foreground"><HardDrive className="h-3 w-3" /> Memory</span>
                  <span className="font-medium text-foreground">{service.memory}%</span>
                </div>
                <Progress value={service.memory} className="h-2" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-medium text-foreground">Response Time (last 20m)</h4>
            <div className="h-36 rounded-lg border border-border bg-secondary/20 p-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics}>
                  <defs>
                    <linearGradient id="svc-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.72 0.19 195)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="oklch(0.72 0.19 195)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} width={25} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "6px", color: "hsl(var(--foreground))", fontSize: "11px" }}
                  />
                  <Area type="monotone" dataKey="value" stroke="oklch(0.72 0.19 195)" strokeWidth={2} fill="url(#svc-grad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Last incident: {service.lastIncident}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ServicesPanel() {
  const [selected, setSelected] = useState<Service | null>(null)
  const [filter, setFilter] = useState<string>("all")

  const filtered = filter === "all" ? services : services.filter((s) => s.status === filter)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground text-balance">Services</h1>
          <p className="text-sm text-muted-foreground">Monitor and manage all infrastructure services</p>
        </div>
        <button className="flex items-center gap-1.5 rounded-md border border-border bg-secondary/50 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        {["all", "healthy", "warning", "critical", "healing"].map((f) => (
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
            {f !== "all" && (
              <span className="ml-1.5 text-xs opacity-60">
                ({services.filter((s) => s.status === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Service Table */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-0">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Activity className="h-4 w-4 text-primary" />
            Service Registry
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 pt-4">
          <div className="overflow-x-auto">
            <table className="w-full" role="table">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-5 pb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Service</th>
                  <th className="px-5 pb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="px-5 pb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Uptime</th>
                  <th className="px-5 pb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Latency</th>
                  <th className="px-5 pb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">CPU</th>
                  <th className="px-5 pb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Memory</th>
                  <th className="px-5 pb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Region</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((svc) => {
                  const cfg = statusConfig[svc.status]
                  return (
                    <tr
                      key={svc.id}
                      onClick={() => setSelected(svc)}
                      className="cursor-pointer border-b border-border transition-colors hover:bg-secondary/30"
                      role="row"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && setSelected(svc)}
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <Server className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">{svc.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <Badge className={`${cfg.bg} ${cfg.color} ${cfg.border} text-xs capitalize`}>
                          <span className={`mr-1 h-1.5 w-1.5 rounded-full ${cfg.color.replace("text-", "bg-")}`} />
                          {svc.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 text-sm text-foreground">{svc.uptime}%</td>
                      <td className="px-5 py-3 text-sm text-foreground">{svc.responseTime}ms</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <Progress value={svc.cpu} className="h-1.5 w-16" />
                          <span className="text-xs text-muted-foreground">{svc.cpu}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <Progress value={svc.memory} className="h-1.5 w-16" />
                          <span className="text-xs text-muted-foreground">{svc.memory}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Globe className="h-3 w-3" />
                          {svc.region}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-5 py-3 text-xs text-muted-foreground">
            <span>Showing {filtered.length} of {services.length} services</span>
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-3 w-3 text-success" />
              <span>Overall health: 75%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {selected && <ServiceDetailSheet service={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
