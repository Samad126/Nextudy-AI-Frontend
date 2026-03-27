"use client"

import { useState } from "react"
import { ChatListHeader } from "./ChatListHeader"
import { ChatView } from "./ChatView"
import { useSocket } from "@/shared/providers/socket-provider"
import { useGetWorkbenchChats, useGetChat } from "@/features/chat/queries/use-get-chat"
import { useCreateChat } from "@/features/chat/mutations/use-create-chat"
import { useDeleteChat } from "@/features/chat/mutations/use-delete-chat"
import { Loader2 } from "lucide-react"
import type { LocalChatMessage } from "@/features/chat/hooks/use-chat"

interface WorkbenchChatViewProps {
  workbenchId: number
  userName?: string
}

export function WorkbenchChatView({ workbenchId, userName = "You" }: WorkbenchChatViewProps) {
  const { isConnected } = useSocket()

  const { data: chats, isLoading: isLoadingChats } = useGetWorkbenchChats(workbenchId)
  const { mutateAsync: createChat, isPending: isCreating } = useCreateChat(workbenchId)
  const { mutate: deleteChat, isPending: isDeleting } = useDeleteChat(workbenchId)

  // null = no explicit selection; falls back to chats[0] (latest) via derived chatId
  const [activeChatId, setActiveChatId] = useState<number | null>(null)
  // Content to auto-send after first chat is created
  const [pendingFirstMessage, setPendingFirstMessage] = useState<string | null>(null)

  // Derive active chat: user selection > first/latest chat in list
  const chatId = activeChatId ?? chats?.[0]?.id

  const { data: chatData, isLoading: isLoadingHistory } = useGetChat(chatId)

  const initialMessages: LocalChatMessage[] | undefined = chatData?.messages.map((m) => ({
    id: String(m.id),
    role: m.role,
    content: m.content,
    sources: m.sources ?? undefined,
  }))

  async function handleFirstMessage(content: string) {
    setPendingFirstMessage(content)
    try {
      const chat = await createChat("New Chat")
      setActiveChatId(chat.id)
    } catch {
      setPendingFirstMessage(null)
    }
  }

  async function handleCreate(title: string) {
    const chat = await createChat(title)
    setActiveChatId(chat.id)
  }

  function handleDelete(id: number) {
    deleteChat(id, {
      onSuccess: () => {
        if (id === chatId) {
          const remaining = chats?.filter((c) => c.id !== id)
          setActiveChatId(remaining?.[0]?.id ?? null)
        }
      },
    })
  }

  if (isLoadingChats) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <ChatListHeader
        chats={chats ?? []}
        activeChatId={chatId}
        isConnected={isConnected}
        isCreating={isCreating}
        isDeleting={isDeleting}
        onSelect={setActiveChatId}
        onCreate={handleCreate}
        onDelete={handleDelete}
      />

      {isLoadingHistory ? (
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <ChatView
          key={chatId ?? "new"}
          chatId={chatId}
          userName={userName}
          initialMessages={initialMessages}
          autoSend={chatId && pendingFirstMessage ? pendingFirstMessage : undefined}
          onAutoSendComplete={() => setPendingFirstMessage(null)}
          onFirstMessage={!chatId ? handleFirstMessage : undefined}
        />
      )}
    </div>
  )
}
