"use client"

import { useState } from "react"
import { FileText, PackageOpen } from "lucide-react"
import { Resource } from "@/types"
import { cn } from "@/lib/utils"

interface ResourcePreviewPanelProps {
  resources: Resource[]
}

export function ResourcePreviewPanel({ resources }: ResourcePreviewPanelProps) {
  const [activeId, setActiveId] = useState<number | null>(
    resources.length > 0 ? resources[0].id : null
  )

  // Sync active tab when resources change
  const activeResource = resources.find((r) => r.id === activeId) ?? resources[0] ?? null

  if (resources.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border text-center py-16">
        <PackageOpen className="size-6 text-muted-foreground" />
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-foreground">No resources selected</p>
          <p className="text-xs text-muted-foreground">
            Select study materials to preview them here.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-hidden rounded-xl border border-border bg-card">
      {/* Resource tabs */}
      <ResourceTabBar
        resources={resources}
        activeId={activeResource?.id ?? null}
        onTabClick={setActiveId}
      />

      {/* Preview content */}
      {activeResource && (
        <ResourceContent resource={activeResource} />
      )}
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
    <div className="flex items-center gap-0 border-b border-border overflow-x-auto shrink-0 scrollbar-hide">
      {resources.map((r) => (
        <button
          key={r.id}
          onClick={() => onTabClick(r.id)}
          className={cn(
            "flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium whitespace-nowrap transition-colors border-b-2 shrink-0",
            activeId === r.id
              ? "border-primary text-foreground bg-muted/30"
              : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/20"
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
      className={cn("size-2 rounded-full shrink-0", colorMap[type.toUpperCase()] ?? "bg-muted-foreground")}
    />
  )
}

function ResourceContent({ resource }: { resource: Resource }) {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-prose mx-auto">
        {/* File header */}
        <div className="mb-6 pb-4 border-b border-border">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
              <FileText className="size-5 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-foreground leading-snug break-words">
                {resource.name}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {resource.type.toUpperCase()} •{" "}
                {resource.file_size ? formatFileSize(resource.file_size) : "Unknown size"}
              </p>
            </div>
          </div>
        </div>

        {/* Placeholder preview text */}
        <ResourcePlaceholderContent />
      </div>
    </div>
  )
}

function ResourcePlaceholderContent() {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground/60 font-mono leading-relaxed">
        x 3T0 B]C ani &nbsp; U &nbsp; z&amp;` &nbsp; 8 ( &nbsp; h ^ _a &nbsp;&nbsp;&nbsp;&nbsp; r
      </p>
      <div className="flex flex-col gap-2 mt-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-3 rounded bg-muted/50" style={{ width: `${75 + Math.sin(i) * 15}%` }} />
        ))}
      </div>
      <div className="flex flex-col gap-2 mt-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-3 rounded bg-muted/50" style={{ width: `${60 + Math.cos(i) * 20}%` }} />
        ))}
      </div>
    </div>
  )
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}
