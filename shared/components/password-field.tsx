"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { FormField } from "@/shared/components/form-field"

interface PasswordFieldProps extends Omit<React.ComponentProps<typeof FormField>, "type" | "inputRight" | "label"> {
  label?: React.ReactNode
  adornment?: React.ReactNode
}

export function PasswordField({ label = "Password", adornment, ...props }: PasswordFieldProps) {
  const [show, setShow] = useState(false)

  const toggle = (
    <button
      type="button"
      className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
      onClick={() => setShow((s) => !s)}
      aria-label={show ? "Hide password" : "Show password"}
    >
      {adornment ?? (show ? <EyeOff className="size-4" /> : <Eye className="size-4" />)}
    </button>
  )

  return (
    <FormField
      label={label}
      type={show ? "text" : "password"}
      inputRight={toggle}
      {...props}
    />
  )
}
