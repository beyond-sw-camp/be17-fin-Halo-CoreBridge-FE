import api from '@/plugins/axiosInterceptor'
import type {
  JobPostingCreateForm,
  JobPostingDetail,
  JobPostingSummary,
} from '@/types/jobPosting/JobPostingTypes'

/**
 * 채용공고 등록 API
 * @param {JobPostingCreateForm} req - 등록할 공고 데이터
 * @returns {Promise<ApiResponse>}
 */
const createJobPosting = async (req: JobPostingCreateForm): Promise<ApiResponse> => {
  let data: ApiResponse = {
    success: false,
    code: 0,
    message: '',
    results: undefined,
  }

  const url: string = '/api/jobPostings'

  await api
    .post(url, req)
    .then((res) => {
      data = res.data as ApiResponse
    })
    .catch((error) => {
      data = error.response?.data as ApiResponse
    })

  return data
}

/**
 * 채용공고 전체 조회 API
 * @returns {Promise<ApiResponse<JobPostingSummary[]>>}
 */
const fetchJobPostings = async (): Promise<ApiResponse<JobPostingSummary[]>> => {
  let data: ApiResponse<JobPostingSummary[]> = {
    success: false,
    code: 0,
    message: '',
    results: undefined,
  }

  const url: string = '/api/jobPostings'

  await api
    .get(url)
    .then((res) => {
      data = res.data as ApiResponse<JobPostingSummary[]>
    })
    .catch((error) => {
      data = error.response?.data as ApiResponse<JobPostingSummary[]>
    })

  return data
}

/**
 * 채용공고 상세 조회 API
 * @param {number} id - 공고 ID
 * @returns {Promise<ApiResponse<JobPostingDetail>>}
 */
const fetchJobPostingDetail = async (id: number): Promise<ApiResponse<JobPostingDetail>> => {
  let data: ApiResponse<JobPostingDetail> = {
    success: false,
    code: 0,
    message: '',
    results: undefined,
  }

  const url: string = `/api/jobPostings/${id}`

  await api
    .get(url)
    .then((res) => {
      data = res.data as ApiResponse<JobPostingDetail>
    })
    .catch((error) => {
      data = error.response?.data as ApiResponse<JobPostingDetail>
    })

  return data
}

/**
 * 채용공고 수정 API
 * @param {number} id - 수정할 공고 ID
 * @param {JobPostingCreateForm} req - 수정할 데이터
 * @returns {Promise<ApiResponse>}
 */
const updateJobPosting = async (id: number, req: JobPostingCreateForm): Promise<ApiResponse> => {
  let data: ApiResponse = {
    success: false,
    code: 0,
    message: '',
    results: undefined,
  }

  const url: string = `/api/jobPostings/${id}`

  await api
    .patch(url, req)
    .then((res) => {
      data = res.data as ApiResponse
    })
    .catch((error) => {
      data = error.response?.data as ApiResponse
    })

  return data
}

/**
 * 채용공고 삭제 API
 * @param {number} id - 삭제할 공고 ID
 * @returns {Promise<ApiResponse>}
 */
const deleteJobPosting = async (id: number): Promise<ApiResponse> => {
  let data: ApiResponse = {
    success: false,
    code: 0,
    message: '',
    results: undefined,
  }

  const url: string = `/api/jobPostings/${id}`

  await api
    .delete(url)
    .then((res) => {
      data = res.data as ApiResponse
    })
    .catch((error) => {
      data = error.response?.data as ApiResponse
    })

  return data
}

export default {
  createJobPosting,
  fetchJobPostings,
  fetchJobPostingDetail,
  updateJobPosting,
  deleteJobPosting,
}
