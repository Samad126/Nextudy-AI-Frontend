import { NextResponse } from "next/server"

export async function POST() {
  const response = NextResponse.json({ message: "Logout successfull" })
  response.cookies.set("refreshToken", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })
  return response
}
