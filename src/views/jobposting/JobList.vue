<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  Search,
  Briefcase,
  MapPin,
  Eye
} from 'lucide-vue-next'

import { getJobsPublic } from '@/api/jobposting'
import type { JobPostingPublic } from '@/types/jobposting/JobPostingTypes'
import ProfileDropdown from '@/components/recruiter-dashboard/ProfileDropdown.vue'
import { useUserStore } from '@/store/useUserStore.ts'

const userStore = useUserStore()

// 공고 데이터 (DB에서 오는 걸로 가정)
const jobs = ref<JobPostingPublic[]>([])

const searchQuery = ref('')

const employmentTypes = ref([
  {
    code: 'FULL_TIME',
    label: '정규직'
  },
  {
    code: 'CONTRACT',
    label: '계약직'
  }, {
    code: 'INTERN',
    label: '인턴'
  }
])

const selectedType = ref(employmentTypes.value[0]!.label)

onMounted(async () => {

  const response = await getJobsPublic()
  if (response.success) {
    console.log(response.results)
    jobs.value = response.results.jobs
  }
})

const orderFilter = ref([
  {
    label: '최신순',
    code: 'lastest'
  },
  {
    label: '오래된 수',
    code: 'old'
  }
])

const selectedOrder = ref(orderFilter.value[0]!.label)

</script>

<template>
  <div class="min-h-screen bg-gray-50">

    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 h-18">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-8">
            <h1 class="text-2xl font-bold text-slate-600">회사명</h1>
            <nav class="hidden md:flex gap-6">
              <a href="#"
                 class="text-slate-600 font-medium hover:text-slate-800 transition">채용공고</a>
              <a href="#" class="text-gray-600 hover:text-slate-800 transition">회사소개</a>
              <a href="#" class="text-gray-600 hover:text-slate-800 transition">기업문화</a>
              <a href="#" class="text-gray-600 hover:text-slate-800 transition">복지혜택</a>
            </nav>
          </div>
          <div class="flex items-center gap-3" v-if="!userStore.isLogin">
            <button
              class="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition text-sm hover:cursor-pointer">
              지원현황
            </button>
            <RouterLink to="/login"
                        class="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition text-sm font-medium hover:cursor-pointer">
              로그인
            </RouterLink>
          </div>
          <div class="flex items-center space-x-4" v-else>
            <div class="flex items-center space-x-3 pl-4 border-l border-slate-200">
              <div class="text-center">
                <p class="text-sm font-medium text-slate-800">{{ userStore.userInfo.name }}</p>
              </div>
              <!-- <div
                  class="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center text-white font-medium shadow-md">
                  CS</div> -->
            </div>
            <ProfileDropdown />
          </div>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-slate-500 to-slate-600 text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-4xl font-bold mb-4">함께 성장할 동료를 찾습니다</h2>
          <p class="text-xl text-slate-100 mb-8">당신의 열정과 재능으로 우리와 함께 미래를 만들어가세요</p>
          <div class="flex justify-center gap-4">
            <div class="bg-slate-700 bg-opacity-20 rounded-lg px-6 py-3">
              <div class="text-3xl font-bold">{{ jobs.length }}</div>
              <div class="text-sm text-slate-200">진행중인 공고</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Search and Filter -->
    <section class="bg-white border-b border-gray-200 py-6 sticky top-18 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1 relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="포지션, 기술 스택으로 검색..."
              class="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent"
            >
            <Search
              class="w-6 h-6 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
          </div>
          <!--          <select v-model="selectedJob" class="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600">-->
          <!--            <option>전체 직군</option>-->
          <!--            <option>개발</option>-->
          <!--            <option>디자인</option>-->
          <!--            <option>마케팅</option>-->
          <!--            <option>기획</option>-->
          <!--            <option>영업</option>-->
          <!--          </select>-->
          <!--          <select v-model="selectedExp" class="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600">-->
          <!--            <option>전체 경력</option>-->
          <!--            <option>신입</option>-->
          <!--            <option>1-3년</option>-->
          <!--            <option>3-5년</option>-->
          <!--            <option>5년 이상</option>-->
          <!--          </select>-->
          <select v-model="selectedType"
                  class="hover:cursor-pointer px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600">
            <option v-for="employmentType in employmentTypes" :key="employmentType.code">
              {{ employmentType.label }}
            </option>
          </select>
        </div>
      </div>
    </section>

    <!-- Job Listings -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="mb-6 flex justify-between items-center">
        <h3 class="text-2xl font-bold text-slate-600">
          진행 중인 채용 공고 <span class="text-gray-500 text-xl ml-2">{{ jobs.length }}</span>
        </h3>
        <select v-model="selectedOrder"
                class="hover:cursor-pointer px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600 text-sm">
          <option v-for="filter in orderFilter" :key="filter.code">{{ filter.label }}</option>
        </select>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="job in jobs"
          :key="job.id"
          class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all cursor-pointer overflow-hidden group"
        >
          <RouterLink :to="{ path: `/jobs/${job.id}` }">
            <div class="p-6">
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-center gap-3">
                  <div
                    class="px-5 py-2 text-sm bg-slate-200 rounded-lg flex items-center justify-center font-bold">
                    {{ job.department }}
                  </div>
                </div>
              </div>

              <h3 class="text-xl font-bold text-slate-600 mb-2 group-hover:text-slate-700">
                {{ job.title }}</h3>

              <!--            <div class="flex flex-wrap gap-2 mb-4">-->
              <!--              <span-->
              <!--                v-for="tag in job.tags"-->
              <!--                :key="tag"-->
              <!--                class="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium"-->
              <!--              >{{ tag }}</span>-->
              <!--            </div>-->

              <div class="space-y-2 text-sm text-gray-600 mb-4">
                <div class="flex items-center gap-2">
                  <Briefcase class="w-4 h-4" />
                  <span>{{ job.experience }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <MapPin class="w-4 h-4" />
                  <span>{{ job.location }}</span>
                </div>
              </div>

              <div class="flex items-center justify-between pt-4 border-t border-gray-200">
                <div class="text-xs text-gray-500">
                  <span :class="job.deadline.includes('5') ? 'text-red-600' : 'text-orange-600'"
                        class="font-medium">{{ job.deadline }}</span>
                </div>
                <div class="flex items-center gap-1 text-xs text-gray-500">
                  <Eye class="w-4 h-4" />
                  <span>{{ job.views }}</span>
                </div>
              </div>
            </div>
            <div
              class="bg-slate-600 text-white text-center py-3 font-medium group-hover:bg-slate-700 transition">
              상세 보기
            </div>
          </RouterLink>
        </div>
      </div>

      <!-- Load More -->
      <div class="text-center mt-12">
        <button
          class="hover:cursor-pointer px-8 py-3 border-2 border-slate-600 text-slate-600 rounded-lg hover:bg-slate-600 hover:text-white transition font-medium">
          더 많은 공고 보기
        </button>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-12 mt-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 class="text-xl font-bold mb-4">회사명</h3>
            <p class="text-gray-400 text-sm">함께 성장하는 기술 기업입니다.</p>
          </div>
          <div>
            <h4 class="font-medium mb-4">회사</h4>
            <ul class="space-y-2 text-sm text-gray-400">
              <li><a href="#" class="hover:text-white transition">회사 소개</a></li>
              <li><a href="#" class="hover:text-white transition">팀 소개</a></li>
              <li><a href="#" class="hover:text-white transition">기업 문화</a></li>
              <li><a href="#" class="hover:text-white transition">블로그</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-medium mb-4">채용</h4>
            <ul class="space-y-2 text-sm text-gray-400">
              <li><a href="#" class="hover:text-white transition">채용 공고</a></li>
              <li><a href="#" class="hover:text-white transition">채용 절차</a></li>
              <li><a href="#" class="hover:text-white transition">복지 혜택</a></li>
              <li><a href="#" class="hover:text-white transition">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-medium mb-4">문의</h4>
            <ul class="space-y-2 text-sm text-gray-400">
              <li>이메일: hr@company.com</li>
              <li>전화: 02-1234-5678</li>
              <li>주소: 서울시 강남구</li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          © 2025 회사명. All rights reserved.
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
</style>
