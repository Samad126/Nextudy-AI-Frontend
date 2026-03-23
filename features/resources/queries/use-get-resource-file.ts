import { axiosPrivate } from "@/lib/api/client"
import { useQuery } from "@tanstack/react-query"

async function getResourceFile(resourceId: number): Promise<Blob> {
  const { data } = await axiosPrivate.get(`/resources/${resourceId}/download`, {
    responseType: "blob",
  })
  return data
}

export function useGetResourceFile(resourceId: number) {
  return useQuery({
    queryKey: ["resource-file", resourceId],
    queryFn: () => getResourceFile(resourceId),
    staleTime: 5 * 60 * 1000,
  })
}
