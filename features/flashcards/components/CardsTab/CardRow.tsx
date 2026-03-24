"use client"

import { useState } from "react"
import { Pencil, Trash2 } from "lucide-react"
import { TableCell, TableRow } from "@/shared/ui/table"
import { Button } from "@/shared/ui/button"
import { DifficultyBadge } from "@/shared/components/DifficultyBadge"
import { Flashcard } from "../../types/flashcard"
import { EditCardSheet } from "./EditCardSheet"
import { DeleteCardDialog } from "./DeleteCardDialog"

interface CardRowProps {
  card: Flashcard
  index: number
  setId: number
}

export function CardRow({ card, index, setId }: CardRowProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <>
      <TableRow>
        <TableCell className="text-muted-foreground text-xs w-8">{index + 1}</TableCell>
        <TableCell className="max-w-xs">
          <p className="truncate text-sm">{card.question}</p>
        </TableCell>
        <TableCell className="max-w-xs">
          <p className="truncate text-sm text-muted-foreground">{card.answer}</p>
        </TableCell>
        <TableCell>
          {card.difficulty ? <DifficultyBadge difficulty={card.difficulty} /> : <span className="text-xs text-muted-foreground/50">—</span>}
        </TableCell>
        <TableCell>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon-xs" onClick={() => setEditOpen(true)}>
              <Pencil className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              className="hover:text-destructive hover:bg-destructive/10"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        </TableCell>
      </TableRow>

      <EditCardSheet open={editOpen} setOpen={setEditOpen} card={card} setId={setId} />
      <DeleteCardDialog open={deleteOpen} setOpen={setDeleteOpen} setId={setId} cardId={card.id} />
    </>
  )
}
