"use client"

import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { Textarea } from "@/shared/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/ui/dialog"
import { useUpdateWorkspace } from "@/features/workspace/mutations/use-update-workspace"
import type { Workspace } from "@/features/workspace/types/workspace"

interface EditWorkspaceDialogProps {
  workspace: Workspace
  open: boolean
  onClose: () => void
}

export function EditWorkspaceDialog({ workspace, open, onClose }: EditWorkspaceDialogProps) {
  const { register, handleSubmit } = useForm({
    defaultValues: { name: workspace.name, desc: workspace.description ?? "" },
  })
  const { mutate, isPending } = useUpdateWorkspace()

  function onSubmit(data: { name: string; desc: string }) {
    const patch: { name?: string; description?: string } = {}
    if (data.name !== workspace.name) patch.name = data.name
    if (data.desc !== (workspace.description ?? "")) patch.description = data.desc
    if (Object.keys(patch).length === 0) { onClose(); return }

    mutate(
      { id: workspace.id, ...patch },
      {
        onSuccess: () => { toast.success("Workspace updated"); onClose() },
        onError: () => toast.error("Failed to update workspace"),
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Workspace</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="ws-name">Name</Label>
            <Input id="ws-name" {...register("name")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ws-desc">Description</Label>
            <Textarea id="ws-desc" {...register("desc")} rows={3} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="size-4 mr-2 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
