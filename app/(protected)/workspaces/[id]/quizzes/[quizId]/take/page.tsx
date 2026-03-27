"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { getApiErrorMessage } from "@/lib/api/get-api-error"
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { useGetQuiz } from "@/features/quizzes/queries/use-get-quiz"
import { useTakeQuiz } from "@/features/quizzes/hooks/use-take-quiz"
import { useSubmitQuizAttempt } from "@/features/quizzes/mutations/use-submit-quiz-attempt"
import { Button } from "@/shared/ui/button"
import { Progress } from "@/shared/ui/progress"
import { Badge } from "@/shared/ui/badge"
import { MCQQuestion } from "@/features/quizzes/components/TakeQuizTab/MCQQuestion"
import { OpenEndedQuestion } from "@/features/quizzes/components/TakeQuizTab/OpenEndedQuestion"
import { ReviewScreen } from "@/features/quizzes/components/TakeQuizTab/ReviewScreen"
import { QuizResult } from "@/features/quizzes/components/TakeQuizTab/QuizResult"
import Countdown from "@/features/quizzes/components/TakeQuizTab/Countdown"

export default function QuizTakePage() {
  const { id, quizId } = useParams<{ id: string; quizId: string }>()
  const router = useRouter()
  const { data: quiz } = useGetQuiz(Number(quizId))
  const questions = quiz?.questions ?? []

  const session = useTakeQuiz(questions)
  const {
    phase,
    currentIndex,
    answers,
    attempt,
    currentQQ,
    isLast,
    startedAt,
    completedAt,
    start,
    reset,
    setResult,
    goBackFromReview,
    goPrev,
    setAnswer,
    goNext,
  } = session

  const [countdown, setCountdown] = useState(3)
  const [timePassed, setTimePassed] = useState(0)

  const { mutate: submit, isPending: isSubmitting } = useSubmitQuizAttempt(
    Number(quizId)
  )

  const onOverview = () => router.push(`/workspaces/${id}/quizzes/${quizId}`)

  useEffect(() => {
    if (phase !== "countdown") return
    const timer = setTimeout(() => {
      if (countdown === 0) start()
      else setCountdown((prev) => prev - 1)
    }, 1000)
    return () => clearTimeout(timer)
  }, [phase, countdown, start])

  useEffect(() => {
    if (phase !== "taking") return
    const timer = setTimeout(() => setTimePassed((prev) => prev + 1), 1000)
    return () => clearTimeout(timer)
  }, [phase, timePassed])

  function handleSubmit() {
    submit(
      {
        quizId: Number(quizId),
        answers: questions.map((qq) => ({
          quizQuestionId: qq.id,
          userAnswer: answers[qq.id] ?? "",
        })),
        startedAt: startedAt!,
        completedAt: completedAt!,
      },
      {
        onSuccess: (data) => setResult(data),
        onError: (err) =>
          toast.error(getApiErrorMessage(err, "Failed to submit quiz")),
      }
    )
  }

  function handleRetake() {
    setCountdown(3)
    setTimePassed(0)
    reset()
  }

  if (phase === "countdown") {
    return <Countdown countdown={countdown} />
  }

  if (phase === "review") {
    return (
      <ReviewScreen
        questions={questions}
        answers={answers}
        onGoBack={goBackFromReview}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    )
  }

  if (phase === "result" && attempt) {
    return (
      <QuizResult
        quiz={quiz!}
        attempt={attempt}
        onRetake={handleRetake}
        onOverview={onOverview}
      />
    )
  }

  if (isSubmitting) {
    return (
      <div className="flex flex-col items-center gap-3 py-16">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Grading your quiz…</p>
      </div>
    )
  }

  const currentQ = currentQQ?.question
  const progress = ((currentIndex + 1) / questions.length) * 100
  const currentAnswer = answers[currentQQ.id]

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onOverview}
          className="-ml-2"
        >
          <ArrowLeft className="mr-1 size-4" /> Back to overview
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm whitespace-nowrap text-muted-foreground">
          Question {currentIndex + 1} of {questions.length}
        </span>
        <Progress value={progress} className="h-1.5 flex-1" />
        <span className="text-sm whitespace-nowrap text-muted-foreground tabular-nums">
          {Math.floor(timePassed / 60)}:
          {String(timePassed % 60).padStart(2, "0")}
        </span>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-1.5 py-0 text-[10px]">
            {currentQ.question_type === "mcq" ? "MCQ" : "Open-ended"}
          </Badge>
          <span className="text-xs text-muted-foreground">
            #{currentIndex + 1}
          </span>
        </div>

        <p className="text-base leading-relaxed font-medium text-foreground">
          {currentQ.title}
        </p>

        {currentQ.question_type === "mcq" && currentQ.mcqChoices ? (
          <MCQQuestion
            choices={currentQ.mcqChoices}
            selected={typeof currentAnswer === "number" ? currentAnswer : null}
            onSelect={(choiceId) => setAnswer(currentQQ.id, choiceId)}
          />
        ) : (
          <OpenEndedQuestion
            value={typeof currentAnswer === "string" ? currentAnswer : ""}
            onChange={(v) => setAnswer(currentQQ.id, v)}
          />
        )}
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={goPrev}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="mr-1 size-4" />
          Previous
        </Button>

        <Button onClick={goNext}>
          {isLast ? "Review & Submit" : "Next"}
          {!isLast && <ChevronRight className="ml-1 size-4" />}
        </Button>
      </div>
    </div>
  )
}
