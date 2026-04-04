export const notificationKeys = {
  all: () => ["notifications"] as const,
}

export type FilterTab = "all" | "unread" | "invites" | "system"