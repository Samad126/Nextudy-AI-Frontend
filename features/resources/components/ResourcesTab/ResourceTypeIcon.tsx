import { FileText, Image, File } from "lucide-react"
import { ResourceType } from "@/types"
import { cn } from "@/lib/utils"

interface ResourceTypeIconProps {
  type: ResourceType
  className?: string
  size?: "sm" | "md" | "lg"
}

const config: Record<ResourceType, { icon: React.ElementType; bg: string; color: string; label: string }> = {
  PDF: { icon: FileText, bg: "bg-red-100 dark:bg-red-950/40", color: "text-red-600 dark:text-red-400", label: "PDF" },
  DOC: { icon: FileText, bg: "bg-blue-100 dark:bg-blue-950/40", color: "text-blue-600 dark:text-blue-400", label: "DOC" },
  IMAGE: { icon: Image, bg: "bg-purple-100 dark:bg-purple-950/40", color: "text-purple-600 dark:text-purple-400", label: "IMG" },
  TXT: { icon: File, bg: "bg-slate-100 dark:bg-slate-800", color: "text-slate-500 dark:text-slate-400", label: "TXT" },
}

const sizeMap = {
  sm: { wrapper: "size-8", icon: "size-4", text: "text-[9px]" },
  md: { wrapper: "size-10", icon: "size-5", text: "text-[10px]" },
  lg: { wrapper: "size-12", icon: "size-6", text: "text-xs" },
}

export function ResourceTypeIcon({ type, className, size = "md" }: ResourceTypeIconProps) {
  const { icon: Icon, bg, color } = config[type]
  const s = sizeMap[size]

  return (
    <div className={cn("rounded-lg flex items-center justify-center shrink-0", bg, s.wrapper, className)}>
      <Icon className={cn(s.icon, color)} />
    </div>
  )
}

export function getTypeLabel(type: ResourceType): string {
  return config[type].label
}
