import api from '@/plugins/axiosInterceptor'
import type {
  Interview,
  InterviewCreateForm,
  Interviewers,
  InterviewListResponse,
  InterviewParam,
} from '@/types/interview/interview'

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

const requestGetInterivews = async (
  req: InterviewParam,
): Promise<ApiResponse<InterviewListResponse>> => {
  let data: ApiResponse<InterviewListResponse> = {
    success: false,
    code: 0,
    message: '',
    results: {
      interviews: [],
      totalElements: 0,
      totalPages: 0,
      currentPage: 0,
    },
  }

  const url: string = '/api/recruiter/interviews'

  await api
    .get(url, {
      params: req,
    })
    .then((res) => {
      data = res.data as ApiResponse<InterviewListResponse>
    })
    .catch((error) => {
      data = error.response.data as ApiResponse<InterviewListResponse>
    })

  return data
}

const requestInterivew = async (req: number): Promise<ApiResponse<Interview>> => {
  let data: ApiResponse<Interview> = {
    success: false,
    code: 0,
    message: '',
    results: {
      id: 0,
      name: '',
      startDateTime: '',
      duration: '',
      process: '',
      interviewType: {
        code: '',
        label: '',
      },
      location: '',
      interviewStatus: {
        code: '',
        label: '',
      },
      description: '',
      interviewers: [],
    },
  }

  const url: string = '/api/recruiter/interviews/' + req

  await api
    .get(url)
    .then((res) => {
      data = res.data as ApiResponse<Interview>
    })
    .catch((error) => {
      data = error.response.data as ApiResponse<Interview>
    })

  return data
}

export default {
  requestInterviewersForInterviewCreate,
  requestAddInterview,
  requestGetInterivews,
  requestInterivew,
}
