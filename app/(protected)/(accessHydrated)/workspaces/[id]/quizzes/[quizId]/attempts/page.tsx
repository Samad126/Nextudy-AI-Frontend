"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, ClipboardList } from "lucide-react"
import { useGetQuizAttempts } from "@/features/quizzes/queries/use-get-quiz-attempts"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table"
import { Button } from "@/shared/ui/button"
import { Skeleton } from "@/shared/ui/skeleton"
import { AttemptRow } from "@/features/quizzes/components/QuizDetail/Attempts/AttemptRow"
import { PageError } from "@/shared/components/page-error"

export default function QuizAttemptsPage() {
  const { id, quizId } = useParams<{ id: string; quizId: string }>()
  const router = useRouter()

  const { data: attempts, isLoading, error, refetch } = useGetQuizAttempts(Number(quizId))

  if (isLoading) {
    return (
      <div className="container flex flex-col gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  if (error) {
    return <PageError error={error} onRetry={refetch} />
  }

  if (!attempts || attempts.length === 0) {
    return (
      <div className="container flex flex-col items-center justify-center py-12 gap-3 text-center">
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
    <div className="container flex flex-col gap-4 max-w-2xl mx-auto w-full">
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/workspaces/${id}/quizzes/${quizId}`)}
          className="-ml-2"
        >
          <ArrowLeft className="size-4 mr-1" /> Back to overview
        </Button>
      </div>
      <div className="rounded-lg border border-border overflow-hidden">
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
                onView={() => router.push(`/workspaces/${id}/quizzes/${quizId}/attempts/${attempt.id}`)}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
