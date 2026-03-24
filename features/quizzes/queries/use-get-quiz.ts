import { axiosPrivate } from "@/lib/api/client"
import { ApiSuccess } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { Quiz, quizKeys } from "../types/quiz"

async function getQuiz(id: number) {
  const { data } = await axiosPrivate.get<ApiSuccess<Quiz>>(`/quizzes/${id}`)
  return data.data
}

export function useGetQuiz(id: number) {
  return useQuery({
    queryKey: quizKeys.detail(id),
    queryFn: () => getQuiz(id),
  })
}
