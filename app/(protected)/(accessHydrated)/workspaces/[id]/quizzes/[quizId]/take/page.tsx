"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { getApiErrorMessage } from "@/lib/api/get-api-error"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useGetQuiz } from "@/features/quizzes/queries/use-get-quiz"
import { useTakeQuiz } from "@/features/quizzes/hooks/use-take-quiz"
import { useSubmitQuizAttempt } from "@/features/quizzes/mutations/use-submit-quiz-attempt"
import { Button } from "@/shared/ui/button"
import Countdown from "@/features/quizzes/components/QuizDetail/TakeQuiz/Countdown"
import { ReviewScreen } from "@/features/quizzes/components/QuizDetail/TakeQuiz/ReviewScreen"
import { QuizProgressBar } from "@/features/quizzes/components/QuizDetail/TakeQuiz/QuizProgressBar"
import { QuizQuestionCard } from "@/features/quizzes/components/QuizDetail/TakeQuiz/QuizQuestionCard"
import { QuizNavigation } from "@/features/quizzes/components/QuizDetail/TakeQuiz/QuizNavigation"

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
    currentQQ,
    isLast,
    startedAt,
    completedAt,
    start,
    goBackFromReview,
    goPrev,
    setAnswer,
    goNext,
  } = session

  const [countdown, setCountdown] = useState(3)
  const [timePassed, setTimePassed] = useState(0)

  const { mutate: submit, isPending: isSubmitting } = useSubmitQuizAttempt(Number(quizId))

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
        onSuccess: (data) => router.replace(`/workspaces/${id}/quizzes/${quizId}/attempts/${data.id}`),
        onError: (err) => toast.error(getApiErrorMessage(err, "Failed to submit quiz")),
      }
    )
  }

  if (phase === "countdown") return <Countdown countdown={countdown} />

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

  if (isSubmitting) {
    return (
      <div className="container flex flex-col items-center gap-3 py-16">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Grading your quiz…</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div>
        <Button variant="ghost" size="sm" onClick={onOverview} className="-ml-2">
          <ArrowLeft className="mr-1 size-4" /> Back to overview
        </Button>
      </div>

      <QuizProgressBar
        current={currentIndex}
        total={questions.length}
        timePassed={timePassed}
      />

      <QuizQuestionCard
        quizQuestion={currentQQ}
        currentIndex={currentIndex}
        currentAnswer={answers[currentQQ.id]}
        onSelect={(choiceId) => setAnswer(currentQQ.id, choiceId)}
        onChange={(v) => setAnswer(currentQQ.id, v)}
      />

      <QuizNavigation
        currentIndex={currentIndex}
        isLast={isLast}
        onPrev={goPrev}
        onNext={goNext}
      />
    </div>
  )
}
