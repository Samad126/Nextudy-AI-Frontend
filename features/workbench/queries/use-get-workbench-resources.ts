import { axiosPrivate } from "@/lib/api/client"
import { ApiSuccess, Resource } from "@/types"
import { useQuery } from "@tanstack/react-query"

async function getWorkbenchResources(workbenchId: number) {
  const { data } = await axiosPrivate.get<ApiSuccess<Resource[]>>(
    `/workbenches/${workbenchId}/resources`
  )
  return data.data
}

export function useGetWorkbenchResources(workbenchId: number) {
  return useQuery({
    queryKey: ["workbench-resources", workbenchId],
    queryFn: () => getWorkbenchResources(workbenchId),
  })
}
