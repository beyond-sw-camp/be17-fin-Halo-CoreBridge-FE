import api from '@/plugins/AxiosInterceptor'

/**
 * 채용 공고 스케줄 생성
 */
export const createJobPostingSchedule = async (data: any) => {
  const response = await api.post('/api/schedules/jobpostings', data)
  return response.data?.results // ✅ result만 반환
}

/**
 * 채용 공고 스케줄 전체 조회
 */
export const getJobPostingSchedules = async () => {
  const response = await api.get('/api/schedules/jobpostings')
  return response.data?.results || [] // ✅ 배열 반환 보장
}

/**
 * 채용 공고 스케줄 상세 조회
 */
export const getJobPostingScheduleById = async (id: number) => {
  const response = await api.get(`/api/schedules/jobpostings/${id}`)
  return response.data?.results
}

/**
 * 채용 공고 스케줄 수정
 */
export const updateJobPostingSchedule = async (id: number, data: any) => {
  const response = await api.put(`/api/schedules/jobpostings/${id}`, data)
  return response.data?.results
}

/**
 * 채용 공고 스케줄 삭제
 */
export const deleteJobPostingSchedule = async (id: number) => {
  const response = await api.delete(`/api/schedules/jobpostings/${id}`)
  return response.data?.result
}

/**
 * 채용 공고 공유
 */
export const shareJobPostingSchedule = async (id: number, userIds: number[]) => {
  const response = await api.post(`/api/schedules/jobpostings/${id}/share`, { userIds })
  return response.data?.results
}

/**
 * 캘린더 데이터 조회
 */
export const getJobPostingCalendar = async (year: number, month: number) => {
  const response = await api.get(`/api/schedules/jobpostings/calendar`, {
    params: { year, month }
  })
  return response.data?.results
}