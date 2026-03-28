import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface LogoProps {
  size?: "sm" | "md"
  inverted?: boolean
  className?: string
}

export function Logo({ size = "md", className }: LogoProps) {
  const height = size === "sm" ? 28 : 32
  const width = Math.round(height * (365 / 406))

  const text = size === "sm" ? "text-base" : "text-lg"

  return (
    <Link href="/" className={cn("flex items-center gap-2 select-none", size === "sm" ? "h-7" : "h-8", className)}>
      <Image
        src="/Logo.svg"
        alt="Nextudy Logo"
        height={height}
        width={width}
        priority
        className="shrink-0"
      />
      <span className={cn(text, "font-semibold leading-none tracking-tight text-dark-grey dark:text-foreground")}>
        Nextudy
      </span>
    </Link>
  )
}
