"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { FileText, Folders } from "lucide-react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { cn } from "@/lib/utils"
import { ResourcesTab } from "@/features/resources/components/ResourcesTab"
import { GroupsTab } from "@/features/resources/components/GroupsTab"

type Tab = "resources" | "groups"

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "resources", label: "Resources", icon: FileText },
  { id: "groups", label: "Groups", icon: Folders },
]

export default function ResourcesPage() {
  const { id } = useParams<{ id: string }>()
  const workspaceId = Number(id)
  const [activeTab, setActiveTab] = useState<Tab>("resources")

  return (
    <DndProvider backend={HTML5Backend}>
    <div className="mx-auto w-auto max-w-7xl px-4 py-8 sm:px-6 xl:w-7xl">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">Resources</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage files and organize them into groups for your workspace.
        </p>
      </div>

      {/* Tab switcher */}
      <div className="flex border-b border-border mb-6 gap-1">
        {TABS.map(({ id: tabId, label, icon: Icon }) => (
          <button
            key={tabId}
            onClick={() => setActiveTab(tabId)}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors relative",
              activeTab === tabId
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="size-4" />
            {label}
            {activeTab === tabId && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "resources" ? (
        <ResourcesTab workspaceId={workspaceId} />
      ) : (
        <GroupsTab workspaceId={workspaceId} />
      )}
    </div>
    </DndProvider>
  )
}
