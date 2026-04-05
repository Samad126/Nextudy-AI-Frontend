"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { getApiErrorMessage } from "@/lib/api/get-api-error"
import { Loader2 } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { Skeleton } from "@/shared/ui/skeleton"
import { useGetProfile } from "../../queries/use-get-profile"
import { useUpdateProfile } from "../../mutations/use-update-profile"
import { ThemeSwitcher } from "./ThemeSwitcher"

interface FormValues {
  firstName: string
  lastName: string
  email: string
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function getInitials(first: string, last: string) {
  return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase()
}

export function ProfileTab() {
  const { data: profile, isLoading } = useGetProfile()
  const { mutate: updateProfile, isPending } = useUpdateProfile()

  const form = useForm<FormValues>({
    defaultValues: { firstName: "", lastName: "", email: "" },
  })

  useEffect(() => {
    if (profile) {
      form.reset({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile])

  function onSubmit(data: FormValues) {
    if (!profile) return

    const patch: Record<string, string> = {}
    if (data.firstName !== profile.firstName) patch.firstName = data.firstName
    if (data.lastName !== profile.lastName) patch.lastName = data.lastName
    if (data.email !== profile.email) patch.email = data.email

    updateProfile(patch, {
      onSuccess: () => toast.success("Profile updated"),
      onError: (err) => toast.error(getApiErrorMessage(err, "Failed to update profile")),
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-md">
        <Skeleton className="size-16 rounded-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="flex size-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground select-none">
          {profile ? getInitials(profile.firstName, profile.lastName) : "?"}
        </div>
        <div>
          <p className="font-medium text-foreground">
            {profile?.firstName} {profile?.lastName}
          </p>
          <p className="text-sm text-muted-foreground">
            Member since {profile?.created_at ? formatDate(profile.created_at) : "—"}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" {...form.register("firstName")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" {...form.register("lastName")} />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...form.register("email")} />
        </div>
      </div>

      <Button type="submit" disabled={!form.formState.isDirty || isPending}>
        {isPending && <Loader2 className="size-4 mr-2 animate-spin" />}
        Save Changes
      </Button>

      <div className="border-t border-border pt-6">
        <ThemeSwitcher />
      </div>
    </form>
  )
}
