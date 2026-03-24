"use client"

import { useParams } from "next/navigation"
import { useGetFlashcardSet } from "@/features/flashcards/queries/use-get-flashcard-set"
import { EditSetTab } from "@/features/flashcards/components/EditSetTab"

export default function FlashcardEditPage() {
  const { id, flashcardId } = useParams<{ id: string; flashcardId: string }>()
  const { data: set } = useGetFlashcardSet(Number(flashcardId))

  if (!set) return null
  return <EditSetTab set={set} workspaceId={Number(id)} />
}
