import { cn } from "@/lib/utils"

export type Difficulty = "EASY" | "MEDIUM" | "HARD"

interface DifficultyBadgeProps {
  difficulty: Difficulty
  className?: string
}

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        difficulty === "EASY" &&
          "border-green-300/60 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-950 dark:text-green-300",
        difficulty === "MEDIUM" &&
          "border-yellow-300/60 bg-yellow-50 text-yellow-700 dark:border-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
        difficulty === "HARD" &&
          "border-red-300/60 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-950 dark:text-red-300",
        className
      )}
    >
      {difficulty.charAt(0) + difficulty.slice(1).toLowerCase()}
    </span>
  )
}
