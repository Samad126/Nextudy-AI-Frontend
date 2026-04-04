import { Bot, FileText } from "lucide-react"
import type { LocalChatMessage } from "@/features/chat/hooks/use-chat"
import { useCitation } from "@/features/workbench/context/citation-context"

export function AssistantMessageBubble({ message }: { message: LocalChatMessage }) {
  const { onCitationClick: onSourceClick } = useCitation()

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
                onClick={() => onSourceClick([source])}
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
