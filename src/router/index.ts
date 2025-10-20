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
      component: () => import('@/views/Layout/DashboardLayout.vue'),
      children: [
        // {
        //   path: '',
        //   name: 'recruiter-dashboard',
        //   component: () => import('@/views/Dashboard/RecruiterDashboadView.vue'),
        // },
        // ✅ 채용공고 관련 하위 라우트
        {
          path: 'jobs',
          name: 'jobPostList',
          component: () => import('@/views/recruiter/Job/JobPostListView.vue'),
        },
        {
          path: 'jobs/:id/info',
          name: 'jobInfo',
          component: () => import('@/views/recruiter/Job/JobInfoView.vue'),
          props: true,
        },
        {
          path: 'jobs/:id',
          name: 'jobDetail',
          component: () => import('@/views/recruiter/Job/JobDetailView.vue'),
          props: true,
        },
        {
          path: 'jobs/:id/applicants',
          name: 'jobApplicant',
          component: () => import('@/views/recruiter/Job/JobApplicantView.vue'),
          props: true,
        },
        {
          path: 'jobs/:id/process',
          name: 'jobProcess',
          component: () => import('@/views/recruiter/Job/JobProcessView.vue'),
          props: true,
        },
        {
          path: 'jobs/:id/schedule',
          name: 'jobSchedule',
          component: () => import('@/views/recruiter/Job/JobScheduleView.vue'),
          props: true,
        },

      ],
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/Layout/DashboardLayout.vue'),
      children: [
        {
          path: '',
          name: 'admin-dashboard',
          component: () => import('@/views/admin/AdminMainView.vue'),
        },
      ],
    },
    // {
    //   path: '/job-postings/create',
    //   name: 'jobPostingCreate',
    //   component: () => import('@/views/recruiter/Job/JobPostingCreateView.vue'),
    // },
    // {
    //   path: '/job-postings/detail',
    //   name: 'jobPostingdetal',
    //   component: () => import('@/views/recruiter/Job/JobDetailForApplicant.vue'),
    // },
    // 채용공고 지원자 관리 관려 라우터
    {
      path: '/job-postings/:id',
      name: 'jobDetailApplicant',
      component: () => import('@/views/recruiter/Job/JobDetailForApplicant.vue'),
      props: true,
    },
    {
      path: '/jobs/create',
      name: 'jobPostingCreate',
      component: () => import('@/views/recruiter/Job/JobPostingCreateView.vue'),
    },



    {
      path: '/resume',
      name: 'resumelayout',
      component: () => import('@/views/Layout/ResumeTopLayout.vue'),
      children: [
        {
          path: '',
          name: 'resume',
          component: () => import('@/views/resume/ResumeView.vue'),
        },
      ],
    },
  ],
})

export default router
