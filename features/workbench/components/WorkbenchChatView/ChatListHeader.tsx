"use client"

import { useState } from "react"
import { MessageSquare, Plus, Trash2, ChevronDown, Loader2, Wifi, WifiOff } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import { Button } from "@/shared/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/ui/dialog"
import { Input } from "@/shared/ui/input"
import type { ChatListItem } from "@/types/chat"

interface ChatListHeaderProps {
  chats: ChatListItem[]
  activeChatId: number | undefined
  isConnected: boolean
  isCreating: boolean
  isDeleting: boolean
  onSelect: (chatId: number) => void
  onCreate: (title: string) => void
  onDelete: (chatId: number) => void
}

export function ChatListHeader({
  chats,
  activeChatId,
  isConnected,
  isCreating,
  isDeleting,
  onSelect,
  onCreate,
  onDelete,
}: ChatListHeaderProps) {
  const [newChatOpen, setNewChatOpen] = useState(false)
  const [title, setTitle] = useState("")

  const activeChat = chats.find((c) => c.id === activeChatId)

  function handleCreate() {
    const trimmed = title.trim()
    if (!trimmed) return
    onCreate(trimmed)
    setTitle("")
    setNewChatOpen(false)
  }

  return (
    <>
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border shrink-0">
        {/* Chat selector dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex flex-1 min-w-0 items-center gap-1.5 rounded-md px-1.5 py-1 text-sm font-medium hover:bg-muted/60 transition-colors">
              <MessageSquare className="size-3.5 shrink-0 text-muted-foreground" />
              <span className="truncate">{activeChat?.title ?? "Chat"}</span>
              <ChevronDown className="size-3.5 shrink-0 text-muted-foreground ml-auto" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {chats.map((chat) => (
              <DropdownMenuItem
                key={chat.id}
                className="flex items-center justify-between gap-2 pr-1"
                onSelect={(e) => {
                  // Don't close on delete button click
                  if ((e.target as HTMLElement).closest("[data-delete]")) {
                    e.preventDefault()
                  } else {
                    onSelect(chat.id)
                  }
                }}
              >
                <span className={`truncate flex-1 ${chat.id === activeChatId ? "font-medium" : ""}`}>
                  {chat.title}
                </span>
                <span className="text-[10px] text-muted-foreground shrink-0">
                  {chat._count.messages}
                </span>
                {chats.length > 1 && (
                  <button
                    data-delete
                    disabled={isDeleting}
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(chat.id)
                    }}
                    className="ml-1 p-0.5 rounded text-muted-foreground hover:text-destructive transition-colors disabled:opacity-40"
                    aria-label="Delete chat"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => setNewChatOpen(true)}>
              <Plus className="size-3.5 mr-2" />
              New Chat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* New chat shortcut */}
        <Button
          variant="ghost"
          size="icon"
          className="size-7 shrink-0"
          disabled={isCreating}
          onClick={() => setNewChatOpen(true)}
          aria-label="New chat"
        >
          {isCreating ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Plus className="size-3.5" />
          )}
        </Button>

        {/* Connection indicator */}
        <span
          title={isConnected ? "Connected" : "Connecting…"}
          className="shrink-0"
        >
          {isConnected ? (
            <Wifi className="size-3.5 text-green-500" />
          ) : (
            <WifiOff className="size-3.5 text-muted-foreground animate-pulse" />
          )}
        </span>
      </div>

      {/* New Chat Dialog */}
      <Dialog open={newChatOpen} onOpenChange={setNewChatOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>New Chat</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Chat title…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            autoFocus
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewChatOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!title.trim()}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
