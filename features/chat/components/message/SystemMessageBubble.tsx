import { TriangleAlert } from "lucide-react"
import type { LocalChatMessage } from "@/features/chat/hooks/use-chat"

export function SystemMessageBubble({ message }: { message: LocalChatMessage }) {
  return (
    <div className="flex justify-start">
      <div className={`max-w-[80%] rounded-xl px-4 py-2.5 flex items-start gap-2 ${message.isError ? "bg-destructive/10" : "bg-muted/60"}`}>
        {message.isError && <TriangleAlert className="size-3.5 shrink-0 mt-0.5 text-destructive" />}
        <p className={`text-xs leading-relaxed ${message.isError ? "text-destructive" : "text-muted-foreground"} whitespace-pre-wrap truncate`}>
          {message.content}
        </p>
      </div>
    </div>
  )
}
