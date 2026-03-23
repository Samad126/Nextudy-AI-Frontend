import { FileText } from "lucide-react"
import { Resource } from "@/types"
import { FileViewer } from "@/shared/components/file-viewer"

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export function ResourceContent({ resource, highlight }: { resource: Resource; highlight?: string }) {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* File header */}
      <div className="shrink-0 border-b border-border px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
            <FileText className="size-4 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-sm leading-snug font-semibold text-foreground">
              {resource.name}
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {resource.type.toUpperCase()} •{" "}
              {resource.file_size
                ? formatFileSize(resource.file_size)
                : "Unknown size"}
            </p>
          </div>
        </div>
      </div>

      {/* File viewer — PDF manages its own scroll via defaultLayoutPlugin */}
      <div className="flex-1 overflow-hidden">
        <FileViewer resource={resource} highlight={highlight} />
      </div>
    </div>
  )
}
