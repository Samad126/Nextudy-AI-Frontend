import { ArrowUp, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function MessageEditField({
  draft,
  textareaRef,
  onChange,
  onKeyDown,
  onCancel,
  onSubmit,
}: {
  draft: string
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
  onChange: (value: string) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  onCancel: () => void
  onSubmit: () => void
}) {
  return (
    <div className="flex max-w-[78%] flex-1 items-end gap-2 rounded-2xl rounded-br-sm border border-primary/50 bg-card px-3 py-2">
      <textarea
        ref={textareaRef}
        value={draft}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        rows={1}
        className="max-h-32 flex-1 resize-none overflow-y-auto bg-transparent text-sm leading-relaxed text-foreground outline-none"
        style={{ fieldSizing: "content" } as React.CSSProperties}
      />
      <div className="flex shrink-0 items-center gap-1">
        <button
          onClick={onCancel}
          className="flex size-6 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Cancel edit"
        >
          <X className="size-3" />
        </button>
        <button
          onClick={onSubmit}
          disabled={!draft.trim()}
          className={cn(
            "flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity",
            !draft.trim() && "opacity-40"
          )}
          aria-label="Save edit"
        >
          <ArrowUp className="size-3" />
        </button>
      </div>
    </div>
  )
}
