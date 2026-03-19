import { cookies } from "next/headers"
import { redirect } from "next/navigation"

async function layout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()

  const isLoggedIn = cookieStore.has("refreshToken")

  if (!isLoggedIn) redirect("/login")
  return <>{children}</>
}

export default layout
