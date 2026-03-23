import { axiosPrivate } from "@/lib/api/client"
import { ApiSuccess, Workbench } from "@/types"
import { useQuery } from "@tanstack/react-query"

async function getWorkbenches(workspaceId: number) {
  const { data } = await axiosPrivate.get<ApiSuccess<Workbench[]>>("/workbenches", {
    params: { workspaceId },
  })
  return data.data
}

export function useGetWorkbenches(workspaceId: number) {
  return useQuery({
    queryKey: ["workbenches", workspaceId],
    queryFn: () => getWorkbenches(workspaceId),
  })
}
