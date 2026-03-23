import { cn } from "@/lib/utils"

export function LayoutButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean
  icon: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={cn(
        "rounded-md p-1.5 transition-colors",
        active
          ? "bg-foreground text-background"
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      )}
    >
      {icon}
    </button>
  )
}
