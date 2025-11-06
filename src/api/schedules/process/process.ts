import api from '@/plugins/axiosInterceptor'

const BASE_URL = (jobPostingId: number) => `/api/recruiter/jobs/${jobPostingId}/schedules`

// ===== 기본 CRUD =====

/** 일정 목록 조회 */
export const getJobProcesses = async (
  jobPostingId: number,
  params?: Record<string, any>
): Promise<ApiResponse<any[]>> => {
  try {
    const res = await api.get(BASE_URL(jobPostingId), { params: params || {} })

    return res.data
  } catch (err: any) {
    return {
      success: false,
      code: err.response?.status || 500,
      message: '일정 목록을 불러오는데 실패했습니다.',
      results: []
    }
  }
}

/** 일정 상세 조회 */
export const getJobProcessById = async (
  jobPostingId: number,
  id: number
): Promise<ApiResponse<any>> => {
  try {
    const res = await api.get(`${BASE_URL(jobPostingId)}/${id}`)
    return res.data
  } catch (err: any) {
    return {
      success: false,
      code: err.response?.status || 500,
      message: '일정을 불러오는데 실패했습니다.',
      results: null
    }
  }
}

/** 일정 생성 */
export const createJobProcess = async (
  jobPostingId: number,
  payload: {
    scheduleType: string
    title: string
    candidateName?: string
    position?: string
    startDate: string
    endDate: string
    startTime: string
    endTime: string
    location?: string
    priority: string
    interviewer?: string
    notes?: string
    status?: string
    assignedTo: number
  }
): Promise<ApiResponse<any>> => {
  try {
    const res = await api.post(BASE_URL(jobPostingId), payload)
    return res.data
  } catch (err: any) {
    return {
      success: false,
      code: err.response?.status || 500,
      message: '일정 생성에 실패했습니다.',
      results: null
    }
  }
}

/** 일정 수정 */
export const updateJobProcess = async (
  jobPostingId: number,
  id: number,
  payload: Partial<{
    scheduleType: string
    title: string
    candidateName: string
    position: string
    startDate: string
    endDate: string
    startTime: string
    endTime: string
    location: string
    priority: string
    interviewer: string
    notes: string
    status: string
    assignedTo: number
  }>
): Promise<ApiResponse<any>> => {
  try {
    const res = await api.put(`${BASE_URL(jobPostingId)}/${id}`, payload)
    return res.data
  } catch (err: any) {
    return {
      success: false,
      code: err.response?.status || 500,
      message: '일정 수정에 실패했습니다.',
      results: null
    }
  }
}

/** 일정 삭제 */
export const deleteJobProcess = async (
  jobPostingId: number,
  id: number
): Promise<ApiResponse<void>> => {
  try {
    const res = await api.delete(`${BASE_URL(jobPostingId)}/${id}`)
    return res.data
  } catch (err: any) {
    return {
      success: false,
      code: err.response?.status || 500,
      message: '일정 삭제에 실패했습니다.',
      results: undefined
    }
  }
}

// ===== 공유 기능 =====

/** 단건 일정 공유 */
export const shareJobProcess = async (
  jobPostingId: number,
  scheduleId: number,
  userIds: number[]
): Promise<ApiResponse<void>> => {
  try {
    const res = await api.post(`${BASE_URL(jobPostingId)}/${scheduleId}/share`, { userIds })
    return res.data
  } catch (err: any) {
    return {
      success: false,
      code: err.response?.status || 500,
      message: '일정 공유에 실패했습니다.',
      results: undefined
    }
  }
}

/** 일정 상태 변경 */
export const updateJobProcessStatus = async (
  jobPostingId: number,
  id: number,
  status: string
): Promise<ApiResponse<any>> => {
  try {
    const res = await api.patch(`${BASE_URL(jobPostingId)}/${id}/status`, { status })
    return res.data
  } catch (err: any) {
    return {
      success: false,
      code: err.response?.status || 500,
      message: '상태 변경에 실패했습니다.',
      results: null
    }
  }
}

/** 여러 일정 공유 */
export const bulkShareJobProcess = async (
  jobPostingId: number,
  scheduleIds: number[],
  userIds: number[]
): Promise<ApiResponse<void>> => {
  try {
    const res = await api.post(`${BASE_URL(jobPostingId)}/bulk/share`, { scheduleIds, userIds })
    return res.data
  } catch (err: any) {
    return {
      success: false,
      code: err.response?.status || 500,
      message: '일정 일괄 공유에 실패했습니다.',
      results: undefined
    }
  }
}