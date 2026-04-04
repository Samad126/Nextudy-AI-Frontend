"use client"

import { useParams } from "next/navigation"
import { useGetFlashcardSet } from "@/features/flashcards/queries/use-get-flashcard-set"
import { StudyTab } from "@/features/flashcards/components/StudyTab"

export default function FlashcardStudyPage() {
  const { flashcardId } = useParams<{ flashcardId: string }>()
  const { data: set } = useGetFlashcardSet(Number(flashcardId))

  if (!set) return null
  return <StudyTab cards={set.cards ?? []} />
}
