import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000"

export async function POST(req: NextRequest) {
  const body = await req.json()

  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

  const json = await res.json()

  if (!res.ok) {
    return NextResponse.json(json, { status: res.status })
  }

  const { accessToken, refreshToken } = json.data

  const cookieStore = await cookies()
  cookieStore.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  })

  return NextResponse.json({ data: { accessToken } }, { status: 200 })
}
