import { axiosPrivate } from "@/lib/api/client"
import { ApiSuccess } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { FlashcardSetSummary, flashcardKeys } from "../types/flashcard"

async function getFlashcardSets(workspaceId: number) {
  const { data } = await axiosPrivate.get<ApiSuccess<FlashcardSetSummary[]>>("/flashcard-sets", {
    params: { workspaceId },
  })
  return data.data
}

export function useGetFlashcardSets(workspaceId: number) {
  return useQuery({
    queryKey: flashcardKeys.all(workspaceId),
    queryFn: () => getFlashcardSets(workspaceId),
  })
}
