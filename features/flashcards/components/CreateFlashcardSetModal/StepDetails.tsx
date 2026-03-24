"use client"

import { UseFormReturn } from "react-hook-form"
import { Label } from "@/shared/ui/label"
import { Input } from "@/shared/ui/input"
import { Textarea } from "@/shared/ui/textarea"
import { Slider } from "@/shared/ui/slider"
import { cn } from "@/lib/utils"
import type { CreateSetFormValues } from "./index"

const DIFFICULTIES = ["EASY", "MEDIUM", "HARD"] as const

interface StepDetailsProps {
  form: UseFormReturn<CreateSetFormValues>
}

export function StepDetails({ form }: StepDetailsProps) {
  const { register, watch, setValue, formState: { errors } } = form
  const difficulty = watch("difficulty")
  const count = watch("count") ?? 5

  return (
    <div className="flex flex-col gap-5">
      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="fc-title" className="text-sm font-medium">
          Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="fc-title"
          placeholder="e.g. Chapter 3 — Cell Biology"
          autoFocus
          aria-invalid={!!errors.title}
          className={cn(errors.title && "border-destructive")}
          {...register("title")}
        />
        {errors.title && (
          <p className="text-xs text-destructive">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="fc-desc" className="text-sm font-medium">Description</Label>
        <Textarea
          id="fc-desc"
          placeholder="Optional description"
          rows={2}
          className="resize-none"
          {...register("description")}
        />
      </div>

      {/* Difficulty */}
      <div className="flex flex-col gap-2">
        <Label className="text-sm font-medium">Difficulty</Label>
        <div className="flex gap-2">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setValue("difficulty", difficulty === d ? undefined : d)}
              className={cn(
                "flex-1 rounded-lg border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors",
                difficulty === d
                  ? d === "EASY"
                    ? "border-green-500 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                    : d === "MEDIUM"
                    ? "border-yellow-500 bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300"
                    : "border-red-500 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                  : "border-border bg-background text-muted-foreground hover:bg-muted"
              )}
            >
              {d.charAt(0) + d.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Card count */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Number of cards</Label>
          <span className="text-sm font-semibold tabular-nums">{count}</span>
        </div>
        <Slider
          min={1}
          max={20}
          step={1}
          value={[count]}
          onValueChange={([v]) => setValue("count", v)}
        />
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>1</span>
          <span>20</span>
        </div>
      </div>
    </div>
  )
}
