import { formatDistanceToNow, intervalToDuration } from "date-fns"
import { TableCell, TableRow } from "@/shared/ui/table"
import { Button } from "@/shared/ui/button"
import { QuizAttempt } from "@/features/quizzes/types/quiz"

function formatDuration(start: string, end?: string): string {
  if (!end) return "—"
  const dur = intervalToDuration({ start: new Date(start), end: new Date(end) })
  const parts: string[] = []
  if (dur.minutes) parts.push(`${dur.minutes}m`)
  if (dur.seconds) parts.push(`${dur.seconds}s`)
  return parts.join(" ") || "< 1s"
}

export function AttemptRow({
  attempt,
  index,
  onView,
}: {
  attempt: QuizAttempt
  index: number
  onView: () => void
}) {
  const score = attempt.score ?? "—"
  const date = formatDistanceToNow(new Date(attempt.started_at), { addSuffix: true })
  const duration = formatDuration(attempt.started_at, attempt.completed_at)

  return (
    <TableRow>
      <TableCell className="text-muted-foreground text-xs">{index + 1}</TableCell>
      <TableCell className="text-sm">{date}</TableCell>
      <TableCell className="text-sm">
        {score !== "—" ? `${score}%` : "—"}
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">{duration}</TableCell>
      <TableCell>
        <Button variant="ghost" size="xs" onClick={onView}>
          View
        </Button>
      </TableCell>
    </TableRow>
  )
}
