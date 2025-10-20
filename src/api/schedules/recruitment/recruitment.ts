import type { Schedule, NewSchedule, TeamMember } from '../../../types/schedules/recruitment/recruitment'

const API_BASE_URL = 'http://localhost:8080/api'

async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (!response.ok) throw new Error(`API Error: ${response.statusText}`)
  return response.json()
}

// Schedule API
export const getSchedules = (params?: any): Promise<Schedule[]> => {
  const queryParams = new URLSearchParams()
  if (params) Object.entries(params).forEach(([key, value]) => { if (value) queryParams.append(key, String(value)) })
  const query = queryParams.toString()
  return fetchAPI<Schedule[]>(`/schedules${query ? `?${query}` : ''}`)
}

export const getScheduleById = (id: number): Promise<Schedule> => fetchAPI<Schedule>(`/schedules/${id}`)
export const createSchedule = (schedule: NewSchedule): Promise<Schedule> => fetchAPI<Schedule>('/schedules', { method: 'POST', body: JSON.stringify(schedule) })
export const updateSchedule = (id: number, schedule: Partial<NewSchedule>): Promise<Schedule> => fetchAPI<Schedule>(`/schedules/${id}`, { method: 'PUT', body: JSON.stringify(schedule) })
export const deleteSchedule = (id: number): Promise<void> => fetchAPI<void>(`/schedules/${id}`, { method: 'DELETE' })
export const shareSchedule = (scheduleId: number, memberIds: number[], permission: 'view' | 'edit'): Promise<void> => fetchAPI<void>(`/schedules/${scheduleId}/share`, { method: 'POST', body: JSON.stringify({ memberIds, permission }) })
export const shareMultipleSchedules = (scheduleIds: number[], memberIds: number[], permission: 'view' | 'edit', message?: string): Promise<void> => fetchAPI<void>('/schedules/share/bulk', { method: 'POST', body: JSON.stringify({ scheduleIds, memberIds, permission, message }) })

// Team API
export const getTeamMembers = (): Promise<TeamMember[]> => fetchAPI<TeamMember[]>('/team/members')
export const getTeamMemberById = (id: number): Promise<TeamMember> => fetchAPI<TeamMember>(`/team/members/${id}`)