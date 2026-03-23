"use client"

import { useEffect, useMemo } from "react"
import { Viewer, Worker } from "@react-pdf-viewer/core"
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout"
import { searchPlugin } from "@react-pdf-viewer/search"
import { ChevronUp, ChevronDown } from "lucide-react"
import "@react-pdf-viewer/core/lib/styles/index.css"
import "@react-pdf-viewer/default-layout/lib/styles/index.css"
import "@react-pdf-viewer/search/lib/styles/index.css"

interface PdfViewerProps {
  blob: Blob
  highlight?: string
}

export function PdfViewer({ blob, highlight }: PdfViewerProps) {
  const blobUrl = useMemo(() => URL.createObjectURL(blob), [blob])
  const searchPluginInstance = searchPlugin()
  const defaultLayoutPluginInstance = defaultLayoutPlugin()

  useEffect(() => {
    return () => URL.revokeObjectURL(blobUrl)
  }, [blobUrl])

  useEffect(() => {
    if (!highlight) return
    const timer = setTimeout(() => {
      searchPluginInstance.highlight(highlight)
    }, 500)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlight])

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {highlight && (
        <div className="flex shrink-0 items-center justify-end gap-1 border-b border-border bg-muted/40 px-4 py-1.5">
          <span className="text-xs text-muted-foreground mr-auto">Showing matches for source</span>
          <button
            onClick={() => searchPluginInstance.jumpToPreviousMatch()}
            className="rounded p-0.5 hover:bg-muted"
          >
            <ChevronUp className="size-3.5" />
          </button>
          <button
            onClick={() => searchPluginInstance.jumpToNextMatch()}
            className="rounded p-0.5 hover:bg-muted"
          >
            <ChevronDown className="size-3.5" />
          </button>
        </div>
      )}
      <div className="flex-1 overflow-hidden">
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
          <Viewer
            fileUrl={blobUrl}
            plugins={[defaultLayoutPluginInstance, searchPluginInstance]}
          />
        </Worker>
      </div>
    </div>
  )
}
