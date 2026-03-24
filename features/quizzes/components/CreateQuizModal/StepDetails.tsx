"use client"

import { UseFormReturn } from "react-hook-form"
import { Label } from "@/shared/ui/label"
import { Input } from "@/shared/ui/input"
import { Textarea } from "@/shared/ui/textarea"
import { cn } from "@/lib/utils"
import type { CreateQuizFormValues } from "./index"

interface StepDetailsProps {
  form: UseFormReturn<CreateQuizFormValues>
}

export function StepDetails({ form }: StepDetailsProps) {
  const { register, formState: { errors } } = form

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="quiz-title">
          Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="quiz-title"
          placeholder="e.g. Midterm Practice Quiz"
          autoFocus
          aria-invalid={!!errors.title}
          className={cn(errors.title && "border-destructive")}
          {...register("title")}
        />
        {errors.title && (
          <p className="text-xs text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="quiz-desc">Description</Label>
        <Textarea
          id="quiz-desc"
          placeholder="Optional description"
          rows={3}
          className="resize-none"
          {...register("description")}
        />
      </div>
    </div>
  )
}
