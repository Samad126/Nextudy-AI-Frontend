import type { Metadata } from "next"
import { cookies } from "next/headers"
import { Geist, Geist_Mono } from "next/font/google"
import Script from "next/script"
import { Toaster } from "sonner"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

import "./globals.css"
import { AuthProvider } from "@/shared/providers/auth-provider"
import { QueryProvider } from "@/shared/providers/query-provider"
import { ThemeProvider } from "@/shared/providers/theme-provider"
import { ConditionalAnalytics } from "@/shared/components/conditional-analytics"
import { CookieConsentBanner } from "@/shared/components/cookie-consent-banner"
import { cn } from "@/lib/utils"

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://nextudy.alakbaroff.com"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Nextudy — AI-powered collaborative study platform",
    template: "%s | Nextudy",
  },
  description:
    "Study smarter with AI-generated questions, smart flashcards, and collaborative workspaces. Nextudy transforms how you learn.",
  keywords: [
    "study",
    "AI",
    "flashcards",
    "collaborative",
    "education",
    "learning",
    "quiz",
    "spaced repetition",
  ],
  authors: [{ name: "Nextudy" }],
  creator: "Nextudy",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Nextudy",
    title: "Nextudy — AI-powered collaborative study platform",
    description:
      "Study smarter with AI-generated questions, smart flashcards, and collaborative workspaces. Nextudy transforms how you learn.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Nextudy — AI-powered collaborative study platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nextudy — AI-powered collaborative study platform",
    description:
      "Study smarter with AI-generated questions, smart flashcards, and collaborative workspaces.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const hasSession = cookieStore.has("refreshToken")

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(fontSans.variable, fontMono.variable)}
    >
      <head>
        {process.env.NODE_ENV === "development" && (
          <Script
            src="https://unpkg.com/react-scan/dist/auto.global.js"
            strategy="beforeInteractive"
          />
        )}
      </head>
      <body className="font-sans antialiased">
        <ConditionalAnalytics />
        <CookieConsentBanner />
        <QueryProvider>
          <AuthProvider hasSession={hasSession}>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem={false}
              disableTransitionOnChange
            >
              {children}
              <Toaster position="bottom-right" richColors closeButton />
            </ThemeProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
