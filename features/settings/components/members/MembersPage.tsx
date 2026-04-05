"use client"

import { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { getApiErrorMessage } from "@/lib/api/get-api-error"
import { ArrowLeft, Loader2, Mail } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Skeleton } from "@/shared/ui/skeleton"
import { useGetMembers } from "@/features/workspace/queries/use-get-members"
import { useGetWorkspaces } from "@/features/workspace/queries/use-get-workspaces"
import { useInviteMember } from "@/features/workspace/mutations/use-invite-member"
import { useGetProfile } from "@/features/settings/queries/use-get-profile"
import { useMyRoleInWorkspace } from "@/features/workspace/hooks/use-workspace-role"
import { can } from "@/lib/permissions"
import { MemberRow } from "./MemberRow"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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

  function handleInvite(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setEmailError("")
    if (!EMAIL_REGEX.test(inviteEmail)) {
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
            setEmailError(getApiErrorMessage(err, "No account found with this email"))
          } else {
            toast.error(getApiErrorMessage(err, "Failed to send invitation"))
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
      {viewerIsOwner && (
        <div className="rounded-lg border border-border p-4 mb-6">
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
        </div>
      )}

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
