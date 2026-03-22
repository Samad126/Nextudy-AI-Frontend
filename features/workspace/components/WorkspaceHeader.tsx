"use client"

import Link from "next/link"
import { useParams, usePathname, useRouter } from "next/navigation"
import { BookOpen, FileText, LayoutDashboard, Shuffle, BarChart2, Layers } from "lucide-react"
import { Logo } from "@/shared/components/logo"
import { useAuth } from "@/shared/providers/auth-provider"
import { useGetWorkspaces } from "@/features/workspace/queries/use-get-workspaces"
import { useGetUserProfile } from "@/features/landing/queries/useGetUserProfile"
import { cn } from "@/lib/utils"
import { WorkspacePill } from "./WorkspacePill"
import { UserMenu } from "./UserMenu"

const NAV_LINKS = [
  { label: "Home",      href: "",             icon: LayoutDashboard },
  { label: "Resources", href: "/resources",   icon: FileText },
  { label: "Cards",     href: "/flashcards",  icon: Layers },
  { label: "Quizzes",   href: "/quizzes",     icon: Shuffle },
  { label: "Workbench", href: "/workbenches", icon: BookOpen },
  { label: "Stats",     href: "/stats",       icon: BarChart2 },
]

function isLinkActive(href: string, pathname: string, baseUrl: string) {
  return href === ""
    ? pathname === baseUrl
    : pathname.startsWith(`${baseUrl}${href}`)
}

/* ── WorkspaceHeader ───────────────────────────────────────────── */
export function WorkspaceHeader() {
  const { id } = useParams<{ id: string }>()
  const pathname = usePathname()
  const router = useRouter()
  const { handleLogout } = useAuth()

  const { data: workspaces } = useGetWorkspaces()
  const { data: user } = useGetUserProfile()

  const baseUrl = `/workspaces/${id}`
  const currentWorkspace = workspaces?.find((ws) => String(ws.id) === id)

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="flex h-14 items-center px-4 sm:px-5">
          {/* Mobile: Logo | workspace pill (center) | avatar */}
          <div className="flex w-full items-center justify-between lg:hidden">
            <Logo size="sm" />
            <WorkspacePill
              align="center"
              currentWorkspace={currentWorkspace}
              workspaces={workspaces}
              currentId={id}
              onSwitch={(wsId) => router.push(`/workspaces/${wsId}`)}
              onAllWorkspaces={() => router.push("/workspaces")}
            />
            <UserMenu
              user={user}
              onSettings={() => {}}
              onSwitchWorkspace={() => router.push("/workspaces")}
              onLogout={handleLogout}
            />
          </div>

          {/* Desktop: Logo + pill | centered nav | name + avatar */}
          <div className="hidden w-full items-center lg:flex">
            {/* Left */}
            <div className="flex shrink-0 items-center gap-3">
              <Logo size="sm" />
              <div className="h-5 w-px bg-border" />
              <WorkspacePill
                align="start"
                currentWorkspace={currentWorkspace}
                workspaces={workspaces}
                currentId={id}
                onSwitch={(wsId) => router.push(`/workspaces/${wsId}`)}
                onAllWorkspaces={() => router.push("/workspaces")}
              />
            </div>

            {/* Center nav */}
            <nav className="flex flex-1 items-center justify-center gap-0.5">
              {NAV_LINKS.map(({ label, href }) => {
                const to = `${baseUrl}${href}`
                const active = isLinkActive(href, pathname, baseUrl)
                return (
                  <Link
                    key={label}
                    href={to}
                    className={cn(
                      "relative flex items-center gap-1.5 rounded-lg px-3 py-1.5",
                      "text-sm font-medium whitespace-nowrap transition-colors",
                      active
                        ? "text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {label}
                    {active && (
                      <span className="absolute inset-x-2 bottom-0 h-px rounded-full bg-primary" />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Right */}
            <div>
              <UserMenu
                user={user}
                onSettings={() => {}}
                onSwitchWorkspace={() => router.push("/workspaces")}
                onLogout={handleLogout}
              />
            </div>
          </div>
        </div>
      </header>

      {/* ── MOBILE BOTTOM TAB BAR ────────────────────────────────── */}
      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex h-14 items-stretch">
          {NAV_LINKS.map(({ label, href, icon: Icon }) => {
            const to = `${baseUrl}${href}`
            const active = isLinkActive(href, pathname, baseUrl)
            return (
              <Link
                key={label}
                href={to}
                className={cn(
                  "relative flex flex-1 flex-col items-center justify-center gap-0.5 pt-2 pb-1 transition-colors",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                {active && (
                  <span className="absolute inset-x-3 top-0 h-0.5 rounded-b-full bg-primary" />
                )}
                <Icon
                  className={cn(
                    "size-5 transition-transform",
                    active && "scale-110"
                  )}
                />
                <span
                  className={cn(
                    "text-[9px] font-medium tracking-wide uppercase",
                    active ? "text-primary" : "text-muted-foreground/70"
                  )}
                >
                  {label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
