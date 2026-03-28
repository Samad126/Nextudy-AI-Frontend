import type { Metadata } from "next"
import { BrainCircuit, FlipHorizontal2, Users } from "lucide-react"
import { Logo } from "@/shared/components/logo"
import { GoogleOAuthProvider } from "@react-oauth/google"

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

const HIGHLIGHTS = [
  {
    icon: BrainCircuit,
    text: "AI-generated questions from your own materials",
  },
  {
    icon: FlipHorizontal2,
    text: "Smart flashcards with study mode",
  },
  { icon: Users, text: "Collaborative workspaces for teams" },
]

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <div className="flex min-h-screen">
        {/* Left panel */}
        <div className="hidden shrink-0 flex-col justify-between bg-dark-grey p-10 lg:flex lg:w-[42%]">
          <Logo inverted />

          <div>
            <blockquote className="mb-8 text-2xl leading-snug font-medium text-white">
              &quot;The most effective way to study is to retrieve information —
              not just re-read it.&quot;
            </blockquote>
            <ul className="flex flex-col gap-4">
              {HIGHLIGHTS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent-green/20">
                    <Icon className="size-4 text-accent-green" />
                  </div>
                  <p className="text-sm leading-relaxed text-white/75">
                    {text}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-white/35">
            &copy; {new Date().getFullYear()} Nextudy
          </p>
        </div>

        {/* Right panel */}
        <div className="flex min-h-screen flex-1 flex-col bg-background">
          <div className="px-6 pt-4 lg:hidden">
            <Logo />
          </div>
          <div className="flex flex-1 items-center justify-center px-6 py-10">
            <div className="w-full max-w-sm">{children}</div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  )
}
