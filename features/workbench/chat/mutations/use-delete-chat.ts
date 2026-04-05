import { axiosPrivate } from "@/lib/api/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"

async function deleteChat(chatId: number) {
  await axiosPrivate.delete(`/chats/${chatId}`)
}

export function useDeleteChat(workbenchId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (chatId: number) => deleteChat(chatId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats", "workbench", workbenchId] })
    },
  })
}
