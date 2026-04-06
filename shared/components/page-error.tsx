import { AlertCircle } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { getApiErrorMessage } from "@/lib/api/get-api-error"

interface PageErrorProps {
  error?: unknown
  message?: string
  onRetry?: () => void
}

export function PageError({ error, message, onRetry }: PageErrorProps) {
  const displayMessage =
    message ?? getApiErrorMessage(error, "Something went wrong. Please try again.")

  return (
    <div className="container flex flex-col items-center justify-center py-24 text-center gap-4">
      <div className="rounded-full bg-destructive/10 p-4">
        <AlertCircle className="size-8 text-destructive" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-semibold text-foreground">Failed to load</p>
        <p className="text-sm text-muted-foreground max-w-xs">{displayMessage}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}
