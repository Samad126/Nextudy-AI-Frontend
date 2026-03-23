"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowUp, Bot } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatMessage {
  id: string
  role: "system" | "user" | "assistant"
  content: string
  userName?: string
}

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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

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

function ChatMessageBubble({ message }: { message: ChatMessage }) {
  if (message.role === "system") {
    return (
      <div className="flex justify-start">
        <div className="max-w-[80%] rounded-xl bg-muted/60 px-4 py-2.5">
          <p className="text-xs text-muted-foreground leading-relaxed">{message.content}</p>
        </div>
      </div>
    )
  }

  if (message.role === "user") {
    return (
      <div className="flex justify-end items-end gap-2">
        <div className="max-w-[78%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5">
          <p className="text-sm text-primary-foreground leading-relaxed">{message.content}</p>
        </div>
        <UserAvatar name={message.userName ?? "You"} />
      </div>
    )
  }

  return (
    <div className="flex justify-start items-end gap-2">
      <div className="flex size-7 items-center justify-center rounded-lg bg-muted shrink-0">
        <Bot className="size-3.5 text-muted-foreground" />
      </div>
      <div className="max-w-[80%] rounded-2xl rounded-bl-sm border border-border bg-card px-4 py-2.5">
        <p className="text-sm text-foreground leading-relaxed">{message.content}</p>
      </div>
    </div>
  )
}

function UserAvatar({ name }: { name: string }) {
  const initials = name.slice(0, 2)
  return (
    <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-[10px] font-semibold text-primary-foreground uppercase">
      {initials}
    </div>
  )
}

function ChatInput({
  value,
  onChange,
  onKeyDown,
  onSend,
}: {
  value: string
  onChange: (v: string) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  onSend: () => void
}) {
  return (
    <div className="shrink-0 flex items-end gap-2 rounded-xl border border-border bg-card px-3 py-2.5 focus-within:ring-2 focus-within:ring-ring/30 transition-shadow">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Ask follow-up questions..."
        rows={1}
        className={cn(
          "flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60",
          "outline-none leading-relaxed max-h-32 overflow-y-auto"
        )}
        style={{ fieldSizing: "content" } as React.CSSProperties}
      />
      <button
        onClick={onSend}
        disabled={!value.trim()}
        className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity disabled:opacity-40"
        aria-label="Send message"
      >
        <ArrowUp className="size-3.5" />
      </button>
    </div>
  )
}
