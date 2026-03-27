"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { getApiErrorMessage } from "@/lib/api/get-api-error"
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { useGetQuiz } from "@/features/quizzes/queries/use-get-quiz"
import { QuizAttempt, QuizQuestion } from "@/features/quizzes/types/quiz"
import { Button } from "@/shared/ui/button"
import { Progress } from "@/shared/ui/progress"
import { Badge } from "@/shared/ui/badge"
import { MCQQuestion } from "@/features/quizzes/components/TakeQuizTab/MCQQuestion"
import { OpenEndedQuestion } from "@/features/quizzes/components/TakeQuizTab/OpenEndedQuestion"
import { ReviewScreen } from "@/features/quizzes/components/TakeQuizTab/ReviewScreen"
import { QuizResult } from "@/features/quizzes/components/TakeQuizTab/QuizResult"
import { useSubmitQuizAttempt } from "@/features/quizzes/mutations/use-submit-quiz-attempt"
import Countdown from "@/features/quizzes/components/TakeQuizTab/Countdown"

type Answers = Record<number, string | number>
type Phase = "countdown" | "taking" | "review" | "result"

interface QuizState {
  phase: Phase
  currentIndex: number
  answers: Answers
  attempt: QuizAttempt | null
  startedAt: Date | null
  completedAt: Date | null
}

export default function QuizTakePage() {
  const { id, quizId } = useParams<{ id: string; quizId: string }>()
  const router = useRouter()
  const { data: quiz } = useGetQuiz(Number(quizId))

  const [state, setState] = useState<QuizState>({
    phase: "countdown",
    currentIndex: 0,
    answers: {},
    attempt: null,
    startedAt: null,
    completedAt: null,
  })
  const [countdown, setCountdown] = useState(3)
  const [timePassed, setTimePassed] = useState(0);

  useEffect(() => {
    if (state.phase !== "countdown" && state.phase !== "taking") return

    const countdownTimer = setTimeout(() => {
      if (state.phase === "taking") {
        setTimePassed((prev) => prev + 1)
      } else if (state.phase === "countdown") {
        if (countdown === 0) {
          setState((prev) => ({ ...prev, phase: "taking", startedAt: new Date() }))
        } else {
          setCountdown((prev) => prev - 1)
        }
      }
    }, 1000)

    return () => clearTimeout(countdownTimer)
  }, [state.phase, countdown, timePassed])

  const { phase, currentIndex, answers, attempt } = state
  const { mutate: submit, isPending: isSubmitting } = useSubmitQuizAttempt(
    Number(quizId)
  )

  if (!quiz) return null

  const questions = quiz.questions ?? []
  const currentQQ: QuizQuestion = questions[currentIndex]
  const currentQ = currentQQ?.question
  const isLast = currentIndex === questions.length - 1

  function setAnswer(quizQuestionId: number, value: string | number) {
    setState((prev) => ({
      ...prev,
      answers: { ...prev.answers, [quizQuestionId]: value },
    }))
  }

  function goNext() {
    setState((prev) =>
      isLast
        ? { ...prev, phase: "review", completedAt: new Date() }
        : { ...prev, currentIndex: prev.currentIndex + 1 }
    )
  }

  function goPrev() {
    setState((prev) => ({ ...prev, currentIndex: prev.currentIndex - 1 }))
  }

  function handleGoBackFromReview(index: number) {
    setState((prev) => ({ ...prev, currentIndex: index, phase: "taking" }))
  }

  function handleSubmit() {
    const answerPayload = questions.map((qq) => ({
      quizQuestionId: qq.id,
      userAnswer: answers[qq.id] ?? "",
    }))

    submit(
      {
        quizId: Number(quizId),
        answers: answerPayload,
        startedAt: state.startedAt!,
        completedAt: state.completedAt!,
      },
      {
        onSuccess: (data) => {
          setState((prev) => ({ ...prev, attempt: data, phase: "result" }))
        },
        onError: (err) =>
          toast.error(getApiErrorMessage(err, "Failed to submit quiz")),
      }
    )
  }

  function handleRetake() {
    setCountdown(3)
    setTimePassed(0)
    setState({
      phase: "countdown",
      currentIndex: 0,
      answers: {},
      attempt: null,
      startedAt: null,
      completedAt: null,
    })
  }

  const onOverview = () => router.push(`/workspaces/${id}/quizzes/${quizId}`)

  if (phase === "countdown") {
    return <Countdown countdown={countdown} />
  }

  if (phase === "review") {
    return (
      <ReviewScreen
        questions={questions}
        answers={answers}
        onGoBack={handleGoBackFromReview}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    )
  }

  if (phase === "result" && attempt) {
    return (
      <QuizResult
        quiz={quiz}
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
        <span className="text-sm whitespace-nowrap tabular-nums text-muted-foreground">
          {Math.floor(timePassed / 60)}:{String(timePassed % 60).padStart(2, "0")}
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
            onSelect={(id) => setAnswer(currentQQ.id, id)}
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
