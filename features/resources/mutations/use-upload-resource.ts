import { axiosPrivate } from "@/lib/api/client"
import { ApiSuccess, Resource } from "@/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"

async function uploadResource(workspaceId: number, file: File) {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("workspaceId", String(workspaceId))
  const { data } = await axiosPrivate.post<ApiSuccess<Resource>>("/resources", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return data.data
}

export function useUploadResource(workspaceId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (file: File) => uploadResource(workspaceId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources", workspaceId] })
    },
  })
}
