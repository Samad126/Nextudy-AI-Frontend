import { ClipboardList } from "lucide-react"
import { Button } from "@/shared/ui/button"

interface QuizEmptyStateProps {
  onCreateClick?: () => void
}

export function QuizEmptyState({ onCreateClick }: QuizEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="rounded-full bg-muted p-5">
        <ClipboardList className="size-8 text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="font-semibold text-foreground">No quizzes yet</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Build a quiz from your workbench questions and start testing your knowledge.
        </p>
      </div>
      {onCreateClick && <Button onClick={onCreateClick}>Create your first quiz</Button>}
    </div>
  )
}
