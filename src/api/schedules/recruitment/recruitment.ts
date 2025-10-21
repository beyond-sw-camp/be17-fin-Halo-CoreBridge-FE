import type { Schedule, NewSchedule, TeamMember } from '../../../types/schedules/recruitment/recruitment'
import api from '@/plugins/AxiosInterceptor'

const API_BASE_URL = 'http://localhost:8080/api'

// Schedule API
export const getSchedules = (params?: any): Promise<ApiResponse<Schedule[]>> => {
  return api.get<ApiResponse<Schedule[]>>('/api/schedules', { params }).then(res => res.data)
}

export const getScheduleById = (id: number): Promise<Schedule> => {
  return api.get<Schedule>(`/schedules/${id}`).then(res => res.data)
}

export const createSchedule = (schedule: NewSchedule): Promise<ApiResponse<Schedule>> => {
  return api.post<ApiResponse<Schedule>>('/api/schedules', schedule).then(res => res.data)
}



export const updateSchedule = (id: number, schedule: Partial<NewSchedule>): Promise<ApiResponse<Schedule>> => {
  return api.put<ApiResponse<Schedule>>(`/schedules/${id}`, schedule).then(res => res.data)
}

export const deleteSchedule = (id: number): Promise<void> => {
  return api.delete(`/schedules/${id}`).then(() => {})
}

export const setRecurringRule = (scheduleId: number, rule: any) => {
  return api.post(`/schedules/${scheduleId}/recurring-rule`, rule)
}



export const shareSchedule = (
  scheduleId: number,
  memberIds: number[],
  permission: 'view' | 'edit'
): Promise<void> => {
  return api.post(`/schedules/${scheduleId}/share`, { memberIds, permission }).then(() => {})
}

export const shareMultipleSchedules = (
  scheduleIds: number[],
  memberIds: number[],
  permission: 'view' | 'edit',
  message?: string
): Promise<void> => {
  return api.post('/schedules/share/bulk', { scheduleIds, memberIds, permission, message }).then(() => {})
}

// Team API
export const getTeamMembers = (): Promise<TeamMember[]> => {
  return api.get<TeamMember[]>('/team/members').then(res => res.data)
}

export const getTeamMemberById = (id: number): Promise<TeamMember> => {
  return api.get<TeamMember>(`/team/members/${id}`).then(res => res.data)
}