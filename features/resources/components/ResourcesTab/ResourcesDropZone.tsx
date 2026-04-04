"use client"

import { useDrop } from "react-dnd"
import { NativeTypes } from "react-dnd-html5-backend"
import { Upload } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/shared/ui/button"

interface ResourcesDropZoneProps {
  onDrop: (file: File) => void
  onUploadClick: () => void
}

export function ResourcesDropZone({ onDrop, onUploadClick }: ResourcesDropZoneProps) {
  const [{ isOver }, dropRef] = useDrop({
    accept: [NativeTypes.FILE],
    drop(item: { files: File[] }) {
      const file = item.files?.[0]
      if (file) onDrop(file)
    },
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  })

  return (
    <div
      ref={dropRef as unknown as React.RefObject<HTMLDivElement>}
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed py-16 text-center transition-colors",
        isOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
      )}
    >
      <div className={cn(
        "flex size-14 items-center justify-center rounded-full transition-colors",
        isOver ? "bg-primary/10" : "bg-muted"
      )}>
        <Upload className={cn("size-6 transition-colors", isOver ? "text-primary" : "text-muted-foreground")} />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">
          {isOver ? "Drop to upload" : "No resources yet"}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {isOver ? "Release to start uploading" : "Drag a file here or click upload"}
        </p>
      </div>
      {!isOver && (
        <Button size="sm" variant="outline" onClick={onUploadClick} className="mt-1">
          Upload a file
        </Button>
      )}
    </div>
  )
}
