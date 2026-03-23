"use client"

import { Checkbox } from "@/shared/ui/checkbox"
import { Resource } from "@/types"
import { cn } from "@/lib/utils"

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

interface ResourceSelectItemProps {
  resource: Resource
  checked: boolean
  onToggle: () => void
}

export function ResourceSelectItem({ resource, checked, onToggle }: ResourceSelectItemProps) {
  return (
    <div
      onClick={onToggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onToggle()}
      className={cn(
        "flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-colors",
        checked ? "border-primary bg-primary/5" : "border-border hover:bg-muted/40"
      )}
    >
      {/* stopPropagation prevents double-toggle: div onClick + checkbox onCheckedChange */}
      <Checkbox
        checked={checked}
        onCheckedChange={(val) => {
          if (val !== "indeterminate") onToggle()
        }}
        onClick={(e) => e.stopPropagation()}
      />
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-sm font-medium text-foreground truncate leading-tight">
          {resource.name}
        </span>
        <span className="text-xs text-muted-foreground">
          {resource.type.toUpperCase()} •{" "}
          {resource.file_size ? formatFileSize(resource.file_size) : "—"}
        </span>
      </div>
    </div>
  )
}
