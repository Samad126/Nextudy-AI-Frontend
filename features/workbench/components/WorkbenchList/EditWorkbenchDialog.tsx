"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { getApiErrorMessage } from "@/lib/api/get-api-error"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import { FormField } from "@/shared/components/form-field"
import { Workbench } from "@/types"
import { useUpdateWorkbench } from "../../mutations/use-update-workbench"

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
})
type FormValues = z.infer<typeof schema>

interface EditWorkbenchDialogProps {
  open: boolean
  setOpen: (v: boolean) => void
  workspaceId: number
  workbench: Workbench
}

export function EditWorkbenchDialog({
  open,
  setOpen,
  workspaceId,
  workbench,
}: EditWorkbenchDialogProps) {
  const { mutate: update, isPending } = useUpdateWorkbench(workspaceId)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (open) {
      reset({ name: workbench.name, description: workbench.description ?? "" })
    }
  }, [open, workbench.id, reset])

  function onSubmit(values: FormValues) {
    update(
      {
        id: workbench.id,
        name: values.name,
        description: values.description || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Workbench updated")
          setOpen(false)
        },
        onError: (err) => toast.error(getApiErrorMessage(err, "Failed to update workbench")),
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit workbench</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-2 flex flex-col gap-4">
          <FormField
            id="edit-workbench-name"
            label={<>Name <span className="text-destructive">*</span></>}
            autoFocus
            error={errors.name?.message}
            {...register("name")}
          />
          <FormField
            id="edit-workbench-description"
            label="Description"
            placeholder="Optional description"
            error={errors.description?.message}
            {...register("description")}
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
