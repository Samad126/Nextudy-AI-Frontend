import { axiosPrivate } from "@/lib/api/client"
import { ApiSuccess, ApiQuestion, AnswerSource, ApiQuestionType, ApiQuestionDifficulty } from "@/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"

interface RegenerateQuestionInput {
  id: number
  regenerateFromScratch: boolean
  answerSource: AnswerSource
  questionType: ApiQuestionType
  difficulty?: ApiQuestionDifficulty
}

async function regenerateQuestion({ id, ...body }: RegenerateQuestionInput) {
  const { data } = await axiosPrivate.post<ApiSuccess<ApiQuestion>>(
    `/questions/${id}/regenerate`,
    body
  )
  return data.data
}

export function useRegenerateQuestion(workbenchId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: regenerateQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions", workbenchId] })
    },
  })
}
