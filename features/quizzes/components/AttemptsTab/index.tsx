"use client"

import { useState } from "react"
import { formatDistanceToNow, intervalToDuration } from "date-fns"
import { Quiz, QuizAttempt } from "../../types/quiz"
import { useGetQuizAttempts } from "../../queries/use-get-quiz-attempts"
import { useGetQuizAttempt } from "../../queries/use-get-quiz-attempt"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table"
import { Button } from "@/shared/ui/button"
import { Skeleton } from "@/shared/ui/skeleton"
import { ClipboardList } from "lucide-react"
import { AttemptResultView } from "./AttemptResultView"

interface AttemptsTabProps {
  quiz: Quiz
}

function formatDuration(start: string, end?: string): string {
  if (!end) return "—"
  const dur = intervalToDuration({ start: new Date(start), end: new Date(end) })
  const parts: string[] = []
  if (dur.minutes) parts.push(`${dur.minutes}m`)
  if (dur.seconds) parts.push(`${dur.seconds}s`)
  return parts.join(" ") || "< 1s"
}

function AttemptRow({
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

export function AttemptsTab({ quiz }: AttemptsTabProps) {
  const [viewAttemptId, setViewAttemptId] = useState<number | null>(null)
  const { data: attempts, isLoading } = useGetQuizAttempts(quiz.id)
  const { data: attemptDetail } = useGetQuizAttempt(quiz.id, viewAttemptId ?? 0)

  if (viewAttemptId && attemptDetail) {
    return (
      <AttemptResultView
        quiz={quiz}
        attempt={attemptDetail}
        onBack={() => setViewAttemptId(null)}
      />
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  if (!attempts || attempts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
        <div className="rounded-full bg-muted p-4">
          <ClipboardList className="size-6 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">
          No attempts yet. Take the quiz to see your results here.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden max-w-2xl mx-auto w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8">#</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead className="w-16" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {attempts.map((attempt, i) => (
            <AttemptRow
              key={attempt.id}
              attempt={attempt}
              index={i}
              onView={() => setViewAttemptId(attempt.id)}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
