import { axiosPrivate } from "@/lib/api/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { flashcardKeys, type FlashcardSet } from "../types/flashcard"

interface DeleteFlashcardInput {
  setId: number
  cardId: number
}

async function deleteFlashcard({ setId, cardId }: DeleteFlashcardInput) {
  await axiosPrivate.delete(`/flashcard-sets/${setId}/cards/${cardId}`)
}

export function useDeleteFlashcard(setId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteFlashcard,
    onMutate: async ({ cardId }) => {
      await queryClient.cancelQueries({ queryKey: flashcardKeys.detail(setId) })
      const previous = queryClient.getQueryData(flashcardKeys.detail(setId))
      queryClient.setQueryData<FlashcardSet>(flashcardKeys.detail(setId), (old) => {
        if (!old) return old
        return { ...old, cards: old.cards.filter((c) => c.id !== cardId) }
      })
      return { previous }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(flashcardKeys.detail(setId), ctx.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: flashcardKeys.detail(setId) })
    },
  })
}
