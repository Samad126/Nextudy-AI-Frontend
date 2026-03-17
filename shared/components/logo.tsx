import Link from "next/link"
import { BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"

interface LogoProps {
  size?: "sm" | "md"
  inverted?: boolean  // white text on dark bg
  className?: string
}

export function Logo({ size = "md", inverted = false, className }: LogoProps) {
  const icon = size === "sm" ? "size-7" : "size-8"
  const iconInner = size === "sm" ? "size-3.5" : "size-4"
  const text = size === "sm" ? "text-base" : "text-lg"

  return (
    <Link href="/" className={cn("flex items-center gap-2 select-none", className)}>
      <div className={cn(icon, "rounded-lg flex items-center justify-center", inverted ? "bg-white/10" : "bg-navy")}>
        <BookOpen className={cn(iconInner, "text-white")} />
      </div>
      <span className={cn(text, "font-semibold tracking-tight", inverted ? "text-white" : "text-navy")}>
        Nextudy
      </span>
    </Link>
  )
}
