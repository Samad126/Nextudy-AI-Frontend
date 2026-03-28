"use client"

import Link from "next/link"
import { Bell } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import { Badge } from "@/shared/ui/badge"
import { Skeleton } from "@/shared/ui/skeleton"
import type { Notification } from "@/types/notification"
import { useGetNotifications } from "../queries/use-get-notifications"

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function PreviewCard({ n }: { n: Notification }) {
  return (
    <div
      className={cn(
        "px-3 py-2.5 rounded-md text-sm",
        !n.is_read && "bg-sky-50/60 dark:bg-sky-950/20"
      )}
    >
      <div className="flex items-start gap-2">
        {!n.is_read && <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-sky-500" />}
        <div className="min-w-0 flex-1">
          <p className={cn("font-medium truncate", !n.is_read ? "text-foreground" : "text-muted-foreground")}>
            {n.title}
          </p>
          <p className="text-xs text-muted-foreground truncate">{n.message}</p>
          <p className="text-[10px] text-muted-foreground/60 mt-0.5">{relativeTime(n.created_at)}</p>
        </div>
      </div>
    </div>
  )
}

export function NotificationBell() {
  const { data: notifications = [], isLoading } = useGetNotifications()
  const unreadCount = notifications.filter((n) => !n.is_read).length
  const preview = notifications.slice(0, 5)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none">
          <Bell className="size-4.5" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-2">
        <div className="flex items-center justify-between px-1 pb-2 border-b border-border mb-1">
          <span className="text-sm font-semibold text-foreground">Notifications</span>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {unreadCount} unread
            </Badge>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-2 py-1">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 rounded-md" />)}
          </div>
        ) : preview.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">No notifications yet.</p>
        ) : (
          <div className="space-y-0.5">
            {preview.map((n) => <PreviewCard key={n.id} n={n} />)}
          </div>
        )}

        <div className="mt-2 pt-2 border-t border-border">
          <Link
            href="/notifications"
            className="block w-full rounded-md py-1.5 text-center text-sm font-medium text-primary hover:bg-muted transition-colors"
          >
            View all notifications
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
