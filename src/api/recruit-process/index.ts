import api from '@/plugins/AxiosInterceptor'
import type {
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

export default {
  requestRecruitProcesses,
}
