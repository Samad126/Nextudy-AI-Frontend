"use client"

import { useParams } from "next/navigation"
import { useGetFlashcardSet } from "@/features/flashcards/queries/use-get-flashcard-set"
import { CardsTab } from "@/features/flashcards/components/CardsTab"

export default function FlashcardCardsPage() {
  const { flashcardId } = useParams<{ flashcardId: string }>()
  const { data: set } = useGetFlashcardSet(Number(flashcardId))

  if (!set) return null
  return <CardsTab cards={set.cards ?? []} setId={set.id} />
}
