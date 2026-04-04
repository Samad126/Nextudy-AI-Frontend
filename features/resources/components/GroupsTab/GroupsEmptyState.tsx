import { Folders } from "lucide-react"
import { Button } from "@/shared/ui/button"

interface GroupsEmptyStateProps {
  canEdit: boolean
  onCreateClick: () => void
}

export function GroupsEmptyState({ canEdit, onCreateClick }: GroupsEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-muted">
        <Folders className="size-6 text-muted-foreground" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">No groups yet</p>
        <p className="text-xs text-muted-foreground mt-0.5">Organize your resources into groups</p>
      </div>
      {canEdit && (
        <Button size="sm" variant="outline" onClick={onCreateClick} className="mt-1">
          Create a group
        </Button>
      )}
    </div>
  )
}
