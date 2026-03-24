import { Bot, FileText, Pencil, TriangleAlert } from "lucide-react"
import { UserAvatar } from "./UserAvatar"
import type { LocalChatMessage } from "@/features/chat/hooks/use-chat"
import type { SourceCitation } from "@/types/chat"

export type { LocalChatMessage as ChatMessage }

export function ChatMessageBubble({
  message,
  userName,
  onEdit,
  onSourceClick,
}: {
  message: LocalChatMessage
  userName?: string
  onEdit?: (id: string, currentContent: string) => void
  onSourceClick?: (citation: SourceCitation) => void
}) {
  if (message.role === "system") {
    return (
      <div className="flex justify-start">
        <div className={`max-w-[80%] rounded-xl px-4 py-2.5 flex items-start gap-2 ${message.isError ? "bg-destructive/10" : "bg-muted/60"}`}>
          {message.isError && <TriangleAlert className="size-3.5 shrink-0 mt-0.5 text-destructive" />}
          <p className={`text-xs leading-relaxed ${message.isError ? "text-destructive" : "text-muted-foreground"}`}>
            {message.content}
          </p>
        </div>
      </div>
    )
  }

  if (message.role === "user") {
    return (
      <div className="group flex justify-end items-end gap-2">
        {onEdit && (
          <button
            onClick={() => onEdit(message.id, message.content)}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded text-muted-foreground hover:text-foreground"
            aria-label="Edit message"
          >
            <Pencil className="size-3.5" />
          </button>
        )}
        <div className="max-w-[78%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5">
          <p className="text-sm text-primary-foreground leading-relaxed">
            {message.content}
          </p>
          {message.isEdited && (
            <span className="text-[10px] text-primary-foreground/60 mt-0.5 block">
              edited
            </span>
          )}
        </div>
        <UserAvatar name={userName ?? "You"} />
      </div>
    )
  }

  return (
    <div className="flex justify-start items-end gap-2">
      <div className="flex size-7 items-center justify-center rounded-lg bg-muted shrink-0">
        <Bot className="size-3.5 text-muted-foreground" />
      </div>
      <div className="max-w-[80%] rounded-2xl rounded-bl-sm border border-border bg-card px-4 py-2.5">
        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
        {message.sources && message.sources.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border flex flex-col gap-1.5">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
              Sources
            </span>
            {message.sources.map((source) => (
              <button
                key={`${source.resourceId}-${source.page ?? "no-page"}`}
                onClick={() => onSourceClick?.(source)}
                className="w-full text-left rounded-lg bg-muted/50 px-3 py-2 hover:bg-muted/80 transition-colors flex items-center gap-2"
              >
                <FileText className="size-3 shrink-0 text-muted-foreground" />
                <span className="text-[11px] font-medium text-foreground truncate flex-1">
                  {source.fileName}
                </span>
                {source.page != null && (
                  <span className="text-[10px] text-muted-foreground shrink-0">p. {source.page}</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
