import { axiosPrivate } from "@/lib/api/client"
import { ApiSuccess, ApiQuestion } from "@/types"
import { useQuery } from "@tanstack/react-query"

async function getQuestions(workbenchId: number) {
  const { data } = await axiosPrivate.get<ApiSuccess<ApiQuestion[]>>(
    `/questions?workbenchId=${workbenchId}`
  )
  return data.data
}

export function useGetQuestions(workbenchId: number) {
  return useQuery({
    queryKey: ["questions", workbenchId],
    queryFn: () => getQuestions(workbenchId),
  })
}
