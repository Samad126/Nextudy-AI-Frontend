"use client"

import { useState } from "react"
import { useParams, useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { cn } from "@/lib/utils"
import { useGetFlashcardSet } from "@/features/flashcards/queries/use-get-flashcard-set"
import { FlashcardSetDetailSkeleton } from "@/features/flashcards/components/FlashcardSetList/FlashcardSetDetailSkeleton"
import { DeleteSetDialog } from "@/features/flashcards/components/DeleteSetDialog"
import { EditSetDialog } from "@/features/flashcards/components/EditSetDialog"

export default function FlashcardSetLayout({ children }: { children: React.ReactNode }) {
  const { id, flashcardId } = useParams<{ id: string; flashcardId: string }>()
  const workspaceId = Number(id)
  const setId = Number(flashcardId)
  const router = useRouter()
  const pathname = usePathname()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  const { data: set, isLoading } = useGetFlashcardSet(setId)

  if (isLoading) return <FlashcardSetDetailSkeleton />
  if (!set) return null

  const base = `/workspaces/${id}/flashcards/${flashcardId}`
  const navItems = [
    { label: "Study", href: base },
    { label: `Cards (${set.cards?.length ?? 0})`, href: `${base}/cards` },
  ]

  return (
    <>
      <div className="container flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => router.push(`/workspaces/${id}/flashcards`)}
              className="-ml-1 mt-0.5 shrink-0"
            >
              <ArrowLeft className="size-4" />
            </Button>
            <div className="flex flex-col gap-0.5">
              <h1 className="text-xl font-semibold tracking-tight">{set.title}</h1>
              {set.description && (
                <p className="text-sm text-muted-foreground">{set.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              className="shrink-0"
              onClick={() => setEditOpen(true)}
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="hover:text-destructive hover:bg-destructive/10 shrink-0"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>

        {/* Page nav */}
        <div className="flex gap-1 border-b border-border">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-3 pb-2.5 pt-1 text-sm font-medium border-b-2 -mb-px transition-colors",
                pathname === item.href
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Page content */}
        <div>{children}</div>
      </div>

      <DeleteSetDialog
        open={deleteOpen}
        setOpen={setDeleteOpen}
        setId={setId}
        workspaceId={workspaceId}
        onDeleted={() => router.push(`/workspaces/${id}/flashcards`)}
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
