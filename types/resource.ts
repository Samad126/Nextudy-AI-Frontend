export type ResourceType = "pdf" | "doc" | "image" | "txt"

export interface Resource {
  id: string
  workspaceId: string
  name: string
  type: ResourceType
  sizeBytes: number
  uploadedAt: string
  groupId?: string
}

export interface ResourceGroup {
  id: string
  workspaceId: string
  name: string
  resourceIds: string[]
}