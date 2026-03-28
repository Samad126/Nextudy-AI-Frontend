import type { Metadata } from "next"
import { ContactForm } from "@/features/landing/components/contact-form"

export const metadata: Metadata = {
  title: "Contact — Nextudy",
  description: "Have a question or feedback? Get in touch with the Nextudy team.",
}

export default function ContactPage() {
  return (
    <div className="px-6 pt-32 pb-16">
      <div className="mx-auto max-w-xl text-center">
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-navy dark:text-foreground">
            Contact us
          </h1>
          <p className="mb-10 text-sm text-muted-foreground">
            Have a question, found a bug, or just want to say hi? We&apos;d love to hear from you.
          </p>
          <ContactForm />
      </div>
    </div>
  )
}
