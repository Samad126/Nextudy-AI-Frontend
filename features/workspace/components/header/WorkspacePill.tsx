"use client"

import { ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { Workspace } from "@/features/workspace/types/workspace"

interface WorkspacePillProps {
  align: "start" | "center"
  currentWorkspace?: Workspace
  workspaces?: Workspace[]
  currentId: string
  onSwitch: (id: number) => void
  onAllWorkspaces: () => void
}

export function WorkspacePill({
  align,
  currentWorkspace,
  workspaces,
  currentId,
  onSwitch,
  onAllWorkspaces,
}: WorkspacePillProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex max-w-[140px] items-center gap-1.5 rounded-full border border-border bg-muted/60 px-3 py-1 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none sm:max-w-[200px]">
          <span className="truncate">
            {currentWorkspace?.name ?? "Workspace"}
          </span>
          <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-56">
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
          Switch workspace
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {workspaces?.map((ws) => (
          <DropdownMenuItem
            key={ws.id}
            onClick={() => onSwitch(ws.id)}
            className={cn(
              "cursor-pointer",
              String(ws.id) === currentId && "font-semibold text-primary",
              "truncate w-full"
            )}
          >
            {ws.name}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-muted-foreground"
          onClick={onAllWorkspaces}
        >
          All workspaces
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
