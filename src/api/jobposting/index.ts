import api from '@/plugins/axiosInterceptor'
import type {
  JobPostingCreateRequest,
  JobPostingPublicResponse,
} from '@/types/jobposting/JobPostingTypes'

// 부서 불러오기
export const getDepartment = async (): Promise<ApiResponse> => {
  let data: ApiResponse = {
    success: false,
    code: 0,
    message: '',
    results: undefined,
  }

  const url = `/api/department`

  await api
    .get(url)
    .then((res) => {
      console.log(res)
      data = res.data as ApiResponse
    })
    .catch((error) => {
      console.log(error)
      data = error.response.data as ApiResponse
    })

  return data
}

// ---- 공고 CRUD --------------------------------------------------------------
export const createJobPosting = async (payload: JobPostingCreateRequest): Promise<ApiResponse> => {
  let data: ApiResponse = {
    success: false,
    code: 0,
    message: '',
    results: undefined,
  }

  const url = '/api/job-postings'

  await api
    .post(url, payload)
    .then((res) => {
      console.log(res)
      data = res.data
    })
    .catch((error) => {
      console.log(error)
      data = error.response.data as ApiResponse
    })

  return data
}

export const getJobs = async (): Promise<ApiResponse> => {
  let data: ApiResponse = {
    success: false,
    code: 0,
    message: '',
    results: undefined,
  }

  const url = '/api/job-postings'

  await api
    .get(url)
    .then((res) => {
      console.log(res)
      data = res.data
    })
    .catch((error) => {
      console.log(error)
      data = error.response.data as ApiResponse
    })

  return data
}

export const getHeaderById = async (id: number): Promise<ApiResponse> => {
  let data: ApiResponse = {
    success: false,
    code: 0,
    message: '',
    results: undefined,
  }

  const url = `/api/job-postings/header/${id}`

  await api
    .get(url)
    .then((res) => {
      console.log(res)
      data = res.data
    })
    .catch((error) => {
      console.log(error)
      data = error.response.data as ApiResponse
    })

  return data
}

export const getJobById = async (id: number): Promise<ApiResponse> => {
  let data: ApiResponse = {
    success: false,
    code: 0,
    message: '',
    results: undefined,
  }

  const url = `/api/job-postings/${id}`

  await api
    .get(url)
    .then((res) => {
      console.log(res)
      data = res.data
    })
    .catch((error) => {
      console.log(error)
      data = error.response.data as ApiResponse
    })

  return data
}
export const getEditResponse = async (id: number): Promise<ApiResponse> => {
  let data: ApiResponse = {
    success: false,
    code: 0,
    message: '',
    results: undefined,
  }

  const url = `/api/job-postings/${id}/edit`

  await api
    .get(url)
    .then((res) => {
      console.log(res)
      data = res.data
    })
    .catch((error) => {
      console.log(error)
      data = error.response.data as ApiResponse
    })

  return data
}

export const updateJobPosting = async (id: number, payload: any): Promise<ApiResponse> => {
  let data: ApiResponse = {
    success: false,
    code: 0,
    message: '',
    results: undefined,
  }

  const url = `/api/job-postings/${id}`

  await api
    .patch(url, payload)
    .then((res) => {
      console.log(res)
      data = res.data as ApiResponse
    })
    .catch((error) => {
      console.log(error)
      data = error.response.data as ApiResponse
    })

  return data
}

export const getJobsPublic = async (): Promise<ApiResponse<JobPostingPublicResponse>> => {
  let data: ApiResponse<JobPostingPublicResponse> = {
    success: false,
    code: 0,
    message: '',
    results: {
      jobs: [],
    },
  }

  const url = `/api/jobs`

  await api
    .get(url)
    .then((res) => {
      console.log(res)
      data = res.data as ApiResponse<JobPostingPublicResponse>
    })
    .catch((error) => {
      console.log(error)
      data = error.response.data as ApiResponse<JobPostingPublicResponse>
    })

  return data
}

//  NEW: 자기소개서 질문 목록 조회
export const getCoverLetterTitles = async (jobPostingId: number): Promise<ApiResponse> => {
  let data: ApiResponse = {
    success: false,
    code: 0,
    message: '',
    results: undefined,
  }

  const url = `/api/jobposts/${jobPostingId}/applies/cover-letter-titles`

  await api
    .get(url)
    .then((res) => {
      console.log('자기소개서 질문 조회 성공:', res)
      data = {
        success: true,
        code: 200,
        message: 'success',
        results: res.data, // 🔥 백엔드에서 List를 직접 반환하므로 res.data를 그대로 사용
      }
    })
    .catch((error) => {
      console.log('자기소개서 질문 조회 실패:', error)
      data = (error.response?.data as ApiResponse) || {
        success: false,
        code: error.response?.status || 500,
        message: error.message,
        results: undefined,
      }
    })

  return data
}

export const deleteJobPosting = async (id: number): Promise<ApiResponse> => {
  let data: ApiResponse = {
    success: false,
    code: 0,
    message: '',
    results: undefined,
  }

  const url = `/api/job-postings/${id}`

  await api
    .delete(url)
    .then((res) => {
      console.log(res)
      data = res.data
    })
    .catch((error) => {
      console.log(error)
      data = error.response.data as ApiResponse
    })

  return data
}

export const searchJobPostings = async (keyword: string, page = 0): Promise<ApiResponse> => {
  let data: ApiResponse = {
    success: false,
    code: 0,
    message: '',
    results: undefined,
  }

  const url = `/api/job-postings/search`

  await api
    .get(url, {
      params: {
        keyword: keyword ? keyword : undefined,
        page: page,
        search_type: 'sql',
      },
    })
    .then((res) => {
      data = res.data
    })
    .catch((error) => {
      data = error.response.data as ApiResponse
    })

  return data
}
