"use client"

import Link from "next/link"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/shared/ui/button"
import { FormField } from "@/shared/components/form-field"
import { PasswordField } from "@/shared/components/password-field"
import { GoogleButton, OrDivider } from "@/features/auth/components"
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth"
import { useLogin } from "@/features/auth/mutations/use-login"
import { getApiErrorMessage } from "@/lib/api/get-api-error"

export default function LoginPage() {
  const { mutate: login, isPending, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })

  function onSubmit(data: LoginFormValues) {
    login(data);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-dark-grey dark:text-foreground">
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
            <Link href="/forgot-password" className="text-xs text-accent-green hover:underline dark:text-accent-green">
              Forgot password?
            </Link>
          }
          {...register("password")}
        />

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {getApiErrorMessage(error, "Something went wrong.")}
          </p>
        )}

        <Button
          type="submit"
          disabled={isPending}
          className="mt-1 h-10 w-full cursor-pointer bg-accent-green text-white hover:bg-accent-green/90"
        >
          {isPending ? (
            <><Loader2 className="size-4 animate-spin" /> Signing in…</>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-accent-green hover:underline dark:text-accent-green">
          Sign up
        </Link>
      </p>
    </div>
  )
}
