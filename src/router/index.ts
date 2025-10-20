import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('@/views/auth/SignupView.vue'),
    },
    {
      path: '/recruiter',
      name: 'main',
      component: () => import('@/views/layout/DashboardLayout.vue'),
      children: [
        {
          path: '',
          name: 'recruiter-dashboard',
          component: () => import('@/views/recruiter/dashboard/RecruiterDashboardView.vue'),
        },
        {
          path: 'all-job-posting',
          name: 'recruiter-all-job-posting',
          component: () => import('@/views/recruiter/Job/AllJobPostingListView.vue')
        },
        {
          path: 'jobs',
          name: 'recruiter-job-layout',
          component: () => import('@/views/layout/RecruiterJobLayout.vue'),
          children: [
            {
              path: 'info',
              name: 'recruiter-job-info',
              component: () => import('@/views/recruiter/Job/JobInfoView.vue')
            },
            {
              path: 'job-applicant-kanban',
              name: 'recruiter-job-kanban',
              component: () => import('@/views/recruiter/Job/JobApplicantKanban.vue')
            },
            {
              path: 'job-applicant-list',
              name: 'recruiter-job-list',
              component: () => import('@/views/recruiter/Job/JobApplicantListView.vue')
            },
            {
              path: 'job-schedule',
              name: 'recruiter-job-schedule',
              component: () => import('@/views/recruiter/Job/JobScheduleView.vue')
            },
            {
              path: 'job-process-edit',
              name: 'recruiter-job-processEdit',
              component: () => import('@/views/recruiter/Job/JobProcessEditView.vue')
            }
          ],
        },
      ],
    },

    // 채용생성 및 지원 리스트

    {
      path: '/job-posting/create',
      name: 'jobPostingCreate',
      component: () => import('@/views/job-posting/JobPostingCreateView.vue'),
    },
    {
      path: '/job-posting/detail-list',
      name: 'jobPostingDetailList',
      component: () => import('@/views/job-posting/JobDetailForApplicant.vue')
    },
    {
      path: '/job-posting/qwer',
      name: 'aaa',
      component: () => import('@/views/recruiter/Job/JobScheduleView.vue')
    },


    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/layout/DashboardLayout.vue'),
      children: [
        {
          path: '',
          name: 'admin-dashboard',
          component: () => import('@/views/admin/AdminMainView.vue'),
        },
      ],
    },

    {
      path: '/resume',
      name: 'resumelayout',
      component: () => import('@/views/layout/ResumeTopLayout.vue'),
      children: [
        {
          path: '',
          name: 'resume',
          component: () => import('@/views/resume/ResumeView.vue'),
        },
      ],

    },
    {
      path: '/applicantlist',
      name: 'applicantlist',
      component: () => import('@/views/ApplicantList/ApplicantListView.vue')
    },
    {
      path: '/applicnatdetail',
      name: 'applicantdetail',
      component: () => import('@/views/applicantdetail/ApplicantDetailView.vue'),
      children: [
        {
          path: '',
          name: 'applicantdetailside',
          component: () => import('@/components/Applicant/ApplicantSidebar.vue'),
        },
      ]
    },
  ],
})

export default router
