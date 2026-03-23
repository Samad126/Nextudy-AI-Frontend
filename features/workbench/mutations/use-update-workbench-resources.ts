import { axiosPrivate } from "@/lib/api/client"
import { ApiSuccess, WorkbenchWithResources } from "@/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"

interface UpdateWorkbenchResourcesInput {
  workbenchId: number
  resourceIds: number[]
}

async function updateWorkbenchResources({ workbenchId, resourceIds }: UpdateWorkbenchResourcesInput) {
  const { data } = await axiosPrivate.put<ApiSuccess<WorkbenchWithResources>>(
    `/workbenches/${workbenchId}/resources`,
    { resourceIds }
  )
  return data.data
}

export function useUpdateWorkbenchResources(workbenchId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateWorkbenchResources,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workbench-resources", workbenchId] })
    },
  })
}
