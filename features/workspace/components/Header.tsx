import { Logo } from "@/shared/components/logo"
import { useAuth } from "@/shared/providers/auth-provider"
import { Button } from "@/shared/ui/button"
import { LogOut } from "lucide-react"
import { NotificationBell } from "@/features/notifications/components/NotificationBell"

function Header() {
  const { handleLogout } = useAuth()

  return (
    <header className="flex items-center justify-between border-b border-border px-5 h-14">
      <Logo size="sm" />
      <div className="flex items-center gap-2">
        <NotificationBell />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <LogOut className="size-4" />
          Logout
        </Button>
      </div>
    </header>
  )
}

export default Header
