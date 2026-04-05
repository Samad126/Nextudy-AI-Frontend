"use client"

import { Textarea } from "@/shared/ui/textarea"

interface OpenEndedQuestionProps {
  value: string
  onChange: (v: string) => void
}

export function OpenEndedQuestion({ value, onChange }: OpenEndedQuestionProps) {
  return (
    <Textarea
      placeholder="Type your answer here..."
      rows={5}
      className="resize-none"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}
