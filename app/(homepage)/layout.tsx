import { Footer } from "@/features/landing/components"
import { Header } from "@/features/landing/components/header"
import React from "react"

function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main-content">
        {children}
      </main>
      <Footer/>
    </>
  )
}

export default layout
