import type { Metadata } from "next"
import { cookies } from "next/headers"
import { CtaBanner, FeaturesSection, Hero, HowItWorks } from "@/features/landing/components";

export const metadata: Metadata = {
  title: "Nextudy — AI-powered collaborative study platform",
  description:
    "Upload your study materials and let AI generate questions, flashcards, and quizzes. Collaborate in shared workspaces and chat with an AI that knows your content.",
  alternates: {
    canonical: "/",
  },
}

export default async function LandingPage() {
  const cookieStore = await cookies()
  const isLoggedIn = cookieStore.has("refreshToken")

  return (
    <>
      <Hero isLoggedIn={isLoggedIn} />
      <FeaturesSection />
      <HowItWorks />
      <CtaBanner isLoggedIn={isLoggedIn} />
    </>
  )
}
