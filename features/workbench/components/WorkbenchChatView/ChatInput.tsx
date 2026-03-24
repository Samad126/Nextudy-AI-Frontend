import { ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"

export function ChatInput({
  value,
  onChange,
  onKeyDown,
  onSend,
  disabled = false,
  placeholder = "Ask follow-up questions...",
}: {
  value: string
  onChange: (v: string) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  onSend: () => void
  disabled?: boolean
  placeholder?: string
}) {
  return (
    <div className="shrink-0 flex items-end gap-2 rounded-xl border border-border bg-card px-3 py-2.5 focus-within:ring-2 focus-within:ring-ring/30 transition-shadow">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        rows={1}
        disabled={disabled}
        className={cn(
          "flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60",
          "outline-none leading-relaxed max-h-32 overflow-y-auto disabled:opacity-50"
        )}
        style={{ fieldSizing: "content" } as React.CSSProperties}
      />
      <button
        onClick={onSend}
        disabled={!value.trim() || disabled}
        className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity disabled:opacity-40"
        aria-label="Send message"
      >
        <ArrowUp className="size-3.5" />
      </button>
    </div>
  )
}
