"use client"

import { NotificationCard } from "@/features/notifications/components/NotificationCard"
import { EMPTY_MESSAGES, TABS } from "@/features/notifications/constants"
import { useMarkAllRead } from "@/features/notifications/mutations/use-mark-all-read"
import { useGetNotifications } from "@/features/notifications/queries/use-get-notifications"
import { FilterTab } from "@/features/notifications/types"
import { filterNotifications } from "@/features/notifications/util"
import { getApiErrorMessage } from "@/lib/api/get-api-error"
import { PageError } from "@/shared/components/page-error"
import { cn } from "@/lib/utils"
import { Button } from "@/shared/ui/button"
import { Skeleton } from "@/shared/ui/skeleton"
import { ArrowLeft, Badge, Bell } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export default function NotificationsRoute() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<FilterTab>("all")
  const { data: notifications = [], isLoading, error, refetch } = useGetNotifications()
  const { mutate: markAllRead, isPending: isMarkingAll } = useMarkAllRead()

  const unreadCount = notifications.filter((n) => !n.is_read).length
  const allRead = unreadCount === 0
  const filtered = filterNotifications(notifications, activeTab)

  function handleMarkAll() {
    markAllRead(undefined, {
      onSuccess: () => toast.success("All notifications marked as read"),
      onError: (err) =>
        toast.error(getApiErrorMessage(err, "Failed to mark all as read")),
    })
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="size-4" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
        </div>
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
      <div className="mb-6 flex gap-1 border-b border-border">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={cn(
              "-mb-px flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium transition-colors",
              activeTab === key
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {label}
            {key === "unread" && unreadCount > 0 && (
              <Badge className="h-4 min-w-4 bg-primary px-1 text-[10px] text-primary-foreground">
                {unreadCount}
              </Badge>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
      ) : error ? (
        <PageError error={error} onRetry={refetch} />
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Bell className="mb-3 size-12 text-muted-foreground/40" />
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
