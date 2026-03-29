import { NextResponse } from "next/server"

export async function POST() {
  const isProd = process.env.NODE_ENV === 'production'
  const response = NextResponse.json({ message: "Logout successful" })

  response.cookies.set("refreshToken", "", {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    ...(isProd && { domain: '.alakbaroff.com' }),
  })

  return response
}
