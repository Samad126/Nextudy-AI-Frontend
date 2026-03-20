import { axiosPrivate } from "@/lib/api/client"
import { ApiSuccess, Workspace } from "@/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"

interface CreateWorkspaceInput {
  name: string
  description?: string
}

async function createWorkspace(input: CreateWorkspaceInput) {
  const { data } = await axiosPrivate.post<ApiSuccess<Workspace>>("/workspaces", input)
  return data.data
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createWorkspace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] })
    },
  })
}
