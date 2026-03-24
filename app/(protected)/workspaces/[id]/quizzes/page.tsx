"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/shared/ui/button"
import { useGetQuizzes } from "@/features/quizzes/queries/use-get-quizzes"
import { QuizGrid } from "@/features/quizzes/components/QuizGrid"
import { QuizEmptyState } from "@/features/quizzes/components/QuizEmptyState"
import { QuizzesSkeleton } from "@/features/quizzes/components/QuizzesSkeleton"
import { CreateQuizModal } from "@/features/quizzes/components/CreateQuizModal"

export default function QuizzesPage() {
  const { id } = useParams<{ id: string }>()
  const workspaceId = Number(id)
  const [createOpen, setCreateOpen] = useState(false)
  const { data: quizzes, isLoading } = useGetQuizzes(workspaceId)

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-tight">Quizzes</h1>
          <Button onClick={() => setCreateOpen(true)}>Create Quiz</Button>
        </div>

        {isLoading ? (
          <QuizzesSkeleton />
        ) : !quizzes || quizzes.length === 0 ? (
          <QuizEmptyState onCreateClick={() => setCreateOpen(true)} />
        ) : (
          <QuizGrid quizzes={quizzes} workspaceId={workspaceId} />
        )}
      </div>

      <CreateQuizModal
        open={createOpen}
        setOpen={setCreateOpen}
        workspaceId={workspaceId}
      />
    </>
  )
}
