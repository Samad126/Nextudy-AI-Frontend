import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm"

export const metadata: Metadata = {
  title: "Set New Password — Nextudy",
  description: "Create a new password for your Nextudy account.",
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

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-dark-grey dark:text-foreground">Set new password</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose a strong password for your account.
        </p>
      </div>

      <ResetPasswordForm />
    </div>
  )
}
