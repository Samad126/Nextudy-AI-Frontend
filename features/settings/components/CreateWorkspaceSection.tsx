"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/shared/ui/button"
import CreateWorkspaceDialog from "@/features/workspace/components/CreateWorkspaceDialog"

export function CreateWorkspaceSection() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Plus className="size-4 mr-2" />
        New Workspace
      </Button>

      <CreateWorkspaceDialog open={open} setOpen={setOpen} />
    </>
  )
}
