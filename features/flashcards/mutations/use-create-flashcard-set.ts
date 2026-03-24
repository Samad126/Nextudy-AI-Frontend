import { axiosPrivate } from "@/lib/api/client"
import { ApiSuccess } from "@/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { FlashcardSet, flashcardKeys, Difficulty } from "../types/flashcard"

export interface CreateFlashcardSetInput {
  workspaceId: number
  title: string
  description?: string
  difficulty?: Difficulty
  count?: number
  resourceIds: number[]
}

async function createFlashcardSet(input: CreateFlashcardSetInput) {
  const { data } = await axiosPrivate.post<ApiSuccess<FlashcardSet>>("/flashcard-sets", input)
  return data.data
}

export function useCreateFlashcardSet(workspaceId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createFlashcardSet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: flashcardKeys.all(workspaceId) })
    },
  })
}
