"use client"

import { Loader2 } from "lucide-react"
import { Resource } from "@/types"
import { useGetResourceFile } from "@/features/resources/queries/use-get-resource-file"
import { PdfViewer } from "./PdfViewer"
import { DocxViewer } from "./DocxViewer"
import { TxtViewer } from "./TxtViewer"
import { ImageViewer } from "./ImageViewer"

interface FileViewerProps {
  resource: Resource
  highlight?: string
  highlightPage?: number
}

export function FileViewer({ resource, highlight, highlightPage }: FileViewerProps) {
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
    case "PDF":
      return <PdfViewer blob={blob} highlight={highlight} highlightPage={highlightPage} />
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
