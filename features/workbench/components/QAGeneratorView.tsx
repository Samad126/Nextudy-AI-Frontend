"use client"

import { ChevronDown, MousePointerClick } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { QAQuestion, QAQuestionCard } from "./QAQuestionCard"

// Mock Q&A data — replace with real API data when available
const MOCK_QUESTIONS: QAQuestion[] = [
  {
    id: 1,
    number: 1,
    type: "verified",
    difficulty: "hard",
    hasSource: true,
    text: "[Advanced] AI Generated Query regarding section 1?",
    options: [
      { label: "A", text: "Verified Evidence A" },
      { label: "B", text: "Documented Fact B" },
      { label: "C", text: "Synthesized Theory C" },
      { label: "D", text: "Plausible Distractor D" },
    ],
    answer: "A",
    explanation:
      "Based on the provided document, this response is directly supported by the text. The specific mechanics described in the materials confirm these findings.",
  },
  {
    id: 2,
    number: 2,
    type: "ai_plus",
    difficulty: "hard",
    hasSource: false,
    text: "[Advanced] AI Generated Query regarding section 1?",
    options: [],
    answer: "Verification Confirmed",
    explanation:
      "While the document provides the foundation, this response utilises broader AI knowledge to bridge the gaps. This synthesis helps provide a more comprehensive academic perspective.",
  },
  {
    id: 3,
    number: 3,
    type: "verified",
    difficulty: "hard",
    hasSource: true,
    text: "[Advanced] AI Generated Query regarding section 1?",
    options: [
      { label: "A", text: "Verified Evidence A" },
      { label: "B", text: "Documented Fact B" },
      { label: "C", text: "Synthesized Theory C" },
      { label: "D", text: "Plausible Distractor D" },
    ],
    answer: "B",
    explanation:
      "The document explicitly states this in section 1.3. Cross-referencing with additional materials confirms this as the most accurate answer.",
  },
]

interface QAGeneratorViewProps {
  hasResources: boolean
}

export function QAGeneratorView({ hasResources }: QAGeneratorViewProps) {
  if (!hasResources) {
    return <QAEmptyState />
  }

  return (
    <div className="flex flex-col h-full">
      <QAToolbar />
      <div className="flex flex-col gap-3 overflow-y-auto flex-1 pr-0.5">
        {MOCK_QUESTIONS.map((q) => (
          <QAQuestionCard key={q.id} question={q} />
        ))}
      </div>
    </div>
  )
}

function QAToolbar() {
  return (
    <div className="flex items-center justify-between mb-3 shrink-0">
      <Button variant="outline" size="sm" className="gap-1.5 text-xs h-7 px-3">
        <ChevronDown className="size-3.5" />
        EXPORT
      </Button>
      <Button variant="outline" size="sm" className="gap-1.5 text-xs h-7 px-3">
        <MousePointerClick className="size-3.5" />
        SELECT
      </Button>
    </div>
  )
}

function QAEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 h-full py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <MousePointerClick className="size-5 text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-foreground">No resources selected</p>
        <p className="text-xs text-muted-foreground">
          Select study materials using the Resources button above.
        </p>
      </div>
    </div>
  )
}
