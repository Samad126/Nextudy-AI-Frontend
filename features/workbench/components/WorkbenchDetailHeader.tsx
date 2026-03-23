"use client"

import { Minus, Plus, Clock, SlidersHorizontal, AlignLeft, Columns2, PanelRight } from "lucide-react"
import { cn } from "@/lib/utils"

export type LayoutMode = "left" | "split" | "right"

interface WorkbenchDetailHeaderProps {
  resourceCount: number
  onOpenSelectSource: () => void
  layout: LayoutMode
  onLayoutChange: (layout: LayoutMode) => void
  onNew: () => void
  onHistory: () => void
  onSettings: () => void
}

export function WorkbenchDetailHeader({
  resourceCount,
  onOpenSelectSource,
  layout,
  onLayoutChange,
  onNew,
  onHistory,
  onSettings,
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

      {/* Center: Action buttons */}
      <div className="flex items-center gap-0.5">
        <ActionButton icon={<Plus className="size-3.5" />} label="New" onClick={onNew} />
        <ActionButton icon={<Clock className="size-3.5" />} label="History" onClick={onHistory} />
        <ActionButton
          icon={<SlidersHorizontal className="size-3.5" />}
          label="Settings"
          onClick={onSettings}
        />
      </div>

      {/* Right: Layout toggle */}
      <div className="flex items-center gap-0.5 rounded-lg border border-border p-0.5">
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

function ActionButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
    >
      {icon}
      {label}
    </button>
  )
}

function LayoutButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean
  icon: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={cn(
        "rounded-md p-1.5 transition-colors",
        active
          ? "bg-foreground text-background"
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      )}
    >
      {icon}
    </button>
  )
}
