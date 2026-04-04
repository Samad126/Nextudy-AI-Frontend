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
import { useCreateResourceGroup } from "../../mutations/use-create-resource-group"

const schema = z.object({
  name: z.string().min(1, "Name is required"),
})
type FormValues = z.infer<typeof schema>

interface CreateGroupDialogProps {
  open: boolean
  setOpen: (v: boolean) => void
  workspaceId: number
}

export function CreateGroupDialog({ open, setOpen, workspaceId }: CreateGroupDialogProps) {
  const { mutate: create, isPending } = useCreateResourceGroup(workspaceId)

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
    create({ name: values.name }, {
      onSuccess: () => {
        toast.success("Group created")
        reset()
        setOpen(false)
      },
      onError: (err) => toast.error(getApiErrorMessage(err, "Failed to create group")),
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>New group</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-2 flex flex-col gap-4">
          <FormField
            id="new-group-name"
            label={<>Name <span className="text-destructive">*</span></>}
            placeholder="e.g. Chapter 1"
            autoFocus
            error={errors.name?.message}
            {...register("name")}
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
