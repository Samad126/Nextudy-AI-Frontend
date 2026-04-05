import { QAOption } from "../QAQuestionCard"

export function AnswerOption({ option }: { option: QAOption }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2">
      <span className="text-[11px] font-semibold text-muted-foreground shrink-0 mt-px">
        {option.label}.
      </span>
      <span className="text-xs text-foreground leading-relaxed">{option.text}</span>
    </div>
  )
}
