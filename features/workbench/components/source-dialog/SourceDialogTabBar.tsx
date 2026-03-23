"use client"

import { cn } from "@/lib/utils"

type SourceTab = "resources" | "groups"

interface SourceDialogTabBarProps {
  activeTab: SourceTab
  onTabChange: (tab: SourceTab) => void
}

export function SourceDialogTabBar({ activeTab, onTabChange }: SourceDialogTabBarProps) {
  return (
    <div className="flex border-b border-border px-5">
      <TabButton
        label="RESOURCES"
        active={activeTab === "resources"}
        onClick={() => onTabChange("resources")}
      />
      <TabButton
        label="GROUPS"
        active={activeTab === "groups"}
        onClick={() => onTabChange("groups")}
      />
    </div>
  )
}

function TabButton({
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
