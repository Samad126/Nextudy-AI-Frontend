"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { getApiErrorMessage } from "@/lib/api/get-api-error"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Textarea } from "@/shared/ui/textarea"
import { Label } from "@/shared/ui/label"
import { FlashcardSet } from "../../types/flashcard"
import { useUpdateFlashcardSet } from "../../mutations/use-update-flashcard-set"
import { useGetResources } from "@/features/resources/queries/use-get-resources"
import { ResourceMultiSelect } from "@/shared/components/ResourceMultiSelect"

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  resourceIds: z.array(z.number()).optional(),
})
type FormValues = z.infer<typeof schema>

interface EditSetTabProps {
  set: FlashcardSet
  workspaceId: number
}

export function EditSetTab({ set, workspaceId }: EditSetTabProps) {
  const { mutate: update, isPending } = useUpdateFlashcardSet(workspaceId)
  const { data: resources = [] } = useGetResources(workspaceId)

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: set.title,
      description: set.description ?? "",
      resourceIds: set.resources.map((r) => r.id),
    },
  })

  useEffect(() => {
    reset({
      title: set.title,
      description: set.description ?? "",
      resourceIds: set.resources.map((r) => r.id),
    })
  }, [set, reset])

  function onSubmit(values: FormValues) {
    update(
      {
        id: set.id,
        title: values.title,
        description: values.description || undefined,
        resourceIds: values.resourceIds,
      },
      {
        onSuccess: () => toast.success("Set updated"),
        onError: (err) => toast.error(getApiErrorMessage(err, "Failed to update set")),
      }
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="edit-title">
          Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="edit-title"
          {...register("title")}
        />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="edit-desc">Description</Label>
        <Textarea
          id="edit-desc"
          rows={3}
          className="resize-none"
          {...register("description")}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Resources</Label>
        <ResourceMultiSelect
          resources={resources}
          selectedIds={watch("resourceIds") ?? []}
          onChange={(ids) => setValue("resourceIds", ids)}
        />
      </div>

      <div>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  )
}
