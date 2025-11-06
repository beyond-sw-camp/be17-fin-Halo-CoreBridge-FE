// ===== Schedule Types (API 응답 형식) =====

export interface ScheduleApiResponse {
  scheduleId: number
  scheduleType: ScheduleType
  candidateId?: number
  candidateName?: string
  title: string
  position?: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  location?: string
  priority: Priority
  status: ScheduleStatus
  interviewer?: string
  stage?: string
  notes?: string
  sharedUserIds?: number[]
  createdAt?: string
  updatedAt?: string
}

// ===== Schedule Types (프론트엔드 사용 형식) =====

export interface Schedule {
  id: number
  type: ScheduleType
  candidateId?: number
  candidateName?: string
  title: string
  position?: string
  date: string
  endDate: string
  time: string // "HH:MM - HH:MM" 형식
  location?: string
  priority: Priority
  status: ScheduleStatus
  interviewer?: string
  stage?: string
  notes?: string
  sharedWith?: number[]
}

// ===== Request Types =====

export interface CreateScheduleRequest {
  scheduleType: ScheduleType
  title: string
  candidateName?: string
  position?: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  location?: string
  priority: Priority
  interviewer?: string
  notes?: string
  status?: ScheduleStatus
}

export interface UpdateScheduleRequest {
  scheduleType?: ScheduleType
  title?: string
  candidateName?: string
  position?: string
  startDate?: string
  endDate?: string
  startTime?: string
  endTime?: string
  location?: string
  priority?: Priority
  interviewer?: string
  notes?: string
  status?: ScheduleStatus
}

// ===== Enums & Constants =====

export type ScheduleType = 
  | 'document_review'
  | 'interview_1'
  | 'interview_2'
  | 'interview_final'
  | 'negotiation'
  | 'onboarding_prep'
  | 'onboarding'
  | 'follow_up'
  | 'meeting'
  | 'event'

export type Priority = 'low' | 'medium' | 'high'

export type ScheduleStatus = 
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'postponed'

// ===== Team Member Types =====

export interface TeamMember {
  id: number
  name: string
  role: string
  department: string
  email: string
}

// ===== Share Types =====

export interface ShareScheduleRequest {
  schedules: number[]
  users: number[]
  permission?: 'view' | 'edit'
  message?: string
}

// ===== Recurring Types =====

export interface RecurringPattern {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
  interval: number
  daysOfWeek: number[] // 0=일요일, 6=토요일
  monthlyType: 'date' | 'day'
  endType: 'never' | 'date' | 'count'
  endDate?: string
  occurrences: number
}

export interface RecurringScheduleData {
  isRecurring: boolean
  recurring?: RecurringPattern
  // ... 기존 Schedule 필드들
}

// ===== Filter Types =====

export interface ScheduleFilters {
  type?: ScheduleType
  priority?: Priority
  status?: ScheduleStatus
  startDate?: string
  endDate?: string
  candidateName?: string
  interviewer?: string
}

// ===== Statistics Types =====

export interface ScheduleStats {
  totalSchedules: number
  byType: Record<ScheduleType, number>
  byPriority: Record<Priority, number>
  byStatus: Record<ScheduleStatus, number>
  thisWeek: number
  today: number
  urgent: number
  upcoming: number
}

// ===== Constants =====

export const SCHEDULE_TYPES = [
  { value: 'document_review', label: '서류 전형', icon: '📄', color: 'orange' },
  { value: 'interview_1', label: '1차 면접', icon: '💼', color: 'blue' },
  { value: 'interview_2', label: '2차 면접', icon: '👥', color: 'indigo' },
  { value: 'interview_final', label: '최종 면접', icon: '⭐', color: 'purple' },
  { value: 'negotiation', label: '처우 협상', icon: '💰', color: 'pink' },
  { value: 'onboarding_prep', label: '온보딩 준비', icon: '📋', color: 'teal' },
  { value: 'onboarding', label: '온보딩', icon: '🎉', color: 'green' },
  { value: 'follow_up', label: '사후 관리', icon: '📞', color: 'cyan' },
  { value: 'meeting', label: '팀 회의', icon: '🤝', color: 'yellow' },
  { value: 'event', label: '채용 이벤트', icon: '📅', color: 'emerald' }
] as const

export const PRIORITIES = [
  { value: 'low', label: '낮음', color: 'green' },
  { value: 'medium', label: '보통', color: 'yellow' },
  { value: 'high', label: '긴급', color: 'red' }
] as const

export const SCHEDULE_STATUSES = [
  { value: 'scheduled', label: '예정됨', color: 'blue' },
  { value: 'in_progress', label: '진행중', color: 'yellow' },
  { value: 'completed', label: '완료', color: 'green' },
  { value: 'cancelled', label: '취소됨', color: 'red' },
  { value: 'postponed', label: '연기됨', color: 'gray' }
] as const

// ===== Utility Functions =====

/**
 * API 응답 데이터를 프론트엔드 형식으로 변환
 */
export const transformApiToFrontend = (apiData: ScheduleApiResponse): Schedule => {
  return {
    id: apiData.scheduleId,
    type: apiData.scheduleType,
    candidateId: apiData.candidateId,
    candidateName: apiData.candidateName || apiData.title,
    title: apiData.title,
    position: apiData.position || '',
    date: apiData.startDate,
    endDate: apiData.endDate || apiData.startDate,
    time: `${apiData.startTime || '00:00'} - ${apiData.endTime || '23:59'}`,
    location: apiData.location || '',
    priority: apiData.priority || 'medium',
    status: apiData.status || 'scheduled',
    interviewer: apiData.interviewer || '',
    stage: apiData.stage || getScheduleTypeLabel(apiData.scheduleType),
    notes: apiData.notes || '',
    sharedWith: apiData.sharedUserIds || []
  }
}

/**
 * 프론트엔드 데이터를 API 요청 형식으로 변환
 */
export const transformFrontendToApi = (frontendData: any): CreateScheduleRequest => {
  return {
    scheduleType: frontendData.type,
    title: frontendData.title,
    candidateName: frontendData.candidateName || frontendData.title,
    position: frontendData.position || '',
    startDate: frontendData.startDate || frontendData.date,
    endDate: frontendData.endDate,
    startTime: frontendData.startTime || '00:00',
    endTime: frontendData.endTime || '23:59',
    location: frontendData.location || '',
    priority: frontendData.priority,
    interviewer: frontendData.interviewer || '',
    notes: frontendData.notes || '',
    status: frontendData.status || 'scheduled'
  }
}

/**
 * 일정 타입 라벨 조회
 */
export const getScheduleTypeLabel = (type: ScheduleType): string => {
  const found = SCHEDULE_TYPES.find(t => t.value === type)
  return found ? found.label : type
}

/**
 * 일정 타입 아이콘 조회
 */
export const getScheduleTypeIcon = (type: ScheduleType): string => {
  const found = SCHEDULE_TYPES.find(t => t.value === type)
  return found ? found.icon : '📅'
}

/**
 * 일정 타입 색상 조회
 */
export const getScheduleTypeColor = (type: ScheduleType): string => {
  const found = SCHEDULE_TYPES.find(t => t.value === type)
  return found ? found.color : 'gray'
}

/**
 * 우선순위 라벨 조회
 */
export const getPriorityLabel = (priority: Priority): string => {
  const found = PRIORITIES.find(p => p.value === priority)
  return found ? found.label : priority
}

/**
 * 우선순위 색상 조회
 */
export const getPriorityColor = (priority: Priority): string => {
  const found = PRIORITIES.find(p => p.value === priority)
  return found ? found.color : 'gray'
}

/**
 * 상태 라벨 조회
 */
export const getStatusLabel = (status: ScheduleStatus): string => {
  const found = SCHEDULE_STATUSES.find(s => s.value === status)
  return found ? found.label : status
}

/**
 * 상태 색상 조회
 */
export const getStatusColor = (status: ScheduleStatus): string => {
  const found = SCHEDULE_STATUSES.find(s => s.value === status)
  return found ? found.color : 'gray'
}

/**
 * 날짜 차이 계산 (일 단위)
 */
export const calculateDaysDifference = (startDate: string, endDate: string): number => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  return diff + 1
}

/**
 * 날짜 포맷 (YYYY-MM-DD)
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * 시간 포맷 (HH:MM)
 */
export const formatTime = (time: string): string => {
  if (!time) return '00:00'
  const [hours, minutes] = time.split(':')
  return `${hours.padStart(2, '0')}:${(minutes || '00').padStart(2, '0')}`
}

/**
 * 유효성 검증
 */
export const validateSchedule = (data: CreateScheduleRequest): string[] => {
  const errors: string[] = []

  if (!data.scheduleType) {
    errors.push('일정 유형을 선택해주세요.')
  }

  if (!data.title || data.title.trim().length < 2) {
    errors.push('제목은 2자 이상이어야 합니다.')
  }

  if (!data.startDate) {
    errors.push('시작일을 선택해주세요.')
  }

  if (!data.endDate) {
    errors.push('종료일을 선택해주세요.')
  }

  if (data.startDate && data.endDate && new Date(data.startDate) > new Date(data.endDate)) {
    errors.push('종료일은 시작일보다 이후여야 합니다.')
  }

  if (!data.priority) {
    errors.push('우선순위를 선택해주세요.')
  }

  return errors
}
