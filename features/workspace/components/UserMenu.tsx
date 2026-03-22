"use client"

import { LogOut, Settings, Shuffle, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import Image from "next/image"
import type { User as UserType } from "@/types"

function getInitials(firstName?: string, lastName?: string) {
  if (!firstName) return "?"
  return `${firstName[0]}${lastName?.[0] ?? ""}`.toUpperCase()
}

interface UserMenuProps {
  user?: UserType
  onSettings: () => void
  onSwitchWorkspace: () => void
  onLogout: () => void
}

export function UserMenu({
  user,
  onSettings,
  onSwitchWorkspace,
  onLogout,
}: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex shrink-0 items-center gap-2">
          <span className="max-w-[100px] truncate text-sm font-medium text-foreground">
            {user ? `${user.firstName} ${user.lastName[0]}.` : ""}
          </span>
          <button className="group flex items-center gap-2 rounded-full focus-visible:outline-none">
            <div className="flex size-8 items-center justify-center overflow-hidden rounded-full bg-primary text-xs font-bold text-primary-foreground ring-2 ring-transparent transition-all select-none group-hover:ring-primary/30">
              {user?.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.firstName}
                  width={32}
                  height={32}
                  className="size-full object-cover"
                />
              ) : (
                getInitials(user?.firstName, user?.lastName)
              )}
            </div>
          </button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col gap-0.5 pb-2">
          <span className="text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
            Account
          </span>
          <span className="truncate text-sm font-semibold text-foreground">
            {user?.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer gap-2" onClick={onSettings}>
          <User className="size-4" />
          General Settings
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer gap-2">
          <Settings className="size-4" />
          Workspace Settings
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer gap-2"
          onClick={onSwitchWorkspace}
        >
          <Shuffle className="size-4" />
          Switch Workspace
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer gap-2 text-destructive focus:text-destructive"
          onClick={onLogout}
        >
          <LogOut className="size-4" />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
