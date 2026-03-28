import type { Metadata } from "next"
import { PrivacyPolicyContent } from "@/features/landing/components/Privacy-Policy-Content"

export const metadata: Metadata = {
  title: "Privacy Policy — Nextudy",
  description: "Learn how Nextudy collects, uses, and protects your personal information.",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="px-6 pt-32 pb-16">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-dark-grey dark:text-foreground">
          Privacy Policy
        </h1>

        <div className="mt-8">
          <PrivacyPolicyContent />
        </div>
      </div>
    </div>
  )
}
