import { axiosPrivate } from "@/lib/api/client"
import type { ApiSuccess } from "@/types"
import type { Chat, ChatListItem } from "@/types/chat"
import { useQuery } from "@tanstack/react-query"

async function getWorkbenchChats(workbenchId: number) {
  const { data } = await axiosPrivate.get<ApiSuccess<ChatListItem[]>>("/chats", {
    params: { workbenchId },
  })
  return data.data
}

async function getChat(chatId: number) {
  const { data } = await axiosPrivate.get<ApiSuccess<Chat>>(`/chats/${chatId}`)
  return data.data
}

export function useGetWorkbenchChats(workbenchId: number) {
  return useQuery({
    queryKey: ["chats", "workbench", workbenchId],
    queryFn: () => getWorkbenchChats(workbenchId),
  })
}

export function useGetChat(chatId: number | undefined) {
  return useQuery({
    queryKey: ["chats", chatId],
    queryFn: () => getChat(chatId!),
    enabled: !!chatId,
  })
}
