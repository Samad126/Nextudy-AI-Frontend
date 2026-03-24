"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Bell } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { Badge } from "@/shared/ui/badge"
import { Skeleton } from "@/shared/ui/skeleton"
import { cn } from "@/lib/utils"
import type { Notification } from "@/types/notification"
import { useGetNotifications } from "../queries/use-get-notifications"
import { useMarkAllRead } from "../mutations/use-mark-all-read"
import { NotificationCard } from "./NotificationCard"

type FilterTab = "all" | "unread" | "invites" | "system"

const EMPTY_MESSAGES: Record<FilterTab, string> = {
  all: "You're all caught up! No notifications yet.",
  unread: "No unread notifications.",
  invites: "No workspace invites.",
  system: "No system notifications.",
}

const TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "invites", label: "Invites" },
  { key: "system", label: "System" },
]

function filterNotifications(notifications: Notification[], tab: FilterTab) {
  switch (tab) {
    case "unread": return notifications.filter((n) => !n.is_read)
    case "invites": return notifications.filter((n) => n.type === "workspace_invite")
    case "system": return notifications.filter((n) => n.type === "system")
    default: return notifications
  }
}

export function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("all")
  const { data: notifications = [], isLoading } = useGetNotifications()
  const { mutate: markAllRead, isPending: isMarkingAll } = useMarkAllRead()

  const unreadCount = notifications.filter((n) => !n.is_read).length
  const allRead = unreadCount === 0
  const filtered = filterNotifications(notifications, activeTab)

  function handleMarkAll() {
    markAllRead(undefined, {
      onSuccess: () => toast.success("All notifications marked as read"),
      onError: () => toast.error("Failed to mark all as read"),
    })
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
        <Button
          variant="outline"
          size="sm"
          disabled={allRead || isMarkingAll}
          onClick={handleMarkAll}
        >
          Mark all as read
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 mb-6 border-b border-border">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 transition-colors -mb-px",
              activeTab === key
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {label}
            {key === "unread" && unreadCount > 0 && (
              <Badge className="h-4 min-w-4 px-1 text-[10px] bg-primary text-primary-foreground">
                {unreadCount}
              </Badge>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Bell className="size-12 text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground">{EMPTY_MESSAGES[activeTab]}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((n) => (
            <NotificationCard key={n.id} notification={n} />
          ))}
        </div>
      )}
    </div>
  )
}
