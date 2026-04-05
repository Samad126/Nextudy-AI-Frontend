"use client"

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
import { useCreateWorkbench } from "../../mutations/use-create-workbench"

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
})
type FormValues = z.infer<typeof schema>

interface CreateWorkbenchDialogProps {
  open: boolean
  setOpen: (v: boolean) => void
  workspaceId: number
}

export function CreateWorkbenchDialog({ open, setOpen, workspaceId }: CreateWorkbenchDialogProps) {
  const { mutate: create, isPending } = useCreateWorkbench(workspaceId)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  function handleOpenChange(v: boolean) {
    if (!v) reset()
    setOpen(v)
  }

  function onSubmit(values: FormValues) {
    create(
      { name: values.name, description: values.description || undefined, workspaceId },
      {
        onSuccess: () => {
          toast.success("Workbench created")
          reset()
          setOpen(false)
        },
        onError: (err) => toast.error(getApiErrorMessage(err, "Failed to create workbench")),
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>New workbench</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-2 flex flex-col gap-4">
          <FormField
            id="workbench-name"
            label={<>Name <span className="text-destructive">*</span></>}
            placeholder="e.g. Week 3 Study Session"
            autoFocus
            error={errors.name?.message}
            {...register("name")}
          />
          <FormField
            id="workbench-description"
            label="Description"
            placeholder="Optional description"
            error={errors.description?.message}
            {...register("description")}
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
