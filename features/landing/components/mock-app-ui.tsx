import { BookOpen, FileText, LayoutDashboard, Shuffle, Sparkles, Layers } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { icon: LayoutDashboard, label: "Home" },
  { icon: FileText,        label: "Resources" },
  { icon: Layers,          label: "Cards" },
  { icon: Shuffle,         label: "Quizzes" },
  { icon: BookOpen,        label: "Workbench", active: true },
]

const TABS = ["Resources", "Questions", "AI Chat"]

export function MockAppUI() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
      {/* Window chrome */}
      <div className="flex items-center gap-1.5 border-b border-border bg-muted/50 px-4 py-3">
        <span className="size-3 rounded-full bg-red-400" />
        <span className="size-3 rounded-full bg-yellow-400" />
        <span className="size-3 rounded-full bg-green-400" />
        <span className="ml-3 hidden font-mono text-xs text-muted-foreground sm:block">
          nextudy.app/workspaces/biology-101/workbenches
        </span>
        <span className="ml-3 font-mono text-xs text-muted-foreground sm:hidden">
          nextudy.app/…/workbenches
        </span>
      </div>

      {/* App header nav */}
      <div className="flex h-10 items-center justify-between border-b border-border bg-background/80 px-3">
        {/* Logo placeholder */}
        <div className="flex items-center gap-1.5">
          <div className="size-5 rounded-md bg-accent-green" />
          <span className="text-[10px] font-bold text-foreground hidden xs:block">Nextudy</span>
        </div>

        {/* Nav links — hidden on very small, shown from sm */}
        <nav className="hidden sm:flex items-center gap-0.5">
          {NAV_LINKS.map(({ label, active }) => (
            <span
              key={label}
              className={cn(
                "relative cursor-pointer rounded-md px-2.5 py-1 text-[10px] font-medium transition-colors",
                active ? "text-accent-green" : "text-muted-foreground"
              )}
            >
              {label}
              {active && (
                <span className="absolute inset-x-1.5 bottom-0 h-px rounded-full bg-accent-green" />
              )}
            </span>
          ))}
        </nav>

        {/* Mobile: just show active nav label */}
        <span className="sm:hidden text-[10px] font-medium text-accent-green">Workbench</span>

        {/* Avatar */}
        <div className="size-6 rounded-full bg-accent-green/30 border border-accent-green/50" />
      </div>

      {/* Content area */}
      <div className="p-3 sm:p-4">
        {/* Tabs */}
        <div className="mb-3 flex gap-1 border-b border-border pb-2">
          {TABS.map((tab, i) => (
            <span
              key={tab}
              className={cn(
                "cursor-pointer rounded-md px-2.5 py-1 text-[10px] sm:text-xs transition-colors",
                i === 2 ? "bg-accent-green text-white" : "text-muted-foreground"
              )}
            >
              {tab}
            </span>
          ))}
        </div>

        {/* Chat messages */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-end">
            <div className="max-w-[75%] rounded-xl rounded-tr-sm bg-dark-grey px-3 py-2 text-[10px] sm:text-xs text-white">
              What are the key differences between mitosis and meiosis?
            </div>
          </div>

          <div className="flex gap-2">
            <div className="mt-0.5 flex size-5 sm:size-6 shrink-0 items-center justify-center rounded-full bg-accent-green">
              <Sparkles className="size-2.5 sm:size-3 text-white" />
            </div>
            <div className="max-w-[80%] rounded-xl rounded-tl-sm bg-muted px-3 py-2 text-[10px] sm:text-xs leading-relaxed">
              <strong>Mitosis</strong> produces 2 identical diploid cells for growth, while{" "}
              <strong>meiosis</strong> produces 4 genetically unique haploid cells for reproduction…
            </div>
          </div>

          <div className="flex justify-end">
            <div className="rounded-xl rounded-tr-sm bg-dark-grey px-3 py-2 text-[10px] sm:text-xs text-white">
              Generate 5 MCQ questions from this topic
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex size-5 sm:size-6 shrink-0 items-center justify-center rounded-full bg-accent-green">
              <Sparkles className="size-2.5 sm:size-3 text-white" />
            </div>
            <div className="flex gap-1 rounded-xl rounded-tl-sm bg-muted px-3 py-2">
              <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:0ms]" />
              <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:150ms]" />
              <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:300ms]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
