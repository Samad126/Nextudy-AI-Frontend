"use client"

const SEGMENT_BASE =
  "flex-1 rounded-md py-1 text-xs font-medium transition-colors cursor-pointer"
const SEGMENT_ACTIVE = "bg-background shadow-sm text-foreground"
const SEGMENT_INACTIVE = "text-muted-foreground hover:text-foreground"

export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T
  onChange: (v: T) => void
  options: { label: string; value: T }[]
}) {
  return (
    <div className="flex gap-0.5 rounded-lg bg-muted p-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`${SEGMENT_BASE} ${value === opt.value ? SEGMENT_ACTIVE : SEGMENT_INACTIVE}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
