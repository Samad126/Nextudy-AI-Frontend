"use client"

import { UseFormReturn } from "react-hook-form"
import { Resource } from "@/types"
import { ResourceMultiSelect } from "@/shared/components/ResourceMultiSelect"
import type { CreateSetFormValues } from "./index"

interface StepResourcesProps {
  form: UseFormReturn<CreateSetFormValues>
  resources: Resource[]
}

export function StepResources({ form, resources }: StepResourcesProps) {
  const { watch, setValue, formState: { errors } } = form
  const resourceIds = watch("resourceIds") ?? []

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">
        Select the resources AI will use to generate your flashcards.
      </p>
      <ResourceMultiSelect
        resources={resources}
        selectedIds={resourceIds}
        onChange={(ids) => setValue("resourceIds", ids, { shouldValidate: true })}
      />
      {errors.resourceIds && (
        <p className="text-xs text-destructive">{errors.resourceIds.message}</p>
      )}
    </div>
  )
}
