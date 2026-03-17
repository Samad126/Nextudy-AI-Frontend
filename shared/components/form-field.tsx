import { cn } from "@/lib/utils"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"

interface FormFieldProps extends React.ComponentProps<typeof Input> {
  id: string
  label: React.ReactNode
  error?: string
  right?: React.ReactNode
  inputRight?: React.ReactNode
}

export function FormField({ id, label, error, right, inputRight, className, ...props }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-sm font-medium">{label}</Label>
        {right}
      </div>
      <div className="relative">
        <Input
          id={id}
          aria-invalid={!!error}
          className={cn(error && "border-destructive focus-visible:ring-destructive/30", inputRight && "pr-10", className)}
          {...props}
        />
        {inputRight && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">{inputRight}</span>
        )}
      </div>
      {error && <p className="text-xs text-destructive" role="alert">{error}</p>}
    </div>
  )
}
