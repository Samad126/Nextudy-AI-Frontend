"use client"

import { useRef, useState } from "react"
import { useDrop } from "react-dnd"
import { NativeTypes } from "react-dnd-html5-backend"
import { CloudUpload } from "lucide-react"
import { toast } from "sonner"
import { getApiErrorMessage } from "@/lib/api/get-api-error"
import { cn } from "@/lib/utils"
import { Button } from "@/shared/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog"
import { useUploadResource } from "../mutations/use-upload-resource"

interface UploadDialogProps {
  open: boolean
  setOpen: (v: boolean) => void
  workspaceId: number
}

export function UploadDialog({ open, setOpen, workspaceId }: UploadDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { mutate: upload, isPending } = useUploadResource(workspaceId)

  const [{ isOver }, dropRef] = useDrop({
    accept: [NativeTypes.FILE],
    drop(item: { files: File[] }) {
      const dropped = item.files?.[0]
      if (dropped) setFile(dropped)
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  })

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files?.[0] ?? null)
  }

  function handleSubmit() {
    if (!file) return
    upload(file, {
      onSuccess: () => {
        toast.success("Resource uploaded")
        setFile(null)
        setOpen(false)
      },
      onError: (err) => toast.error(getApiErrorMessage(err, "Failed to upload resource")),
    })
  }

  function handleOpenChange(v: boolean) {
    if (!v) setFile(null)
    setOpen(v)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload resource</DialogTitle>
        </DialogHeader>

        <div className="mt-2 flex flex-col gap-4">
          <div
            ref={dropRef as unknown as React.RefObject<HTMLDivElement>}
            onClick={() => inputRef.current?.click()}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed py-10 text-center transition-colors",
              isOver
                ? "border-primary bg-primary/5"
                : "border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50"
            )}
          >
            <div className={cn(
              "flex size-12 items-center justify-center rounded-full transition-colors",
              isOver ? "bg-primary/20" : "bg-primary/10"
            )}>
              <CloudUpload className={cn("size-6 transition-colors", isOver ? "text-primary" : "text-primary")} />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {file ? file.name : isOver ? "Drop to upload" : "Click or drag a file here"}
              </p>
              {file ? (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {(file.size / 1024).toFixed(1)} KB · {file.type || "unknown type"}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground mt-0.5">PDF, DOC, image, or text file</p>
              )}
            </div>
          </div>
          <input ref={inputRef} type="file" className="hidden" onChange={handleFileChange} />

          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!file || isPending}>
              {isPending ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
