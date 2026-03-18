import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Toaster } from "sonner"

import "./globals.css"
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
  keywords: ["study", "AI", "flashcards", "collaborative", "education", "learning"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(fontSans.variable, fontMono.variable)}
    >
      <body className="antialiased font-sans">
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            {children}
            <Toaster position="bottom-right" richColors closeButton />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
