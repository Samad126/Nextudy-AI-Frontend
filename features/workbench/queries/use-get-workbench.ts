import { axiosPrivate } from "@/lib/api/client"
import { ApiSuccess, Workbench } from "@/types"
import { useQuery } from "@tanstack/react-query"

async function getWorkbench(workbenchId: number) {
  const { data } = await axiosPrivate.get<ApiSuccess<Workbench>>(
    `/workbenches/${workbenchId}`
  )
  return data.data
}

export function useGetWorkbench(workbenchId: number) {
  return useQuery({
    queryKey: ["workbench", workbenchId],
    queryFn: () => getWorkbench(workbenchId),
  })
}
