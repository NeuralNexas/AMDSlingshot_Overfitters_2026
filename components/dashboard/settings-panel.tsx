"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Settings,
  Shield,
  Bot,
  GitBranch,
  Bell,
  Database,
  Key,
  Globe,
  Terminal,
} from "lucide-react"

interface SettingToggle {
  id: string
  label: string
  description: string
  enabled: boolean
}

export function SettingsPanel() {
  const [healingSettings, setHealingSettings] = useState<SettingToggle[]>([
    { id: "auto-heal", label: "Auto-Healing", description: "Automatically apply remediation for known issue patterns", enabled: true },
    { id: "ai-diagnosis", label: "AI-Powered Diagnosis", description: "Use LLM agents for root cause analysis", enabled: true },
    { id: "predictive", label: "Predictive Alerts", description: "Predict issues before they impact services", enabled: true },
    { id: "auto-scale", label: "Auto-Scaling", description: "Automatically scale resources based on demand", enabled: true },
    { id: "rollback", label: "Auto-Rollback", description: "Automatically roll back failed deployments", enabled: false },
    { id: "notifications", label: "Slack Notifications", description: "Send incident notifications to Slack", enabled: true },
  ])

  const toggleSetting = (id: string) => {
    setHealingSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground text-balance">Settings</h1>
        <p className="text-sm text-muted-foreground">Configure your self-healing platform</p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Self-Healing Config */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Shield className="h-4 w-4 text-primary" />
              Self-Healing Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {healingSettings.map((setting) => (
              <div key={setting.id} className="flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-foreground">{setting.label}</span>
                  <span className="text-xs text-muted-foreground">{setting.description}</span>
                </div>
                <Switch
                  checked={setting.enabled}
                  onCheckedChange={() => toggleSetting(setting.id)}
                  aria-label={`Toggle ${setting.label}`}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Integrations */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <GitBranch className="h-4 w-4 text-primary" />
              Integrations
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {[
              { name: "FastAPI Backend", icon: Terminal, status: "connected", version: "v0.104.1" },
              { name: "LangFlow Workflows", icon: GitBranch, status: "connected", version: "v1.0.18" },
              { name: "OpenAI GPT-4o", icon: Bot, status: "connected", version: "2024-08" },
              { name: "PagerDuty", icon: Bell, status: "connected", version: "v3" },
              { name: "PostgreSQL", icon: Database, status: "connected", version: "16.2" },
              { name: "Prometheus", icon: Globe, status: "pending", version: "-" },
            ].map((integration) => {
              const Icon = integration.icon
              return (
                <div
                  key={integration.name}
                  className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-foreground">{integration.name}</span>
                      <p className="font-mono text-xs text-muted-foreground">{integration.version}</p>
                    </div>
                  </div>
                  <Badge
                    className={`text-xs capitalize ${
                      integration.status === "connected"
                        ? "bg-success/10 text-success border-success/30"
                        : "bg-warning/10 text-warning border-warning/30"
                    }`}
                  >
                    {integration.status}
                  </Badge>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* API Keys */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Key className="h-4 w-4 text-primary" />
              API Keys
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {[
              { name: "OPENAI_API_KEY", masked: "sk-...4f2a", lastUsed: "2s ago" },
              { name: "ANTHROPIC_API_KEY", masked: "sk-ant-...8b1c", lastUsed: "1m ago" },
              { name: "PAGERDUTY_TOKEN", masked: "u+...9xK2", lastUsed: "3h ago" },
              { name: "SLACK_WEBHOOK", masked: "https://...T024", lastUsed: "12m ago" },
            ].map((key) => (
              <div key={key.name} className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3">
                <div className="flex flex-col gap-0.5">
                  <span className="font-mono text-sm font-medium text-foreground">{key.name}</span>
                  <span className="font-mono text-xs text-muted-foreground">{key.masked}</span>
                </div>
                <span className="text-xs text-muted-foreground">Used {key.lastUsed}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Architecture */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Settings className="h-4 w-4 text-primary" />
              Platform Architecture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {[
                { layer: "Backend", tech: "Python / FastAPI", desc: "REST API + WebSocket server", color: "text-primary" },
                { layer: "AI Agents", tech: "LLM + Custom Logic", desc: "Monitor, Diagnose, Remediate, Predict", color: "text-chart-5" },
                { layer: "Workflow", tech: "LangFlow / Node-RED", desc: "Visual pipeline orchestration", color: "text-success" },
                { layer: "Dashboard", tech: "Streamlit / Retool", desc: "Real-time observability & control", color: "text-warning" },
              ].map((item, i) => (
                <div key={item.layer} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-secondary text-xs font-bold text-foreground">
                    {i + 1}
                  </div>
                  <div className="flex flex-1 flex-col gap-0.5 rounded-lg border border-border bg-secondary/30 p-2.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${item.color}`}>{item.layer}</span>
                      <Badge variant="outline" className="font-mono text-[10px]">{item.tech}</Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">{item.desc}</span>
                  </div>
                  {i < 3 && (
                    <div className="absolute left-[39px] mt-16 h-3 w-px bg-border" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
