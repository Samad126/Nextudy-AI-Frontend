import { cn } from "@/lib/utils"

export function ResourceTypeDot({ type }: { type: string }) {
  const colorMap: Record<string, string> = {
    PDF: "bg-red-400",
    DOC: "bg-blue-400",
    IMAGE: "bg-purple-400",
    TXT: "bg-gray-400",
  }
  return (
    <span
      className={cn(
        "size-2 shrink-0 rounded-full",
        colorMap[type.toUpperCase()] ?? "bg-muted-foreground"
      )}
    />
  )
}
