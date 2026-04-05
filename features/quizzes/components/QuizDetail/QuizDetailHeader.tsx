import { ArrowLeft, Trash2 } from "lucide-react"
import { Button } from "@/shared/ui/button"

interface QuizDetailHeaderProps {
  title: string
  description?: string | null
  onBack: () => void
  onDelete: () => void
}

export function QuizDetailHeader({ title, description, onBack, onDelete }: QuizDetailHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onBack}
          className="mt-0.5 -ml-1 shrink-0"
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex flex-col gap-0.5">
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        className="shrink-0 hover:bg-destructive/10 hover:text-destructive"
        onClick={onDelete}
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  )
}
