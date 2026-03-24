export type MessageRole = "user" | "assistant" | "system"

export interface SourceCitation {
  resourceId: number
  fileName: string
  page: number | null
  snippet: string
}

export interface Message {
  id: number
  chat_history_id: number
  role: MessageRole
  content: string
  model_id: string | null
  tokens_used: number | null
  finish_reason: string | null
  error_message: string | null
  sources: SourceCitation[] | null
  created_at: string
}

export interface Chat {
  id: number
  workbenchId: number
  title: string
  model_id: string
  system_prompt: string | null
  created_at: string
  updated_at: string
  messages: Message[]
}

export interface ChatListItem {
  id: number
  workbenchId: number
  title: string
  model_id: string
  created_at: string
  updated_at: string
  _count: { messages: number }
}

// ─── WebSocket payloads ───────────────────────────────────────────────────────

export interface SendMessagePayload {
  chatId: number
  content: string
}

export interface EditMessagePayload {
  chatId: number
  messageId: number
  content: string
}

export interface TypingEvent {
  chatId: number
  isTyping: boolean
}

export interface MessageAck {
  data: Message
}
