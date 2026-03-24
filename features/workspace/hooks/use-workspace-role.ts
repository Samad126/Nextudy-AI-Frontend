import { useGetMembers } from "../queries/use-get-members"
import { useGetProfile } from "@/features/settings/queries/use-get-profile"
import type { Role } from "../types/workspace"

/**
 * Derives the current user's role in a given workspace.
 * Returns undefined while loading.
 */
export function useMyRoleInWorkspace(workspaceId: number): Role | undefined {
  const { data: members } = useGetMembers(workspaceId)
  const { data: profile } = useGetProfile()
  if (!members || !profile) return undefined
  return members.find((m) => m.user.id === profile.id)?.role
}
