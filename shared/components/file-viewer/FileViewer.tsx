"use client"

import { Loader2 } from "lucide-react"
import { Resource } from "@/types"
import { useGetResourceFile } from "@/features/resources/queries/use-get-resource-file"
import { PdfContentViewer } from "./PdfContentViewer"
import { DocxViewer } from "./DocxViewer"
import { TxtViewer } from "./TxtViewer"
import { ImageViewer } from "./ImageViewer"

interface FileViewerProps {
  resource: Resource
  highlight?: string
}

export function FileViewer({ resource, highlight }: FileViewerProps) {
  // PDF uses its own content fetch — no blob download needed
  if (resource.type === "PDF") {
    return <PdfContentViewer resourceId={resource.id} highlight={highlight} />
  }

  return <BlobFileViewer resource={resource} highlight={highlight} />
}

function BlobFileViewer({ resource, highlight }: FileViewerProps) {
  const { data: blob, isLoading, isError } = useGetResourceFile(resource.id)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (isError || !blob) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Failed to load file.
      </p>
    )
  }

  switch (resource.type) {
    case "DOC":
      return <DocxViewer blob={blob} highlight={highlight} />
    case "TXT":
      return <TxtViewer blob={blob} />
    case "IMAGE":
      return <ImageViewer blob={blob} />
    default:
      return (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Unsupported file type.
        </p>
      )
  }
}
