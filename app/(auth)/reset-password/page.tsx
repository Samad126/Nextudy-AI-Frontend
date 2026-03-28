"use client"

import { Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CheckCircle2, Loader2, ShieldAlert } from "lucide-react"
import { toast } from "sonner"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/shared/ui/button"
import { PasswordField } from "@/shared/components/password-field"
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
  getPasswordStrength,
} from "@/lib/validations/auth"
import { useResetPassword } from "@/features/auth/mutations/use-reset-password"
import { getApiErrorMessage } from "@/lib/api/get-api-error"

const STRENGTH_COLOR = { 1: "#ef4444", 2: "#f59e0b", 3: "var(--color-sage)" }

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const uid = searchParams.get("uid")
  const router = useRouter()

  const { mutate: resetPassword, isPending } = useResetPassword()

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
    mode: "onChange",
  })

  const password = useWatch({ control, name: "password" })
  const confirmPassword = useWatch({ control, name: "confirmPassword" })
  const strength = getPasswordStrength(password)
  const passwordsMatch = !!confirmPassword && password === confirmPassword

  function onSubmit(data: ResetPasswordFormValues) {
    resetPassword(
      { userId: Number(uid), token: token!, newPassword: data.password },
      {
        onSuccess: () => {
          toast.success("Password updated. Please sign in.")
          router.push("/login")
        },
        onError: (err) => {
          toast.error(
            getApiErrorMessage(err, "Something went wrong. Please request a new reset link.")
          )
        },
      }
    )
  }

  if (!token || !uid || isNaN(Number(uid))) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-destructive/10">
          <ShieldAlert className="size-8 text-destructive" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-dark-grey dark:text-foreground">Invalid link</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            This reset link is missing or invalid. Please request a new one.
          </p>
        </div>
        <Link
          href="/forgot-password"
          className="inline-flex h-10 items-center justify-center rounded-md bg-accent-green px-4 text-sm font-medium text-white transition-colors hover:bg-accent-green/90"
        >
          Request new link
        </Link>
      </div>
    )
  }

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-dark-grey dark:text-foreground">Set new password</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose a strong password for your account.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <PasswordField
            id="password"
            label="New password"
            autoComplete="new-password"
            placeholder="Min. 8 characters"
            error={errors.password?.message}
            {...register("password")}
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
                        i <= strength.level ? STRENGTH_COLOR[strength.level] : "var(--color-border)",
                    }}
                  />
                ))}
              </div>
              <span className="text-xs font-medium" style={{ color: STRENGTH_COLOR[strength.level] }}>
                {strength.label}
              </span>
            </div>
          )}
        </div>

        <PasswordField
          id="confirmPassword"
          label="Confirm new password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          adornment={passwordsMatch ? <CheckCircle2 className="size-4 text-accent-green" /> : undefined}
          {...register("confirmPassword")}
        />

        <Button
          type="submit"
          disabled={isPending}
          className="mt-1 h-10 w-full cursor-pointer bg-accent-green text-white hover:bg-accent-green/90"
        >
          {isPending ? (
            <><Loader2 className="size-4 animate-spin" /> Updating password…</>
          ) : (
            "Update password"
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Remember your password?{" "}
        <Link href="/login" className="font-medium text-accent-green hover:underline dark:text-accent-green">
          Sign in
        </Link>
      </p>
    </>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/login"
        className="inline-flex w-fit cursor-pointer items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Back to sign in
      </Link>

      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </div>
  )
}
