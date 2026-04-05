import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

export function StatCard({
  label,
  value,
  icon: Icon,
  href,
  colorClass,
}: {
  label: string
  value: number | undefined
  icon: React.ElementType
  href: string
  colorClass: string
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/30 hover:bg-muted/30"
    >
      <div className={cn("rounded-lg p-2.5", colorClass)}>
        <Icon className="size-5" />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold tabular-nums text-foreground">
          {value ?? "—"}
        </p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
      <ArrowRight className="ml-auto size-4 text-transparent transition-colors group-hover:text-muted-foreground" />
    </Link>
  )
}
