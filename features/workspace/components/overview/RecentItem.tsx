import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function RecentItem({
  title,
  subtitle,
  href,
}: {
  title: string
  subtitle: string
  href: string
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/50"
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <ArrowRight className="ml-2 size-3.5 shrink-0 text-transparent transition-colors group-hover:text-muted-foreground" />
    </Link>
  )
}
