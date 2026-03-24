import { useQuery } from "@tanstack/react-query"
import { axiosPrivate } from "@/lib/api/client"
import { useAuth } from "@/shared/providers/auth-provider"
import type { ApiSuccess } from "@/types"
import type { WorkspaceMember } from "../types/workspace"

export const workspaceMemberKeys = {
  all: (workspaceId: number) => ["workspaces", workspaceId, "members"] as const,
}

async function getMembers(workspaceId: number): Promise<WorkspaceMember[]> {
  const { data } = await axiosPrivate.get<ApiSuccess<WorkspaceMember[]>>(
    `/workspaces/${workspaceId}/members`
  )
  return data.data
}

export function useGetMembers(workspaceId: number) {
  const { hasSession, isAccessTokenHydrated } = useAuth()
  return useQuery({
    queryKey: workspaceMemberKeys.all(workspaceId),
    queryFn: () => getMembers(workspaceId),
    enabled: hasSession && isAccessTokenHydrated,
  })
}
