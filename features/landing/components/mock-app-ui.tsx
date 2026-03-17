import { ClipboardList, FileText, FlipHorizontal2, Layers, Sparkles, Users } from "lucide-react"
import { cn } from "@/lib/utils"

const SIDEBAR_ITEMS = [
  { icon: Layers,          label: "Workbenches" },
  { icon: FileText,        label: "Resources" },
  { icon: FlipHorizontal2, label: "Flashcards" },
  { icon: ClipboardList,   label: "Quizzes" },
  { icon: Users,           label: "Members" },
]

const TABS = ["Resources", "Questions", "AI Chat"]

export function MockAppUI() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-2xl" style={{ minWidth: 0 }}>
      {/* Window chrome */}
      <div className="flex items-center gap-1.5 border-b border-border bg-[#f8f9fa] px-4 py-3">
        <span className="size-3 rounded-full bg-red-400" />
        <span className="size-3 rounded-full bg-yellow-400" />
        <span className="size-3 rounded-full bg-green-400" />
        <span className="ml-3 font-mono text-xs text-muted-foreground">nextudy.app/workbenches/biology-101</span>
      </div>

      <div className="flex h-72">
        {/* Sidebar */}
        <div className="flex w-44 shrink-0 flex-col gap-1 border-r border-border bg-[#f8f9fa] p-3">
          <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Biology 101</p>
          {SIDEBAR_ITEMS.map(({ icon: Icon, label }) => (
            <div key={label} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted/50">
              <Icon className="size-3" /> {label}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden p-4">
          <div className="mb-3 flex gap-1 border-b border-border pb-2">
            {TABS.map((tab, i) => (
              <span key={tab} className={cn("cursor-pointer rounded-md px-3 py-1 text-xs transition-colors", i === 2 ? "bg-teal text-white" : "text-muted-foreground")}>
                {tab}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-end">
              <div className="max-w-[70%] rounded-xl rounded-tr-sm bg-navy px-3 py-2 text-xs text-white">
                What are the key differences between mitosis and meiosis?
              </div>
            </div>
            <div className="flex gap-2">
              <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-sky">
                <Sparkles className="size-3 text-white" />
              </div>
              <div className="max-w-[80%] rounded-xl rounded-tl-sm bg-muted px-3 py-2 text-xs leading-relaxed">
                <strong>Mitosis</strong> produces 2 identical diploid cells for growth, while <strong>meiosis</strong> produces 4 genetically unique haploid cells for reproduction…
              </div>
            </div>
            <div className="flex justify-end">
              <div className="rounded-xl rounded-tr-sm bg-navy px-3 py-2 text-xs text-white">
                Generate 5 MCQ questions from this topic
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-sky">
                <Sparkles className="size-3 text-white" />
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
    </div>
  )
}
