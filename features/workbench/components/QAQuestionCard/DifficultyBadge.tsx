import { cn } from "@/lib/utils"
import { QAQuestion } from "../QAQuestionCard"

export function DifficultyBadge({ difficulty }: { difficulty: QAQuestion["difficulty"] }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        difficulty === "easy" && "border-sage/40 bg-sage/10 text-sage-700",
        difficulty === "medium" && "border-yellow-300/60 bg-yellow-50 text-yellow-700 dark:border-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
        difficulty === "hard" && "border-border bg-muted/50 text-muted-foreground"
      )}
    >
      {difficulty}
    </span>
  )
}
