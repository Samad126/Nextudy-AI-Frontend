import { axiosPrivate } from "@/lib/api/client"
import { useQuery } from "@tanstack/react-query"

export async function getResourceContent(resourceId: number): Promise<string | null> {
  const { data } = await axiosPrivate.get<{ data: { content: string | null } }>(
    `/resources/${resourceId}/content`,
  )
  return data.data.content ?? null
}

export function useGetResourceContent(resourceId: number) {
  return useQuery({
    queryKey: ["resource-content", resourceId],
    queryFn: () => getResourceContent(resourceId),
    staleTime: 10 * 60 * 1000,
    retry: false,
  })
}
