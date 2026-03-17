"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { FormField } from "./form-field"

interface PasswordFieldProps {
  id: string
  label?: string
  error?: string
  right?: React.ReactNode
  placeholder?: string
  autoComplete?: string
  value: string
  onChange: (value: string) => void
  adornment?: React.ReactNode // optional override icon (e.g. checkmark)
}

export function PasswordField({
  id,
  label = "Password",
  error,
  right,
  placeholder = "••••••••",
  autoComplete,
  value,
  onChange,
  adornment,
}: PasswordFieldProps) {
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
      id={id}
      label={label}
      error={error}
      right={right}
      type={show ? "text" : "password"}
      autoComplete={autoComplete}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      inputRight={toggle}
    />
  )
}
