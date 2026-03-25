"use client"

import { createContext, useContext } from "react"
import type { SourceCitation } from "@/types"

const CitationContext = createContext<(citation: SourceCitation) => void>(() => {})
export const CitationProvider = CitationContext.Provider
export const useCitation = () => useContext(CitationContext)
