import { cn } from "@/lib/utils"

type ActiveTab = "qa" | "chat"

function PanelTab({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-2.5 text-xs font-semibold tracking-wide transition-colors border-b-2 -mb-px",
        active
          ? "border-primary text-foreground"
          : "border-transparent text-muted-foreground hover:text-foreground"
      )}
    >
      {label}
    </button>
  )
}

export function WorkbenchPanelTabs({
  activeTab,
  onTabChange,
}: {
  activeTab: ActiveTab
  onTabChange: (tab: ActiveTab) => void
}) {
  return (
    <div className="flex shrink-0 border-b border-border px-4">
      <PanelTab
        label="Q&A GENERATOR"
        active={activeTab === "qa"}
        onClick={() => onTabChange("qa")}
      />
      <PanelTab
        label="CHAT"
        active={activeTab === "chat"}
        onClick={() => onTabChange("chat")}
      />
    </div>
  )
}
