import type { SidebarNavItem } from '@/types/common/SidebarNavItem'
import { Home, Calendar, MessagesSquare, UserRoundSearch, UserRoundCog } from 'lucide-vue-next'

export const navs: SidebarNavItem[] = [
  {
    path: '/admin',
    label: '대시보드',
    icon: Home,
    role: ['관리자', '채용 담당자'],
  },
  {
    path: '/admin/jobs',
    label: '채용 관리',
    icon: UserRoundSearch,
    role: ['관리자', '채용 담당자'],
  },
  {
    path: '/admin/interviews',
    label: '면접 관리',
    icon: MessagesSquare,
    role: ['관리자', '채용 담당자', '면접관'],
  },
  {
    path: '/admin/schedules',
    label: '일정 관리',
    icon: Calendar,
    role: ['관리자', '채용 담당자'],
  },
  {
    path: '/admin/accounts',
    label: '계정 관리',
    icon: UserRoundCog,
    role: ['관리자'],
  },
]
