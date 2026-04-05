import { QuizSummary } from "../types/quiz"
import { QuizCard } from "./QuizCard/QuizCard"

interface QuizGridProps {
  quizzes: QuizSummary[]
  workspaceId: number
}

export function QuizGrid({ quizzes, workspaceId }: QuizGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {quizzes.map((quiz) => (
        <QuizCard key={quiz.id} quiz={quiz} workspaceId={workspaceId} />
      ))}
    </div>
  )
}
