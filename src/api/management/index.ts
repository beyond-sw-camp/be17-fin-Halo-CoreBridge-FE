import api from '@/plugins/AxiosInterceptor'

// -------------------------
// Types
// -------------------------


// 특정 채용공고의 Management 보드 데이터 조회
const getManagementBoard = async (jobPostingId: number): Promise<ApiResponse> => {
  let data: ApiResponse = {
    success: false,
    code: 0,
    message: '',
    results: undefined
  }

  const url = `/api/jobs/${jobPostingId}/management`

  await api
    .get(url, { params: { jobPostingId } })
    .then((res) => {
      data = res.data
    })
    .catch((error) => {
      data = error.response.data as ApiResponse
    })

  return data
}

// 이력서의 단계를 변경
const updateApplicantStage = async (
  jobPostingId: number,
  resumeId: number,
  processId: number
): Promise<ApiResponse> => {
  let data: ApiResponse = {
    success: false,
    code: 0,
    message: '',
    results: undefined,
  }

  const url = `/api/jobs/${jobPostingId}/management/${resumeId}/process/${processId}`

  try {
    const res = await api.patch(url)
    data = res.data
  } catch (error: any) {
    data = error.response.data as ApiResponse
  }

  return data
}

export default {
  getManagementBoard,
  updateApplicantStage
}