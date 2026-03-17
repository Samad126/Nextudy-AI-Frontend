import { Logo } from "@/shared/components/logo"
import { FOOTER_LINKS } from "../constants"

export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div className="max-w-xs">
            <Logo size="sm" className="mb-3" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              AI-powered collaborative study platform for students and teams.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8 text-sm">
            {FOOTER_LINKS.map(({ heading, links }) => (
              <div key={heading}>
                <p className="mb-3 font-medium text-foreground">{heading}</p>
                <ul className="flex flex-col gap-2">
                  {links.map((l) => (
                    <li key={l}>
                      <a href="#" className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Nextudy. All rights reserved.</p>
          <p>Built for learners, by learners.</p>
        </div>
      </div>
    </footer>
  )
}
