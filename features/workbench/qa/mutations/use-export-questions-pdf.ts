import { axiosPrivate } from "@/lib/api/client"
import { useMutation } from "@tanstack/react-query"
import { trackQAExported } from "@/lib/analytics"

async function exportQuestionsPdf(workbenchId: number): Promise<void> {
  const response = await axiosPrivate.get(`/questions/export/pdf`, {
    params: { workbenchId },
    responseType: "blob",
  })

  const blob = new Blob([response.data], { type: "application/pdf" })
  const url = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = `questions-${workbenchId}.pdf`
  a.click()

  URL.revokeObjectURL(url)
}

export function useExportQuestionsPdf(workbenchId: number) {
  return useMutation({
    mutationFn: () => exportQuestionsPdf(workbenchId),
    onSuccess: () => trackQAExported("pdf"),
  })
}
