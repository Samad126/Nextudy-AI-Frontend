import { z } from "zod"

export const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const forgotPasswordSchema = z.object({
  email: z.email("Enter a valid email address."),
})

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required."),
    lastName: z.string().min(1, "Last name is required."),
    email: z.email("Enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
    terms: z.literal(true, { error: "You must agree to continue." }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })

export type RegisterFormValues = z.infer<typeof registerSchema>

export type PasswordStrength = { level: 1 | 2 | 3; label: "Weak" | "Medium" | "Strong" }

export function getPasswordStrength(password: string): PasswordStrength | null {
  if (!password) return null
  let score = 0
  if (password.length >= 8)  score++
  if (password.length >= 12) score++
  if (/[!@#$%^&*]/.test(password)) score++
  if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score++
  if (score <= 1) return { level: 1, label: "Weak" }
  if (score === 2) return { level: 2, label: "Medium" }
  return { level: 3, label: "Strong" }
}
