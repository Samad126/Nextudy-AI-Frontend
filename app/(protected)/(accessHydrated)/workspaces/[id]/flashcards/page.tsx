"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/shared/ui/button"
import { useGetFlashcardSets } from "@/features/flashcards/queries/use-get-flashcard-sets"
import { FlashcardSetGrid } from "@/features/flashcards/components/FlashcardSetList/FlashcardSetGrid"
import { FlashcardSetsEmptyState } from "@/features/flashcards/components/FlashcardSetList/FlashcardSetsEmptyState"
import { FlashcardSetsSkeleton } from "@/features/flashcards/components/FlashcardSetList/FlashcardSetsSkeleton"
import { CreateFlashcardSetModal } from "@/features/flashcards/components/CreateFlashcardSetModal"
import { useWorkspaceRole } from "@/shared/providers/workspace-role-provider"
import { can } from "@/lib/permissions"

export default function FlashcardsPage() {
  const { id } = useParams<{ id: string }>()
  const workspaceId = Number(id)
  const [createOpen, setCreateOpen] = useState(false)
  const { data: sets, isLoading } = useGetFlashcardSets(workspaceId)
  const { role } = useWorkspaceRole()
  const canEdit = role !== undefined && can.editContent(role)

  return (
    <>
      <div className="container flex flex-col gap-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Flashcards</h1>
            <p className="text-sm text-muted-foreground mt-1">Study smarter with AI-generated flashcard sets.</p>
          </div>
          {canEdit && <Button onClick={() => setCreateOpen(true)}>Create Set</Button>}
        </div>

        {isLoading ? (
          <FlashcardSetsSkeleton />
        ) : !sets || sets.length === 0 ? (
          <FlashcardSetsEmptyState onCreateClick={canEdit ? () => setCreateOpen(true) : undefined} />
        ) : (
          <FlashcardSetGrid sets={sets} workspaceId={workspaceId} />
        )}
      </div>

      <CreateFlashcardSetModal
        open={createOpen}
        setOpen={setCreateOpen}
        workspaceId={workspaceId}
      />
    </>
  )
}
