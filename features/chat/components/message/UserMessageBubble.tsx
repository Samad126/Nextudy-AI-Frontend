import { useEffect, useRef, useState } from "react"
import { Pencil } from "lucide-react"
import { UserAvatar } from "../UserAvatar"
import { MessageEditField } from "./MessageEditField"
import { UserMessageContent } from "./UserMessageContent"
import type { LocalChatMessage } from "@/features/chat/hooks/use-chat"

export function UserMessageBubble({
  message,
  userName,
  onEdit,
}: {
  message: LocalChatMessage
  userName?: string
  onEdit?: (id: string, newContent: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(message.content)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (editing) {
      textareaRef.current?.focus()
      const len = textareaRef.current?.value.length ?? 0
      textareaRef.current?.setSelectionRange(len, len)
    }
  }, [editing])

  function handleStartEdit() {
    setDraft(message.content)
    setEditing(true)
  }

  function handleCancel() {
    setEditing(false)
    setDraft(message.content)
  }

  function handleSubmit() {
    const trimmed = draft.trim()
    if (!trimmed || trimmed === message.content) {
      handleCancel()
      return
    }
    onEdit?.(message.id, trimmed)
    setEditing(false)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
    if (e.key === "Escape") handleCancel()
  }

  return (
    <div className="group flex items-end justify-end gap-2">
      {!editing && onEdit && (
        <button
          onClick={handleStartEdit}
          className="rounded p-1 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground"
          aria-label="Edit message"
        >
          <Pencil className="size-3.5" />
        </button>
      )}

      {editing ? (
        <MessageEditField
          draft={draft}
          textareaRef={textareaRef}
          onChange={setDraft}
          onKeyDown={handleKeyDown}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
        />
      ) : (
        <UserMessageContent content={message.content} isEdited={message.isEdited} />
      )}

      <UserAvatar name={userName ?? "You"} />
    </div>
  )
}
