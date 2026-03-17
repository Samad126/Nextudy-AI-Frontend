import { BrainCircuit, FlipHorizontal2, Users } from "lucide-react"
import { Logo } from "@/shared/components/logo"

const HIGHLIGHTS = [
  { icon: BrainCircuit,    color: "sky",    text: "AI-generated questions from your own materials" },
  { icon: FlipHorizontal2, color: "sage",   text: "Smart flashcards with study mode" },
  { icon: Users,           color: "yellow", text: "Collaborative workspaces for teams" },
]

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden shrink-0 flex-col justify-between bg-navy p-10 lg:flex lg:w-[42%]">
        <Logo inverted />

        <div>
          <blockquote className="mb-8 text-2xl font-medium leading-snug text-white">
            &quot;The most effective way to study is to retrieve information — not just re-read it.&quot;
          </blockquote>
          <ul className="flex flex-col gap-4">
            {HIGHLIGHTS.map(({ icon: Icon, color, text }) => (
              <li key={text} className="flex items-start gap-3">
                <div className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-${color}/20`}>
                  <Icon className={`size-4 text-${color}`} />
                </div>
                <p className="text-sm leading-relaxed text-white/75">{text}</p>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-white/35">&copy; {new Date().getFullYear()} Nextudy</p>
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
  )
}
