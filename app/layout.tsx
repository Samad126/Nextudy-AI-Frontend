import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { cookies } from "next/headers"
import Script from "next/script"
import { Toaster } from "sonner"

import "./globals.css"
import { AuthProvider } from "@/shared/providers/auth-provider"
import { QueryProvider } from "@/shared/providers/query-provider"
import { ThemeProvider } from "@/shared/providers/theme-provider"
import { cn } from "@/lib/utils"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
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
  ],
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
        <Script
          src="https://unpkg.com/react-scan/dist/auto.global.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="font-sans antialiased">
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
