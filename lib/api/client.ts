import type { ApiSuccess } from "@/types"
import axios, { type AxiosRequestConfig } from "axios"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000"

let accessToken: string | null = null

export const getAccessToken = () => accessToken
export const setAccessToken = (token: string | null) => {
  accessToken = token
}

export type RefreshTokenResponse = {
  accessToken: string
  refreshToken: string
}

type QueueItem = {
  resolve: (token: string) => void
  reject: (error: unknown) => void
}

let isRefreshing = false
let queue: QueueItem[] = []

function processQueue(error: unknown, token: string | null) {
  queue.forEach((item) => {
    if (error) {
      item.reject(error)
    } else {
      item.resolve(token!)
    }
  })
  queue = []
}

// Public instance (no auth)
export const axiosBase = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
})

// Private instance (requires auth)
export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
})

axiosPrivate.interceptors.request.use(
  (config) => {
    if (accessToken && !config.headers["Authorization"]) {
      config.headers["Authorization"] = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

axiosPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest: AxiosRequestConfig & { _retry?: boolean } =
      error.config

    if (
      (error.response?.status !== 401 && error.response?.status !== 403) ||
      originalRequest._retry
    ) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        queue.push({ resolve, reject })
      })
        .then((token) => {
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${token}`,
          }
          return axiosPrivate(originalRequest)
        })
        .catch(Promise.reject.bind(Promise))
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      const { data } =
        await axiosBase.post<ApiSuccess<RefreshTokenResponse>>("/auth/refresh")
      const newToken = data.data.accessToken

      accessToken = newToken
      processQueue(null, newToken)

      originalRequest.headers = {
        ...originalRequest.headers,
        Authorization: `Bearer ${newToken}`,
      }

      return axiosPrivate(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError, null)
      accessToken = null
      if (typeof window !== "undefined") {
        console.log("DISPATCHED")
        window.dispatchEvent(new CustomEvent("auth:session-expired"))
      }
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)
