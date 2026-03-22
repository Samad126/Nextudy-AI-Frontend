import { axiosPrivate } from "@/lib/api/client"
import { ApiSuccess, Resource } from "@/types"
import { useQuery } from "@tanstack/react-query"

async function getResources(workspaceId: number) {
  const { data } = await axiosPrivate.get<ApiSuccess<Resource[]>>("/resources", {
    params: { workspaceId },
  })
  return data.data
}

export function useGetResources(workspaceId: number) {
  return useQuery({
    queryKey: ["resources", workspaceId],
    queryFn: () => getResources(workspaceId),
  })
}
