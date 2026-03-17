import type { User } from "./user"

export type Role = "owner" | "editor" | "member"

export interface Workspace {
  id: string
  name: string
  description: string
  memberCount: number
  role: Role
  createdAt: string
}

export interface WorkspaceMember {
  id: string
  user: Pick<User, "id" | "firstName" | "lastName" | "email" | "avatarUrl">
  role: Role
  joinedAt: string
}