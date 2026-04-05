"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useGetQuiz } from "@/features/quizzes/queries/use-get-quiz"
import { DeleteQuizDialog } from "@/features/quizzes/components/Dialogs/DeleteQuizDialog"
import { QuizDetailSkeleton } from "@/features/quizzes/components/QuizDetail/QuizDetailSkeleton"
import { QuizDetailHeader } from "@/features/quizzes/components/QuizDetail/QuizDetailHeader"

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
    return <QuizDetailSkeleton />
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
        <QuizDetailHeader
          title={quiz.title}
          description={quiz.description}
          onBack={() => router.push(`/workspaces/${id}/quizzes`)}
          onDelete={() => setDeleteOpen(true)}
        />

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
