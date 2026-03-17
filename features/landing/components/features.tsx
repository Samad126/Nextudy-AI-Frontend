import { FEATURES } from "../constants"

export function FeaturesSection() {
  return (
    <section id="features" className="bg-muted/30 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-navy">Everything you need to study effectively</h2>
          <p className="mx-auto max-w-xl text-muted-foreground">A complete AI-powered toolkit for students and teams.</p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="cursor-default rounded-xl border border-border bg-card p-6 transition-shadow duration-200 hover:shadow-md">
              <div className={`mb-4 flex size-10 items-center justify-center rounded-lg bg-${color}/15`}>
                <Icon className={`size-5 text-${color}`} />
              </div>
              <h3 className="mb-2 text-base font-semibold text-navy">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
