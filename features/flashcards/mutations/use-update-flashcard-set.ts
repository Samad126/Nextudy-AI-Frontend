import { axiosPrivate } from "@/lib/api/client"
import { ApiSuccess } from "@/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { FlashcardSet, flashcardKeys } from "../types/flashcard"

export interface UpdateFlashcardSetInput {
  id: number
  title?: string
  description?: string
}

async function updateFlashcardSet({ id, ...body }: UpdateFlashcardSetInput) {
  const { data } = await axiosPrivate.patch<ApiSuccess<FlashcardSet>>(`/flashcard-sets/${id}`, body)
  return data.data
}

export function useUpdateFlashcardSet(workspaceId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateFlashcardSet,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: flashcardKeys.detail(data.id) })
      queryClient.invalidateQueries({ queryKey: flashcardKeys.all(workspaceId) })
    },
  })
}
