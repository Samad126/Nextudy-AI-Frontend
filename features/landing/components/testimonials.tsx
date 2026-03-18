import { TESTIMONIALS } from "../constants"

export function Testimonials() {
  return (
    <section id="testimonials" className="bg-muted/30 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-navy dark:text-foreground">Students love Nextudy</h2>
          <p className="text-muted-foreground">Real feedback from real learners.</p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {TESTIMONIALS.map(({ initials, name, role, quote, color }) => (
            <div key={name} className="rounded-xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className={`flex size-10 shrink-0 items-center justify-center rounded-full bg-${color} text-sm font-semibold text-white`}>
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-medium text-navy dark:text-foreground">{name}</p>
                  <p className="text-xs text-muted-foreground">{role}</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">&ldquo;{quote}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
