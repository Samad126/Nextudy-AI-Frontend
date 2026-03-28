"use client"

import FullpageSpinner from "@/shared/components/FullpageSpinner"
import Header from "@/features/workspace/components/Header"
import { useAuth } from "@/shared/providers/auth-provider"

function NotificationsLayout({ children }: { children: React.ReactNode }) {
  const { isAccessTokenHydrated } = useAuth()

  if (!isAccessTokenHydrated) {
    return <FullpageSpinner />
  }

  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col">{children}</main>
    </>
  )
}

export default NotificationsLayout
