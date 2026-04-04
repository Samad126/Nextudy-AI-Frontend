import type { LocalChatMessage } from "@/features/chat/hooks/use-chat"
import { SystemMessageBubble } from "./SystemMessageBubble"
import { UserMessageBubble } from "./UserMessageBubble"
import { AssistantMessageBubble } from "./AssistantMessageBubble"

export type { LocalChatMessage as ChatMessage }

export function ChatMessageBubble({
  message,
  userName,
  onEdit,
}: {
  message: LocalChatMessage
  userName?: string
  onEdit?: (id: string, newContent: string) => void
}) {
  switch (message.role) {
    case "system":
      return <SystemMessageBubble message={message} />
    case "user":
      return <UserMessageBubble message={message} userName={userName} onEdit={onEdit} />
    default:
      return <AssistantMessageBubble message={message} />
  }
}
