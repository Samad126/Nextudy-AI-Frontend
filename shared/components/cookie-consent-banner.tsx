"use client"

import { useState } from "react"
import Link from "next/link"
import { Cookie } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { useCookieConsent } from "@/shared/hooks/use-cookie-consent"

export function CookieConsentBanner() {
  const { consent, resolved, saveConsent } = useCookieConsent()
  const [analytics, setAnalytics] = useState(true)

  if (!resolved || consent !== null) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[calc(100%-2rem)] max-w-sm rounded-xl border border-border bg-background p-4 shadow-lg sm:w-80">
      <div className="mb-3 flex items-center gap-2">
        <Cookie className="size-4 shrink-0 text-accent-green" />
        <p className="text-sm font-medium text-foreground">Cookie preferences</p>
      </div>

      <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
        We use cookies to keep you signed in and, with your permission, to understand how you use Nextudy.{" "}
        <Link href="/privacy-policy" className="text-accent-green underline-offset-2 hover:underline dark:text-accent-green">
          Privacy Policy
        </Link>
      </p>

      <div className="mb-4 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-foreground">Necessary</p>
            <p className="text-xs text-muted-foreground">Authentication &amp; security</p>
          </div>
          <div className="flex h-5 w-9 items-center justify-end rounded-full bg-accent-green px-1 opacity-60 cursor-not-allowed">
            <div className="size-3 rounded-full bg-white" />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-foreground">Analytics</p>
            <p className="text-xs text-muted-foreground">Usage &amp; performance</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={analytics}
            onClick={() => setAnalytics((v) => !v)}
            className={`flex h-5 w-9 cursor-pointer items-center rounded-full px-1 transition-colors ${
              analytics ? "justify-end bg-accent-green" : "justify-start bg-muted"
            }`}
          >
            <div className="size-3 rounded-full bg-white" />
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="flex-1 cursor-pointer text-xs"
          onClick={() => saveConsent(analytics)}
        >
          Save preferences
        </Button>
        <Button
          size="sm"
          className="flex-1 cursor-pointer bg-accent-green text-xs text-white hover:bg-accent-green/90"
          onClick={() => saveConsent(true)}
        >
          Accept all
        </Button>
      </div>
    </div>
  )
}
