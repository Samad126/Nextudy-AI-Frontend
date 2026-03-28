"use client"

import { useState } from "react"
import { Loader2, Check, CheckCheck } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { getApiErrorMessage } from "@/lib/api/get-api-error"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import type { Notification } from "@/types/notification"
import { useMarkRead } from "../mutations/use-mark-read"
import { useInviteAction } from "../mutations/use-invite-action"

function formatRelativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days === 1) return "Yesterday"
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
}

const TYPE_LABELS: Record<string, string> = {
  workspace_invite: "Workspace Invite",
  system: "System",
  reminder: "Reminder",
}

interface NotificationCardProps {
  notification: Notification
}

export function NotificationCard({ notification }: NotificationCardProps) {
  const { mutate: markRead } = useMarkRead()
  const { mutate: inviteAction, isPending } = useInviteAction()
  const [actionDone, setActionDone] = useState<"accepted" | "rejected" | null>(null)

  const invite = notification.workspaceInvite
  const inviteStatus = actionDone ?? invite?.status

  function handleClick() {
    if (!notification.is_read && notification.type !== "workspace_invite") {
      markRead(notification.id)
    }
  }

  function handleInviteAction(action: "accept" | "reject") {
    if (!invite) return
    inviteAction(
      { inviteId: invite.id, action },
      {
        onSuccess: () => {
          setActionDone(action === "accept" ? "accepted" : "rejected")
        },
        onError: (err) => {
          toast.error(getApiErrorMessage(err, `Failed to ${action} invitation`))
        },
      }
    )
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        "relative rounded-lg border p-4 transition-colors",
        notification.is_read
          ? "border-border bg-muted/30"
          : "cursor-pointer border-l-4 border-l-sky-500 bg-sky-50/50 shadow-sm dark:bg-sky-950/10",
        notification.type !== "workspace_invite" && !notification.is_read && "cursor-pointer"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        {!notification.is_read && (
          <button
            onClick={(e) => { e.stopPropagation(); markRead(notification.id) }}
            className="mt-0.5 shrink-0 text-muted-foreground hover:text-foreground transition-colors"
            title="Mark as read"
          >
            <CheckCheck className="size-4" />
          </button>
        )}
        <div className="flex items-start gap-3 min-w-0 flex-1">
          {!notification.is_read && (
            <span className="mt-1 size-2 shrink-0 rounded-full bg-sky-500" />
          )}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <Badge variant="secondary" className="text-[10px] font-medium">
                {TYPE_LABELS[notification.type] ?? notification.type}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatRelativeTime(notification.created_at)}
              </span>
            </div>
            <p className="font-medium text-sm text-foreground">{notification.title}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{notification.message}</p>

            {notification.type === "workspace_invite" && invite && (
              <div className="mt-3">
                {inviteStatus === "pending" ? (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isPending}
                      onClick={(e) => { e.stopPropagation(); handleInviteAction("reject") }}
                    >
                      {isPending ? <Loader2 className="size-3.5 animate-spin" /> : "Decline"}
                    </Button>
                    <Button
                      size="sm"
                      disabled={isPending}
                      onClick={(e) => { e.stopPropagation(); handleInviteAction("accept") }}
                    >
                      {isPending ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <>
                          <Check className="size-3.5 mr-1" />
                          Accept
                        </>
                      )}
                    </Button>
                  </div>
                ) : inviteStatus === "accepted" ? (
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400 border-0">
                    Accepted ✓
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-muted-foreground">
                    Declined
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
