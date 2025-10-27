import api from '@/plugins/AxiosInterceptor'
import type { Job, JobPostingSchedule } from '../../../types/schedules/jobposting/jobposting'
import type { JobPostingCreateRequest, JobPostingDetail } from '@/types/jobPosting/JobPostingTypes'

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

export const getJobs = async (params?: Record<string, any>): Promise<Job[]> => {
  const res = await api.get<ApiResponse<Job[]>>('/jobs', { params })
  return res.data.results
}

export const getJobById = async (id: number): Promise<Job> => {
  const res = await api.get<ApiResponse<Job>>(`/jobs/${id}`)
  return res.data.results
}

export const updateJob = async (id: number, job: Partial<Job>): Promise<Job> => {
  const res = await api.put<ApiResponse<Job>>(`/jobs/${id}`, job)
  return res.data.results
}

export const deleteJob = async (id: number): Promise<void> => {
  await api.delete(`/jobs/${id}`)
}

*/

// ---- 공고 일정 (JobPostingSchedule) ----------------------------------------

// 전체 일정 조회 ( /recruiter/schedules 달력 화면에서 사용 )
export const getAllSchedules = async (): Promise<JobPostingSchedule[]> => {
  const res = await api.get<ApiResponse<JobPostingSchedule[]>>('/api/schedule/jobposting')
  return res.data.results
}

// 공고별 일정 조회 ( /recruiter/jobs/:id/schedule 화면에서 사용 )
export const getSchedulesByJobPosting = async (jobPostingId: number): Promise<JobPostingSchedule[]> => {
  const res = await api.get<ApiResponse<JobPostingSchedule[]>>(
    `/schedule/jobposting/job-postings/${jobPostingId}`
  )
  return res.data.results
}

/**
 * 채용 공고 스케줄 생성
 */
export const createJobPostingSchedule = async (data: any) => {
  const response = await api.post('/api/schedules/jobpostings', data)
  return response.data?.results // result만 반환
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
 * 채용 공고 스케줄 전체 조회
 */
export const getJobPostingSchedules = async () => {
  const response = await api.get('/api/schedules/jobpostings')
  return response.data?.results || [] // 배열 반환 보장
}

/**
 * 채용 공고 스케줄 상세 조회
 */
export const getJobPostingScheduleById = async (id: number) => {
  const response = await api.get(`/api/schedules/jobpostings/${id}`)
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
