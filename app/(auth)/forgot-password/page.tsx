"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, CheckCircle2, Loader2, Mail } from "lucide-react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/shared/ui/button"
import { FormField } from "@/shared/components/form-field"
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "@/lib/validations/auth"
import { useForgotPassword } from "@/features/auth/mutations/use-forgot-password"
import { getApiErrorMessage } from "@/lib/api/get-api-error"

const RESEND_COOLDOWN = 30

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const { mutate: requestReset, isPending } = useForgotPassword()

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({ resolver: zodResolver(forgotPasswordSchema) })

  useEffect(() => {
    if (countdown <= 0) return
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  function onSubmit(data: ForgotPasswordFormValues) {
    requestReset(data, {
      onSuccess: () => {
        setSent(true)
        setCountdown(RESEND_COOLDOWN)
      },
      onError: (err) => {
        toast.error(getApiErrorMessage(err, "Something went wrong. Please try again."))
      },
    })
  }

  function handleResend() {
    requestReset(
      { email: getValues("email") },
      {
        onSuccess: () => {
          setCountdown(RESEND_COOLDOWN)
          toast.success("Reset link resent.")
        },
        onError: (err) => {
          toast.error(getApiErrorMessage(err, "Failed to resend. Please try again."))
        },
      }
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/login"
        className="inline-flex w-fit cursor-pointer items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Back to sign in
      </Link>

      {sent ? (
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-sage/10">
            <CheckCircle2 className="size-8 text-sage" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-navy dark:text-foreground">Check your email</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              We sent a reset link to{" "}
              <span className="font-medium text-foreground">{getValues("email")}</span>. It expires in 15 minutes.
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
            disabled={countdown > 0 || isPending}
            onClick={handleResend}
            className="h-10 w-full cursor-pointer disabled:cursor-not-allowed"
          >
            {isPending ? (
              <><Loader2 className="size-4 animate-spin" /> Sending…</>
            ) : countdown > 0 ? (
              `Resend in ${countdown}s`
            ) : (
              "Resend reset link"
            )}
          </Button>

          <Link href="/login" className="text-sm font-medium text-teal hover:underline">
            Back to sign in
          </Link>
        </div>
      ) : (
        <>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-navy dark:text-foreground">Reset your password</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter your email and we&apos;ll send you a reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
            <FormField
              id="email"
              label="Email address"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register("email")}
            />
            <Button
              type="submit"
              disabled={isPending}
              className="h-10 w-full cursor-pointer bg-teal text-white hover:bg-teal/90"
            >
              {isPending ? (
                <><Loader2 className="size-4 animate-spin" /> Sending reset link…</>
              ) : (
                "Send reset link"
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link href="/login" className="font-medium text-teal hover:underline dark:text-sky">Sign in</Link>
          </p>
        </>
      )}
    </div>
  )
}
