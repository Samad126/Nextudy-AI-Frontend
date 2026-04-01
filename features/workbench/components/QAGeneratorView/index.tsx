"use client"

import { useState } from "react"
import { Sparkles } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { Skeleton } from "@/shared/ui/skeleton"
import { QAQuestion, QAQuestionCard } from "../QAQuestionCard"
import { QAToolbar } from "./QAToolbar"
import { QAEmptyState } from "./QAEmptyState"
import { EditQuestionDrawer } from "../EditQuestionDrawer"
import { RegenerateQuestionDialog } from "../RegenerateQuestionDialog"
import { useGetQuestions } from "../../queries/use-get-questions"
import { CreateQuizFromSelectionDialog } from "@/features/quizzes/components/CreateQuizFromSelectionDialog"
import { useExportQuestionsPdf } from "../../mutations/use-export-questions-pdf"
import { toast } from "sonner"
import { getApiErrorMessage } from "@/lib/api/get-api-error"
import type { ApiQuestion } from "@/types"

function mapApiQuestion(q: ApiQuestion, index: number): QAQuestion {
  const isMCQ = q.question_type === "mcq"

  const sortedChoices = [...(q.mcqChoices ?? [])].sort(
    (a, b) => a.choice_order - b.choice_order
  )

  const options = isMCQ
    ? sortedChoices.map((c, i) => ({
        label: String.fromCharCode(65 + i),
        text: c.choice_text,
      }))
    : []

  const correctChoice = sortedChoices.find((c) => c.is_correct)
  const correctIndex = correctChoice
    ? sortedChoices.findIndex((c) => c.id === correctChoice.id)
    : -1
  const correctLabel =
    correctIndex >= 0 ? String.fromCharCode(65 + correctIndex) : undefined

  return {
    id: q.id,
    number: index + 1,
    type: q.answer_source === "file" ? "verified" : "ai_plus",
    difficulty: q.difficulty.toLowerCase() as "easy" | "medium" | "hard",
    hasSource: q.answer_source === "file" || q.answer_source === "mixed",
    sourceCitation: q.source_citations,
    text: q.title,
    options,
    answer: correctLabel ?? q.openEndedAnswer?.sample_answer ?? "",
    explanation: q.explanation ?? "",
  }
}

interface QAGeneratorViewProps {
  hasResources: boolean
  workbenchId: number
  workspaceId: number
  onGenerate: () => void
  onRegenerate: () => void
}

export function QAGeneratorView({
  hasResources,
  workbenchId,
  workspaceId,
  onGenerate,
  onRegenerate,
}: QAGeneratorViewProps) {
  const { data: questions, isLoading } = useGetQuestions(workbenchId)
  const { mutate: exportPdf, isPending: isExporting } = useExportQuestionsPdf(workbenchId)
  const [selectMode, setSelectMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [createQuizOpen, setCreateQuizOpen] = useState(false)
  const [editQuestion, setEditQuestion] = useState<ApiQuestion | null>(null)
  const [regenerateQuestion, setRegenerateQuestion] = useState<ApiQuestion | null>(null)

  function toggleSelectMode() {
    setSelectMode((m) => !m)
    setSelectedIds(new Set())
  }

  function toggleQuestion(id: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleSelectAll() {
    if (!questions) return
    const allIds = new Set(questions.map((q) => q.id))
    const allSelected = questions.every((q) => selectedIds.has(q.id))
    setSelectedIds(allSelected ? new Set() : allIds)
  }

  function handleQuizCreated() {
    setSelectMode(false)
    setSelectedIds(new Set())
  }

  if (!hasResources) {
    return <QAEmptyState />
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
    )
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 h-full py-16 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <Sparkles className="size-5 text-muted-foreground" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-foreground">No questions yet</p>
          <p className="text-xs text-muted-foreground">
            Generate questions from your selected materials.
          </p>
        </div>
        <Button size="sm" onClick={onGenerate} className="mt-1">
          Create Questions
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col h-full">
        <QAToolbar
          onRegenerate={onRegenerate}
          onExport={() => exportPdf(undefined, {
            onError: (err) => toast.error(getApiErrorMessage(err, "Failed to export PDF")),
          })}
          isExporting={isExporting}
          selectMode={selectMode}
          selectedCount={selectedIds.size}
          totalCount={questions.length}
          onToggleSelectMode={toggleSelectMode}
          onCreateQuiz={() => setCreateQuizOpen(true)}
          onSelectAll={handleSelectAll}
        />
        <div className="flex flex-col gap-3 overflow-y-auto flex-1 pr-0.5">
          {questions.map((q, i) => {
            const mapped = mapApiQuestion(q, i)
            return (
              <QAQuestionCard
                key={q.id}
                question={mapped}
                selectMode={selectMode}
                selected={selectedIds.has(q.id)}
                onToggleSelect={() => toggleQuestion(q.id)}

                onEdit={() => setEditQuestion(q)}
                onRegenerate={() => setRegenerateQuestion(q)}
              />
            )
          })}
        </div>
      </div>

      <CreateQuizFromSelectionDialog
        open={createQuizOpen}
        setOpen={setCreateQuizOpen}
        workspaceId={workspaceId}
        questionIds={Array.from(selectedIds)}
        onSuccess={handleQuizCreated}
      />

      <EditQuestionDrawer
        open={!!editQuestion}
        onOpenChange={(open) => { if (!open) setEditQuestion(null) }}
        question={editQuestion}
        workbenchId={workbenchId}
      />

      <RegenerateQuestionDialog
        open={!!regenerateQuestion}
        onOpenChange={(open) => { if (!open) setRegenerateQuestion(null) }}
        question={regenerateQuestion}
        workbenchId={workbenchId}
      />
    </>
  )
}
