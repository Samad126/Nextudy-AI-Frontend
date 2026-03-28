import { useCallback, useState } from "react"
import { QuizAttempt, QuizQuestion } from "../types/quiz"
import { trackQuizStarted, trackQuizCompleted } from "@/lib/analytics"

type Answers = Record<number, string | number>
export type QuizPhase = "countdown" | "taking" | "review" | "result"

interface QuizSessionState {
  phase: QuizPhase
  currentIndex: number
  answers: Answers
  attempt: QuizAttempt | null
  startedAt: Date | null
  completedAt: Date | null
}

export function useTakeQuiz(questions: QuizQuestion[]) {
  const [state, setState] = useState<QuizSessionState>({
    phase: "countdown",
    currentIndex: 0,
    answers: {},
    attempt: null,
    startedAt: null,
    completedAt: null,
  })

  const isLast = state.currentIndex === questions.length - 1

  const start = useCallback(() => {
    setState((prev) => ({ ...prev, phase: "taking", startedAt: new Date() }))
    trackQuizStarted(questions.length)
  }, [questions.length])

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

  function goBackFromReview(index: number) {
    setState((prev) => ({ ...prev, currentIndex: index, phase: "taking" }))
  }

  function setResult(attempt: QuizAttempt) {
    setState((prev) => ({ ...prev, attempt, phase: "result" }))
    trackQuizCompleted(attempt.score ?? 0, questions.length)
  }

  function reset() {
    setState({
      phase: "countdown",
      currentIndex: 0,
      answers: {},
      attempt: null,
      startedAt: null,
      completedAt: null,
    })
  }

  return {
    ...state,
    isLast,
    currentQQ: questions[state.currentIndex],
    start,
    setAnswer,
    goNext,
    goPrev,
    goBackFromReview,
    setResult,
    reset,
  }
}
