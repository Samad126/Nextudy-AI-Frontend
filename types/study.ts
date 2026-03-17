export type Difficulty = "easy" | "medium" | "hard"
export type QuestionType = "mcq" | "open_ended"

export interface McqOption {
  id: string
  text: string
  isCorrect: boolean
}

export interface GradingKeyword {
  word: string
  weight: number
}

export interface Workbench {
  id: string
  workspaceId: string
  name: string
  pinnedResourceIds: string[]
  createdAt: string
}

export interface Question {
  id: string
  workbenchId: string
  type: QuestionType
  text: string
  difficulty: Difficulty
  options?: McqOption[]              // mcq only
  sampleAnswer?: string              // open_ended only
  gradingKeywords?: GradingKeyword[] // open_ended only
}

export interface Flashcard {
  id: string
  workspaceId: string
  front: string
  back: string
  difficulty: Difficulty
}

export interface Quiz {
  id: string
  workspaceId: string
  title: string
  description: string
  questionIds: string[]
  attemptCount: number
  lastScore?: number
  createdAt: string
}

export interface QuizAttempt {
  id: string
  quizId: string
  userId: string
  score: number
  answers: Record<string, string> // questionId → answer
  completedAt: string
}