import { axiosPrivate } from "@/lib/api/client"
import { ApiSuccess, ApiQuestion } from "@/types"
import { useQuery } from "@tanstack/react-query"

async function getWorkspaceQuestions(workspaceId: number) {
  const { data } = await axiosPrivate.get<ApiSuccess<ApiQuestion[]>>("/questions", {
    params: { workspaceId },
  })
  return data.data
}

export function useGetWorkspaceQuestions(workspaceId: number) {
  return useQuery({
    queryKey: ["questions", "workspace", workspaceId],
    queryFn: () => getWorkspaceQuestions(workspaceId),
  })
}
