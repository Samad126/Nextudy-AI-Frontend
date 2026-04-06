import { SearchX } from "lucide-react"
import Link from "next/link"
import { Button } from "@/shared/ui/button"

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center py-24 text-center gap-4">
      <div className="rounded-full bg-muted p-4">
        <SearchX className="size-8 text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-semibold text-foreground">Not found</p>
        <p className="text-sm text-muted-foreground max-w-xs">
          The page or resource you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
      </div>
      <Button variant="outline" size="sm" asChild>
        <Link href="../">Go to workspaces</Link>
      </Button>
    </div>
  )
}
