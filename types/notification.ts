export type NotificationType = "workspace_invite" | "system" | "reminder"
export type InviteStatus = "pending" | "accepted" | "rejected"

export interface WorkspaceInviteDetail {
  id: number
  status: InviteStatus
  workspaceId: number
  invitee_email: string
  workspace: { id: number; name: string }
  inviter: { id: number; firstName: string; lastName: string }
}

export interface Notification {
  id: number
  userId: number
  type: NotificationType
  title: string
  message: string
  is_read: boolean
  created_at: string
  read_at: string | null
  workspaceInvite: WorkspaceInviteDetail | null
}
