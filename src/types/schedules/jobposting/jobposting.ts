export type JobStatus = 'recruiting' | 'screening' | 'interviewing' | 'closed' | 'paused'
export type Permission = 'view' | 'edit'

export interface Job {
  id: number
  title: string
  department: string
  experience: string
  type: string
  status: JobStatus
  postedDate: string
  deadline: string
  daysLeft: number
  applicants: number
  progress: number
  screening: number
  interview1: number
  interview2: number
  final: number
  isUrgent?: boolean
  sharedWith?: number[]
}

export interface CalendarDate {
  date: number | null
  isToday: boolean
  hasJobs: boolean
  jobs: Job[]
}

export interface Filters {
  status: string
  department: string
  experience: string
  type: string
}

export interface TeamMember {
  id: number
  name: string
  role: string
  department: string
  email: string
}

export interface ShareSettings {
  permission: Permission
  sendNotification: boolean
  message: string
}

export interface Statistic {
  label: string
  value: string
  icon: 'calendar' | 'clock' | 'alert' | 'users' | 'check'
  color: 'blue' | 'yellow' | 'red' | 'purple' | 'green'
  isAlert: boolean
}