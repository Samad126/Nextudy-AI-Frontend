"use client"

import { useState, useEffect, useEffectEvent } from "react"
import Link from "next/link"
import { Menu, X, ChevronRight } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { Logo } from "@/shared/components/logo"
import { NAV_LINKS } from "../constants"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/store/auth.store"
import { useHasSession } from "@/shared/providers/auth-provider"

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  const user = useAuthStore((s) => s.user);
  const { isHydrated } = useAuthStore();
  const hasSession = useHasSession();

  const handler = useEffectEvent(() => setScrolled(scrollY > 12))

  useEffect(() => {
    addEventListener("scroll", handler)
    return () => window.removeEventListener("scroll", handler)
  }, [])

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
          {hasSession && !isHydrated ? (
            <div className="h-8 w-32 animate-pulse rounded-md bg-muted" />
          ) : user ? (
            <Link href="/dashboard">
              <Button size="sm" className="cursor-pointer bg-teal text-white hover:bg-teal/90">
                Go to dashboard <ChevronRight className="size-3.5" />
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="cursor-pointer">
                  Sign in
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="cursor-pointer bg-teal text-white hover:bg-teal/90">
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
            {hasSession && !isHydrated ? (
              <div className="h-8 w-full animate-pulse rounded-md bg-muted" />
            ) : user ? (
              <Link href="/dashboard" className="flex-1">
                <Button size="sm" className="w-full cursor-pointer bg-teal text-white hover:bg-teal/90">
                  Go to dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full cursor-pointer">
                    Sign in
                  </Button>
                </Link>
                <Link href="/register" className="flex-1">
                  <Button size="sm" className="w-full cursor-pointer bg-teal text-white hover:bg-teal/90">
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
