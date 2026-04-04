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
  const autoSendTriggered = useRef(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const { messages, isTyping, isStreaming, isConnected, sendMessage, editMessage } = useChat({
    chatId,
    initialMessages,
  })

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

    if (!chatId && onFirstMessage) {
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
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden px-4 pb-4 pt-3">
      <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-3 pb-3 pr-0.5">
        {messages.map((msg) => (
          <ChatMessageBubble
            key={msg.id}
            message={msg}
            userName={userName}
            onEdit={msg.role === "user" ? editMessage : undefined}
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
        placeholder={!isConnected ? "Connecting…" : "Ask follow-up questions..."}
      />
    </div>
  )
}
