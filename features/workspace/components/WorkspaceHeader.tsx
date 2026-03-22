"use client"

import Link from "next/link"
import { useParams, usePathname, useRouter } from "next/navigation"
import {
  BookOpen,
  ChevronDown,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Shuffle,
  BarChart2,
  Layers,
  User,
} from "lucide-react"

import { Logo } from "@/shared/components/logo"
import { useAuth } from "@/shared/providers/auth-provider"
import { useGetWorkspaces } from "@/features/workspace/queries/use-get-workspaces"
import { useGetUserProfile } from "@/features/landing/queries/useGetUserProfile"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import Image from "next/image"

const NAV_LINKS = [
  { label: "Home", href: "", icon: LayoutDashboard },
  { label: "Resources", href: "/resources", icon: FileText },
  { label: "Cards", href: "/flashcards", icon: Layers },
  { label: "Quizzes", href: "/quizzes", icon: Shuffle },
  { label: "Workbench", href: "/workbenches", icon: BookOpen },
  { label: "Stats", href: "/stats", icon: BarChart2 },
]

function getInitials(firstName?: string, lastName?: string) {
  if (!firstName) return "?"
  return `${firstName[0]}${lastName?.[0] ?? ""}`.toUpperCase()
}

export function WorkspaceHeader() {
  const { id } = useParams<{ id: string }>()
  const pathname = usePathname()
  const router = useRouter()
  const { handleLogout } = useAuth()

  const { data: workspaces } = useGetWorkspaces()
  const { data: user } = useGetUserProfile()

  const currentWorkspace = workspaces?.find((ws) => String(ws.id) === id)

  const activeLink = NAV_LINKS.find(({ href }) =>
    href === ""
      ? pathname === `/workspaces/${id}`
      : pathname.startsWith(`/workspaces/${id}${href}`)
  )

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-background px-4 gap-3 sm:px-5">
      {/* Left: Logo + Workspace Selector */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <Logo size="sm" />

        <div className="hidden sm:block h-5 w-px bg-border" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-sm font-medium text-foreground hover:bg-muted transition-colors sm:px-3 sm:max-w-[160px]">
              <span className="hidden sm:block truncate max-w-[120px]">
                {currentWorkspace?.name ?? "Workspace"}
              </span>
              <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-52">
            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
              Switch Workspace
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {workspaces?.map((ws) => (
              <DropdownMenuItem
                key={ws.id}
                className={cn(
                  "cursor-pointer",
                  String(ws.id) === id && "font-medium text-primary"
                )}
                onClick={() => router.push(`/workspaces/${ws.id}`)}
              >
                {ws.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-muted-foreground"
              onClick={() => router.push("/workspaces")}
            >
              All workspaces
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Center: Nav — full on md+, hidden on mobile */}
      <nav className="hidden md:flex items-center gap-1 overflow-x-auto scrollbar-none">
        {NAV_LINKS.map(({ label, href }) => {
          const to = `/workspaces/${id}${href}`
          const isActive =
            href === ""
              ? pathname === `/workspaces/${id}`
              : pathname.startsWith(to)

          return (
            <Link
              key={label}
              href={to}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Right: mobile nav menu + user dropdown */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Mobile nav — hamburger dropdown (hidden on md+) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="md:hidden flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-2 py-1.5 text-sm font-medium text-foreground hover:bg-muted transition-colors sm:px-2.5">
              <Menu className="size-4" />
              <span className="hidden sm:block text-xs">{activeLink?.label ?? "Menu"}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            {NAV_LINKS.map(({ label, href, icon: Icon }) => {
              const to = `/workspaces/${id}${href}`
              const isActive =
                href === ""
                  ? pathname === `/workspaces/${id}`
                  : pathname.startsWith(to)
              return (
                <DropdownMenuItem
                  key={label}
                  className={cn("cursor-pointer gap-2", isActive && "font-medium text-primary")}
                  onClick={() => router.push(to)}
                >
                  <Icon className="size-4" />
                  {label}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-muted transition-colors">
              <div className="size-7 rounded-full bg-primary flex items-center justify-center text-xs font-semibold text-primary-foreground select-none overflow-hidden">
                {user?.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt={user.firstName}
                    className="size-full object-cover"
                  />
                ) : (
                  getInitials(user?.firstName, user?.lastName)
                )}
              </div>
              <span className="font-medium text-foreground max-w-[80px] truncate hidden sm:block">
                {user ? `${user.firstName} ${user.lastName[0]}.` : "..."}
              </span>
              <ChevronDown className="size-3.5 text-muted-foreground hidden sm:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col gap-0.5">
              <span className="text-xs font-normal text-muted-foreground uppercase tracking-wider">
                Account
              </span>
              <span className="text-sm font-semibold text-foreground">
                {user?.email}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer gap-2">
              <User className="size-4" />
              General Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer gap-2">
              <Settings className="size-4" />
              Workspace Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer gap-2"
              onClick={() => router.push("/workspaces")}
            >
              <Shuffle className="size-4" />
              Switch Workspace
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer gap-2 text-destructive focus:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="size-4" />
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
