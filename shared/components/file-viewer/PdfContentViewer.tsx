"use client"

import { useEffect, useMemo, useRef } from "react"
import { ChevronUp, ChevronDown, Loader2, X } from "lucide-react"
import { useGetResourceContent } from "@/features/resources/queries/use-get-resource-content"
import { useCitation } from "@/shared/context/citation-context"

interface PdfContentViewerProps {
  resourceId: number
  highlight?: string
}

const MARK_CLASS = "pdf-highlight-mark"

function highlightTextNodes(
  container: HTMLElement,
  term: string
): HTMLElement[] {
  // Remove previous highlights
  container.querySelectorAll(`mark.${MARK_CLASS}`).forEach((m) => {
    const parent = m.parentNode
    if (parent) {
      parent.replaceChild(document.createTextNode(m.textContent ?? ""), m)
      parent.normalize()
    }
  })

  if (!term.trim()) return []

  console.log("Inner html: ", container.innerHTML)
  console.log("TERM: ", term)

  // Backend returns HTML — strip tags via DOM to get plain text matching what's rendered
  const tmp = document.createElement("div")
  tmp.innerHTML = term
  const cleanTerm = (tmp.textContent ?? term).replace(/\s+/g, " ").trim()
  const words = cleanTerm.split(" ").filter(Boolean)
  if (!words.length) return []
  const escapedWords = words.map((w) =>
    w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  )
  const regex = new RegExp(escapedWords.join("\\s+"), "gi")

  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT)
  const textNodes: Text[] = []
  let node
  while ((node = walker.nextNode())) textNodes.push(node as Text)

  // Build fullText from ORIGINAL text (no stripping) so offsets match textContent exactly
  let fullText = ""
  const map: Array<{ node: Text; start: number }> = []
  for (const tn of textNodes) {
    map.push({ node: tn, start: fullText.length })
    fullText += tn.textContent ?? ""
  }

  const matches: Array<{ start: number; end: number }> = []
  let m
  while ((m = regex.exec(fullText)) !== null) {
    matches.push({ start: m.index, end: m.index + m[0].length })
  }

  if (!matches.length) return []

  // Collect all nodes that overlap with each match (handles cross-node spans from <strong>, <em>, etc.)
  type Chunk = { node: Text; localStart: number; localEnd: number }
  const matchChunks: Chunk[][] = matches.map((match) => {
    const chunks: Chunk[] = []
    for (const entry of map) {
      const nodeEnd = entry.start + (entry.node.textContent?.length ?? 0)
      if (entry.start >= match.end || nodeEnd <= match.start) continue
      chunks.push({
        node: entry.node,
        localStart: Math.max(0, match.start - entry.start),
        localEnd: Math.min(
          entry.node.textContent?.length ?? 0,
          match.end - entry.start
        ),
      })
    }
    return chunks
  });

  const markEls: HTMLElement[] = []
  // Process in reverse DOM order to preserve offsets
  for (const chunks of [...matchChunks].reverse()) {
    const firstMark = highlightChunks(chunks)
    if (firstMark) markEls.unshift(firstMark)
  }

  return markEls
}

function highlightChunks(
  chunks: Array<{ node: Text; localStart: number; localEnd: number }>
): HTMLElement | null {
  let firstMark: HTMLElement | null = null
  // Reverse within the match too so earlier nodes aren't invalidated
  for (const { node: tn, localStart, localEnd } of [...chunks].reverse()) {
    if (!tn.parentNode || localStart >= localEnd) continue
    const before = tn.textContent!.slice(0, localStart)
    const matched = tn.textContent!.slice(localStart, localEnd)
    const after = tn.textContent!.slice(localEnd)

    const mark = document.createElement("mark")
    mark.className = `${MARK_CLASS} bg-yellow-300 text-black rounded-sm px-0.5`
    mark.textContent = matched

    const parent = tn.parentNode
    if (before) parent.insertBefore(document.createTextNode(before), tn)
    parent.insertBefore(mark, tn)
    if (after) parent.insertBefore(document.createTextNode(after), tn)
    parent.removeChild(tn)

    firstMark = mark
  }
  return firstMark
}

export function PdfContentViewer({ resourceId, highlight }: PdfContentViewerProps) {
  const { citationIndex, citationCount, onPrevCitation, onNextCitation, onDismiss } = useCitation()
  const {
    data: content,
    isLoading,
    isError,
  } = useGetResourceContent(resourceId)
  const html = useMemo(() => content ?? null, [content])
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!contentRef.current || html === null) return
    contentRef.current.innerHTML = html
  }, [html])

  useEffect(() => {
    if (!contentRef.current || html === null) return
    const marks = highlightTextNodes(contentRef.current, highlight ?? "")
    if (marks[0]) marks[0].scrollIntoView({ behavior: "smooth", block: "center" })
  }, [highlight, html])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (isError || content === undefined) {
    return (
      <p className="py-8 text-center text-sm text-destructive">
        Failed to load content.
      </p>
    )
  }

  if (content === null) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Content is still being extracted. Check back shortly.
      </p>
    )
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {highlight && (
        <div className="flex shrink-0 items-center justify-between border-b border-border bg-muted/40 px-4 py-1.5 text-xs text-muted-foreground">
          {citationCount && citationCount > 1 ? (
            <span>Source {(citationIndex ?? 0) + 1} / {citationCount}</span>
          ) : (
            <span>Source</span>
          )}
          <div className="flex items-center gap-1">
            {citationCount && citationCount > 1 && (
              <>
                <button onClick={onPrevCitation} className="rounded p-0.5 hover:bg-muted">
                  <ChevronUp className="size-3.5" />
                </button>
                <button onClick={onNextCitation} className="rounded p-0.5 hover:bg-muted">
                  <ChevronDown className="size-3.5" />
                </button>
              </>
            )}
            <button onClick={onDismiss} className="ml-1 rounded p-0.5 hover:bg-muted" title="Clear highlight">
              <X className="size-3.5" />
            </button>
          </div>
        </div>
      )}

      <div className="h-full overflow-auto p-4">
        <div
          ref={contentRef}
          className="pdf-content text-sm leading-relaxed text-foreground [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_em]:italic [&_h1]:mt-4 [&_h1]:mb-3 [&_h1]:text-xl [&_h1]:font-bold [&_h2]:mt-3 [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:mt-2 [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-medium [&_li]:ml-5 [&_li]:list-disc [&_ol]:mb-3 [&_ol_li]:list-decimal [&_p]:mb-3 [&_strong]:font-semibold [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-border [&_td]:px-2 [&_td]:py-1 [&_th]:border [&_th]:border-border [&_th]:bg-muted [&_th]:px-2 [&_th]:py-1 [&_ul]:mb-3"
        />
      </div>
    </div>
  )
}
