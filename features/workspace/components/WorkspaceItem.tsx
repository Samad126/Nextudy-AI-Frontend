import { Workspace } from "@/types"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { formatDate } from "../util/util"

function WorkspaceItem({ ws }: { ws: Workspace }) {
  return (
    <Link
      href={`/workspaces/${ws.id}`}
      key={ws.id}
      className="group flex h-36 cursor-pointer flex-col justify-between rounded-xl border border-border bg-card p-5 transition-all hover:border-primary hover:shadow-md"
    >
      <div className="flex flex-col gap-1">
        <span className="truncate font-semibold text-foreground">
          {ws.name}
        </span>
        {ws.description && (
          <span className="line-clamp-2 text-xs text-muted-foreground">
            {ws.description}
          </span>
        )}
        <span className="text-xs text-muted-foreground">
          Created {formatDate(new Date(ws.created_at))}
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-sm font-medium text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        Enter workspace
        <ArrowRight className="size-4" />
      </div>
    </Link>
  )
}

export default WorkspaceItem
