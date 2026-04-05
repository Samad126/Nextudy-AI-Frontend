import { Badge } from "@/shared/ui/badge"
import { DifficultyBadge } from "@/shared/components/DifficultyBadge"
import type { Difficulty } from "@/shared/components/DifficultyBadge"
import { QuizQuestion } from "@/features/quizzes/types/quiz"

interface QuestionRowProps {
  quizQuestion: QuizQuestion
  index: number
}

export function QuestionRow({ quizQuestion, index }: QuestionRowProps) {
  const { question } = quizQuestion

  return (
    <div className="flex items-start gap-3 px-4 py-3 border-b border-border last:border-0">
      <span className="text-xs text-muted-foreground w-5 shrink-0 mt-0.5">{index + 1}</span>
      <p className="text-sm flex-1 text-foreground">{question.title}</p>
      <div className="flex items-center gap-1.5 shrink-0">
        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
          {question.question_type === "mcq" ? "MCQ" : "Open-ended"}
        </Badge>
        {question.difficulty && (
          <DifficultyBadge difficulty={question.difficulty as Difficulty} />
        )}
      </div>
    </div>
  )
}
