"use client"

import { useState, useEffect, useEffectEvent } from "react"
import Link from "next/link"
import {
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  LayoutDashboard,
  LogOut,
} from "lucide-react"
import { Button } from "@/shared/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import { Logo } from "@/shared/components/logo"
import { NAV_LINKS } from "../constants"
import { cn } from "@/lib/utils"
import { useGetUserProfile } from "../queries/useGetUserProfile"
import { useHasSession } from "@/shared/providers/auth-provider"
import { useAuthStore } from "@/store/auth.store"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  const hasSession = useHasSession()
  const { data: user } = useGetUserProfile()
  const logout = useAuthStore((s) => s.logout)
  const queryClient = useQueryClient();
  const router = useRouter()

  const handler = useEffectEvent(() => setScrolled(scrollY > 12))

  useEffect(() => {
    addEventListener("scroll", handler)
    return () => window.removeEventListener("scroll", handler)
  }, [])

  function handleLogout() {
    
    fetch("/api/logout", { method: "POST" }).then(() => {
      logout()
      queryClient.removeQueries();
      router.refresh();
    })
  }

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-200",
        scrolled
          ? "border-b border-border bg-background/95 shadow-sm backdrop-blur-sm"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="cursor-pointer rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {hasSession && !user ? (
            <div className="h-8 w-32 animate-pulse rounded-md bg-muted" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="cursor-pointer gap-1.5"
                >
                  {user.firstName} {user.lastName}
                  <ChevronDown className="size-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer">
                    <LayoutDashboard className="size-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="size-4" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="cursor-pointer">
                  Sign in
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="cursor-pointer bg-teal text-white hover:bg-teal/90"
                >
                  Get started <ChevronRight className="size-3.5" />
                </Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="cursor-pointer rounded-lg p-2 transition-colors hover:bg-muted md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="flex flex-col gap-1 border-b border-border bg-background px-6 pb-4 md:hidden">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              className="cursor-pointer rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted"
            >
              {label}
            </a>
          ))}
          <div className="mt-2 flex gap-2 border-t border-border pt-2">
            {hasSession && !user ? (
              <div className="h-8 w-full animate-pulse rounded-md bg-muted" />
            ) : user ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex-1"
                  onClick={() => setOpen(false)}
                >
                  <Button
                    size="sm"
                    className="w-full cursor-pointer"
                    variant="outline"
                  >
                    <LayoutDashboard className="size-4" />
                    Dashboard
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="ghost"
                  className="flex-1 cursor-pointer text-destructive hover:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="size-4" />
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" className="flex-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full cursor-pointer"
                  >
                    Sign in
                  </Button>
                </Link>
                <Link href="/register" className="flex-1">
                  <Button
                    size="sm"
                    className="w-full cursor-pointer bg-teal text-white hover:bg-teal/90"
                  >
                    Get started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
