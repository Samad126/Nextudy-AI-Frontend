import { Quiz } from "../../types/quiz"
import { QuestionRow } from "./QuestionRow"
import { Button } from "@/shared/ui/button"

interface OverviewTabProps {
  quiz: Quiz
  onTakeQuiz: () => void
}

export function OverviewTab({ quiz, onTakeQuiz }: OverviewTabProps) {
  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      {quiz.description && (
        <p className="text-sm text-muted-foreground">{quiz.description}</p>
      )}

      {/* Question list */}
      <div>
        <p className="text-sm font-medium mb-3">
          Questions ({(quiz.questions ?? []).length})
        </p>
        <div className="rounded-lg border border-border overflow-hidden">
          {(quiz.questions ?? []).map((qq, i) => (
            <QuestionRow key={qq.id} quizQuestion={qq} index={i} />
          ))}
        </div>
      </div>

      <div>
        <Button onClick={onTakeQuiz}>Take Quiz</Button>
      </div>
    </div>
  )
}
