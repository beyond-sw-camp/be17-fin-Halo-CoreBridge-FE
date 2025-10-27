import api from '@/plugins/AxiosInterceptor'
import type {
  RecruitProcessChangeOrderForm,
  RecruitProcessDeleteForm, RecruitProcessEditForm, RecruitProcessForm,
  RecruitProcessRequest,
  RecruitProcessResponse
} from '@/types/jobPosting/RecruitProcess.ts'

/**
 * 특정 채용의 채용 프로세스 요청 API
 * @param {RecruitProcessRequest} req - 요청 객체
 * @returns
 */
const requestRecruitProcesses = async (req: RecruitProcessRequest): Promise<ApiResponse<RecruitProcessResponse>> => {

  let data: ApiResponse<RecruitProcessResponse> = {
    success: false,
    code: 0,
    message: '',
    results: {
      recruitProcesses: []
    },
  }

  const url: string = '/api/recruiter/processes'

  await api
    .get(url, { params: req })
    .then((res) => {
      console.log(res)
      data = res.data as ApiResponse<RecruitProcessResponse>
    })
    .catch((error) => {
      console.log(error)
      data = error.response.data as ApiResponse<RecruitProcessResponse>
    })

  return data
}

/**
 * 채용 프로세스 순서 변경 요청 API
 * @param {RecruitProcessRequest} req - 요청 객체
 * @returns
 */
const requestRecruitProcessChangeOrder = async (req: RecruitProcessChangeOrderForm): Promise<ApiResponse<RecruitProcessResponse>> => {

  let data: ApiResponse<RecruitProcessResponse> = {
    success: false,
    code: 0,
    message: '',
    results: {
      recruitProcesses: []
    },
  }

  const url: string = '/api/recruiter/processes'

  await api
    .patch(url, req)
    .then((res) => {
      data = res.data as ApiResponse<RecruitProcessResponse>
    })
    .catch((error) => {
      data = error.response.data as ApiResponse<RecruitProcessResponse>
    })

  return data
}

/**
 * 채용 프로세스 추가 요청 API
 * @param {RecruitProcessForm} req - 요청 객체
 * @returns
 */
const requestRecruitProcessAdding = async (req: RecruitProcessForm): Promise<ApiResponse<RecruitProcessResponse>> => {

  let data: ApiResponse<RecruitProcessResponse> = {
    success: false,
    code: 0,
    message: '',
    results: {
      recruitProcesses: []
    },
  }

  const url: string = '/api/recruiter/processes'

  await api
    .post(url, req)
    .then((res) => {
      data = res.data as ApiResponse<RecruitProcessResponse>
    })
    .catch((error) => {
      data = error.response.data as ApiResponse<RecruitProcessResponse>
    })

  return data
}

/**
 * 채용 프로세스 수정 요청 API
 * @param {RecruitProcessForm} req - 요청 객체
 * @returns
 */
const requestUpdateRecruitProcess = async (req: RecruitProcessEditForm): Promise<ApiResponse<RecruitProcessResponse>> => {

  let data: ApiResponse<RecruitProcessResponse> = {
    success: false,
    code: 0,
    message: '',
    results: {
      recruitProcesses: []
    },
  }

  const url: string = '/api/recruiter/processes/' + req.id

  await api
    .patch(url, {
      name: req.name,
      colorCode: req.colorCode,
      jobPostingId: req.jobPostingId,
    })
    .then((res) => {
      data = res.data as ApiResponse<RecruitProcessResponse>
    })
    .catch((error) => {
      data = error.response.data as ApiResponse<RecruitProcessResponse>
    })

  return data
}

/**
 * 채용 프로세스 삭제 요청 API
 * @param {RecruitProcessForm} req - 요청 객체
 * @returns
 */
const requestDeleteRecruitProcess = async (req: RecruitProcessDeleteForm): Promise<ApiResponse<RecruitProcessResponse>> => {

  let data: ApiResponse<RecruitProcessResponse> = {
    success: false,
    code: 0,
    message: '',
    results: {
      recruitProcesses: []
    },
  }

  const url: string = '/api/recruiter/processes/' + req.id

  await api
    .delete(url)
    .then((res) => {
      data = res.data as ApiResponse<RecruitProcessResponse>
    })
    .catch((error) => {
      data = error.response.data as ApiResponse<RecruitProcessResponse>
    })

  return data
}

export default {
  requestRecruitProcesses,
  requestRecruitProcessChangeOrder,
  requestRecruitProcessAdding,
  requestUpdateRecruitProcess,
  requestDeleteRecruitProcess
}
