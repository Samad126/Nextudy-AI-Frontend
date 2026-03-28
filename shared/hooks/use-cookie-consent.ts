"use client"

import { useState, useEffect } from "react"

export type CookieConsent = {
  necessary: true
  analytics: boolean
}

const STORAGE_KEY = "nextudy_cookie_consent"

export function useCookieConsent() {
  const [consent, setConsent] = useState<CookieConsent | null>(null)
  const [resolved, setResolved] = useState(false)

  useEffect(() => {
    function handleConsent() {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setConsent(JSON.parse(stored))
      }
      setResolved(true)
    }
    handleConsent();
  }, [])

  function saveConsent(analytics: boolean) {
    const value: CookieConsent = { necessary: true, analytics }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    setConsent(value)
    window.dispatchEvent(new Event("cookie-consent-updated"))
  }

  return { consent, resolved, saveConsent }
}
