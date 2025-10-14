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
        {
          path: '',
          name: 'recruiter-dashboard',
          component: () => import('@/views/recruiter/RecruiterDashboadView.vue'),
        },
        {
          path: 'jobs',
          name: 'recruiter-jobs',
          component: () => import('@/views/recruiter/EmploymentView.vue'),
          meta: { title: '채용 관리' },
        },
        {
          path: 'jobs/:jobId/pipeline',
          name: 'recruiter-job-pipeline',
          component: () => import('@/views/recruiter/EmploymentPipelineView.vue'),
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
    {
      path: '/job-postings/create',
      name: 'jobPostingCreate',
      component: () => import('@/views/JobPosting/JobPostingCreate.vue'),
    },
    {
      path: '/job-postings/:id',
      name: 'jobPostingDetail',
      component: () => import('@/views/JobPosting/JobPostingDetail.vue'),
      props: true,
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
