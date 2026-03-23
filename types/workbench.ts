import { Resource } from "./resource"

export interface Workbench {
  id: number
  workspaceId: number
  name: string
  description?: string
  created_at: string
  updated_at: string
}

export interface WorkbenchWithResources extends Workbench {
  resources: Resource[]
}
