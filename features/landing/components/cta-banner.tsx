import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { Button } from "@/shared/ui/button"

const PERKS = ["Free plan available", "No credit card required", "Cancel anytime"]

export function CtaBanner() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-3xl text-center">
        <div className="rounded-2xl bg-navy px-8 py-12">
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-white">Ready to study smarter?</h2>
          <p className="mb-6 text-base text-white/70">Join thousands of students transforming how they learn with AI.</p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/register">
              <Button size="lg" className="h-11 cursor-pointer bg-yellow px-6 font-semibold text-navy hover:bg-yellow/90">
                Get started free <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="h-11 cursor-pointer border-white/30 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white">
                Sign in
              </Button>
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            {PERKS.map((p) => (
              <div key={p} className="flex items-center gap-1.5 text-xs text-white/60">
                <CheckCircle2 className="size-3.5" /> {p}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
