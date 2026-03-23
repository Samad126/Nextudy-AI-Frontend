import { QAQuestion } from "../QAQuestionCard"

export function TypeBadge({ type }: { type: QAQuestion["type"] }) {
  if (type === "verified") {
    return (
      <span className="inline-flex items-center rounded-md border border-green-300 bg-green-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-green-700 dark:border-green-700 dark:bg-green-950 dark:text-green-300">
        Verified
      </span>
    )
  }
  return (
    <span className="inline-flex items-center rounded-md border border-primary/30 bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
      AI+
    </span>
  )
}
