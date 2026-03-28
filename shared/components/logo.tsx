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

  const text = size === "sm" ? "text-base" : "text-lg"

  return (
    <Link href="/" className={cn("flex items-center gap-2 select-none", className)}>
      <Image
        src="/Logo.svg"
        alt=""
        height={height}
        width={0}
        style={{ width: "auto", height: height }}
        priority
      />
      <span className={cn(text, "font-semibold tracking-tight text-dark-grey dark:text-foreground")}>
        Nextudy
      </span>
    </Link>
  )
}
