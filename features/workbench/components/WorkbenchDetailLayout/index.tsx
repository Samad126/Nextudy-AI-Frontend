"use client"

import { useState } from "react"
import { Resource } from "@/types"
import { useGetWorkbenchResources } from "../../queries/use-get-workbench-resources"
import { useGetResources } from "@/features/resources/queries/use-get-resources"
import { WorkbenchDetailHeader, LayoutMode } from "../WorkbenchDetailHeader"
import { SelectSourceDialog } from "../SelectSourceDialog"
import { QAGeneratorView } from "../QAGeneratorView"
import { WorkbenchChatView } from "../WorkbenchChatView"
import { ResourcePreviewPanel } from "../ResourcePreviewPanel"
import { WorkbenchPanelTabs } from "./WorkbenchPanelTabs"
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

  // On desktop, respect the layout toggle. On mobile, always show both panels stacked.
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

      {/*
        Content panels.
        - Mobile: flex-col so panels stack vertically, each at ~50vh. Height is auto.
        - Desktop (md+): flex-row with a fixed viewport height, respecting layout toggle.
      */}
      <div className="flex flex-col md:flex-row gap-4 mt-4 md:h-[calc(100vh-230px)]">
        {/* Left panel — always visible on mobile, conditionally on desktop */}
        <div
          className={cn(
            "flex flex-col overflow-hidden rounded-xl border border-border bg-card",
            // Mobile: fixed height so both panels are visible
            "h-[50vh]",
            // Desktop: fill available space according to layout mode, override mobile height
            "md:h-auto",
            // Desktop visibility and sizing
            showLeft ? "md:flex" : "md:hidden",
            layout === "split" ? "md:flex-1 md:min-w-0" : "md:w-full"
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

        {/* Right panel — always visible on mobile, conditionally on desktop */}
        <div
          className={cn(
            "flex flex-col overflow-hidden",
            // Mobile: fixed height so both panels are visible
            "h-[50vh]",
            // Desktop: fill available space according to layout mode, override mobile height
            "md:h-auto",
            // Desktop visibility and sizing
            showRight ? "md:flex" : "md:hidden",
            layout === "split" ? "md:flex-1 md:min-w-0" : "md:w-full"
          )}
        >
          <ResourcePreviewPanel resources={selectedResources} />
        </div>
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
