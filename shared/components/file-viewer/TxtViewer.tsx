"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

export function TxtViewer({ blob }: { blob: Blob }) {
  const [text, setText] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    blob.text().then((t) => {
      if (!cancelled) setText(t)
    })
    return () => {
      cancelled = true
    }
  }, [blob])

  if (text === null) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto p-4">
      <pre className="whitespace-pre-wrap wrap-break-word font-mono text-sm leading-relaxed text-foreground">
        {text}
      </pre>
    </div>
  )
}
