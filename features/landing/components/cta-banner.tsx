import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { Button } from "@/shared/ui/button"

const PERKS = ["Free plan available", "No credit card required", "Cancel anytime"]

export function CtaBanner() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-3xl text-center">
        <div className="rounded-2xl bg-navy px-8 py-12 dark:bg-card dark:ring-1 dark:ring-border">
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-white dark:text-foreground">Ready to study smarter?</h2>
          <p className="mb-6 text-base text-white/70 dark:text-muted-foreground">Join thousands of students transforming how they learn with AI.</p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/register">
              <Button size="lg" className="h-11 cursor-pointer bg-yellow px-6 font-semibold text-navy hover:bg-yellow/90">
                Get started free <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="h-11 cursor-pointer border-white/30 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white dark:border-border dark:text-foreground dark:hover:bg-muted">
                Sign in
              </Button>
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            {PERKS.map((p) => (
              <div key={p} className="flex items-center gap-1.5 text-xs text-white/60 dark:text-muted-foreground">
                <CheckCircle2 className="size-3.5" aria-hidden="true" /> {p}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
