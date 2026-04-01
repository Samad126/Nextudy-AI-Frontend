import { Eye } from "lucide-react"

interface SourceButtonProps {
  onClick?: () => void
  fileName?: string
}

export function SourceButton({ onClick, fileName }: SourceButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 text-[11px] font-medium text-primary/80 hover:text-primary transition-colors"
    >
      <Eye className="size-3" />
      {fileName ? fileName : "Source (beta)"}
    </button>
  )
}
