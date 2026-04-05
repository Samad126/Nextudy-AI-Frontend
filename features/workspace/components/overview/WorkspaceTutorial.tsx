"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/shared/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Button } from "@/shared/ui/button"
import { FileText, BookOpen, Sparkles, Shuffle, Layers, PartyPopper } from "lucide-react"
import { cn } from "@/lib/utils"

const STORAGE_KEY = "isTutorialShowed"

const STEPS = [
  {
    icon: PartyPopper,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    title: "Welcome to Nextudy!",
    description:
      "Your AI-powered study workspace. Let me walk you through the core features — it only takes a minute.",
  },
  {
    icon: FileText,
    color: "text-sky-500",
    bg: "bg-sky-500/10",
    title: "Upload Resources",
    description:
      "Start by uploading your study materials — PDFs, Word documents, images, or text files. These become the knowledge base your AI works from.",
  },
  {
    icon: BookOpen,
    color: "text-teal-500",
    bg: "bg-teal-500/10",
    title: "Work in a Workbench",
    description:
      "A Workbench is your AI study space. It reads your resources, answers questions via chat, and cites the exact source passages it uses.",
  },
  {
    icon: Sparkles,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    title: "Generate Questions",
    description:
      "From any workbench, ask the AI to generate MCQ or open-ended questions based on your materials. Review, edit, and refine them to match your goals.",
  },
  {
    icon: Shuffle,
    color: "text-green-500",
    bg: "bg-green-500/10",
    title: "Take Quizzes",
    description:
      "Turn your generated questions into quizzes. Attempt them anytime, track your scores, and review results to find your weak spots.",
  },
  {
    icon: Layers,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    title: "Study Flashcards",
    description:
      "Create AI-powered flashcard sets from your resources. Flip, shuffle, and study on the go — perfect for quick review sessions.",
  },
]

export function WorkspaceTutorial() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (typeof window === "undefined") return
    if (!localStorage.getItem(STORAGE_KEY)) {
      setOpen(true)
    }
  }, [])

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, "true")
    setOpen(false)
  }

  function handleNext() {
    if (step === STEPS.length - 1) {
      dismiss()
    } else {
      setStep((s) => s + 1)
    }
  }

  const current = STEPS[step]
  const Icon = current.icon
  const isLast = step === STEPS.length - 1

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) dismiss() }}>
      <DialogContent className="sm:max-w-sm p-0 overflow-hidden gap-0">
        <VisuallyHidden>
          <DialogTitle>{current.title}</DialogTitle>
        </VisuallyHidden>
        {/* Icon banner */}
        <div className={cn("flex items-center justify-center pt-10 pb-6", current.bg)}>
          <div className={cn("rounded-2xl p-4 bg-background/60 backdrop-blur-sm shadow-sm")}>
            <Icon className={cn("size-10", current.color)} />
          </div>
        </div>

        {/* Text */}
        <div className="px-7 pt-5 pb-3 flex flex-col gap-2 text-center">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
            Step {step + 1} of {STEPS.length}
          </p>
          <h2 className="text-lg font-semibold text-foreground">{current.title}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{current.description}</p>
        </div>

        {/* Dot progress */}
        <div className="flex items-center justify-center gap-1.5 py-5">
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={cn(
                "rounded-full transition-all duration-200",
                i === step
                  ? "w-5 h-2 bg-primary"
                  : "w-2 h-2 bg-muted-foreground/25 hover:bg-muted-foreground/50"
              )}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-7 pb-7">
          <Button variant="ghost" size="sm" onClick={dismiss} className="text-muted-foreground">
            Skip
          </Button>
          <div className="flex gap-2">
            {step > 0 && (
              <Button variant="outline" size="sm" onClick={() => setStep((s) => s - 1)}>
                Back
              </Button>
            )}
            <Button size="sm" onClick={handleNext}>
              {isLast ? "Get Started" : "Next"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
