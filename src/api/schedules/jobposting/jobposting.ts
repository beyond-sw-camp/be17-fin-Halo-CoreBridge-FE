// src/api/jobposting.ts
import api from '../../../plugins/AxiosInterceptor'
import type { Job, JobPostingSchedule } from '../../../types/schedules/jobposting/jobposting'
import type { JobPostingCreateRequest, JobPostingDetailResponse } from '@/types/jobPosting/JobPostingTypes'

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

export const updateJob = async (id: number, job: Partial<Job>): Promise<Job> => {
  const res = await api.put<ApiResponse<Job>>(`/jobs/${id}`, job)
  return res.data.results
}

export const deleteJob = async (id: number): Promise<void> => {
  await api.delete(`/jobs/${id}`)
}

// ---- 공유(share) 기능 (UI 유지, API 비활성) ---------------------------------
export const SHARE_API_ENABLED = false
/*
// (백엔드 준비되면 주석 해제)
export const shareJob = async (
  jobId: number,
  memberIds: number[],
  permission: 'view' | 'edit'
): Promise<void> => {
  const res = await api.post<ApiResponse<void>>(`/jobs/${jobId}/share`, { memberIds, permission })
  return res.data.results
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

// 일정 등록
export const createJobPostingSchedule = async (
  payload: Partial<JobPostingSchedule> & { jobPostingId: number; startDate: string; endDate?: string }
): Promise<JobPostingSchedule> => {
  const res = await api.post<ApiResponse<JobPostingSchedule>>('/api/schedule/jobposting', payload)
  return res.data.results
}

// 일정 수정
export const updateJobPostingSchedule = async (
  scheduleId: number,
  payload: Partial<JobPostingSchedule>
): Promise<JobPostingSchedule> => {
  const res = await api.put<ApiResponse<JobPostingSchedule>>(`/schedule/jobposting/${scheduleId}`, payload)
  return res.data.results
}

// 일정 삭제
export const deleteJobPostingSchedule = async (scheduleId: number): Promise<void> => {
  await api.delete(`/schedule/jobposting/${scheduleId}`)
}
