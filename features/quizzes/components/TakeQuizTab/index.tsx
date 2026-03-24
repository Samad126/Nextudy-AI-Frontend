"use client"

import { useState } from "react"
import { toast } from "sonner"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { Quiz, QuizAttempt, QuizQuestion } from "../../types/quiz"
import { Button } from "@/shared/ui/button"
import { Progress } from "@/shared/ui/progress"
import { Badge } from "@/shared/ui/badge"
import { MCQQuestion } from "./MCQQuestion"
import { OpenEndedQuestion } from "./OpenEndedQuestion"
import { ReviewScreen } from "./ReviewScreen"
import { QuizResult } from "./QuizResult"
import { useSubmitQuizAttempt } from "../../mutations/use-submit-quiz-attempt"

type Answers = Record<number, string | number>
type Phase = "taking" | "review" | "result"

interface TakeQuizTabProps {
  quiz: Quiz
  onOverview: () => void
}

export function TakeQuizTab({ quiz, onOverview }: TakeQuizTabProps) {
  const [phase, setPhase] = useState<Phase>("taking")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null)

  const { mutate: submit, isPending: isSubmitting } = useSubmitQuizAttempt(quiz.id)

  const questions = quiz.questions ?? []
  const currentQQ: QuizQuestion = questions[currentIndex]
  const currentQ = currentQQ?.question
  const isLast = currentIndex === questions.length - 1

  function setAnswer(quizQuestionId: number, value: string | number) {
    setAnswers((prev) => ({ ...prev, [quizQuestionId]: value }))
  }

  function goNext() {
    if (isLast) {
      setPhase("review")
    } else {
      setCurrentIndex((i) => i + 1)
    }
  }

  function goPrev() {
    setCurrentIndex((i) => i - 1)
  }

  function handleGoBackFromReview(index: number) {
    setCurrentIndex(index)
    setPhase("taking")
  }

  function handleSubmit() {
    const answerPayload = questions.map((qq) => ({
      quizQuestionId: qq.id,
      userAnswer: answers[qq.id] ?? "",
    }))

    submit(
      { quizId: quiz.id, answers: answerPayload },
      {
        onSuccess: (data) => {
          setAttempt(data)
          setPhase("result")
        },
        onError: () => toast.error("Failed to submit quiz"),
      }
    )
  }

  function handleRetake() {
    setAnswers({})
    setCurrentIndex(0)
    setAttempt(null)
    setPhase("taking")
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
    <div className="flex flex-col gap-6 max-w-2xl">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          Question {currentIndex + 1} of {questions.length}
        </span>
        <Progress value={progress} className="flex-1 h-1.5" />
      </div>

      {/* Question card */}
      <div className="rounded-xl border border-border bg-card p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
            {currentQ.question_type === "mcq" ? "MCQ" : "Open-ended"}
          </Badge>
          <span className="text-xs text-muted-foreground">#{currentIndex + 1}</span>
        </div>

        <p className="text-base font-medium text-foreground leading-relaxed">
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

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={goPrev}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="size-4 mr-1" />
          Previous
        </Button>

        <Button onClick={goNext}>
          {isLast ? "Review & Submit" : "Next"}
          {!isLast && <ChevronRight className="size-4 ml-1" />}
        </Button>
      </div>
    </div>
  )
}
