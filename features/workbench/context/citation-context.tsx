"use client"

import { createContext, useContext, useState, useCallback } from "react"
import type { SourceCitation } from "@/types"

interface CitationContextValue {
  activeCitation: SourceCitation | null
  citationIndex: number
  citationCount: number
  onCitationClick: (citations: SourceCitation[]) => void
  onPrevCitation: () => void
  onNextCitation: () => void
  onDismiss: () => void
}

const CitationContext = createContext<CitationContextValue>({
  activeCitation: null,
  citationIndex: 0,
  citationCount: 0,
  onCitationClick: () => {},
  onPrevCitation: () => {},
  onNextCitation: () => {},
  onDismiss: () => {},
})

interface CitationProviderProps {
  children: React.ReactNode
  onCitationClick?: () => void
}

export function CitationProvider({ children, onCitationClick: onSideEffect }: CitationProviderProps) {
  const [citations, setCitations] = useState<SourceCitation[]>([])
  const [index, setIndex] = useState(0)

  const onCitationClick = useCallback((next: SourceCitation[]) => {
    setCitations(next)
    setIndex(0)
    onSideEffect?.()
  }, [onSideEffect])

  const value: CitationContextValue = {
    activeCitation: citations[index] ?? null,
    citationIndex: index,
    citationCount: citations.length,
    onCitationClick,
    onPrevCitation: () => setIndex((i) => (i - 1 + citations.length) % citations.length),
    onNextCitation: () => setIndex((i) => (i + 1) % citations.length),
    onDismiss: () => { setCitations([]); setIndex(0) },
  }

  return <CitationContext.Provider value={value}>{children}</CitationContext.Provider>
}

export const useCitation = () => useContext(CitationContext)
