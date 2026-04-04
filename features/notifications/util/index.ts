import { Notification } from "@/types"
import { FilterTab } from "../types"

export function filterNotifications(notifications: Notification[], tab: FilterTab) {
  switch (tab) {
    case "unread":
      return notifications.filter((n) => !n.is_read)
    case "invites":
      return notifications.filter((n) => n.type === "workspace_invite")
    case "system":
      return notifications.filter((n) => n.type === "system")
    default:
      return notifications
  }
}
