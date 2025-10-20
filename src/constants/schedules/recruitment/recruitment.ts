import type { ScheduleType } from '../../../types/schedules/recruitment/recruitment'
import { FileCheck, Briefcase, UserCheck, Handshake, FileText, GraduationCap, Heart, UsersRound, PartyPopper } from 'lucide-vue-next'

export const SCHEDULE_TYPE_LABELS: Record<ScheduleType, string> = {
  document_review: '서류전형', interview_1: '1차면접', interview_2: '2차면접', interview_final: '최종면접',
  negotiation: '처우협상', onboarding_prep: '온보딩준비', onboarding: '온보딩', follow_up: '사후관리',
  meeting: '회의', event: '이벤트'
}

export const SCHEDULE_TYPE_ICONS: Record<ScheduleType, any> = {
  document_review: FileCheck, interview_1: Briefcase, interview_2: Briefcase, interview_final: UserCheck,
  negotiation: Handshake, onboarding_prep: FileText, onboarding: GraduationCap, follow_up: Heart,
  meeting: UsersRound, event: PartyPopper
}

export const SCHEDULE_TYPE_COLORS: Record<ScheduleType, string> = {
  document_review: 'bg-orange-100 text-orange-700', interview_1: 'bg-blue-100 text-blue-700',
  interview_2: 'bg-indigo-100 text-indigo-700', interview_final: 'bg-purple-100 text-purple-700',
  negotiation: 'bg-pink-100 text-pink-700', onboarding_prep: 'bg-teal-100 text-teal-700',
  onboarding: 'bg-green-100 text-green-700', follow_up: 'bg-cyan-100 text-cyan-700',
  meeting: 'bg-yellow-100 text-yellow-700', event: 'bg-emerald-100 text-emerald-700'
}

export const SCHEDULE_TYPE_BORDER_COLORS: Record<ScheduleType, string> = {
  document_review: 'border-orange-500 bg-orange-50', interview_1: 'border-blue-500 bg-blue-50',
  interview_2: 'border-indigo-500 bg-indigo-50', interview_final: 'border-purple-500 bg-purple-50',
  negotiation: 'border-pink-500 bg-pink-50', onboarding_prep: 'border-teal-500 bg-teal-50',
  onboarding: 'border-green-500 bg-green-50', follow_up: 'border-cyan-500 bg-cyan-50',
  meeting: 'border-yellow-500 bg-yellow-50', event: 'border-emerald-500 bg-emerald-50'
}

export const POSITION_MAP: Record<string, string> = {
  frontend: '프론트엔드 개발자', backend: '백엔드 개발자', fullstack: '풀스택 개발자',
  designer: 'UX/UI 디자이너', pm: '프로덕트 매니저', marketing: '마케팅', sales: '영업'
}

export const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토']

// 유틸리티 함수들
export const getScheduleColorClass = (schedule: any) => {
  if (schedule.priority === 'high') return 'bg-red-100 text-red-700 font-semibold'
  return SCHEDULE_TYPE_COLORS[schedule.type as ScheduleType]
}

export const getScheduleBorderClass = (schedule: any) => {
  if (schedule.priority === 'high') return 'border-red-500 bg-red-50'
  return SCHEDULE_TYPE_BORDER_COLORS[schedule.type as ScheduleType]
}

export const getScheduleIcon = (type: ScheduleType) => SCHEDULE_TYPE_ICONS[type]
export const getScheduleTypeLabel = (type: ScheduleType) => SCHEDULE_TYPE_LABELS[type]

export const getIconBgClass = (color: string) => {
  const classes: Record<string, string> = { blue: 'bg-blue-100', yellow: 'bg-yellow-100', red: 'bg-red-100', purple: 'bg-purple-100', green: 'bg-green-100' }
  return classes[color] || 'bg-gray-100'
}

export const getIconColorClass = (color: string) => {
  const classes: Record<string, string> = { blue: 'text-blue-600', yellow: 'text-yellow-600', red: 'text-red-600', purple: 'text-purple-600', green: 'text-green-600' }
  return classes[color] || 'text-gray-600'
}

export const getValueColorClass = (color: string, isAlert: boolean) => {
  if (isAlert) return 'text-red-600'
  const classes: Record<string, string> = { blue: 'text-blue-600', yellow: 'text-yellow-600', red: 'text-red-600', purple: 'text-purple-600', green: 'text-green-600' }
  return classes[color] || 'text-gray-900'
}

export const calculateDaysDifference = (startDate: string, endDate: string): number => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
}

export const checkScheduleConflict = (schedules: any[], startDate: string, endDate: string): boolean => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0]
    if (schedules.some(s => s.date === dateStr)) return true
  }
  return false
}