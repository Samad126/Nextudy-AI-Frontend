export function UserAvatar({ name }: { name: string }) {
  const initials = name.slice(0, 2)
  return (
    <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-[10px] font-semibold text-primary-foreground uppercase">
      {initials}
    </div>
  )
}
