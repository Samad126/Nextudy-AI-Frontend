"use client"

import Link from "next/link"
import { use } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const TABS = [
  { label: "Profile", segment: "profile" },
  { label: "Workspaces", segment: "workspaces" },
]

export default function SettingsLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const pathname = usePathname()
  const base = `/workspaces/${id}/settings`

  // Hide tab bar on sub-pages (e.g. .../workspaces/[wsId]/members)
  const segments = pathname.replace(base, "").split("/").filter(Boolean)
  const isSubPage = segments.length > 1

  if (isSubPage) return <>{children}</>

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-foreground mb-6">Settings</h1>
      <div className="flex gap-1 border-b border-border mb-8">
        {TABS.map(({ label, segment }) => {
          const href = `${base}/${segment}`
          const active = pathname === href || pathname.startsWith(`${href}/`)
          return (
            <Link
              key={segment}
              href={href}
              className={cn(
                "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
                active
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {label}
            </Link>
          )
        })}
      </div>
      {children}
    </div>
  )
}
