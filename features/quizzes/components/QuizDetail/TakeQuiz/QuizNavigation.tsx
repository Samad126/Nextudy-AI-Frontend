import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/shared/ui/button"

interface QuizNavigationProps {
  currentIndex: number
  isLast: boolean
  onPrev: () => void
  onNext: () => void
}

export function QuizNavigation({ currentIndex, isLast, onPrev, onNext }: QuizNavigationProps) {
  return (
    <div className="flex items-center justify-between">
      <Button variant="outline" onClick={onPrev} disabled={currentIndex === 0}>
        <ChevronLeft className="mr-1 size-4" />
        Previous
      </Button>
      <Button onClick={onNext}>
        {isLast ? "Review & Submit" : "Next"}
        {!isLast && <ChevronRight className="ml-1 size-4" />}
      </Button>
    </div>
  )
}
