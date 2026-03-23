"use client"

import { useState } from "react"
import { Resource } from "@/types"
import { useGetWorkbenchResources } from "../queries/use-get-workbench-resources"
import { useGetResources } from "@/features/resources/queries/use-get-resources"
import { WorkbenchDetailHeader, LayoutMode } from "./WorkbenchDetailHeader"
import { SelectSourceDialog } from "./SelectSourceDialog"
import { QAGeneratorView } from "./QAGeneratorView"
import { WorkbenchChatView } from "./WorkbenchChatView"
import { ResourcePreviewPanel } from "./ResourcePreviewPanel"
import { cn } from "@/lib/utils"

type ActiveTab = "qa" | "chat"

interface WorkbenchDetailLayoutProps {
  workbenchId: number
  workspaceId: number
}

export function WorkbenchDetailLayout({ workbenchId, workspaceId }: WorkbenchDetailLayoutProps) {
  const [layout, setLayout] = useState<LayoutMode>("split")
  const [activeTab, setActiveTab] = useState<ActiveTab>("qa")
  const [sourceDialogOpen, setSourceDialogOpen] = useState(false)
  // null means "not overridden yet" — derive from server data instead
  const [localSelectedIds, setLocalSelectedIds] = useState<Set<number> | null>(null)

  const { data: workbenchResources = [] } = useGetWorkbenchResources(workbenchId)
  const { data: allResources = [] } = useGetResources(workspaceId)

  // Use local override if the user has confirmed a selection; otherwise derive from server
  const selectedIds = localSelectedIds ?? new Set(workbenchResources.map((r) => r.id))

  const selectedResources: Resource[] = allResources.filter((r) => selectedIds.has(r.id))
  const hasResources = selectedIds.size > 0

  const showLeft = layout === "left" || layout === "split"
  const showRight = layout === "right" || layout === "split"

  return (
    <div className="flex flex-col gap-0 -mt-2">
      <WorkbenchDetailHeader
        resourceCount={selectedIds.size}
        onOpenSelectSource={() => setSourceDialogOpen(true)}
        layout={layout}
        onLayoutChange={setLayout}
        onNew={() => {}}
        onHistory={() => {}}
        onSettings={() => {}}
      />

      {/* Content panels */}
      <div className="flex gap-4 mt-4" style={{ height: "calc(100vh - 230px)" }}>
        {/* Left panel */}
        {showLeft && (
          <div
            className={cn(
              "flex flex-col overflow-hidden rounded-xl border border-border bg-card",
              layout === "split" ? "flex-1 min-w-0" : "w-full"
            )}
          >
            <WorkbenchPanelTabs activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="flex-1 overflow-hidden px-4 pb-4 pt-3">
              {activeTab === "qa" ? (
                <QAGeneratorView hasResources={hasResources} />
              ) : (
                <WorkbenchChatView hasResources={hasResources} />
              )}
            </div>
          </div>
        )}

        {/* Right panel */}
        {showRight && (
          <div
            className={cn(
              "flex flex-col overflow-hidden",
              layout === "split" ? "flex-1 min-w-0" : "w-full"
            )}
          >
            <ResourcePreviewPanel resources={selectedResources} />
          </div>
        )}
      </div>

      <SelectSourceDialog
        open={sourceDialogOpen}
        setOpen={setSourceDialogOpen}
        workspaceId={workspaceId}
        workbenchId={workbenchId}
        selectedIds={selectedIds}
        onConfirm={setLocalSelectedIds}
      />
    </div>
  )
}

function WorkbenchPanelTabs({
  activeTab,
  onTabChange,
}: {
  activeTab: ActiveTab
  onTabChange: (tab: ActiveTab) => void
}) {
  return (
    <div className="flex shrink-0 border-b border-border px-4">
      <PanelTab
        label="Q&A GENERATOR"
        active={activeTab === "qa"}
        onClick={() => onTabChange("qa")}
      />
      <PanelTab
        label="CHAT"
        active={activeTab === "chat"}
        onClick={() => onTabChange("chat")}
      />
    </div>
  )
}

function PanelTab({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-2.5 text-xs font-semibold tracking-wide transition-colors border-b-2 -mb-px",
        active
          ? "border-primary text-foreground"
          : "border-transparent text-muted-foreground hover:text-foreground"
      )}
    >
      {label}
    </button>
  )
}
