import { axiosPrivate } from "@/lib/api/client"
import { ApiSuccess, ApiQuestion, ApiQuestionDifficulty } from "@/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"

interface UpdateQuestionInput {
  id: number
  title?: string
  difficulty?: ApiQuestionDifficulty
  explanation?: string
  mcqChoices?: { id?: number; choice_text?: string; choice_order?: number; is_correct?: boolean }[]
  sample_answer?: string
  gradingKeywords?: { id?: number; keyword?: string; weight?: number; is_required?: boolean }[]
}

async function updateQuestion({ id, ...body }: UpdateQuestionInput) {
  const { data } = await axiosPrivate.patch<ApiSuccess<ApiQuestion>>(`/questions/${id}`, body)
  return data.data
}

export function useUpdateQuestion(workbenchId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions", workbenchId] })
    },
  })
}
