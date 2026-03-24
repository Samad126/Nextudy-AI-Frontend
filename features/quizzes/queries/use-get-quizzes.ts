import { axiosPrivate } from "@/lib/api/client"
import { ApiSuccess } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { QuizSummary, quizKeys } from "../types/quiz"

async function getQuizzes(workspaceId: number) {
  const { data } = await axiosPrivate.get<ApiSuccess<QuizSummary[]>>("/quizzes", {
    params: { workspaceId },
  })
  return data.data
}

export function useGetQuizzes(workspaceId: number) {
  return useQuery({
    queryKey: quizKeys.all(workspaceId),
    queryFn: () => getQuizzes(workspaceId),
  })
}
