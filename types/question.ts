import type { SourceCitation } from "./chat"
export type { SourceCitation }

export type ApiQuestionType = "mcq" | "open_ended"
export type ApiQuestionDifficulty = "EASY" | "MEDIUM" | "HARD"
export type ApiQuestionDifficultyMixed = "EASY" | "MEDIUM" | "HARD" | "MIXED"
export type GenerationMode = "USER_PROVIDED" | "AI_GENERATED"
export type AnswerSource = "file" | "ai" | "mixed"
export type AnswerSchema = "MCQ" | "OPEN_ENDED" | "MIXED"
export type GenerationScope = "FIXED" | "EXHAUSTIVE"

export interface MCQChoice {
  id: number
  question_id: number
  choice_text: string
  choice_order: number
  is_correct: boolean
}

export interface ApiGradingKeyword {
  id: number
  open_ended_answer_id: number
  keyword: string
  weight: string
  is_required: boolean
}

export interface OpenEndedAnswer {
  id: number
  question_id: number
  sample_answer: string
  gradingKeywords: ApiGradingKeyword[]
}

export interface ApiQuestion {
  id: number
  workbenchId: number
  title: string
  question_type: ApiQuestionType
  answer_source: AnswerSource
  difficulty: ApiQuestionDifficulty
  explanation?: string
  source_citation?: SourceCitation
  mcqChoices: MCQChoice[]
  openEndedAnswer?: OpenEndedAnswer
  created_at: string
}

export interface CreateQuestionsInput {
  workbenchId: number
  generationMode: GenerationMode
  answerSource: AnswerSource
  // USER_PROVIDED
  questions?: string
  // AI_GENERATED
  answerSchema?: AnswerSchema
  difficulty?: ApiQuestionDifficultyMixed
  generationScope?: GenerationScope
  count?: number
  minWords?: number
  answerLength?: { unit: "words" | "paragraphs" | "pages"; amount: number }
}
