export function ActionButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-md px-2 py-1.5 md:px-3 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
    >
      {icon}
      <span className="hidden md:inline">{label}</span>
    </button>
  )
}
