export function IconButton({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode
  onClick?: () => void
  label: string
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
    >
      {children}
    </button>
  )
}
