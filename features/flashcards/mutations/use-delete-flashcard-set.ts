import { axiosPrivate } from "@/lib/api/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { flashcardKeys } from "../types/flashcard"

async function deleteFlashcardSet(id: number) {
  await axiosPrivate.delete(`/flashcard-sets/${id}`)
}

export function useDeleteFlashcardSet(workspaceId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteFlashcardSet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: flashcardKeys.all(workspaceId) })
    },
  })
}
