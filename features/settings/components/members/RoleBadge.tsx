import { cn } from "@/lib/utils"
import type { Role } from "@/features/workspace/types/workspace"

const ROLE_COLORS: Record<Role, string> = {
  owner: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  editor: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  member: "bg-muted text-muted-foreground",
}

export function RoleBadge({ role }: { role: Role }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        ROLE_COLORS[role]
      )}
    >
      {role}
    </span>
  )
}
