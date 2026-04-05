import { CheckCircle, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { AttemptAnswer } from "@/features/quizzes/types/quiz"

interface AttemptAnswerCardProps {
  answer: AttemptAnswer
  index: number
}

export function AttemptAnswerCard({ answer: ans, index: i }: AttemptAnswerCardProps) {
  const q = ans.question
  const isMcq = q.mcqChoices.length > 0
  const userChoiceId = isMcq ? Number(ans.userAnswer) : null

  return (
    <div
      className={cn(
        "rounded-xl border p-4 flex flex-col gap-3",
        ans.isCorrect ? "border-green-300/60" : "border-red-300/60"
      )}
    >
      <div className="flex items-start gap-2">
        {ans.isCorrect ? (
          <CheckCircle className="size-4 text-green-600 shrink-0 mt-0.5" />
        ) : (
          <XCircle className="size-4 text-red-500 shrink-0 mt-0.5" />
        )}
        <p className="text-sm font-medium">
          {i + 1}. {q.title}
        </p>
      </div>

      {isMcq ? (
        <div className="flex flex-col gap-1.5 pl-6">
          {q.mcqChoices.map((choice) => {
            const isSelected = choice.id === userChoiceId
            const isCorrectChoice = choice.is_correct

            return (
              <div
                key={choice.id}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm",
                  isCorrectChoice
                    ? "border-green-400/60 bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-300"
                    : isSelected
                    ? "border-red-400/60 bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-300"
                    : "border-border bg-background/50 text-muted-foreground"
                )}
              >
                {isCorrectChoice ? (
                  <CheckCircle className="size-3.5 shrink-0 text-green-600" />
                ) : isSelected ? (
                  <XCircle className="size-3.5 shrink-0 text-red-500" />
                ) : (
                  <span className="size-3.5 shrink-0" />
                )}
                {choice.choice_text}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="pl-6 flex flex-col gap-2">
          <p className="text-xs text-muted-foreground">
            Your answer: <span className="text-foreground">{ans.userAnswer || "—"}</span>
          </p>
          {q.openEndedAnswer && (
            <div className="rounded-md bg-background/60 border border-border px-3 py-2">
              <p className="text-xs text-muted-foreground font-medium mb-0.5">Sample answer</p>
              <p className="text-xs">{q.openEndedAnswer.sample_answer}</p>
            </div>
          )}
        </div>
      )}

      {!ans.isCorrect && q.explanation && (
        <div className="ml-6 rounded-md bg-background/60 border border-border px-3 py-2">
          <p className="text-xs text-muted-foreground font-medium mb-0.5">Explanation</p>
          <p className="text-xs">{q.explanation}</p>
        </div>
      )}
    </div>
  )
}
