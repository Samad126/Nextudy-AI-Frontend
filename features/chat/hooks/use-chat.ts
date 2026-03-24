"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useSocket } from "@/shared/providers/socket-provider"
import type { Message, SourceCitation, TypingEvent } from "@/types/chat"

export interface LocalChatMessage {
  id: string
  role: "system" | "user" | "assistant"
  content: string
  sources?: SourceCitation[]
  isEdited?: boolean
  isError?: boolean
}

const SYSTEM_INIT: LocalChatMessage = {
  id: "system-init",
  role: "system",
  content: "Workbench initialized. Ask questions about your study materials.",
}

function toLocal(m: Message): LocalChatMessage {
  return {
    id: String(m.id),
    role: m.role,
    content: m.content,
    sources: m.sources ?? undefined,
  }
}

interface UseChatOptions {
  chatId: number | undefined
  initialMessages?: LocalChatMessage[]
}

export function useChat({ chatId, initialMessages }: UseChatOptions) {
  const { socket, isConnected } = useSocket()
  const [messages, setMessages] = useState<LocalChatMessage[]>(
    initialMessages?.length ? initialMessages : [SYSTEM_INIT]
  )
  const [isTyping, setIsTyping] = useState(false)
  const lastOptimisticId = useRef<string | null>(null)

  useEffect(() => {
    if (!socket || chatId === undefined) return

    function onTyping({ chatId: incomingId, isTyping: typing }: TypingEvent) {
      if (incomingId !== chatId) return
      setIsTyping(typing)
    }

    function onMessage(msg: Message) {
      const local = toLocal(msg)
      setMessages((prev) =>
        prev.some((m) => m.id === local.id) ? prev : [...prev, local]
      )
    }

    function onError({ message }: { message: string }) {
      setIsTyping(false)
      setMessages((prev) => {
        const filtered = lastOptimisticId.current
          ? prev.filter((m) => m.id !== lastOptimisticId.current)
          : prev
        lastOptimisticId.current = null
        return [...filtered, { id: `error-${Date.now()}`, role: "system", content: message, isError: true }]
      })
    }

    socket.on("chat:typing", onTyping)
    socket.on("chat:message", onMessage)
    socket.on("chat:error", onError)
    return () => {
      socket.off("chat:typing", onTyping)
      socket.off("chat:message", onMessage)
      socket.off("chat:error", onError)
    }
  }, [socket, chatId])

  const sendMessage = useCallback(
    (content: string) => {
      if (!socket || !isConnected || !content.trim() || chatId === undefined) return

      const optimisticId = `optimistic-${Date.now()}`
      lastOptimisticId.current = optimisticId
      setMessages((prev) => [...prev, { id: optimisticId, role: "user", content }])

      socket.emit("chat:sendMessage", { chatId, content })
    },
    [socket, isConnected, chatId]
  )

  const editMessage = useCallback(
    (messageId: string, content: string) => {
      if (!socket || !isConnected || !content.trim() || chatId === undefined) return

      setMessages((prev) => {
        const idx = prev.findIndex((m) => m.id === messageId)
        if (idx === -1) return prev
        const updated = prev.slice(0, idx + 1)
        updated[idx] = { ...updated[idx], content, isEdited: true }
        return updated
      })

      socket.emit("chat:editMessage", { chatId, messageId: Number(messageId), content })
    },
    [socket, isConnected, chatId]
  )

  return { messages, isTyping, isConnected, sendMessage, editMessage }
}
