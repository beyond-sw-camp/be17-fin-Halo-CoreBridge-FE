import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import jobPostingRoutes from '@/views/JobPosting/index.js';

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
    ...jobPostingRoutes, // jobPosting 라우트 병합
  ],
})

export default router
