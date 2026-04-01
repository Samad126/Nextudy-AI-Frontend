"use client"

import { useState } from "react"
import { PackageOpen } from "lucide-react"
import { Resource, SourceCitation } from "@/types"
import { ResourceTabBar } from "./ResourceTabBar"
import { ResourceContent } from "./ResourceContent"

interface ResourcePreviewPanelProps {
  resources: Resource[]
  activeCitation?: SourceCitation | null
  onDismissCitation?: () => void
}

export function ResourcePreviewPanel({ resources, activeCitation, onDismissCitation }: ResourcePreviewPanelProps) {
  // Tracks the user's explicit tab selection. null means "no override yet".
  const [selectedId, setSelectedId] = useState<number | null>(null)

  // Citation overrides the user's tab selection; fall back to user pick or first resource.
  const validSelectedId = resources.some((r) => r.id === selectedId) ? selectedId : null
  const resolvedId = activeCitation?.resourceId ?? validSelectedId
  const activeResource = resources.find((r) => r.id === resolvedId) ?? resources[0] ?? null

  if (resources.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
        <PackageOpen className="size-6 text-muted-foreground" />
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-foreground">
            No resources selected
          </p>
          <p className="text-xs text-muted-foreground">
            Select study materials to preview them here.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card">
      {/* Resource tabs */}
      <ResourceTabBar
        resources={resources}
        activeId={activeResource?.id ?? null}
        onTabClick={setSelectedId}
      />

      {/* Preview content */}
      {activeResource && (
        <ResourceContent
          resource={activeResource}
          highlight={
            activeCitation?.resourceId === activeResource.id
              ? activeCitation.snippet
              : undefined
          }
          onDismiss={onDismissCitation}
        />
      )}
    </div>
  )
}
