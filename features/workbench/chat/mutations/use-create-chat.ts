import { axiosPrivate } from "@/lib/api/client"
import type { ApiSuccess } from "@/types"
import type { ChatListItem } from "@/types/chat"
import { useMutation, useQueryClient } from "@tanstack/react-query"

async function createChat(workbenchId: number, title: string) {
  const { data } = await axiosPrivate.post<ApiSuccess<ChatListItem>>("/chats", {
    workbenchId,
    title,
  })
  return data.data
}

export function useCreateChat(workbenchId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (title: string) => createChat(workbenchId, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats", "workbench", workbenchId] })
    },
  })
}
