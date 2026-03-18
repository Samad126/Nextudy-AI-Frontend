"use client"

import Link from "next/link"
import { Check, Loader2 } from "lucide-react"
import { useForm, useWatch, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/shared/ui/button"
import { Checkbox } from "@/shared/ui/checkbox"
import { Label } from "@/shared/ui/label"
import { FormField } from "@/shared/components/form-field"
import { PasswordField } from "@/shared/components/password-field"
import { GoogleButton, OrDivider } from "@/features/auth/components"
import { registerSchema, type RegisterFormValues, getPasswordStrength } from "@/lib/validations/auth"
import { useRegister } from "@/features/auth/mutations/use-register"

const STRENGTH_COLOR = { 1: "#ef4444", 2: "#f59e0b", 3: "var(--color-sage)" }

export default function RegisterPage() {
  const { mutate: registerUser, isPending, error } = useRegister()

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { firstName: "", lastName: "", email: "", password: "", confirmPassword: "", terms: undefined },
    mode: "onChange"
  })

  const password = useWatch({ control, name: "password" })
  const confirmPassword = useWatch({ control, name: "confirmPassword" })
  const strength = getPasswordStrength(password)
  const passwordsMatch = !!confirmPassword && password === confirmPassword

  function onSubmit(data: RegisterFormValues) {
    registerUser(data)
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-navy dark:text-foreground">
          Create your account
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Start studying smarter today
        </p>
      </div>

      <GoogleButton />
      <OrDivider />

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <FormField
            id="firstName"
            label="First name"
            autoComplete="given-name"
            placeholder="Jane"
            error={errors.firstName?.message}
            {...register("firstName")}
          />
          <FormField
            id="lastName"
            label="Last name"
            autoComplete="family-name"
            placeholder="Doe"
            error={errors.lastName?.message}
            {...register("lastName")}
          />
        </div>

        <FormField
          id="email"
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <div className="flex flex-col gap-1.5">
          <PasswordField
            id="password"
            label="Password"
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
          error={errors.confirmPassword?.message}
          adornment={passwordsMatch ? <Check className="size-4 text-sage" /> : undefined}
          {...register("confirmPassword")}
        />

        <div className="flex flex-col gap-1">
          <div className="flex items-start gap-2.5">
            <Controller
              name="terms"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="terms"
                  checked={field.value === true}
                  className="mt-0.5 cursor-pointer"
                  onCheckedChange={(c) => field.onChange(c === true ? true : undefined)}
                />
              )}
            />
            <Label
              htmlFor="terms"
              className="cursor-pointer text-sm leading-relaxed text-muted-foreground"
            >
              I agree to the{" "}
              <a href="#" className="text-teal hover:underline dark:text-sky">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-teal hover:underline dark:text-sky">
                Privacy Policy
              </a>
            </Label>
          </div>
          {errors.terms && (
            <p className="text-xs text-destructive" role="alert">
              {errors.terms.message}
            </p>
          )}
        </div>

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error.response?.data?.error.message ?? "Something went wrong."}
          </p>
        )}

        <Button
          type="submit"
          disabled={isPending}
          className="mt-1 h-10 w-full cursor-pointer bg-teal text-white hover:bg-teal/90"
        >
          {isPending ? (
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
        <Link href="/login" className="font-medium text-teal hover:underline dark:text-sky">
          Sign in
        </Link>
      </p>
    </div>
  )
}
