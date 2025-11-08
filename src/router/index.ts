import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/useUserStore'
import { ROLES } from '@/constants/roles'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('@/views/auth/SignupView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
    },
    {
      path: '/password-reset',
      name: 'password-reset',
      component: () => import('@/views/auth/PasswordFindView.vue'),
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('@/views/auth/PasswordResetView.vue'),
      meta: {
        requiresToken: true,
      },
    },
    {
      path: '/email-find',
      name: 'email-find',
      component: () => import('@/views/auth/EmailFindView.vue'),
    },
    {
      path: '/admin',
      name: 'main',
      component: () => import('@/views/layout/DashboardLayout.vue'),
      meta: {
        requiresAuth: true,
        role: [ROLES.RECRUITER, ROLES.ADMIN],
      },
      children: [
        {
          path: '',
          name: 'admin-dashboard',
          component: () => import('@/views/recruiter/dashboard/RecruiterDashboardView.vue'),
        },
        {
          path: 'schedules',
          name: 'recruiter-schedules',
          component: () => import('@/views/recruiter/schedule/JobPostingSchedule.vue'),
        },
        {
          path: 'jobs',
          name: 'recruiter-jobs',
          component: () => import('@/views/recruiter/job/AllJobPostingListView.vue'),
        },
        {
          path: 'jobs/:id',
          name: 'recrutier-job-layout',
          component: () => import('@/views/layout/RecruiterJobLayout.vue'),
          children: [
            {
              path: '',
              name: 'recruiter-job-detail',
              component: () => import('@/views/recruiter/job/JobInfoView.vue'),
            },
            {
              path: 'manage',
              name: 'recruiter-job-manage',
              component: () => import('@/views/recruiter/job/JobApplicantManageView.vue'),
            },
            {
              path: 'applicants',
              name: 'recruiter-job-list',
              component: () => import('@/views/recruiter/job/JobApplicantListView.vue'),
            },
            {
              path: 'schedules',
              name: 'recruiter-job-schedule',
              component: () => import('@/views/recruiter/job/JobProcessSchedule.vue'),
            },
            {
              path: 'process',
              name: 'recruiter-job-processEdit',
              component: () => import('@/views/recruiter/job/JobProcessEditView.vue'),
            },
          ],
        },
        {
          path: 'interviews',
          name: 'recruiter-interview-layout',
          component: () => import('@/views/layout/InterviewLayout.vue'),
          children: [
            {
              path: '',
              name: 'recruiter-interviews',
              component: () => import('@/views/recruiter/interview/InterviewsView.vue'),
            },
            {
              path: 'interviewers',
              name: 'recruiter-interview-interviewers',
              component: () => import('@/views/recruiter/interview/InterviewerManagementView.vue'),
            },
            {
              path: 'rooms',
              name: 'recruiter-interview-rooms',
              component: () => import('@/views/recruiter/interview/RoomManagementView.vue'),
            },
          ],
        },
      ],
    },

    // 채용생성 및 지원 리스트
    {
      path: '/job-posting/create',
      name: 'jobPostingCreate',
      component: () => import('@/views/jobposting/JobCreateView.vue'),
      meta: {
        role: [ROLES.RECRUITER, ROLES.ADMIN],
      },
    },
    {
      path: '/job-posting/:id/edit',
      name: 'jobPostingEdit',
      component: () => import('@/views/jobposting/JobEditView.vue'),
      meta: {
        role: [ROLES.RECRUITER, ROLES.ADMIN],
      },
    },
    {
      path: '/jobs',
      name: 'jobs',
      component: () => import('@/views/jobposting/JobList.vue'),
    },
    {
      path: '/jobs/:id',
      name: 'jobPostingDetailListForApplicant',
      component: () => import('@/views/jobposting/JobDetailForApplicant.vue'),
    },
    {
      path: '/jobposts/:jobpostId/applies',
      name: 'resumelayout',
      component: () => import('@/views/layout/ResumeTopLayout.vue'),
      meta: {
        requiresAuth: true,
      },
      props: true, //
      children: [
        {
          path: '',
          name: 'resume',
          component: () => import('@/views/resume/ResumeView.vue'),
        },
      ],
    },
    {
      path: '/jobposts/:jobpostId/applies/:resumeId',
      name: 'applicantdetail',
      component: () => import('@/views/applicantdetail/ApplicantDetailView.vue'),
      meta: {
        requiresAuth: true,
        role: [ROLES.ADMIN, ROLES.RECRUITER, ROLES.INTERVIEWER],
      },
      props: true,
      children: [
        {
          path: '',
          name: 'applicantdetailside',
          component: () => import('@/components/applicant/ApplicantSidebar.vue'),
        },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const requiresToken = to.matched.some((record) => record.meta.requiresToken)
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const roles = to.matched.find((r) => r.meta.role)?.meta.role

  const userRole = userStore.userInfo.role
  const isLogin = userStore.isLogin

  // 로그인 필요한 페이지인데 로그인 안 된 경우
  if (requiresAuth && !isLogin) {
    alert('로그인이 필요합니다.')
    return next('/login')
  }

  // 비밀번호 재설정 페이지에서는 토큰이 필요
  if (requiresToken) {
    const token = to.query.token
    if (!token) {
      next('/login')
    }
  }

  // 라우터 주소의 권한이 로그인한 사용자의 권한에 맞는 지 체크
  if (roles) {
    const allowedRoles = Array.isArray(roles) ? roles : [roles]

    if (!allowedRoles.includes(userRole)) {
      alert('접근 권한이 없습니다.')
      return next('/')
    }
  }

  // '/' 접근 시 역할별 리다이렉트
  if (to.path === '/') {
    if (userRole === ROLES.ADMIN || userRole === ROLES.RECRUITER) {
      return next('/admin')
    }

    if (userRole === ROLES.INTERVIEWER) {
      return next('/interviewer')
    }

    // 지원자 or 비로그인
    return next('/jobs')
  }

  next()
})

export default router
