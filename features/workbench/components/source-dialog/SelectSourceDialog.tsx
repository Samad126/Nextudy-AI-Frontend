"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog"
import { SelectSourceDialogContent } from "./SelectSourceDialogContent"

interface SelectSourceDialogProps {
  open: boolean
  setOpen: (v: boolean) => void
  workspaceId: number
  workbenchId: number
  selectedIds: Set<number>
  onConfirm: (ids: Set<number>) => void
}

export function SelectSourceDialog({
  open,
  setOpen,
  workspaceId,
  workbenchId,
  selectedIds,
  onConfirm,
}: SelectSourceDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-sm gap-0 p-0 overflow-hidden">
        <DialogHeader className="px-5 pt-5 pb-4 border-b border-border">
          <DialogTitle className="text-base">Select Source Context</DialogTitle>
        </DialogHeader>

        {/*
         * Render content only when open so SelectSourceDialogContent mounts
         * fresh each time — state initialises from props, no useEffect needed.
         */}
        {open && (
          <SelectSourceDialogContent
            workspaceId={workspaceId}
            workbenchId={workbenchId}
            selectedIds={selectedIds}
            onConfirm={onConfirm}
            onClose={() => setOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
