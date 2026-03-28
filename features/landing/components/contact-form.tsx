"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Send, CheckCircle } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { Label } from "@/shared/ui/label"
import { Textarea } from "@/shared/ui/textarea"
import { FormField } from "@/shared/components/form-field"
import { useContact } from "../mutations/use-contact"
import { getApiErrorMessage } from "@/lib/api/get-api-error"

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Enter a valid email address"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message too long"),
})

type ContactFormValues = z.infer<typeof contactSchema>

export function ContactForm() {
  const { mutate: sendContact, isPending, isSuccess, error } = useContact()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  })

  function onSubmit(data: ContactFormValues) {
    sendContact(data)
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <CheckCircle className="size-10 text-accent-green" />
        <h2 className="text-lg font-semibold text-foreground">Message sent!</h2>
        <p className="max-w-xs text-sm text-muted-foreground">
          Thanks for reaching out. We&apos;ll get back to you as soon as possible.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          id="name"
          label="Name"
          autoComplete="name"
          placeholder="Jane Doe"
          error={errors.name?.message}
          {...register("name")}
        />
        <FormField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="message" className="text-sm font-medium">
          Message
        </Label>
        <Textarea
          id="message"
          placeholder="How can we help you?"
          rows={5}
          aria-invalid={!!errors.message}
          className="resize-none"
          {...register("message")}
        />
        {errors.message && (
          <p className="text-xs text-destructive" role="alert">
            {errors.message.message}
          </p>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {getApiErrorMessage(error, "Failed to send message. Please try again.")}
        </p>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="h-10 w-full cursor-pointer bg-accent-green text-white hover:bg-accent-green/90 sm:w-auto sm:self-end"
      >
        {isPending ? (
          <><Loader2 className="size-4 animate-spin" /> Sending…</>
        ) : (
          <><Send className="size-4" /> Send message</>
        )}
      </Button>
    </form>
  )
}
