"use client"

import { Badge } from "@/components/ui/badge"
import { Bell, Search, ChevronDown } from "lucide-react"

export function TopBar() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-md border border-border bg-secondary/50 px-3 py-1.5">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search services, incidents..."
            className="w-56 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            aria-label="Search"
          />
          <kbd className="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
            /
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Badge variant="outline" className="gap-1.5 border-success/30 bg-success/10 text-success">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          6 Healthy
        </Badge>
        <Badge variant="outline" className="gap-1.5 border-warning/30 bg-warning/10 text-warning">
          <span className="h-1.5 w-1.5 rounded-full bg-warning" />
          1 Warning
        </Badge>
        <Badge variant="outline" className="gap-1.5 border-destructive/30 bg-destructive/10 text-destructive">
          <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
          1 Critical
        </Badge>

        <div className="mx-1 h-5 w-px bg-border" />

        <button className="relative rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
            3
          </span>
        </button>

        <button className="flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-secondary" aria-label="User menu">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            D
          </div>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </button>
      </div>
    </header>
  )
}
