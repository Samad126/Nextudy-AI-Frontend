import { Layers } from "lucide-react"
import { Button } from "@/shared/ui/button"

interface FlashcardSetsEmptyStateProps {
  onCreateClick: () => void
}

export function FlashcardSetsEmptyState({ onCreateClick }: FlashcardSetsEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="rounded-full bg-muted p-5">
        <Layers className="size-8 text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="font-semibold text-foreground">No flashcard sets yet</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Create your first set and let AI generate cards from your study materials.
        </p>
      </div>
      <Button onClick={onCreateClick}>Create your first set</Button>
    </div>
  )
}
