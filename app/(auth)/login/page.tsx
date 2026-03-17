"use client"

import Link from "next/link"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/shared/ui/button"
import { FormField } from "@/shared/components/form-field"
import { PasswordField } from "@/shared/components/password-field"
import { GoogleButton, OrDivider } from "@/features/auth/components"
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth"

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })

  async function onSubmit() {
    await new Promise((r) => setTimeout(r, 1500))
    toast.success("Signed in successfully!")
  }

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
        <PasswordField
          id="password"
          autoComplete="current-password"
          error={errors.password?.message}
          right={
            <Link href="/forgot-password" className="text-xs text-teal hover:underline">
              Forgot password?
            </Link>
          }
          {...register("password")}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-1 h-10 w-full cursor-pointer bg-teal text-white hover:bg-teal/90"
        >
          {isSubmitting ? (
            <><Loader2 className="size-4 animate-spin" /> Signing in…</>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-teal hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  )
}
