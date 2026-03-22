import { axiosPrivate } from "@/lib/api/client"
import { ApiSuccess, ResourceGroup } from "@/types"
import { useQuery } from "@tanstack/react-query"

async function getResourceGroups(workspaceId: number) {
  const { data } = await axiosPrivate.get<ApiSuccess<ResourceGroup[]>>("/resource-groups", {
    params: { workspaceId },
  })
  return data.data
}

export function useGetResourceGroups(workspaceId: number) {
  return useQuery({
    queryKey: ["resource-groups", workspaceId],
    queryFn: () => getResourceGroups(workspaceId),
  })
}
