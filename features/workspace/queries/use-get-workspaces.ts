import { axiosPrivate } from "@/lib/api/client"
import { ApiSuccess, Workspace } from "@/types"
import { useQuery } from "@tanstack/react-query"

async function getWorkspaces() {
  const { data } =
    await axiosPrivate.get<ApiSuccess<Workspace[]>>("/workspaces")

  return data.data
}

export function useGetWorkspaces() {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: getWorkspaces,
  })
}
