"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import { FormField } from "@/shared/components/form-field"
import { useCreateWorkspace } from "../mutations/use-create-workspace"

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface CreateWorkspaceDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
}

function CreateWorkspaceDialog({ open, setOpen }: CreateWorkspaceDialogProps) {
  const { mutate, isPending } = useCreateWorkspace()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  function handleOpenChange(value: boolean) {
    setOpen(value)
    if (!value) reset()
  }

  function onSubmit(values: FormValues) {
    mutate(
      { name: values.name, description: values.description || undefined },
      {
        onSuccess: () => {
          setOpen(false)
          reset()
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New workspace</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-2 flex flex-col gap-4">
          <FormField
            id="ws-name"
            label={<>Name <span className="text-destructive">*</span></>}
            placeholder="e.g. Biology 101"
            autoFocus
            error={errors.name?.message}
            {...register("name")}
          />

          <FormField
            id="ws-description"
            label={<>Description <span className="text-xs font-normal text-muted-foreground">(optional)</span></>}
            placeholder="What is this workspace for?"
            {...register("description")}
          />

          <div className="flex justify-end gap-2 pt-1">
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

export default CreateWorkspaceDialog
