"use client"

import { useMemo, useState } from "react"
import { Search, FileText, File } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/shared/ui/input"
import { Checkbox } from "@/shared/ui/checkbox"
import { Label } from "@/shared/ui/label"
import { Resource } from "@/types"

interface ResourceMultiSelectProps {
  resources: Resource[]
  selectedIds: number[]
  onChange: (ids: number[]) => void
}

function ResourceIcon({ type }: { type: Resource["type"] }) {
  if (type === "PDF") return <FileText className="size-4 text-red-500" />
  if (type === "DOC") return <FileText className="size-4 text-blue-500" />
  return <File className="size-4 text-muted-foreground" />
}

export function ResourceMultiSelect({ resources, selectedIds, onChange }: ResourceMultiSelectProps) {
  const [search, setSearch] = useState("")

  const filtered = useMemo(
    () => resources.filter((r) => r.name.toLowerCase().includes(search.toLowerCase())),
    [resources, search]
  )

  function toggle(id: number) {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((x) => x !== id))
    } else {
      onChange([...selectedIds, id])
    }
  }

  function toggleAll() {
    if (selectedIds.length === filtered.length && filtered.length > 0) {
      onChange([])
    } else {
      onChange(filtered.map((r) => r.id))
    }
  }

  const allSelected = filtered.length > 0 && filtered.every((r) => selectedIds.includes(r.id))

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
        <Input
          placeholder="Search resources..."
          className="pl-8 h-8 text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-md border border-border overflow-hidden w-full">
        {/* Select all row */}
        <div className="flex items-center gap-2.5 px-3 py-2 border-b border-border bg-muted/30">
          <Checkbox
            id="resource-select-all"
            checked={allSelected}
            onCheckedChange={toggleAll}
          />
          <Label htmlFor="resource-select-all" className="text-xs font-medium cursor-pointer">
            Select all ({filtered.length})
          </Label>
        </div>

        {/* Resource list */}
        <div className="max-h-52 overflow-y-auto divide-y divide-border">
          {filtered.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">No resources found</p>
          ) : (
            filtered.map((resource) => (
              <label
                key={resource.id}
                className={cn(
                  "grid grid-cols-[auto_auto_1fr] items-center gap-2.5 px-3 py-2 w-full cursor-pointer transition-colors",
                  selectedIds.includes(resource.id) ? "bg-primary/5" : "hover:bg-muted/40"
                )}
              >
                <Checkbox
                  checked={selectedIds.includes(resource.id)}
                  onCheckedChange={() => toggle(resource.id)}
                />
                <ResourceIcon type={resource.type} />
                <span className="text-sm truncate">{resource.name}</span>
              </label>
            ))
          )}
        </div>
      </div>

      {selectedIds.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {selectedIds.length} resource{selectedIds.length !== 1 ? "s" : ""} selected
        </p>
      )}
    </div>
  )
}
