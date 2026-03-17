const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000"

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

interface RequestOptions {
  method?: HttpMethod
  body?: unknown
  token?: string
}

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, token } = options

  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (token) headers["Authorization"] = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new ApiError(res.status, err.message ?? "Request failed")
  }

  return res.json() as Promise<T>
}

export const apiClient = {
  get:    <T>(url: string, token?: string)              => request<T>(url, { token }),
  post:   <T>(url: string, body: unknown, token?: string) => request<T>(url, { method: "POST",   body, token }),
  put:    <T>(url: string, body: unknown, token?: string) => request<T>(url, { method: "PUT",    body, token }),
  patch:  <T>(url: string, body: unknown, token?: string) => request<T>(url, { method: "PATCH",  body, token }),
  delete: <T>(url: string, token?: string)              => request<T>(url, { method: "DELETE", token }),
}

export { ApiError }
