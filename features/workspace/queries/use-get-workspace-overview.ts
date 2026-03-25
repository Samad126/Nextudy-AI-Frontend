import { useQuery } from "@tanstack/react-query"
import { axiosPrivate } from "@/lib/api/client"
import { useAuth } from "@/shared/providers/auth-provider"
import type { ApiSuccess } from "@/types"

export interface WorkspaceOverview {
  counts: {
    resources: number
    workbenches: number
    quizzes: number
    flashcardSets: number
  }
  recentWorkbenches: { id: number; name: string; created_at: string }[]
  recentQuizzes: { id: number; title: string; created_at: string }[]
  recentFlashcardSets: { id: number; title: string; created_at: string }[]
}

async function getWorkspaceOverview(workspaceId: number): Promise<WorkspaceOverview> {
  const { data } = await axiosPrivate.get<ApiSuccess<WorkspaceOverview>>(
    `/workspaces/${workspaceId}/overview`
  )
  return data.data
}

export function useGetWorkspaceOverview(workspaceId: number) {
  const { hasSession, isAccessTokenHydrated } = useAuth()
  return useQuery({
    queryKey: ["workspaces", workspaceId, "overview"],
    queryFn: () => getWorkspaceOverview(workspaceId),
    enabled: hasSession && isAccessTokenHydrated,
  })
}
