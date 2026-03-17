export interface ChatSession {
  id: string
  workbenchId: string
  title: string
  createdAt: string
}

export interface ChatSource {
  resourceId: string
  resourceName: string
  excerpt: string
}

export interface ChatMessage {
  id: string
  sessionId: string
  role: "user" | "assistant"
  content: string
  sources?: ChatSource[]
  createdAt: string
  isEdited?: boolean
}