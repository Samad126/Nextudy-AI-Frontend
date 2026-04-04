import Link from "next/link"

export function RecentSection({
  title,
  href,
  children,
}: {
  title: string
  href: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between px-4 pb-2 pt-4">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <Link
          href={href}
          className="text-xs text-muted-foreground transition-colors hover:text-primary"
        >
          View all
        </Link>
      </div>
      <div className="px-1 pb-3">{children}</div>
    </div>
  )
}
