"use client"

import { useState } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { QuizSummary } from "../../types/quiz"
import { Badge } from "@/shared/ui/badge"
import { DeleteQuizDialog } from "../Dialogs/DeleteQuizDialog"
import { QuizCardMenu } from "./QuizCardMenu"
import { useWorkspaceRole } from "@/shared/providers/workspace-role-provider"
import { can } from "@/lib/permissions"

interface QuizCardProps {
  quiz: QuizSummary
  workspaceId: number
}

export function QuizCard({ quiz, workspaceId }: QuizCardProps) {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const { role } = useWorkspaceRole()
  const canEdit = role !== undefined && can.editContent(role)

  const relativeDate = formatDistanceToNow(new Date(quiz.created_at), { addSuffix: true })

  return (
    <>
      <div className="group relative rounded-xl border border-border bg-card overflow-hidden transition-all duration-200 hover:border-primary/30 hover:shadow-sm">
        {canEdit && <QuizCardMenu onDelete={() => setDeleteOpen(true)} />}

        {/* Card body */}
        <Link
          href={`/workspaces/${workspaceId}/quizzes/${quiz.id}`}
          className="flex flex-col gap-2 p-4"
        >
          <span className="font-medium text-sm text-foreground leading-snug line-clamp-1 pr-6">
            {quiz.title}
          </span>

          {quiz.description ? (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {quiz.description}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground/50 italic">No description</p>
          )}

          <div className="flex items-center justify-between mt-1 gap-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                {quiz.questionCount} {quiz.questionCount === 1 ? "question" : "questions"}
              </Badge>
              {quiz.attemptCount > 0 && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  {quiz.attemptCount} {quiz.attemptCount === 1 ? "attempt" : "attempts"}
                </Badge>
              )}
            </div>
            <span className="text-[11px] text-muted-foreground/60">{relativeDate}</span>
          </div>
        </Link>
      </div>

      <DeleteQuizDialog
        open={deleteOpen}
        setOpen={setDeleteOpen}
        quizId={quiz.id}
        workspaceId={workspaceId}
      />
    </>
  )
}
