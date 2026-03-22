export type ResourceType = "PDF" | "DOC" | "IMAGE" | "TXT"

export interface Resource {
  id: number
  workspaceId: number
  name: string
  type: ResourceType
  file_size: number
  mime_type: string
  created_at: string
}

export interface ResourceGroup {
  id: number
  workspaceId: number
  name: string
  resources: Resource[]
}
