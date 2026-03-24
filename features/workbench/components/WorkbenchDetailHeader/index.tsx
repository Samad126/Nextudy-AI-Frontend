"use client"

import { Minus, AlignLeft, Columns2, PanelRight } from "lucide-react"
import { LayoutButton } from "./LayoutButton"

export type LayoutMode = "left" | "split" | "right"

interface WorkbenchDetailHeaderProps {
  resourceCount: number
  onOpenSelectSource: () => void
  layout: LayoutMode
  onLayoutChange: (layout: LayoutMode) => void
}

export function WorkbenchDetailHeader({
  resourceCount,
  onOpenSelectSource,
  layout,
  onLayoutChange,
}: WorkbenchDetailHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-3 mb-0">
      {/* Left: Resource selector */}
      <button
        onClick={onOpenSelectSource}
        className="flex items-center gap-2 rounded-lg border border-border bg-card hover:bg-muted transition-colors px-3 py-1.5 text-sm font-semibold text-foreground"
      >
        <Minus className="size-3.5 text-muted-foreground" />
        <span>{resourceCount} RESOURCES</span>
        {resourceCount > 0 && (
          <span className="size-2 rounded-full bg-primary shrink-0" />
        )}
      </button>

      {/* Right: Layout toggle — hidden on mobile, visible on md+ */}
      <div className="hidden md:flex items-center gap-0.5 rounded-lg border border-border p-0.5">
        <LayoutButton
          active={layout === "left"}
          icon={<AlignLeft className="size-3.5" />}
          label="Left panel only"
          onClick={() => onLayoutChange("left")}
        />
        <LayoutButton
          active={layout === "split"}
          icon={<Columns2 className="size-3.5" />}
          label="Split view"
          onClick={() => onLayoutChange("split")}
        />
        <LayoutButton
          active={layout === "right"}
          icon={<PanelRight className="size-3.5" />}
          label="Right panel only"
          onClick={() => onLayoutChange("right")}
        />
      </div>
    </div>
  )
}
