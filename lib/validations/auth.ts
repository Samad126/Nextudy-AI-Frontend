/* Auth form validation — plain functions, no external deps */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(email: string): string | null {
  if (!email) return "Email is required."
  if (!EMAIL_RE.test(email)) return "Enter a valid email address."
  return null
}

export function validatePassword(password: string): string | null {
  if (!password) return "Password is required."
  if (password.length < 8) return "Password must be at least 8 characters."
  return null
}

export function validatePasswordMatch(a: string, b: string): string | null {
  if (!b) return "Please confirm your password."
  if (a !== b) return "Passwords do not match."
  return null
}

export function validateRequired(value: string, label = "This field"): string | null {
  if (!value.trim()) return `${label} is required.`
  return null
}

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
