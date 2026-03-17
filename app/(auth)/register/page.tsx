"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/shared/ui/button"
import { Checkbox } from "@/shared/ui/checkbox"
import { Label } from "@/shared/ui/label"
import { getPasswordStrength, validateEmail, validatePassword, validatePasswordMatch, validateRequired } from "@/lib/validations/auth"
import { FormField, GoogleButton, OrDivider, PasswordField } from "@/features/auth/components"

const STRENGTH_COLOR = { 1: "#ef4444", 2: "#f59e0b", 3: "var(--color-sage)" }

export default function RegisterPage() {
  const [fields, setFields] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [terms, setTerms] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const set = (key: string, value: string) => {
    setFields((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: "" }))
  }

  function validate() {
    const e: Record<string, string> = {}
    const firstErr = validateRequired(fields.firstName, "First name")
    const lastErr = validateRequired(fields.lastName, "Last name")
    const emailErr = validateEmail(fields.email)
    const passErr = validatePassword(fields.password)
    const matchErr = validatePasswordMatch(
      fields.password,
      fields.confirmPassword
    )
    if (firstErr) e.firstName = firstErr
    if (lastErr) e.lastName = lastErr
    if (emailErr) e.email = emailErr
    if (passErr) e.password = passErr
    if (matchErr) e.confirmPassword = matchErr
    if (!terms) e.terms = "You must agree to continue."
    setErrors(e)
    return !Object.keys(e).length
  }

  async function handleSubmit(ev: { preventDefault(): void }) {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    setLoading(false)
    toast.success("Account created! Welcome to Nextudy.")
  }

  const strength = getPasswordStrength(fields.password)
  const passwordsMatch =
    !!fields.confirmPassword && fields.password === fields.confirmPassword

  return (
    <div className="flex flex-col gap-5">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-navy">
          Create your account
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Start studying smarter today
        </p>
      </div>

      <GoogleButton />
      <OrDivider />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <FormField
            id="firstName"
            label="First name"
            autoComplete="given-name"
            placeholder="Jane"
            right={<div>salam</div>}
            value={fields.firstName}
            error={errors.firstName}
            onChange={(e) => set("firstName", e.target.value)}
          />
          <FormField
            id="lastName"
            label="Last name"
            autoComplete="family-name"
            placeholder="Doe"
            value={fields.lastName}
            error={errors.lastName}
            onChange={(e) => set("lastName", e.target.value)}
          />
        </div>

        <FormField
          id="email"
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={fields.email}
          error={errors.email}
          onChange={(e) => set("email", e.target.value)}
        />

        <div className="flex flex-col gap-1.5">
          <PasswordField
            id="password"
            autoComplete="new-password"
            placeholder="Min. 8 characters"
            value={fields.password}
            error={errors.password}
            onChange={(v) => set("password", v)}
          />
          {strength && (
            <div className="flex items-center gap-2">
              <div className="flex flex-1 gap-1">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-1 flex-1 rounded-full transition-colors duration-300"
                    style={{
                      backgroundColor:
                        i <= strength.level
                          ? STRENGTH_COLOR[strength.level]
                          : "var(--color-border)",
                    }}
                  />
                ))}
              </div>
              <span
                className="text-xs font-medium"
                style={{ color: STRENGTH_COLOR[strength.level] }}
              >
                {strength.label}
              </span>
            </div>
          )}
        </div>

        <PasswordField
          id="confirmPassword"
          label="Confirm password"
          autoComplete="new-password"
          value={fields.confirmPassword}
          error={errors.confirmPassword}
          onChange={(v) => set("confirmPassword", v)}
          adornment={
            passwordsMatch ? <Check className="size-4 text-sage" /> : undefined
          }
        />

        <div className="flex flex-col gap-1">
          <div className="flex items-start gap-2.5">
            <Checkbox
              id="terms"
              checked={terms}
              className="mt-0.5 cursor-pointer"
              onCheckedChange={(c) => {
                setTerms(c === true)
                setErrors((e) => ({ ...e, terms: "" }))
              }}
            />
            <Label
              htmlFor="terms"
              className="cursor-pointer text-sm leading-relaxed text-muted-foreground"
            >
              I agree to the{" "}
              <a href="#" className="text-teal hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-teal hover:underline">
                Privacy Policy
              </a>
            </Label>
          </div>
          {errors.terms && (
            <p className="text-xs text-destructive" role="alert">
              {errors.terms}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="mt-1 h-10 w-full cursor-pointer bg-teal text-white hover:bg-teal/90"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Creating account…
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-teal hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
