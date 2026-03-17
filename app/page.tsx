import { LandingNavbar } from "@/features/landing/components/navbar"
import { Hero } from "@/features/landing/components/hero"
import { FeaturesSection } from "@/features/landing/components/features"
import { HowItWorks } from "@/features/landing/components/how-it-works"
import { Testimonials } from "@/features/landing/components/testimonials"
import { CtaBanner } from "@/features/landing/components/cta-banner"
import { Footer } from "@/features/landing/components/footer"

export default function LandingPage() {
  return (
    <>
      <LandingNavbar />
      <main>
        <Hero />
        <FeaturesSection />
        <HowItWorks />
        <Testimonials />
        <CtaBanner />
      </main>
      <Footer />
    </>
  )
}
