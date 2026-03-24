import { BookOpen } from "lucide-react"
import { Flashcard } from "../../types/flashcard"
import { FlashcardFlipper } from "./FlashcardFlipper"

interface StudyTabProps {
  cards: Flashcard[]
}

export function StudyTab({ cards }: StudyTabProps) {
  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
        <div className="rounded-full bg-muted p-4">
          <BookOpen className="size-6 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">No cards to study yet.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto w-full">
      <FlashcardFlipper cards={cards} />
    </div>
  )
}
