import type { JobStatus } from '../../../types/schedules/jobposting/jobposting'

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  recruiting: '채용중',
  screening: '서류검토',
  interviewing: '면접중',
  closed: '마감',
  paused: '일시중단'
}

export const JOB_STATUS_COLORS: Record<JobStatus, string> = {
  recruiting: 'bg-green-100 text-green-700',
  screening: 'bg-blue-100 text-blue-700',
  interviewing: 'bg-purple-100 text-purple-700',
  closed: 'bg-gray-100 text-gray-700',
  paused: 'bg-yellow-100 text-yellow-700'
}

export const JOB_STATUS_BORDER_COLORS: Record<JobStatus, string> = {
  recruiting: 'border-green-500 bg-green-50',
  screening: 'border-blue-500 bg-blue-50',
  interviewing: 'border-purple-500 bg-purple-50',
  closed: 'border-gray-500 bg-gray-50',
  paused: 'border-yellow-500 bg-yellow-50'
}

export const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토']

export const getJobColorClass = (job: any) => {
  if (job.isUrgent || job.daysLeft <= 3) return 'bg-red-100 text-red-700 font-semibold'
  return JOB_STATUS_COLORS[job.status as JobStatus]
}

export const getJobBorderClass = (job: any) => {
  if (job.isUrgent || job.daysLeft <= 3) return 'border-red-500 bg-red-50'
  return JOB_STATUS_BORDER_COLORS[job.status as JobStatus]
}

export const getStatusClass = (status: JobStatus) => JOB_STATUS_COLORS[status]
export const getStatusLabel = (status: JobStatus) => JOB_STATUS_LABELS[status]

export const getProgressColor = (progress: number) => {
  if (progress >= 75) return 'bg-green-500'
  if (progress >= 50) return 'bg-blue-500'
  if (progress >= 25) return 'bg-yellow-500'
  return 'bg-gray-400'
}

export const getIconBgClass = (color: string) => {
  const classes: Record<string, string> = {
    blue: 'bg-blue-100', yellow: 'bg-yellow-100', red: 'bg-red-100',
    purple: 'bg-purple-100', green: 'bg-green-100'
  }
  return classes[color] || 'bg-gray-100'
}

export const getIconColorClass = (color: string) => {
  const classes: Record<string, string> = {
    blue: 'text-blue-600', yellow: 'text-yellow-600', red: 'text-red-600',
    purple: 'text-purple-600', green: 'text-green-600'
  }
  return classes[color] || 'text-gray-600'
}

export const getValueColorClass = (color: string, isAlert: boolean) => {
  if (isAlert) return 'text-red-600'
  const classes: Record<string, string> = {
    blue: 'text-blue-600', yellow: 'text-yellow-600', red: 'text-red-600',
    purple: 'text-purple-600', green: 'text-green-600'
  }
  return classes[color] || 'text-gray-900'
}