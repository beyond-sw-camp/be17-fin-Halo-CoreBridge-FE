export type ScheduleType = 'document_review' | 'interview_1' | 'interview_2' | 'interview_final' | 'negotiation' | 'onboarding_prep' | 'onboarding' | 'follow_up' | 'meeting' | 'event'
export type ScheduleStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
export type Priority = 'low' | 'medium' | 'high'
export type Permission = 'view' | 'edit'

export interface Schedule {
  id: number
  type: ScheduleType
  candidateId?: number
  candidateName?: string
  title?: string
  position: string
  startDate: string;
  endDate: string; 
  time?: string;
  startTime: string
  endTime?: string
  location: string
  priority: Priority
  status: ScheduleStatus
  interviewer?: string
  stage?: string
  notes?: string
  sharedWith?: number[]
}

export interface CalendarDate {
  date: number | null
  isToday: boolean
  hasSchedules: boolean
  schedules: Schedule[]
  dateString?: string
}

export interface TeamMember {
  id: number
  name: string
  role: string
  department: string
  email: string
}

export interface Filters {
  type: string
  position: string
  status: string
  date: string
  sharedWith: string
}

export interface NewSchedule {
  id?: number
  type: string
  candidateId: number | null
  candidateName: string
  title?: string
  position: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  location: string
  priority: string
  interviewer?: string
  stage?: string
  notes?: string
  isRecurring: boolean

  // ✅ 반복 설정 추가
  frequency?: 'DAILY' | 'WEEKLY' | 'MONTHLY'
  interval?: number
  endRecurringDate?: string

  createdBy: number | null
}


export interface ShareSettings {
  startDate: string | undefined;
  endDate: string | undefined;
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

export interface PipelineStage {
  name: string
  count: number
  color: string
}