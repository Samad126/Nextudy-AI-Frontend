"use client"

import { useState } from "react"
import { toast } from "sonner"
import { getApiErrorMessage } from "@/lib/api/get-api-error"
import { Trash2 } from "lucide-react"
import { Button } from "@/shared/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"
import { useUpdateMemberRole } from "@/features/workspace/mutations/use-update-member-role"
import { RoleBadge } from "./RoleBadge"
import { RemoveMemberDialog } from "./RemoveMemberDialog"
import type { WorkspaceMember, Role } from "@/features/workspace/types/workspace"

interface MemberRowProps {
  member: WorkspaceMember
  workspaceId: number
  isSelf: boolean
  viewerIsOwner: boolean
}

export function MemberRow({ member, workspaceId, isSelf, viewerIsOwner }: MemberRowProps) {
  const [removeOpen, setRemoveOpen] = useState(false)
  const { mutate: updateRole, isPending: updatingRole } = useUpdateMemberRole()

  const canChangeRole = viewerIsOwner && !isSelf && member.role !== "owner"
  const canRemove = viewerIsOwner && !isSelf

  return (
    <div className="flex items-center gap-3 py-3 border-b border-border last:border-0">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground select-none">
        {member.user.firstName[0]}{member.user.lastName[0]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-sm font-medium text-foreground">
            {member.user.firstName} {member.user.lastName}
          </span>
          {isSelf && (
            <span className="text-xs text-muted-foreground">(you)</span>
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate">{member.user.email}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {canChangeRole ? (
          <Select
            defaultValue={member.role}
            disabled={updatingRole}
            onValueChange={(value) => {
              updateRole(
                { workspaceId, memberId: member.id, role: value as Exclude<Role, "owner"> },
                {
                  onSuccess: () => toast.success("Role updated"),
                  onError: (err) => toast.error(getApiErrorMessage(err, "Failed to update role")),
                }
              )
            }}
          >
            <SelectTrigger className="h-7 w-24 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="editor">editor</SelectItem>
              <SelectItem value="member">member</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <RoleBadge role={member.role} />
        )}
        {canRemove && (
          <Button
            variant="ghost"
            size="icon"
            className="size-7 text-muted-foreground hover:text-destructive"
            onClick={() => setRemoveOpen(true)}
          >
            <Trash2 className="size-3.5" />
          </Button>
        )}
      </div>
      {removeOpen && (
        <RemoveMemberDialog
          member={member}
          workspaceId={workspaceId}
          open
          onClose={() => setRemoveOpen(false)}
        />
      )}
    </div>
  )
}
