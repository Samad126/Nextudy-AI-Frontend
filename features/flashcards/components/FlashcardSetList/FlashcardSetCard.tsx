"use client"

import { useState } from "react"
import Link from "next/link"
import { MoreVertical, Pencil, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { FlashcardSetSummary, Difficulty } from "../../types/flashcard"
import { DifficultyBadge } from "@/shared/components/DifficultyBadge"
import { Button } from "@/shared/ui/button"
import { Badge } from "@/shared/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import { DeleteSetDialog } from "../DeleteSetDialog"
import { EditSetDialog } from "../EditSetDialog"
import { useWorkspaceRole } from "@/shared/providers/workspace-role-provider"
import { can } from "@/lib/permissions"

interface FlashcardSetCardProps {
  set: FlashcardSetSummary & { difficulty?: Difficulty }
  workspaceId: number
}

export function FlashcardSetCard({ set, workspaceId }: FlashcardSetCardProps) {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const { role } = useWorkspaceRole()
  const canEdit = role !== undefined && can.editContent(role)

  const relativeDate = formatDistanceToNow(new Date(set.created_at), { addSuffix: true })

  return (
    <>
      <div className="group relative rounded-xl border border-border bg-card overflow-hidden transition-all duration-200 hover:border-primary/30 hover:shadow-sm">
        {/* Kebab menu */}
        {canEdit && (
          <div className="absolute top-2.5 right-2.5 z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-card/80 backdrop-blur-sm"
                  onClick={(e) => e.preventDefault()}
                >
                  <MoreVertical className="size-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditOpen(true)}>
                  <Pencil className="size-3.5 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => setDeleteOpen(true)}
                >
                  <Trash2 className="size-3.5 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Card body */}
        <Link
          href={`/workspaces/${workspaceId}/flashcards/${set.id}`}
          className="flex flex-col gap-2 p-4"
        >
          <span className="font-medium text-sm text-foreground leading-snug line-clamp-1 pr-6">
            {set.title}
          </span>

          {set.description ? (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {set.description}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground/50 italic">No description</p>
          )}

          <div className="flex items-center justify-between mt-1 gap-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                {set.cardCount} {set.cardCount === 1 ? "card" : "cards"}
              </Badge>
              {set.difficulty && <DifficultyBadge difficulty={set.difficulty} />}
            </div>
            <span className="text-[11px] text-muted-foreground/60">{relativeDate}</span>
          </div>
        </Link>
      </div>

      <DeleteSetDialog
        open={deleteOpen}
        setOpen={setDeleteOpen}
        setId={set.id}
        workspaceId={workspaceId}
      />
      <EditSetDialog
        open={editOpen}
        setOpen={setEditOpen}
        set={set}
        workspaceId={workspaceId}
      />
    </>
  )
}
