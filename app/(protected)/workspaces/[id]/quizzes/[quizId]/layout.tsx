"use client"

import { useState } from "react"
import { useParams, useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Trash2 } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { Skeleton } from "@/shared/ui/skeleton"
import { cn } from "@/lib/utils"
import { useGetQuiz } from "@/features/quizzes/queries/use-get-quiz"
import { DeleteQuizDialog } from "@/features/quizzes/components/DeleteQuizDialog"

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  const { id, quizId } = useParams<{ id: string; quizId: string }>()
  const router = useRouter()
  const pathname = usePathname()
  const [deleteOpen, setDeleteOpen] = useState(false)

  const { data: quiz, isLoading } = useGetQuiz(Number(quizId))

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
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

  if (!quiz) return null

  const base = `/workspaces/${id}/quizzes/${quizId}`
  const navItems = [
    { label: "Overview", href: base },
    { label: "Take Quiz", href: `${base}/take` },
    { label: "Attempts", href: `${base}/attempts` },
  ]

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => router.push(`/workspaces/${id}/quizzes`)}
              className="-ml-1 mt-0.5 shrink-0"
            >
              <ArrowLeft className="size-4" />
            </Button>
            <div className="flex flex-col gap-0.5">
              <h1 className="text-xl font-semibold tracking-tight">{quiz.title}</h1>
              {quiz.description && (
                <p className="text-sm text-muted-foreground">{quiz.description}</p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            className="hover:text-destructive hover:bg-destructive/10 shrink-0"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>

        {/* Page nav */}
        <div className="flex gap-1 border-b border-border">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-3 pb-2.5 pt-1 text-sm font-medium border-b-2 -mb-px transition-colors",
                pathname === item.href
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Page content */}
        <div>{children}</div>
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
