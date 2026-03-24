import { axiosPrivate } from "@/lib/api/client"
import { ApiSuccess } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { FlashcardSet, flashcardKeys } from "../types/flashcard"

async function getFlashcardSet(id: number) {
  const { data } = await axiosPrivate.get<ApiSuccess<FlashcardSet>>(`/flashcard-sets/${id}`)
  return data.data
}

export function useGetFlashcardSet(id: number) {
  return useQuery({
    queryKey: flashcardKeys.detail(id),
    queryFn: () => getFlashcardSet(id),
  })
}
