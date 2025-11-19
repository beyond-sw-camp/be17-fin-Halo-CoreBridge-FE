import api from '@/plugins/axiosInterceptor'
import type { EvaluationSaveForm, EvaluationTemplates } from '@/types/evaluation/Evaluation'

const requestEvaluationCompelete = async (req: EvaluationSaveForm): Promise<ApiResponse> => {
  let data: ApiResponse = {
    success: false,
    code: 0,
    message: '',
    results: undefined,
  }

  const url: string = '/api/interviewer/evaluation'

  await api
    .post(url, req)
    .then((res) => {
      data = res.data as ApiResponse
    })
    .catch((error) => {
      data = error.response.data as ApiResponse
    })

  return data
}

const requestEvaluationCriteriaData = async (): Promise<ApiResponse<EvaluationTemplates>> => {
  let data: ApiResponse<EvaluationTemplates> = {
    success: false,
    code: 0,
    message: '',
    results: {
      evaluationTemplates: [],
    },
  }

  const url: string = '/api/interviewer/evaluation-criteria'

  await api
    .get(url)
    .then((res) => {
      data = res.data as ApiResponse<EvaluationTemplates>
    })
    .catch((error) => {
      data = error.response.data as ApiResponse<EvaluationTemplates>
    })

  return data
}

export default {
  requestEvaluationCompelete,
  requestEvaluationCriteriaData,
}
