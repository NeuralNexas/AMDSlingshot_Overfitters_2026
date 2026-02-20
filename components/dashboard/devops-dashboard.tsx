"use client"

import { useState } from "react"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { TopBar } from "@/components/dashboard/top-bar"
import { OverviewPanel } from "@/components/dashboard/overview-panel"
import { ServicesPanel } from "@/components/dashboard/services-panel"
import { AgentsPanel } from "@/components/dashboard/agents-panel"
import { WorkflowPanel } from "@/components/dashboard/workflow-panel"
import { IncidentsPanel } from "@/components/dashboard/incidents-panel"
import { SettingsPanel } from "@/components/dashboard/settings-panel"

function ActivePanel({ tab }: { tab: string }) {
  switch (tab) {
    case "overview":
      return <OverviewPanel />
    case "services":
      return <ServicesPanel />
    case "agents":
      return <AgentsPanel />
    case "workflows":
      return <WorkflowPanel />
    case "incidents":
      return <IncidentsPanel />
    case "settings":
      return <SettingsPanel />
    default:
      return <OverviewPanel />
  }
}

export default function DevOpsDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <SidebarNav activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          <ActivePanel tab={activeTab} />
        </main>
      </div>
    </div>
  )
}