import { Logo } from "@/shared/components/logo"
import { useAuth } from "@/shared/providers/auth-provider"
import { Button } from "@/shared/ui/button"
import { LogOut } from "lucide-react"

function Header() {
  const { handleLogout } = useAuth()

  return (
    <header className="flex items-center justify-between border-b border-border px-6 py-4">
      <Logo size="sm" />
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLogout}
        className="gap-2 text-muted-foreground hover:text-foreground"
      >
        <LogOut className="size-4" />
        Logout
      </Button>
    </header>
  )
}

export default Header
