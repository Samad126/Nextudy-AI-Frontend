"use client"

import { useEffect, useRef, useState } from "react"
import mammoth from "mammoth"
import { ChevronUp, ChevronDown, Loader2 } from "lucide-react"

interface DocxViewerProps {
  blob: Blob
  highlight?: string
}

const MARK_CLASS = "docx-highlight-mark"

function highlightTextNodes(container: HTMLElement, term: string): HTMLElement[] {
  // Remove previous highlights
  container.querySelectorAll(`mark.${MARK_CLASS}`).forEach((m) => {
    const parent = m.parentNode
    if (parent) {
      parent.replaceChild(document.createTextNode(m.textContent ?? ""), m)
      parent.normalize()
    }
  })

  if (!term.trim()) return []

  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const regex = new RegExp(escaped, "gi")

  // Collect text nodes
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT)
  const textNodes: Text[] = []
  let node
  while ((node = walker.nextNode())) textNodes.push(node as Text)

  // Build full text + position map back to nodes
  let fullText = ""
  const map: Array<{ node: Text; start: number }> = []
  for (const tn of textNodes) {
    map.push({ node: tn, start: fullText.length })
    fullText += tn.textContent ?? ""
  }

  // Find all matches
  const matches: Array<{ start: number; end: number }> = []
  let m
  while ((m = regex.exec(fullText)) !== null) {
    matches.push({ start: m.index, end: m.index + m[0].length })
  }

  if (!matches.length) return []

  // Process matches in reverse so splicing doesn't shift earlier positions
  const markEls: HTMLElement[] = []
  for (const match of [...matches].reverse()) {
    // Find which text node(s) this match spans — for now handle single-node matches
    // (cross-node matches are rare for typical AI quote sources)
    const entry = [...map].reverse().find((e) => e.start <= match.start)
    if (!entry) continue

    const tn = entry.node
    const localStart = match.start - entry.start
    const localEnd = match.end - entry.start

    if (localEnd > (tn.textContent?.length ?? 0)) continue // spans nodes, skip

    const before = tn.textContent!.slice(0, localStart)
    const matched = tn.textContent!.slice(localStart, localEnd)
    const after = tn.textContent!.slice(localEnd)

    const mark = document.createElement("mark")
    mark.className = `${MARK_CLASS} bg-yellow-300 text-black rounded-sm px-0.5`
    mark.textContent = matched

    const parent = tn.parentNode!
    if (before) parent.insertBefore(document.createTextNode(before), tn)
    parent.insertBefore(mark, tn)
    if (after) parent.insertBefore(document.createTextNode(after), tn)
    parent.removeChild(tn)

    markEls.unshift(mark) // keep in document order
  }

  return markEls
}

export function DocxViewer({ blob, highlight }: DocxViewerProps) {
  const [rawHtml, setRawHtml] = useState<string | null>(null)
  const [error, setError] = useState(false)
  const [matchCount, setMatchCount] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)
  const marksRef = useRef<HTMLElement[]>([])

  useEffect(() => {
    let cancelled = false
    blob
      .arrayBuffer()
      .then((buffer) => mammoth.convertToHtml({ arrayBuffer: buffer }))
      .then((result) => {
        if (!cancelled) setRawHtml(result.value)
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })
    return () => { cancelled = true }
  }, [blob])

  // Set innerHTML once rawHtml is ready
  useEffect(() => {
    if (!contentRef.current || rawHtml === null) return
    contentRef.current.innerHTML = rawHtml
  }, [rawHtml])

  // Apply highlights whenever highlight term changes (after HTML is set)
  useEffect(() => {
    if (!contentRef.current || rawHtml === null) return
    const marks = highlightTextNodes(contentRef.current, highlight ?? "")
    marksRef.current = marks
    setMatchCount(marks.length)
    setCurrentIndex(0)
    if (marks[0]) marks[0].scrollIntoView({ behavior: "smooth", block: "center" })
  }, [highlight, rawHtml])

  function scrollToMatch(index: number) {
    const mark = marksRef.current[index]
    if (!mark) return
    marksRef.current.forEach((m) => m.classList.remove("ring-2", "ring-orange-500"))
    mark.classList.add("ring-2", "ring-orange-500")
    mark.scrollIntoView({ behavior: "smooth", block: "center" })
    setCurrentIndex(index)
  }

  if (error) {
    return (
      <p className="py-8 text-center text-sm text-destructive">
        Failed to render document.
      </p>
    )
  }

  if (!rawHtml) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Match navigation bar */}
      {highlight && matchCount > 0 && (
        <div className="flex shrink-0 items-center justify-between border-b border-border bg-muted/40 px-4 py-1.5 text-xs text-muted-foreground">
          <span>
            {currentIndex + 1} / {matchCount} match{matchCount !== 1 ? "es" : ""}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => scrollToMatch((currentIndex - 1 + matchCount) % matchCount)}
              className="rounded p-0.5 hover:bg-muted"
            >
              <ChevronUp className="size-3.5" />
            </button>
            <button
              onClick={() => scrollToMatch((currentIndex + 1) % matchCount)}
              className="rounded p-0.5 hover:bg-muted"
            >
              <ChevronDown className="size-3.5" />
            </button>
          </div>
        </div>
      )}
      {highlight && matchCount === 0 && (
        <div className="shrink-0 border-b border-border bg-muted/40 px-4 py-1.5 text-xs text-muted-foreground">
          No matches found
        </div>
      )}

      <div className="h-full overflow-auto p-4">
        <div
          ref={contentRef}
          className="docx-content text-sm leading-relaxed text-foreground [&_h1]:mb-3 [&_h1]:text-xl [&_h1]:font-bold [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-medium [&_li]:ml-5 [&_li]:list-disc [&_ol]:mb-3 [&_p]:mb-3 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-border [&_td]:px-2 [&_td]:py-1 [&_th]:border [&_th]:border-border [&_th]:bg-muted [&_th]:px-2 [&_th]:py-1 [&_ul]:mb-3"
        />
      </div>
    </div>
  )
}
