"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, CheckCircle2, Loader2, Mail } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/shared/ui/button"
import { FormField } from "@/features/auth/components/form-field"
import { validateEmail } from "@/lib/validations/auth"

const RESEND_COOLDOWN = 30

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    if (countdown <= 0) return
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  function validate() {
    const err = validateEmail(email)
    setEmailError(err ?? "")
    return !err
  }

  async function handleSubmit(ev: { preventDefault(): void }) {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    setLoading(false)
    setSent(true)
    setCountdown(RESEND_COOLDOWN)
  }

  async function handleResend() {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    setLoading(false)
    setCountdown(RESEND_COOLDOWN)
    toast.success("Reset link resent.")
  }

  return (
    <div className="flex flex-col gap-6">
      <Link href="/login" className="inline-flex w-fit cursor-pointer items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="size-3.5" />
        Back to sign in
      </Link>

      {sent ? (
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-sage/10">
            <CheckCircle2 className="size-8 text-sage" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-navy">Check your email</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              We sent a reset link to <span className="font-medium text-foreground">{email}</span>. It expires in 15 minutes.
            </p>
          </div>

          <div className="w-full rounded-xl border border-sage/30 bg-sage/5 p-4 text-left">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-sage" />
              <p className="text-xs leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground">Didn&apos;t see it? </span>
                Check your spam folder, or verify the email address you entered.
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            disabled={countdown > 0 || loading}
            onClick={handleResend}
            className="h-10 w-full cursor-pointer disabled:cursor-not-allowed"
          >
            {loading
              ? <><Loader2 className="size-4 animate-spin" /> Sending…</>
              : countdown > 0 ? `Resend in ${countdown}s` : "Resend reset link"}
          </Button>

          <Link href="/login" className="text-sm font-medium text-teal hover:underline">
            Back to sign in
          </Link>
        </div>
      ) : (
        <>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-navy">Reset your password</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter your email and we&apos;ll send you a reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <FormField
              id="email" label="Email address" type="email" autoComplete="email"
              placeholder="you@example.com" value={email} error={emailError}
              onChange={(e) => { setEmail(e.target.value); setEmailError("") }}
            />
            <Button type="submit" disabled={loading} className="h-10 w-full cursor-pointer bg-teal text-white hover:bg-teal/90">
              {loading ? <><Loader2 className="size-4 animate-spin" /> Sending reset link…</> : "Send reset link"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link href="/login" className="font-medium text-teal hover:underline">Sign in</Link>
          </p>
        </>
      )}
    </div>
  )
}
