"use client"

import { useTheme } from "next-themes"
import { Monitor, Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"

const THEMES = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
]

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium text-foreground">Appearance</p>
        <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
      </div>
      <div className="flex gap-2">
        {THEMES.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            className={cn(
              "flex flex-1 flex-col items-center gap-2 rounded-lg border p-3 text-sm font-medium transition-colors",
              theme === value
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
            )}
          >
            <Icon className="size-5" />
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
