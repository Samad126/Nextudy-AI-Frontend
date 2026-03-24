import { Bot } from "lucide-react"

export function TypingIndicator() {
  return (
    <div className="flex justify-start items-end gap-2">
      <div className="flex size-7 items-center justify-center rounded-lg bg-muted shrink-0">
        <Bot className="size-3.5 text-muted-foreground" />
      </div>
      <div className="rounded-2xl rounded-bl-sm border border-border bg-card px-4 py-3">
        <span className="inline-flex items-center gap-1">
          <span className="size-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:0ms]" />
          <span className="size-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:150ms]" />
          <span className="size-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:300ms]" />
        </span>
      </div>
    </div>
  )
}
