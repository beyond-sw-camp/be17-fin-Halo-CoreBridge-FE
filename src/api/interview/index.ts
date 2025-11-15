import api from '@/plugins/axiosInterceptor'
import type { InterviewCreateForm, Interviewers } from '@/types/interview/interview'

const requestInterviewersForInterviewCreate = async (
  req: number,
): Promise<ApiResponse<Interviewers>> => {
  let data: ApiResponse<Interviewers> = {
    success: false,
    code: 0,
    message: '',
    results: {
      interviewers: [],
    },
  }

  const url: string = '/api/interviewers'

  await api
    .get(url, {
      params: {
        jobPostingId: req,
      },
    })
    .then((res) => {
      data = res.data as ApiResponse<Interviewers>
    })
    .catch((error) => {
      data = error.response.data as ApiResponse<Interviewers>
    })

  return data
}

const requestAddInterview = async (req: InterviewCreateForm): Promise<ApiResponse> => {
  let data: ApiResponse = {
    success: false,
    code: 0,
    message: '',
    results: undefined,
  }

  const url: string = '/api/recruiter/interviews'

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

export default {
  requestInterviewersForInterviewCreate,
  requestAddInterview,
}
