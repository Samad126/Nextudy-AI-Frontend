export function UserMessageContent({
  content,
  isEdited,
}: {
  content: string
  isEdited?: boolean
}) {
  return (
    <div className="max-w-[78%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5">
      <p className="text-sm leading-relaxed text-primary-foreground">
        {content}
      </p>
      {isEdited && (
        <span className="mt-0.5 block text-[10px] text-primary-foreground/60">
          edited
        </span>
      )}
    </div>
  )
}
