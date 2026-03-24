import { ApiQuestion } from "@/types"
import { Checkbox } from "@/shared/ui/checkbox"
import { Badge } from "@/shared/ui/badge"
import { DifficultyBadge } from "@/shared/components/DifficultyBadge"
import { cn } from "@/lib/utils"
import type { Difficulty } from "@/shared/components/DifficultyBadge"

interface QuestionSelectItemProps {
  question: ApiQuestion
  selected: boolean
  onToggle: () => void
}

export function QuestionSelectItem({ question, selected, onToggle }: QuestionSelectItemProps) {
  return (
    <label
      className={cn(
        "flex items-start gap-3 px-3 py-2.5 cursor-pointer transition-colors border-b border-border last:border-0",
        selected ? "bg-primary/5" : "hover:bg-muted/40"
      )}
    >
      <Checkbox checked={selected} onCheckedChange={onToggle} className="mt-0.5 shrink-0" />
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <p className="text-sm line-clamp-2 text-foreground">{question.title}</p>
        <div className="flex items-center gap-1.5 flex-wrap">
          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
            {question.question_type === "mcq" ? "MCQ" : "Open-ended"}
          </Badge>
          {question.difficulty && (
            <DifficultyBadge difficulty={question.difficulty as Difficulty} />
          )}
        </div>
      </div>
    </label>
  )
}
