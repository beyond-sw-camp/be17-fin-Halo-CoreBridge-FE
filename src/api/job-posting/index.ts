import api from '@/plugins/AxiosInterceptor'
import type { JobPostingCreateRequest,} from '@/types/jobPosting/JobPostingTypes'

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
