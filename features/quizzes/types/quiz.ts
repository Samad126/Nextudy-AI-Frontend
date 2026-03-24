import type { Difficulty } from "@/shared/components/DifficultyBadge"

export type { Difficulty }

export type QuestionType = "mcq" | "open_ended"

export interface MCQChoice {
  id: number
  choice_text: string
  choice_order: number
}

export interface Question {
  id: number
  title: string
  question_type: QuestionType
  difficulty?: Difficulty
  explanation?: string
  mcqChoices?: MCQChoice[]
  openEndedAnswer?: {
    sample_answer: string
  }
}

export interface QuizQuestion {
  id: number
  question: Question
}

export interface Quiz {
  id: number
  workspaceId: number
  title: string
  description?: string
  questions: QuizQuestion[]
  created_at: string
  updated_at: string
}

export interface QuizSummary {
  id: number
  title: string
  description?: string
  questionCount: number
  attemptCount: number
  created_at: string
}

export interface UserQuizAnswer {
  id: number
  quizQuestionId: number
  userAnswer: string
  isCorrect: boolean
}

export interface QuizAttempt {
  id: number
  quizId: number
  score?: number
  started_at: string
  completed_at?: string
  answers: UserQuizAnswer[]
}

export const quizKeys = {
  all: (workspaceId: number) => ["quizzes", workspaceId] as const,
  detail: (id: number) => ["quiz", id] as const,
  attempts: (quizId: number) => ["quiz", quizId, "attempts"] as const,
  attempt: (quizId: number, attemptId: number) =>
    ["quiz", quizId, "attempts", attemptId] as const,
}
