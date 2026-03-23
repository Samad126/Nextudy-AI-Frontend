import { Bot } from "lucide-react"
import { UserAvatar } from "./UserAvatar"

export interface ChatMessage {
  id: string
  role: "system" | "user" | "assistant"
  content: string
  userName?: string
}

export function ChatMessageBubble({ message }: { message: ChatMessage }) {
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
