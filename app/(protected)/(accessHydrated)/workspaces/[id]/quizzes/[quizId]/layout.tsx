"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Trash2 } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { Skeleton } from "@/shared/ui/skeleton"
import { useGetQuiz } from "@/features/quizzes/queries/use-get-quiz"
import { DeleteQuizDialog } from "@/features/quizzes/components/DeleteQuizDialog"

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { id, quizId } = useParams<{ id: string; quizId: string }>()
  const router = useRouter()
  const [deleteOpen, setDeleteOpen] = useState(false)

  const { data: quiz, isLoading } = useGetQuiz(Number(quizId))

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 container">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-4 w-80" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24 rounded-lg" />
          <Skeleton className="h-9 w-24 rounded-lg" />
          <Skeleton className="h-9 w-24 rounded-lg" />
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-muted-foreground">Quiz not found</p>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-6 container">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => router.push(`/workspaces/${id}/quizzes`)}
              className="mt-0.5 -ml-1 shrink-0"
            >
              <ArrowLeft className="size-4" />
            </Button>
            <div className="flex flex-col gap-0.5">
              <h1 className="text-xl font-semibold tracking-tight">
                {quiz.title}
              </h1>
              {quiz.description && (
                <p className="text-sm text-muted-foreground">
                  {quiz.description}
                </p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            className="shrink-0 hover:bg-destructive/10 hover:text-destructive"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>

        {/* Page content */}
        {quiz && <div>{children}</div>}
      </div>

      <DeleteQuizDialog
        open={deleteOpen}
        setOpen={setDeleteOpen}
        quizId={Number(quizId)}
        workspaceId={Number(id)}
        onDeleted={() => router.push(`/workspaces/${id}/quizzes`)}
      />
    </>
  )
}
