import type { SidebarNavItem } from '@/types/common/SidebarNavItem'
import { Home, Users, BarChart3, Calendar, MessagesSquare, UserRoundSearch } from 'lucide-vue-next'

export const recruiterNavs: SidebarNavItem[] = [
  { path: '/recruiter', label: '대시보드', icon: Home },
  { path: '/recruiter/jobs', label: '채용 관리', icon: UserRoundSearch },
  { path: '/recruiter/applicants', label: '지원자 관리', icon: Users },
  { path: '/recruiter/interviews', label: '면접 관리', icon: MessagesSquare },
  { path: '/recruiter/calendar', label: '일정 관리', icon: Calendar },
  { path: '/recruiter/analytics', label: '통계 분석', icon: BarChart3 },
]

export const adminNavs: SidebarNavItem[] = [
  { path: '/admin/dashboard', label: '대시보드', icon: Home },
  { path: '/admin/users', label: '회원 관리', icon: Users },
]
