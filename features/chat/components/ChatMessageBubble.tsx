import { Bot, FileText, Pencil, TriangleAlert } from "lucide-react"
import { UserAvatar } from "./UserAvatar"
import type { LocalChatMessage } from "@/features/chat/hooks/use-chat"
import { useCitation } from "@/features/workbench/context/citation-context"

export type { LocalChatMessage as ChatMessage }

export function ChatMessageBubble({
  message,
  userName,
  onEdit,
}: {
  message: LocalChatMessage
  userName?: string
  onEdit?: (id: string, currentContent: string) => void
}) {
  const onSourceClick = useCitation()

  if (message.role === "system") {
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
        <div
          className="text-sm text-foreground leading-relaxed [&_h1]:mb-2 [&_h1]:mt-3 [&_h1]:text-base [&_h1]:font-bold [&_h2]:mb-1.5 [&_h2]:mt-2.5 [&_h2]:text-sm [&_h2]:font-semibold [&_h3]:mb-1 [&_h3]:mt-2 [&_h3]:text-sm [&_h3]:font-medium [&_li]:ml-4 [&_li]:list-disc [&_ol_li]:list-decimal [&_ol]:mb-2 [&_p]:mb-2 [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_em]:italic [&_ul]:mb-2 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_pre]:mb-2 [&_pre]:rounded [&_pre]:bg-muted [&_pre]:p-2 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-border [&_td]:px-2 [&_td]:py-1 [&_th]:border [&_th]:border-border [&_th]:bg-muted [&_th]:px-2 [&_th]:py-1"
          dangerouslySetInnerHTML={{ __html: message.content as string }}
        />
        {message.sources && message.sources.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border flex flex-col gap-1.5">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
              Sources
            </span>
            {message.sources.map((source, index) => (
              <button
                key={`${index}`}
                onClick={() => onSourceClick(source)}
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
