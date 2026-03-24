import type { Role } from "@/features/workspace/types/workspace"

export const can = {
  /** Create / edit / delete workspace content (workbenches, resources, quizzes, flashcards, questions) */
  editContent: (role: Role) => role === "owner" || role === "editor",

  /** Invite/remove members, rename/delete workspace, change member roles */
  adminWorkspace: (role: Role) => role === "owner",

  /** Only non-owners can leave (owners must delete) */
  leaveWorkspace: (role: Role) => role !== "owner",
}
