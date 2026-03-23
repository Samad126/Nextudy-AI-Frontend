export function ResourceTypeLabel({ type }: { type: string }) {
  const map: Record<string, string> = {
    pdf: "PDF",
    video: "VID",
    audio: "AUD",
    image: "IMG",
    link: "URL",
    note: "TXT",
  }
  return (
    <span className="text-[9px] font-semibold text-muted-foreground leading-none">
      {map[type] ?? type.slice(0, 3).toUpperCase()}
    </span>
  )
}
