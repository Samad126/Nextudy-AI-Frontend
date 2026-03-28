"use client"

import { useState, useEffect } from "react"
import { GoogleAnalytics } from "./google-analytics"

export function ConditionalAnalytics() {
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false)

  useEffect(() => {
    function check() {
      const stored = localStorage.getItem("nextudy_cookie_consent")
      if (stored) {
        setAnalyticsAllowed(JSON.parse(stored).analytics === true)
      }
    }

    check()
    window.addEventListener("cookie-consent-updated", check)
    return () => window.removeEventListener("cookie-consent-updated", check)
  }, [])

  if (!analyticsAllowed) return null
  return <GoogleAnalytics />
}
