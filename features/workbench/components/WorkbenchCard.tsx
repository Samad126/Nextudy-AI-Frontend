"use client"

import { useState } from "react"
import Link from "next/link"
import { Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Workbench } from "@/types"
import { Button } from "@/shared/ui/button"
import { useDeleteWorkbench } from "../mutations/use-delete-workbench"
import { EditWorkbenchDialog } from "./EditWorkbenchDialog"

interface WorkbenchCardProps {
  workbench: Workbench
  workspaceId: number
}

export function WorkbenchCard({ workbench, workspaceId }: WorkbenchCardProps) {
  const [editOpen, setEditOpen] = useState(false)
  const { mutate: deleteWorkbench, isPending: deleting } = useDeleteWorkbench(workspaceId)

  function handleDelete(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    deleteWorkbench(workbench.id, {
      onSuccess: () => toast.success("Workbench deleted"),
      onError: () => toast.error("Failed to delete workbench"),
    })
  }

  function handleEdit(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setEditOpen(true)
  }

  const formattedDate = new Date(workbench.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <>
      <div className="group relative rounded-xl border border-border bg-card overflow-hidden transition-all duration-200 hover:border-primary/20 hover:shadow-sm">
        {/* Action buttons — top right */}
        <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <Button
            variant="ghost"
            size="icon-xs"
            className="text-muted-foreground hover:text-foreground bg-card/80 backdrop-blur-sm"
            onClick={handleEdit}
            aria-label="Edit workbench"
          >
            <Pencil className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 bg-card/80 backdrop-blur-sm"
            onClick={handleDelete}
            disabled={deleting}
            aria-label="Delete workbench"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>

        {/* Card body — clickable link */}
        <Link
          href={`/workspaces/${workspaceId}/workbenches/${workbench.id}`}
          className="flex flex-col gap-2 p-4"
        >
          <span className="font-medium text-sm text-foreground leading-snug line-clamp-1">
            {workbench.name}
          </span>
          {workbench.description ? (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {workbench.description}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground/50 italic">No description</p>
          )}
          <span className="mt-1 text-[11px] text-muted-foreground/60 self-end">
            {formattedDate}
          </span>
        </Link>
      </div>

      <EditWorkbenchDialog
        open={editOpen}
        setOpen={setEditOpen}
        workspaceId={workspaceId}
        workbench={workbench}
      />
    </>
  )
}
