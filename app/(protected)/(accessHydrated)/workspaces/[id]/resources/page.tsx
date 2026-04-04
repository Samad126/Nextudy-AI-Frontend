"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { FileText, Folders } from "lucide-react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { cn } from "@/lib/utils"
import { ResourcesTab } from "@/features/resources/components/ResourcesTab/ResourcesTab"
import { GroupsTab } from "@/features/resources/components/GroupsTab/GroupsTab"

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
      <div className="container">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Resources
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage files and organize them into groups for your workspace.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="mb-6 flex gap-1 border-b border-border">
          {TABS.map(({ id: tabId, label, icon: Icon }) => (
            <button
              key={tabId}
              onClick={() => setActiveTab(tabId)}
              className={cn(
                "relative flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors",
                activeTab === tabId
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="size-4" />
              {label}
              {activeTab === tabId && (
                <span className="absolute right-0 bottom-0 left-0 h-0.5 rounded-t-full bg-primary" />
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
