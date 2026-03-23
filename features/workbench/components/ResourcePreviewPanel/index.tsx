"use client"

import { useState } from "react"
import { PackageOpen } from "lucide-react"
import { Resource } from "@/types"
import { ResourceTabBar } from "./ResourceTabBar"
import { ResourceContent } from "./ResourceContent"

interface ResourcePreviewPanelProps {
  resources: Resource[]
}

export function ResourcePreviewPanel({ resources }: ResourcePreviewPanelProps) {
  const [activeId, setActiveId] = useState<number | null>(
    resources.length > 0 ? resources[0].id : null
  )

  // Sync active tab when resources change
  const activeResource =
    resources.find((r) => r.id === activeId) ?? resources[0] ?? null

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
        onTabClick={setActiveId}
      />

      {/* Preview content */}
      {activeResource && <ResourceContent resource={activeResource} />}
    </div>
  )
}

