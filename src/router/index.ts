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
          path: 'jobs',
          name: 'recruiter-job-layout',
          component: () => import('@/views/layout/RecruiterJobLayout.vue'),
          children: [],
        },
      ],
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
      path: '/job-postings/create',
      name: 'jobPostingCreate',
      component: () => import('@/views/job-posting/JobPostingCreate.vue'),
    },
    {
      path: '/job-postings/:id',
      name: 'jobPostingDetail',
      component: () => import('@/views/job-posting/JobPostingDetail.vue'),
      props: true,
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
