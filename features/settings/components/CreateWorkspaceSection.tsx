"use client"

import { useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"
import { Plus, Loader2 } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { useCreateWorkspace } from "@/features/workspace/mutations/use-create-workspace"

export function CreateWorkspaceSection() {
  const [open, setOpen] = useState(false)
  const { register, handleSubmit, reset, control } = useForm({
    defaultValues: { name: "", desc: "" },
  })
  const { mutate, isPending } = useCreateWorkspace()

  function onSubmit(data: { name: string; desc: string }) {
    mutate(
      { name: data.name.trim(), description: data.desc.trim() || undefined },
      {
        onSuccess: () => {
          toast.success("Workspace created")
          reset()
          setOpen(false)
        },
        onError: () => toast.error("Failed to create workspace"),
      }
    )
  }

  const nameValue = useWatch({ control, name: "name" }) 

  return (
    <div>
      {!open ? (
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          <Plus className="size-4 mr-2" />
          New Workspace
        </Button>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="rounded-lg border border-border p-4 space-y-3">
          <p className="text-sm font-medium text-foreground">Create Workspace</p>
          <div className="space-y-1.5">
            <Label htmlFor="new-ws-name">Name *</Label>
            <Input
              id="new-ws-name"
              placeholder="e.g. CS Study Group"
              {...register("name")}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="new-ws-desc">Description</Label>
            <Input
              id="new-ws-desc"
              placeholder="Optional description"
              {...register("desc")}
            />
          </div>
          <div className="flex gap-2">
            <Button type="button" size="sm" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={!nameValue.trim() || isPending}>
              {isPending && <Loader2 className="size-3.5 mr-1.5 animate-spin" />}
              Create
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
