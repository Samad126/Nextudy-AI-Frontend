import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { MockAppUI } from "./mock-app-ui"

export function Hero() {
  return (
    <section className="px-6 pb-20 pt-32">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground">
            <Sparkles className="size-3.5 text-yellow" />
            AI-powered study platform
          </div>

          <h1 className="mb-5 text-5xl font-bold leading-[1.1] tracking-tight text-navy sm:text-6xl">
            Study smarter,{" "}
            <span className="text-teal">not harder</span>
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Upload your study materials and let AI generate questions, flashcards, and quizzes.
            Collaborate in shared workspaces and chat with an AI that knows your content.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/register">
              <Button size="lg" className="h-11 cursor-pointer bg-teal px-6 text-white hover:bg-teal/90">
                Get started free <ArrowRight className="size-4" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="outline" size="lg" className="h-11 cursor-pointer px-6">
                See how it works
              </Button>
            </a>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">No credit card required · Free plan available</p>
        </div>

        <div className="mx-auto max-w-3xl">
          <MockAppUI />
        </div>
      </div>
    </section>
  )
}
