import { Progress } from "@/shared/ui/progress"

interface QuizProgressBarProps {
  current: number
  total: number
  timePassed: number
}

export function QuizProgressBar({ current, total, timePassed }: QuizProgressBarProps) {
  const progress = ((current + 1) / total) * 100

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm whitespace-nowrap text-muted-foreground">
        Question {current + 1} of {total}
      </span>
      <Progress value={progress} className="h-1.5 flex-1" />
      <span className="text-sm whitespace-nowrap text-muted-foreground tabular-nums">
        {Math.floor(timePassed / 60)}:
        {String(timePassed % 60).padStart(2, "0")}
      </span>
    </div>
  )
}
