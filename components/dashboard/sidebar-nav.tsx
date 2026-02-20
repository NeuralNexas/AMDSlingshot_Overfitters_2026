"use client"

import { cn } from "@/lib/utils"
import {
  Activity,
  Bot,
  GitBranch,
  LayoutDashboard,
  AlertTriangle,
  Settings,
  Shield,
  Zap,
} from "lucide-react"

interface SidebarNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const navItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "services", label: "Services", icon: Activity },
  { id: "agents", label: "AI Agents", icon: Bot },
  { id: "workflows", label: "Workflows", icon: GitBranch },
  { id: "incidents", label: "Incidents", icon: AlertTriangle },
]

const bottomItems = [
  { id: "settings", label: "Settings", icon: Settings },
]

export function SidebarNav({ activeTab, onTabChange }: SidebarNavProps) {
  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-5 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Shield className="h-4 w-4 text-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">DevOps</span>
          <span className="text-xs text-muted-foreground">Self-Healing Platform</span>
        </div>
        <Zap className="ml-auto h-3.5 w-3.5 text-primary animate-pulse-glow" />
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-3" aria-label="Main navigation">
        <span className="mb-1 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Platform
        </span>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-4 w-4" />
              {item.label}
              {item.id === "incidents" && (
                <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-xs font-semibold text-destructive-foreground">
                  2
                </span>
              )}
            </button>
          )
        })}
      </nav>

      <div className="border-t border-border px-3 py-3">
        {bottomItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                activeTab === item.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          )
        })}
      </div>
    </aside>
  )
}
