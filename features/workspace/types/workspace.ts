import type { User } from "../../../types/user"

export type Role = "owner" | "editor" | "member"

export interface Workspace {
  id: number
  name: string
  description: string
  created_at: string
  updated_at: Date
}

export interface WorkspaceMember {
  id: string
  user: Pick<User, "id" | "firstName" | "lastName" | "email" | "avatarUrl">
  role: Role
  joinedAt: string
}