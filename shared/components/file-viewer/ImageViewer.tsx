"use client"

import { useEffect, useMemo } from "react"

export function ImageViewer({ blob }: { blob: Blob }) {
  const url = useMemo(() => URL.createObjectURL(blob), [blob])

  useEffect(() => {
    return () => URL.revokeObjectURL(url)
  }, [url])

  return (
    <div className="flex h-full items-center justify-center p-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt="Resource"
        className="max-h-full max-w-full rounded-lg object-contain"
      />
    </div>
  )
}
