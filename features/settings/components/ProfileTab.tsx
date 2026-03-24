"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { Skeleton } from "@/shared/ui/skeleton"
import { useGetProfile } from "../queries/use-get-profile"
import { useUpdateProfile } from "../mutations/use-update-profile"

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

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName)
      setLastName(profile.lastName)
      setEmail(profile.email)
    }
  }, [profile])

  const isDirty =
    profile &&
    (firstName !== profile.firstName ||
      lastName !== profile.lastName ||
      email !== profile.email)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!profile || !isDirty) return

    const patch: Record<string, string> = {}
    if (firstName !== profile.firstName) patch.firstName = firstName
    if (lastName !== profile.lastName) patch.lastName = lastName
    if (email !== profile.email) patch.email = email

    updateProfile(patch, {
      onSuccess: () => toast.success("Profile updated"),
      onError: () => toast.error("Failed to update profile"),
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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
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
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <Button type="submit" disabled={!isDirty || isPending}>
        {isPending && <Loader2 className="size-4 mr-2 animate-spin" />}
        Save Changes
      </Button>
    </form>
  )
}
