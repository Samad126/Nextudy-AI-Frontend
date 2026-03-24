import { axiosPrivate } from "@/lib/api/client"
import { ApiSuccess } from "@/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Flashcard, flashcardKeys, Difficulty } from "../types/flashcard"

export interface UpdateFlashcardInput {
  setId: number
  cardId: number
  question?: string
  answer?: string
  difficulty?: Difficulty
}

async function updateFlashcard({ setId, cardId, ...body }: UpdateFlashcardInput) {
  const { data } = await axiosPrivate.patch<ApiSuccess<Flashcard>>(
    `/flashcard-sets/${setId}/cards/${cardId}`,
    body
  )
  return data.data
}

export function useUpdateFlashcard(setId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateFlashcard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: flashcardKeys.detail(setId) })
    },
  })
}
