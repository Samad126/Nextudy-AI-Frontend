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
import { useRenameResourceGroup } from "../../mutations/use-rename-resource-group"

const schema = z.object({
  name: z.string().min(1, "Name is required"),
})
type FormValues = z.infer<typeof schema>

interface RenameGroupDialogProps {
  open: boolean
  setOpen: (v: boolean) => void
  workspaceId: number
  groupId: number
  currentName: string
}

export function RenameGroupDialog({
  open,
  setOpen,
  workspaceId,
  groupId,
  currentName,
}: RenameGroupDialogProps) {
  const { mutate: rename, isPending } = useRenameResourceGroup(workspaceId)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (open) reset({ name: currentName })
  }, [open, currentName, reset])

  function onSubmit(values: FormValues) {
    rename(
      { groupId, name: values.name },
      {
        onSuccess: () => {
          toast.success("Group renamed")
          setOpen(false)
        },
        onError: (err) => toast.error(getApiErrorMessage(err, "Failed to rename group")),
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Rename group</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-2 flex flex-col gap-4">
          <FormField
            id="group-name"
            label="Name"
            autoFocus
            error={errors.name?.message}
            {...register("name")}
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
