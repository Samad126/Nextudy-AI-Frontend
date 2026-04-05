import { cn } from "@/lib/utils"

interface AttemptScoreSummaryProps {
  score: number
  correct: number
  total: number
  startedAt: string
}

export function AttemptScoreSummary({ score, correct, total, startedAt }: AttemptScoreSummaryProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4">
      <div
        className={cn(
          "flex items-center justify-center w-14 h-14 rounded-full border-2 text-xl font-bold shrink-0",
          score >= 80
            ? "border-green-500 text-green-600 bg-green-50 dark:bg-green-950/30"
            : score >= 50
            ? "border-yellow-500 text-yellow-600 bg-yellow-50 dark:bg-yellow-950/30"
            : "border-red-500 text-red-600 bg-red-50 dark:bg-red-950/30"
        )}
      >
        {score}%
      </div>
      <div className="flex flex-col gap-0.5">
        <p className="font-medium">{correct} of {total} correct</p>
        <p className="text-xs text-muted-foreground">
          {new Date(startedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
  )
}
