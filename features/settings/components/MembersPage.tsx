"use client"

import { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { ArrowLeft, Loader2, Trash2, Mail } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { Badge } from "@/shared/ui/badge"
import { Skeleton } from "@/shared/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/ui/dialog"
import { cn } from "@/lib/utils"
import { useGetMembers } from "@/features/workspace/queries/use-get-members"
import { useGetWorkspaces } from "@/features/workspace/queries/use-get-workspaces"
import { useInviteMember } from "@/features/workspace/mutations/use-invite-member"
import { useUpdateMemberRole } from "@/features/workspace/mutations/use-update-member-role"
import { useRemoveMember } from "@/features/workspace/mutations/use-remove-member"
import { useGetProfile } from "@/features/settings/queries/use-get-profile"
import { useMyRoleInWorkspace } from "@/features/workspace/hooks/use-workspace-role"
import { can } from "@/lib/permissions"
import type { WorkspaceMember, Role } from "@/features/workspace/types/workspace"

const ROLE_COLORS: Record<Role, string> = {
  owner: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  editor: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  member: "bg-muted text-muted-foreground",
}

function RoleBadge({ role }: { role: Role }) {
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

/* ── Remove Confirm Dialog ──────────────────────────── */
function RemoveMemberDialog({
  member,
  workspaceId,
  open,
  onClose,
}: {
  member: WorkspaceMember
  workspaceId: number
  open: boolean
  onClose: () => void
}) {
  const { mutate, isPending } = useRemoveMember()

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove Member</DialogTitle>
          <DialogDescription>
            Remove <strong>{member.user.firstName} {member.user.lastName}</strong> from this workspace?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={() =>
              mutate(
                { workspaceId, memberId: member.id },
                {
                  onSuccess: () => { toast.success("Member removed"); onClose() },
                  onError: () => toast.error("Failed to remove member"),
                }
              )
            }
          >
            {isPending && <Loader2 className="size-4 mr-2 animate-spin" />}
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/* ── Member Row ─────────────────────────────────────── */
function MemberRow({
  member,
  workspaceId,
  isSelf,
  viewerIsOwner,
}: {
  member: WorkspaceMember
  workspaceId: number
  isSelf: boolean
  viewerIsOwner: boolean
}) {
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
                  onError: () => toast.error("Failed to update role"),
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

/* ── Main Page ──────────────────────────────────────── */
export function MembersPage({ workspaceId, contextId }: { workspaceId: number; contextId: string }) {
  const [inviteEmail, setInviteEmail] = useState("")
  const [emailError, setEmailError] = useState("")

  const { data: members = [], isLoading } = useGetMembers(workspaceId)
  const { data: workspaces = [] } = useGetWorkspaces()
  const { data: profile } = useGetProfile()
  const { mutate: inviteMember, isPending: inviting } = useInviteMember()
  const viewerRole = useMyRoleInWorkspace(workspaceId)
  const viewerIsOwner = viewerRole !== undefined && can.adminWorkspace(viewerRole)

  const workspace = workspaces.find((w) => w.id === workspaceId)

  function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    setEmailError("")
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(inviteEmail)) {
      setEmailError("Enter a valid email address")
      return
    }
    inviteMember(
      { workspaceId, email: inviteEmail },
      {
        onSuccess: () => {
          toast.success(`Invitation sent to ${inviteEmail}`)
          setInviteEmail("")
        },
        onError: (err: unknown) => {
          const status = (err as { response?: { status?: number } })?.response?.status
          if (status === 404) {
            setEmailError("No account found with this email")
          } else {
            toast.error("Failed to send invitation")
          }
        },
      }
    )
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <div className="mb-6">
        <Link
          href={`/workspaces/${contextId}/settings/workspaces`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="size-4" />
          Back to Settings
        </Link>
        <h1 className="text-2xl font-bold text-foreground">
          {workspace?.name ?? "Workspace"} — Members
        </h1>
      </div>

      {/* Invite — owner only */}
      {viewerIsOwner && <div className="rounded-lg border border-border p-4 mb-6">
        <p className="text-sm font-medium text-foreground mb-3">Invite new member</p>
        <form onSubmit={handleInvite} className="flex gap-2">
          <div className="flex-1 space-y-1">
            <Input
              type="email"
              placeholder="Email address"
              value={inviteEmail}
              onChange={(e) => { setInviteEmail(e.target.value); setEmailError("") }}
              className={emailError ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {emailError && (
              <p className="text-xs text-destructive">{emailError}</p>
            )}
          </div>
          <Button type="submit" disabled={inviting || !inviteEmail}>
            {inviting ? <Loader2 className="size-4 animate-spin" /> : (
              <>
                <Mail className="size-4 mr-1.5" />
                Invite
              </>
            )}
          </Button>
        </form>
      </div>}

      {/* Members List */}
      <div className="rounded-lg border border-border">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 rounded-md" />)}
          </div>
        ) : members.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">No members yet.</p>
        ) : (
          <div className="px-4">
            {members.map((m) => (
              <MemberRow
                key={m.id}
                member={m}
                workspaceId={workspaceId}
                isSelf={profile ? m.user.id === profile.id : false}
                viewerIsOwner={viewerIsOwner}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
