export type Role = "owner" | "editor" | "member"

export interface Workspace {
  id: number
  name: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface WorkspaceMember {
  id: number
  role: Role
  joined_at: string
  user: {
    id: number
    firstName: string
    lastName: string
    email: string
  }
}