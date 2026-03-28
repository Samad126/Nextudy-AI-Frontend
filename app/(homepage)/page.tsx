import type { Metadata } from "next"
import { CtaBanner, FeaturesSection, Hero, HowItWorks, Testimonials } from "@/features/landing/components";

export const metadata: Metadata = {
  title: "Nextudy — AI-powered collaborative study platform",
  description:
    "Upload your study materials and let AI generate questions, flashcards, and quizzes. Collaborate in shared workspaces and chat with an AI that knows your content.",
  alternates: {
    canonical: "/",
  },
}

export default function LandingPage() {
  return (
    <>
      <Hero />
      <FeaturesSection />
      <HowItWorks />
      <Testimonials />
      <CtaBanner />
    </>
  )
}
