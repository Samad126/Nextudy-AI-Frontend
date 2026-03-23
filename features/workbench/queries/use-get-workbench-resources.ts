import { axiosPrivate } from "@/lib/api/client"
import { ApiSuccess, Resource } from "@/types"
import { useQuery } from "@tanstack/react-query"

interface WorkbenchResourceEntry {
  workbenchId: number
  resourceId: number
  added_at: string
  resource: Resource
}

async function getWorkbenchResources(workbenchId: number) {
  const { data } = await axiosPrivate.get<ApiSuccess<WorkbenchResourceEntry[]>>(
    `/workbenches/${workbenchId}/resources`
  )
  // API returns join table entries — extract the nested resource objects
  return data.data.map((entry) => entry.resource)
}

export function useGetWorkbenchResources(workbenchId: number) {
  return useQuery({
    queryKey: ["workbench-resources", workbenchId],
    queryFn: () => getWorkbenchResources(workbenchId),
  })
}
