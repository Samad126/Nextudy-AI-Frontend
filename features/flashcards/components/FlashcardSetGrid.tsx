import { FlashcardSetSummary, Difficulty } from "../types/flashcard"
import { FlashcardSetCard } from "./FlashcardSetCard"

interface FlashcardSetGridProps {
  sets: (FlashcardSetSummary & { difficulty?: Difficulty })[]
  workspaceId: number
}

export function FlashcardSetGrid({ sets, workspaceId }: FlashcardSetGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {sets.map((set) => (
        <FlashcardSetCard key={set.id} set={set} workspaceId={workspaceId} />
      ))}
    </div>
  )
}
