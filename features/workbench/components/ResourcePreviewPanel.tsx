"use client"

import { useState } from "react"
import { FileText, PackageOpen } from "lucide-react"
import { Resource } from "@/types"
import { cn } from "@/lib/utils"
import { FileViewer } from "@/shared/components/file-viewer"

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

function ResourceTabBar({
  resources,
  activeId,
  onTabClick,
}: {
  resources: Resource[]
  activeId: number | null
  onTabClick: (id: number) => void
}) {
  return (
    <div className="scrollbar-hide flex shrink-0 items-center gap-0 overflow-x-auto border-b border-border">
      {resources.map((r) => (
        <button
          key={r.id}
          onClick={() => onTabClick(r.id)}
          className={cn(
            "flex shrink-0 items-center gap-1.5 border-b-2 px-4 py-2.5 text-xs font-medium whitespace-nowrap transition-colors",
            activeId === r.id
              ? "border-primary bg-muted/30 text-foreground"
              : "border-transparent text-muted-foreground hover:bg-muted/20 hover:text-foreground"
          )}
        >
          <ResourceTypeDot type={r.type} />
          <span className="max-w-[140px] truncate">{r.name}</span>
        </button>
      ))}
    </div>
  )
}

function ResourceTypeDot({ type }: { type: string }) {
  const colorMap: Record<string, string> = {
    PDF: "bg-red-400",
    DOC: "bg-blue-400",
    IMAGE: "bg-purple-400",
    TXT: "bg-gray-400",
  }
  return (
    <span
      className={cn(
        "size-2 shrink-0 rounded-full",
        colorMap[type.toUpperCase()] ?? "bg-muted-foreground"
      )}
    />
  )
}

function ResourceContent({ resource }: { resource: Resource }) {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* File header */}
      <div className="shrink-0 border-b border-border px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
            <FileText className="size-4 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-sm leading-snug font-semibold text-foreground">
              {resource.name}
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {resource.type.toUpperCase()} •{" "}
              {resource.file_size
                ? formatFileSize(resource.file_size)
                : "Unknown size"}
            </p>
          </div>
        </div>
      </div>

      {/* File viewer — PDF manages its own scroll via defaultLayoutPlugin */}
      <div className="flex-1 overflow-hidden">
        <FileViewer resource={resource} />
      </div>
    </div>
  )
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}
