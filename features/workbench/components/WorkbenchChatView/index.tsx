"use client"

import { useState, useRef, useEffect } from "react"
import { ChatMessageBubble, TypingIndicator } from "./ChatMessageBubble"
import { ChatInput } from "./ChatInput"
import { ChatListHeader } from "./ChatListHeader"
import { useChat, type LocalChatMessage } from "@/features/chat/hooks/use-chat"
import { useSocket } from "@/shared/providers/socket-provider"
import { useGetWorkbenchChats, useGetChat } from "@/features/chat/queries/use-get-chat"
import { useCreateChat } from "@/features/chat/mutations/use-create-chat"
import { useDeleteChat } from "@/features/chat/mutations/use-delete-chat"
import { Loader2 } from "lucide-react"
import type { SourceCitation } from "@/types/chat"

interface WorkbenchChatViewProps {
  workbenchId: number
  userName?: string
  onSourceClick?: (citation: SourceCitation) => void
}

export function WorkbenchChatView({ workbenchId, userName = "You", onSourceClick }: WorkbenchChatViewProps) {
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
          onSourceClick={onSourceClick}
        />
      )}
    </div>
  )
}

function ChatView({
  chatId,
  userName,
  initialMessages,
  autoSend,
  onAutoSendComplete,
  onFirstMessage,
  onSourceClick,
}: {
  chatId: number | undefined
  userName: string
  initialMessages?: LocalChatMessage[]
  autoSend?: string
  onAutoSendComplete?: () => void
  onFirstMessage?: (content: string) => void
  onSourceClick?: (citation: SourceCitation) => void
}) {
  const [input, setInput] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const autoSendTriggered = useRef(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const { messages, isTyping, isConnected, sendMessage, editMessage } = useChat({
    chatId,
    initialMessages,
  })

  // Send the first message automatically once chatId + socket are ready
  useEffect(() => {
    if (!autoSend || !chatId || !isConnected || autoSendTriggered.current) return
    autoSendTriggered.current = true
    sendMessage(autoSend)
    onAutoSendComplete?.()
  }, [autoSend, chatId, isConnected, sendMessage, onAutoSendComplete])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  function handleSend() {
    const trimmed = input.trim()
    if (!trimmed || isTyping || !isConnected) return

    if (editingId) {
      editMessage(editingId, trimmed)
      setEditingId(null)
    } else if (!chatId && onFirstMessage) {
      onFirstMessage(trimmed)
    } else {
      sendMessage(trimmed)
    }
    setInput("")
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
    if (e.key === "Escape" && editingId) {
      setEditingId(null)
      setInput("")
    }
  }

  function handleEditRequest(id: string, currentContent: string) {
    setEditingId(id)
    setInput(currentContent)
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden px-4 pb-4 pt-3">
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 pb-3 pr-0.5">
        {messages.map((msg) => (
          <ChatMessageBubble
            key={msg.id}
            message={msg}
            userName={userName}
            onEdit={msg.role === "user" ? handleEditRequest : undefined}
            onSourceClick={onSourceClick}
          />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      <ChatInput
        value={input}
        onChange={setInput}
        onKeyDown={handleKeyDown}
        onSend={handleSend}
        disabled={isTyping || !isConnected}
        placeholder={
          !isConnected
            ? "Connecting…"
            : editingId
              ? "Edit your message… (Esc to cancel)"
              : "Ask follow-up questions..."
        }
      />
    </div>
  )
}
