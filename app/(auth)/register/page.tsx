import type { Metadata } from "next"
import { RegisterForm } from "@/features/auth/components/RegisterForm"

export const metadata: Metadata = {
  title: "Create Account — Nextudy",
  description: "Sign up for Nextudy and start studying smarter with AI-generated questions, smart flashcards, and collaborative workspaces.",
}

export default function RegisterPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-dark-grey dark:text-foreground">
          Create your account
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Start studying smarter today
        </p>
      </div>

      <RegisterForm />
    </div>
  )
}
