import type { Difficulty } from "@/shared/components/DifficultyBadge"

export type { Difficulty }

export interface Flashcard {
  id: number
  flashcardSetId: number
  question: string
  answer: string
  difficulty?: Difficulty
  created_at: string
  updated_at: string
}

export interface FlashcardSet {
  id: number
  workspaceId: number
  title: string
  description?: string
  cards: Flashcard[]
  resources: { id: number; name: string }[]
  created_at: string
  updated_at: string
}

export interface FlashcardSetSummary {
  id: number
  title: string
  description?: string
  cardCount: number
  created_at: string
}

export const flashcardKeys = {
  all: (workspaceId: number) => ["flashcard-sets", "list", workspaceId] as const,
  detail: (id: number) => ["flashcard-sets", "detail", id] as const,
}
