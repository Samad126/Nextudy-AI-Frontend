import axios from "axios"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000"

let accessToken: string | null = null

export const getAccessToken = () => accessToken
export const setAccessToken = (token: string | null) => {
  accessToken = token
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
  (error) => Promise.reject(error),
)

axiosPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const { data } = await axiosBase.post<{ accessToken: string }>(
          "/auth/refresh",
        )

        accessToken = data.accessToken
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`

        return axiosPrivate(originalRequest)
      } catch {
        accessToken = null
        window.location.href = "/login"
      }
    }

    return Promise.reject(error)
  },
)
