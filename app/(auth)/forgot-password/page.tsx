import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm"

export const metadata: Metadata = {
  title: "Reset Password — Nextudy",
  description: "Forgot your Nextudy password? Enter your email and we'll send you a reset link.",
}

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/login"
        className="inline-flex w-fit cursor-pointer items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Back to sign in
      </Link>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-dark-grey dark:text-foreground">Reset your password</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      <ForgotPasswordForm />
    </div>
  )
}
