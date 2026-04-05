import { Badge } from "@/shared/ui/badge"
import { MCQQuestion } from "./MCQQuestion"
import { OpenEndedQuestion } from "./OpenEndedQuestion"
import { QuizQuestion } from "@/features/quizzes/types/quiz"

interface QuizQuestionCardProps {
  quizQuestion: QuizQuestion
  currentIndex: number
  currentAnswer: string | number | undefined
  onSelect: (choiceId: number) => void
  onChange: (value: string) => void
}

export function QuizQuestionCard({
  quizQuestion,
  currentIndex,
  currentAnswer,
  onSelect,
  onChange,
}: QuizQuestionCardProps) {
  const q = quizQuestion.question

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6">
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="px-1.5 py-0 text-[10px]">
          {q.question_type === "mcq" ? "MCQ" : "Open-ended"}
        </Badge>
        <span className="text-xs text-muted-foreground">#{currentIndex + 1}</span>
      </div>

      <p className="text-base leading-relaxed font-medium text-foreground">
        {q.title}
      </p>

      {q.question_type === "mcq" && q.mcqChoices ? (
        <MCQQuestion
          choices={q.mcqChoices}
          selected={typeof currentAnswer === "number" ? currentAnswer : null}
          onSelect={onSelect}
        />
      ) : (
        <OpenEndedQuestion
          value={typeof currentAnswer === "string" ? currentAnswer : ""}
          onChange={onChange}
        />
      )}
    </div>
  )
}
