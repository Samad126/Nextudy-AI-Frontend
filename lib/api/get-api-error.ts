import { isAxiosError } from "axios"
import type { ApiError } from "@/types/api"

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError<ApiError>(error)) {
    return error.response?.data?.error?.message ?? fallback
  }
  return fallback
}

export function isNotFoundError(error: unknown): boolean {
  return isAxiosError(error) && error.response?.status === 404
}
