"use client"

import { useParams } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/shared/ui/button"
import { useGetQuizzes } from "@/features/quizzes/queries/use-get-quizzes"
import { QuizGrid } from "@/features/quizzes/components/QuizGrid"
import { QuizEmptyState } from "@/features/quizzes/components/QuizEmptyState"
import { QuizzesSkeleton } from "@/features/quizzes/components/QuizzesSkeleton"
import { useWorkspaceRole } from "@/shared/providers/workspace-role-provider"
import { can } from "@/lib/permissions"

function informWorkbench() {
  toast.info("Quizzes are generated from your Workbench. Open a workbench and use the Q&A tab to create questions, then build a quiz from there.")
}

export default function QuizzesPage() {
  const { id } = useParams<{ id: string }>()
  const workspaceId = Number(id)
  const { data: quizzes, isLoading } = useGetQuizzes(workspaceId)
  const { role } = useWorkspaceRole()
  const canEdit = role !== undefined && can.editContent(role)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Quizzes</h1>
        {canEdit && <Button onClick={informWorkbench}>Create Quiz</Button>}
      </div>

      {isLoading ? (
        <QuizzesSkeleton />
      ) : !quizzes || quizzes.length === 0 ? (
        <QuizEmptyState onCreateClick={canEdit ? informWorkbench : undefined} />
      ) : (
        <QuizGrid quizzes={quizzes} workspaceId={workspaceId} />
      )}
    </div>
  )
}
