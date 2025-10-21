import type { Job } from '../../../types/schedules/jobposting/jobposting'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (!response.ok) throw new Error(`API Error: ${response.statusText}`)
  return response.json()
}

export const getJobs = (params?: any): Promise<Job[]> => {
  const queryParams = new URLSearchParams()
  if (params) Object.entries(params).forEach(([key, value]) => { if (value) queryParams.append(key, String(value)) })
  const query = queryParams.toString()
  return fetchAPI<Job[]>(`/jobs${query ? `?${query}` : ''}`)
}

export const getJobById = (id: number): Promise<Job> => fetchAPI<Job>(`/jobs/${id}`)
export const createJob = (job: Partial<Job>): Promise<Job> => fetchAPI<Job>('/jobs', { method: 'POST', body: JSON.stringify(job) })
export const updateJob = (id: number, job: Partial<Job>): Promise<Job> => fetchAPI<Job>(`/jobs/${id}`, { method: 'PUT', body: JSON.stringify(job) })
export const deleteJob = (id: number): Promise<void> => fetchAPI<void>(`/jobs/${id}`, { method: 'DELETE' })
export const shareJob = (jobId: number, memberIds: number[], permission: 'view' | 'edit'): Promise<void> => fetchAPI<void>(`/jobs/${jobId}/share`, { method: 'POST', body: JSON.stringify({ memberIds, permission }) })
export const shareMultipleJobs = (jobIds: number[], memberIds: number[], permission: 'view' | 'edit', message?: string): Promise<void> => fetchAPI<void>('/jobs/share/bulk', { method: 'POST', body: JSON.stringify({ jobIds, memberIds, permission, message }) })