import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table"
import { Flashcard } from "../../types/flashcard"
import { CardRow } from "./CardRow"

interface CardsTabProps {
  cards: Flashcard[]
  setId: number
}

export function CardsTab({ cards, setId }: CardsTabProps) {
  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-2 text-center">
        <p className="text-sm text-muted-foreground">No cards remaining.</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8">#</TableHead>
            <TableHead>Question</TableHead>
            <TableHead>Answer</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead className="w-20">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cards.map((card, i) => (
            <CardRow key={card.id} card={card} index={i} setId={setId} />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
