"use client"

import { useState, useRef } from "react"
import { ChatMessageBubble, ChatMessage } from "./ChatMessageBubble"
import { ChatInput } from "./ChatInput"

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "system-init",
    role: "system",
    content: "Workbench initialized for this workspace. Use the top bar to select materials.",
  },
]

interface WorkbenchChatViewProps {
  hasResources: boolean
  userName?: string
}

export function WorkbenchChatView({ hasResources, userName = "You" }: WorkbenchChatViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)

  function handleSend() {
    const trimmed = input.trim()
    if (!trimmed) return

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
      userName,
    }

    const assistantMsg: ChatMessage = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: hasResources
        ? `I have analysed the documents (Total 628000 chars). Based on the context, your query about "${trimmed}" suggests a focus on the key themes we've identified. How would you like me to elaborate?`
        : "Please select study materials using the Resources button at the top before asking questions.",
    }

    setMessages((prev) => [...prev, userMsg, assistantMsg])
    setInput("")
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 pb-3 pr-0.5">
        {messages.map((msg) => (
          <ChatMessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <ChatInput
        value={input}
        onChange={setInput}
        onKeyDown={handleKeyDown}
        onSend={handleSend}
      />
    </div>
  )
}
