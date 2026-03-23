"use client"

import { useEffect, useMemo } from "react"
import { Viewer, Worker } from "@react-pdf-viewer/core"
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation"
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout"
import { searchPlugin } from "@react-pdf-viewer/search"
import { ChevronUp, ChevronDown } from "lucide-react"
import "@react-pdf-viewer/core/lib/styles/index.css"
import "@react-pdf-viewer/default-layout/lib/styles/index.css"
import "@react-pdf-viewer/search/lib/styles/index.css"

interface PdfViewerProps {
  blob: Blob
  highlight?: string
  highlightPage?: number
}

export function PdfViewer({ blob, highlight, highlightPage }: PdfViewerProps) {
  const blobUrl = useMemo(() => URL.createObjectURL(blob), [blob])
  const searchPluginInstance = searchPlugin()
  const pageNavigationPluginInstance = pageNavigationPlugin()
  const defaultLayoutPluginInstance = defaultLayoutPlugin()

  useEffect(() => {
    return () => URL.revokeObjectURL(blobUrl)
  }, [blobUrl])

  useEffect(() => {
    if (!highlight) return
    const timer = setTimeout(async () => {
      // Jump to the cited page first (page numbers are 1-based from API, 0-based in viewer)
      if (highlightPage && highlightPage > 1) {
        pageNavigationPluginInstance.jumpToPage(highlightPage - 1)
      }

      // Split into clause-sized chunks so each fits within a single PDF text-layer line.
      // A long snippet spanning multiple visual lines will never match as one string
      // because the PDF text layer stores line-break tokens between rows.
      const chunks = highlight
        .split(/[,;.]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 6)

      const keywords = chunks.length > 0 ? chunks : [highlight]
      searchPluginInstance.highlight(keywords)
    }, 500)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlight, highlightPage])

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
            plugins={[defaultLayoutPluginInstance, pageNavigationPluginInstance, searchPluginInstance]}
          />
        </Worker>
      </div>
    </div>
  )
}
