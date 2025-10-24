export interface NotificationItem {
  id: number
  type: 'application' | 'deadline' | 'interview' | 'system' | 'update' | 'success'
  title: string
  message: string
  timestamp: string
  read: boolean
  jobTitle?: string
  link?: string
  action?: { label: string; type: 'open_link' | 'view_application' | 'view_job' | 'view_schedule' | 'view_applicants' }
}