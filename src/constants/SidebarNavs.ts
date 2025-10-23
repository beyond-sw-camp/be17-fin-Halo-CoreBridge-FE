import type { SidebarNavItem } from '@/types/common/SidebarNavItem'
import {
  Home,
  Users,
  Calendar,
  MessagesSquare,
  UserRoundSearch,
  LayoutList,
  Building2
} from 'lucide-vue-next'

export const recruiterNavs: SidebarNavItem[] = [
  {
    path: '/recruiter',
    label: '대시보드',
    icon: Home
  },
  {
    path: '/recruiter/jobs',
    label: '채용 관리',
    icon: UserRoundSearch
  },
  {
    path: '/recruiter/interviews',
    label: '면접 관리',
    icon: MessagesSquare,
    children: [
      {
        path: '/recruiter/interviews',
        label: '면접 목록',
        icon: LayoutList
      },
      {
        path: '/recruiter/interviews/interviewers',
        label: '면접관 관리',
        icon: Users
      },
      {
        path: '/recruiter/interviews/rooms',
        label: '면접실 관리',
        icon: Building2
      }
    ]
  },
  {
    path: '/recruiter/schedules',
    label: '일정 관리',
    icon: Calendar
  }
]

export const adminNavs: SidebarNavItem[] = [
  {
    path: '/admin/dashboard',
    label: '대시보드',
    icon: Home
  },
  {
    path: '/admin/users',
    label: '회원 관리',
    icon: Users
  }
]
