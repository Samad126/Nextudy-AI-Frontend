"use client"

import { useState } from "react"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/shared/ui/button"
import { GoogleButton } from "@/features/auth/components/google-button"
import { OrDivider } from "@/features/auth/components/or-divider"
import { FormField } from "@/features/auth/components/form-field"
import { PasswordField } from "@/features/auth/components/password-toggle"
import { validateEmail, validatePassword } from "@/lib/validations/auth"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  function validate() {
    const e: Record<string, string> = {}
    const emailErr = validateEmail(email)
    const passErr = validatePassword(password)
    if (emailErr) e.email = emailErr
    if (passErr) e.password = passErr
    setErrors(e)
    return !Object.keys(e).length
  }

  async function handleSubmit(ev: { preventDefault(): void }) {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    setLoading(false)
    toast.success("Signed in successfully!")
  }

  const clear = (key: string) => setErrors((e) => ({ ...e, [key]: "" }))

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-navy">
          Welcome back
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to your Nextudy account
        </p>
      </div>

      <GoogleButton />
      <OrDivider />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <FormField
          id="email"
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          error={errors.email}
          onChange={(e) => {
            setEmail(e.target.value)
            clear("email")
          }}
        />
        <PasswordField
          id="password"
          autoComplete="current-password"
          value={password}
          error={errors.password}
          onChange={(v) => {
            setPassword(v)
            clear("password")
          }}
          right={
            <Link
              href="/forgot-password"
              className="text-xs text-teal hover:underline"
            >
              Forgot password?
            </Link>
          }
        />

        <Button
          type="submit"
          disabled={loading}
          className="mt-1 h-10 w-full cursor-pointer bg-teal text-white hover:bg-teal/90"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-teal hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  )
}
