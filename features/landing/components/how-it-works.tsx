import { STEPS } from "../constants"

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-navy">Up and running in minutes</h2>
          <p className="text-muted-foreground">Three steps to smarter studying.</p>
        </div>

        <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="absolute top-10 hidden h-px bg-border md:left-[calc(16.67%+1.5rem)] md:right-[calc(16.67%+1.5rem)] md:block" />

          {STEPS.map(({ step, icon: Icon, title, desc, color }) => (
            <div key={step} className="relative z-10 flex flex-col items-center text-center">
              <div className={`mb-5 flex size-20 items-center justify-center rounded-2xl border-2 bg-card border-${color}`}>
                <Icon className={`size-8 text-${color}`} />
              </div>
              <p className={`mb-2 text-xs font-bold tracking-widest text-${color}`}>STEP {step}</p>
              <h3 className="mb-2 text-lg font-semibold text-navy">{title}</h3>
              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
