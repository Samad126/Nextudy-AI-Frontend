"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useSocket } from "@/shared/providers/socket-provider"
import type { Message, SourceCitation } from "@/types/chat"

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

// Stable placeholder ID for the in-flight streaming message
const STREAMING_ID = "streaming-assistant"

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
  // true while waiting for first chunk (shows typing dots) OR while streaming
  const [isTyping, setIsTyping] = useState(false)
  // true only during active streaming (first chunk received, final message not yet)
  const [isStreaming, setIsStreaming] = useState(false)
  // Queue of optimistic IDs in send order — matched FIFO against chat:userMessage confirmations
  const optimisticQueue = useRef<string[]>([])
  // ID of the message currently being edited — used to replace it when chat:userMessage confirms
  const pendingEditId = useRef<string | null>(null)

  useEffect(() => {
    if (!socket || chatId === undefined) return

    function onChunk({ chatId: incomingId, chunk }: { chatId: number; chunk: string }) {
      if (incomingId !== chatId) return
      setIsStreaming(true)
      setMessages((prev) => {
        const idx = prev.findIndex((m) => m.id === STREAMING_ID)
        if (idx === -1) {
          // First chunk — add the streaming placeholder
          return [...prev, { id: STREAMING_ID, role: "assistant", content: chunk }]
        }
        const updated = [...prev]
        updated[idx] = { ...updated[idx], content: updated[idx].content + chunk }
        return updated
      })
    }

    function onUserMessage(msg: Message) {
      // Emitted before streaming starts — replace the optimistic or edited message with the real DB record
      const local = toLocal(msg)
      const editId = pendingEditId.current
      if (editId) {
        pendingEditId.current = null
        setMessages((prev) => prev.map((m) => (m.id === editId ? { ...local, isEdited: true } : m)))
        return
      }
      const optimisticId = optimisticQueue.current.shift() ?? null
      setMessages((prev) => {
        if (prev.some((m) => m.id === local.id)) return prev
        if (optimisticId) return prev.map((m) => (m.id === optimisticId ? local : m))
        return [...prev, local]
      })
    }

    function onMessage(msg: Message) {
      // Only handles the final assistant message
      const local = toLocal(msg)
      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== STREAMING_ID)
        return prev.some((m) => m.id === local.id) ? filtered : [...filtered, local]
      })
      setIsTyping(false)
      setIsStreaming(false)
    }

    function onError({ message }: { message: string }) {
      setIsTyping(false)
      setIsStreaming(false)
      setMessages((prev) => {
        const pendingIds = new Set(optimisticQueue.current)
        optimisticQueue.current = []
        return [
          ...prev.filter((m) => m.id !== STREAMING_ID && !pendingIds.has(m.id)),
          { id: `error-${Date.now()}`, role: "system", content: message, isError: true },
        ]
      })
    }

    socket.on("chat:chunk", onChunk)
    socket.on("chat:userMessage", onUserMessage)
    socket.on("chat:message", onMessage)
    socket.on("chat:error", onError)
    return () => {
      socket.off("chat:chunk", onChunk)
      socket.off("chat:userMessage", onUserMessage)
      socket.off("chat:message", onMessage)
      socket.off("chat:error", onError)
    }
  }, [socket, chatId])

  const sendMessage = useCallback(
    (content: string) => {
      if (!socket || !isConnected || !content.trim() || chatId === undefined) return

      const optimisticId = `optimistic-${Date.now()}`
      optimisticQueue.current.push(optimisticId)
      setIsTyping(true)
      setMessages((prev) => [...prev, { id: optimisticId, role: "user", content }])

      socket.emit("chat:sendMessage", { chatId, content })
    },
    [socket, isConnected, chatId]
  )

  const editMessage = useCallback(
    (messageId: string, content: string) => {
      if (!socket || !isConnected || !content.trim() || chatId === undefined) return

      setIsTyping(true)
      setMessages((prev) => {
        const idx = prev.findIndex((m) => m.id === messageId)
        if (idx === -1) return prev
        const updated = prev.slice(0, idx + 1)
        updated[idx] = { ...updated[idx], content, isEdited: true }
        return updated
      })

      pendingEditId.current = messageId
      socket.emit("chat:editMessage", { chatId, messageId: Number(messageId), content })
    },
    [socket, isConnected, chatId]
  )

  return { messages, isTyping, isStreaming, isConnected, sendMessage, editMessage }
}
