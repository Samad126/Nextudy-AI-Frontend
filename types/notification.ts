export type NotificationType = "workspace_invite" | "system"

export interface Notification {
  id: string
  type: NotificationType
  read: boolean
  createdAt: string
  workspaceId?: string
  workspaceName?: string
  invitedByName?: string
  message?: string
}