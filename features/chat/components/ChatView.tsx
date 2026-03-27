"use client"

import { useState, useRef, useEffect } from "react"
import { ChatMessageBubble } from "./ChatMessageBubble"
import { TypingIndicator } from "./TypingIndicator"
import { ChatInput } from "./ChatInput"
import { useChat, type LocalChatMessage } from "@/features/chat/hooks/use-chat"


export interface ChatViewProps {
  chatId: number | undefined
  userName: string
  initialMessages?: LocalChatMessage[]
  autoSend?: string
  onAutoSendComplete?: () => void
  onFirstMessage?: (content: string) => void
}

export function ChatView({
  chatId,
  userName,
  initialMessages,
  autoSend,
  onAutoSendComplete,
  onFirstMessage,
}: ChatViewProps) {
  const [input, setInput] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const autoSendTriggered = useRef(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const { messages, isTyping, isStreaming, isConnected, sendMessage, editMessage } = useChat({
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
      <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-3 pb-3 pr-0.5">
        {messages.map((msg) => (
          <ChatMessageBubble
            key={msg.id}
            message={msg}
            userName={userName}
            onEdit={msg.role === "user" ? handleEditRequest : undefined}
          />
        ))}
        {isTyping && !isStreaming && <TypingIndicator />}
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
