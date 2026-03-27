"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Resource, SourceCitation } from "@/types"
import { useSocket } from "@/shared/providers/socket-provider"
import { useGetWorkbenchResources } from "../../queries/use-get-workbench-resources"
import { useGetResources } from "@/features/resources/queries/use-get-resources"
import { WorkbenchDetailHeader, LayoutMode } from "../WorkbenchDetailHeader"
import { SelectSourceDialog } from "../SelectSourceDialog"
import { QAGeneratorView } from "../QAGeneratorView"
import { QuestionsDialog } from "../QuestionsDialog"
import { ResourcePreviewPanel } from "../ResourcePreviewPanel"
import { WorkbenchPanelTabs } from "./WorkbenchPanelTabs"
import { CitationProvider } from "../../context/citation-context"
import { cn } from "@/lib/utils"
import { WorkbenchChatView } from "@/features/chat/components"

type ActiveTab = "qa" | "chat"

interface WorkbenchDetailLayoutProps {
  workbenchId: number
  workspaceId: number
}

export function WorkbenchDetailLayout({
  workbenchId,
  workspaceId,
}: WorkbenchDetailLayoutProps) {
  const { socket } = useSocket()
  const socketRef = useRef(socket)
  useEffect(() => {
    socketRef.current = socket
  }, [socket])

  const [ui, setUi] = useState<{ layout: LayoutMode; activeTab: ActiveTab }>({
    layout: "split",
    activeTab: "qa",
  })
  const [questionsDialog, setQuestionsDialog] = useState({
    open: false,
    isRegen: false,
  })
  const [sourceDialogOpen, setSourceDialogOpen] = useState(false)
  // null means "not overridden yet" — derive from server data instead
  const [localSelectedIds, setLocalSelectedIds] = useState<Set<number> | null>(null)
  const [activeCitation, setActiveCitation] = useState<SourceCitation | null>(null)

  // Connect when the chat tab is active
  useEffect(() => {
    if (ui.activeTab !== "chat" || !socket) return
    socket.connect()
  }, [ui.activeTab, socket])

  // Disconnect only when leaving the page
  useEffect(() => {
    return () => {
      socketRef.current?.disconnect()
    }
  }, [])

  const { data: workbenchResources = [] } = useGetWorkbenchResources(workbenchId)
  const { data: allResources = [] } = useGetResources(workspaceId)

  // Use local override if the user has confirmed a selection; otherwise derive from server
  const selectedIds =
    localSelectedIds ?? new Set(workbenchResources.map((r) => r.id))

  const selectedResources: Resource[] = allResources.filter((r) =>
    selectedIds.has(r.id)
  )
  const hasResources = selectedIds.size > 0

  const handleGenerate = useCallback(() => {
    setQuestionsDialog({ open: true, isRegen: false })
  }, [])

  const handleRegenerate = useCallback(() => {
    setQuestionsDialog({ open: true, isRegen: true })
  }, [])

  const handleSourceClick = useCallback((citation: SourceCitation) => {
    setActiveCitation(citation)
    setUi((prev) => ({ ...prev, layout: "split" }))
  }, [])

  // On desktop, respect the layout toggle. On mobile, always show both panels stacked.
  const showLeft = ui.layout === "left" || ui.layout === "split"
  const showRight = ui.layout === "right" || ui.layout === "split"

  return (
    <CitationProvider value={handleSourceClick}>
      <div className="-mt-2 flex flex-col gap-0">
        <WorkbenchDetailHeader
          resourceCount={selectedIds.size}
          onOpenSelectSource={() => setSourceDialogOpen(true)}
          layout={ui.layout}
          onLayoutChange={(layout) => setUi((prev) => ({ ...prev, layout }))}
        />

        {/*
        Content panels.
        - Mobile: flex-col so panels stack vertically, each at ~50vh. Height is auto.
        - Desktop (md+): flex-row with a fixed viewport height, respecting layout toggle.
      */}
        <div className="mt-4 flex flex-col gap-4 md:h-[calc(100vh-230px)] md:flex-row">
          {/* Left panel — always visible on mobile, conditionally on desktop */}
          <div
            className={cn(
              "flex flex-col overflow-hidden rounded-xl border border-border bg-card",
              // Mobile: fixed height so both panels are visible
              "h-[70dvh]",
              // Desktop: fill available space according to layout mode, override mobile height
              "md:h-auto",
              // Desktop visibility and sizing
              showLeft ? "md:flex" : "md:hidden",
              ui.layout === "split" ? "md:min-w-0 md:flex-1" : "md:w-full"
            )}
          >
            <WorkbenchPanelTabs
              activeTab={ui.activeTab}
              onTabChange={(activeTab) => setUi((prev) => ({ ...prev, activeTab }))}
            />
            <div className="flex-1 overflow-hidden px-4 pt-3 pb-4">
              {ui.activeTab === "qa" ? (
                <QAGeneratorView
                  hasResources={hasResources}
                  workbenchId={workbenchId}
                  workspaceId={workspaceId}
                  onGenerate={handleGenerate}
                  onRegenerate={handleRegenerate}
                />
              ) : (
                <WorkbenchChatView workbenchId={workbenchId} />
              )}
            </div>
          </div>

          {/* Right panel — always visible on mobile, conditionally on desktop */}
          <div
            className={cn(
              "flex flex-col overflow-hidden",
              // Mobile: fixed height so both panels are visible
              "h-[70dvh]",
              // Desktop: fill available space according to layout mode, override mobile height
              "md:h-auto",
              // Desktop visibility and sizing
              showRight ? "md:flex" : "md:hidden",
              ui.layout === "split" ? "md:min-w-0 md:flex-1" : "md:w-full"
            )}
          >
            <ResourcePreviewPanel
              resources={selectedResources}
              activeCitation={activeCitation}
            />
          </div>
        </div>

        <QuestionsDialog
          open={questionsDialog.open}
          setOpen={(open) => setQuestionsDialog((prev) => ({ ...prev, open }))}
          workbenchId={workbenchId}
          isRegenerate={questionsDialog.isRegen}
        />

        <SelectSourceDialog
          open={sourceDialogOpen}
          setOpen={setSourceDialogOpen}
          workspaceId={workspaceId}
          workbenchId={workbenchId}
          selectedIds={selectedIds}
          onConfirm={setLocalSelectedIds}
        />
      </div>
    </CitationProvider>
  )
}
