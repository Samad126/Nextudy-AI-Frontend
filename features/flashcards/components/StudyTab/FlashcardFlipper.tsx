"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight, RotateCcw, Shuffle } from "lucide-react"
import { Flashcard } from "../../types/flashcard"
import { DifficultyBadge } from "@/shared/components/DifficultyBadge"
import { Button } from "@/shared/ui/button"
import { Progress } from "@/shared/ui/progress"

interface FlashcardFlipperProps {
  cards: Flashcard[]
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function FlashcardFlipper({ cards }: FlashcardFlipperProps) {
  const [deck, setDeck] = useState(cards)
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [hasFlippedOnce, setHasFlippedOnce] = useState(false)
  const [shuffled, setShuffled] = useState(false)

  const current = deck[index]

  const goNext = useCallback(() => {
    setIndex((i) => {
      if (i >= deck.length - 1) return i
      setFlipped(false)
      return i + 1
    })
  }, [deck.length])

  const goPrev = useCallback(() => {
    setIndex((i) => {
      if (i <= 0) return i
      setFlipped(false)
      return i - 1
    })
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") goNext()
      if (e.key === "ArrowLeft") goPrev()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [goNext, goPrev])

  function handleFlip() {
    setFlipped((f) => !f)
    if (!hasFlippedOnce) setHasFlippedOnce(true)
  }

  function handleShuffle() {
    setDeck(shuffleArray(deck))
    setIndex(0)
    setFlipped(false)
    setShuffled(true)
  }

  function handleRestart() {
    setDeck(shuffled ? shuffleArray(cards) : cards)
    setIndex(0)
    setFlipped(false)
  }

  if (!current) return null

  const progress = ((index + 1) / deck.length) * 100

  return (
    <div className="flex flex-col gap-6">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          Card {index + 1} of {deck.length}
        </span>
        <Progress value={progress} className="flex-1 h-1.5" />
      </div>

      {/* Card — CSS 3D flip */}
      <div
        className="cursor-pointer select-none"
        style={{ perspective: "1200px" }}
        onClick={handleFlip}
      >
        <div
          className="relative w-full transition-transform duration-500"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            height: "14rem",
            willChange: "transform",
          }}
        >
          {/* Front face */}
          <div
            className="absolute top-0 left-0 w-full h-full rounded-2xl border border-border bg-card p-8 md:p-12 flex flex-col items-center justify-center gap-4"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(0deg)",
            }}
          >
            <p className="text-lg md:text-xl font-medium text-center text-foreground leading-relaxed">
              {current.question}
            </p>
            {!hasFlippedOnce && (
              <p className="text-xs text-muted-foreground/60 italic mt-2">
                Click card to reveal answer
              </p>
            )}
          </div>

          {/* Back face — pre-rotated 180deg so it starts hidden */}
          <div
            className="absolute top-0 left-0 w-full h-full rounded-2xl border border-primary/30 bg-primary/5 p-8 md:p-12 flex flex-col items-center justify-center gap-4"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <p className="text-base md:text-lg text-center text-foreground leading-relaxed">
              {current.answer}
            </p>
            {current.difficulty && (
              <div className="absolute bottom-4 right-4">
                <DifficultyBadge difficulty={current.difficulty} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button variant="ghost" size="icon-sm" onClick={handleRestart} title="Restart">
            <RotateCcw className="size-4" />
          </Button>
          <Button
            variant={shuffled ? "secondary" : "ghost"}
            size="icon-sm"
            onClick={handleShuffle}
            title="Shuffle"
          >
            <Shuffle className="size-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="icon-sm" onClick={goPrev} disabled={index === 0}>
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={goNext}
            disabled={index === deck.length - 1}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
