import { FilterTab } from "../types";

export const EMPTY_MESSAGES: Record<FilterTab, string> = {
  all: "You're all caught up! No notifications yet.",
  unread: "No unread notifications.",
  invites: "No workspace invites.",
  system: "No system notifications.",
}

export const TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "invites", label: "Invites" },
  { key: "system", label: "System" },
]
