"use client"

import { PackageOpen } from "lucide-react"
import { Skeleton } from "@/shared/ui/skeleton"
import { Resource } from "@/types"
import { ResourceSelectItem } from "./ResourceSelectItem"

interface ResourcesTabContentProps {
  resources: Resource[]
  isLoading: boolean
  localSelected: Set<number>
  onToggle: (id: number) => void
}

export function ResourcesTabContent({
  resources,
  isLoading,
  localSelected,
  onToggle,
}: ResourcesTabContentProps) {
  if (isLoading) {
    return (
      <>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-xl" />
        ))}
      </>
    )
  }

  if (resources.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
        <PackageOpen className="size-5 text-muted-foreground" />
        <p className="text-xs text-muted-foreground">No resources in this workspace.</p>
      </div>
    )
  }

  return (
    <>
      {resources.map((resource) => (
        <ResourceSelectItem
          key={resource.id}
          resource={resource}
          checked={localSelected.has(resource.id)}
          onToggle={() => onToggle(resource.id)}
        />
      ))}
    </>
  )
}
