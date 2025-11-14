<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  Search,
  Briefcase,
  MapPin,
  Eye,
  ChevronDown
} from 'lucide-vue-next'

import { searchPublicJobs } from '@/api/publicjobposting'
import { getTechStack } from '@/api/teck-stack'
import type { JobPostingPublic, PublicJobSearchResponse } from '@/types/jobposting/JobPostingTypes'
import ScrollObserver from '@/components/ScrollObserver.vue'
import ProfileDropdown from '@/components/recruiter-dashboard/ProfileDropdown.vue'
import { useUserStore } from '@/store/useUserStore'

const userStore = useUserStore()

// =============================
// 📌 상태값
// =============================
const jobs = ref<JobPostingPublic[]>([])
const hasMore = ref(true)
const isLoading = ref(false)
const totalElements = ref(0)

// 검색 필터들
const keyword = ref('')
const careerType = ref<string | null>(null)
const techStacks = ref<string[]>([])

// 단일 기술스택 Select (정렬 자리에 들어갈)
const singleTech = ref('')

// 사용 가능한 기술스택 예시
const allTechOptions = [
  'JAVA', 'SPRING_BOOT', 'SPRING_MVC', 'SPRING_SECURITY'
]

// 페이지네이션
const page = ref(0)
const size = 12

// =============================
// 📌 Payload builder
// =============================
const buildPayload = () => ({
  keyword: keyword.value || undefined,
  careerType: careerType.value || undefined,
  techStacks: techStacks.value.length ? techStacks.value : undefined,
  page: page.value,
  size
})

// =============================
// 📌 데이터 로드
// =============================
const loadJobs = async () => {
  if (isLoading.value || !hasMore.value) return
  isLoading.value = true

  const response = await searchPublicJobs(buildPayload())

  if (response.success) {
    const jobList = response.results.jobs
    totalElements.value = response.results.totalElements

    if (page.value === 0) {
      jobs.value = jobList
    } else {
      jobs.value.push(...jobList)
    }

    // 백엔드 last 사용
    hasMore.value = !response.results.last
  }

  isLoading.value = false
}

// =============================
// 📌 검색 버튼 클릭
// =============================
const onSearch = () => {
  // 단일 선택을 배열 형태로 변환
  techStacks.value = []
  if (singleTech.value) {
    techStacks.value.push(singleTech.value)
  }

  // 페이지 초기화 후 검색
  page.value = 0
  hasMore.value = true
  loadJobs()
}

// =============================
// 무한스크롤
// =============================
const onScrollShow = () => {
  if (!isLoading.value && hasMore.value) {
    page.value++
    loadJobs()
  }
}

// =============================
// 기술스택 최초 롤딩(추후에 추가)
// =============================

const techOptions = ref<{ code: string; label: string }[]>([])
const loadTechStacks = async () => {
  const res = await getTechStack()
  if (res.success) {
    techOptions.value = res.results  // [{code, label}]
  }
}

onMounted(() => {
  loadJobs()
  // loadTechStacks()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">

    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-50 h-20 flex items-center">
      <div class="max-w-7xl mx-auto px-6 w-full flex justify-between items-center">
        <div class="flex items-center gap-10">
          <h1 class="text-2xl font-bold text-slate-700">회사명</h1>

          <nav class="hidden md:flex gap-8 text-slate-600 font-medium">
            <a class="hover:text-slate-900 transition">채용공고</a>
            <a class="hover:text-slate-900 transition">회사소개</a>
            <a class="hover:text-slate-900 transition">기업문화</a>
            <a class="hover:text-slate-900 transition">복지혜택</a>
          </nav>
        </div>

        <div v-if="!userStore.isLogin" class="flex items-center gap-4">
          <button class="px-4 py-2 text-slate-600 rounded-lg text-sm hover:bg-slate-100 transition">
            지원현황
          </button>

          <RouterLink to="/login"
            class="px-4 py-2 bg-slate-700 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition">
            로그인
          </RouterLink>
        </div>

        <div v-else class="flex items-center gap-4">
          <p class="text-sm text-slate-700">{{ userStore.userInfo.name }}</p>
          <ProfileDropdown />
        </div>
      </div>
    </header>

    <!-- Hero -->
    <section class="bg-gradient-to-r from-slate-600 to-slate-700 text-white py-20">
      <div class="max-w-7xl mx-auto px-6 text-center">
        <h2 class="text-4xl font-bold mb-3">함께 성장할 동료를 찾습니다</h2>
        <p class="text-lg text-slate-200 mb-10">
          당신의 열정과 재능으로 미래를 만들어가세요
        </p>

        <div class="inline-flex flex-col items-center bg-white/10 px-8 py-5 rounded-xl backdrop-blur-sm">
          <span class="text-4xl font-extrabold">{{ totalElements }}</span>
          <span class="text-sm text-slate-100 mt-1">전체 공고</span>
        </div>
      </div>
    </section>

    <section class="bg-white py-4 sticky top-20 z-40 shadow-sm border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-6 items-end">

        <!-- 제목 검색 -->
        <div class="flex flex-col">
          <label class="text-sm text-slate-600 mb-1">키워드</label>
          <div class="relative">
            <input v-model="keyword" class="w-full h-14 pl-12 pr-4 rounded-lg bg-gray-100 border border-gray-200
                 focus:bg-white focus:border-slate-500 focus:ring-2 focus:ring-slate-400 transition"
              placeholder="포지션, 기술 스택 검색..." />
            <Search class="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <!-- 경력 선택 -->
        <div class="flex flex-col">
          <label class="text-sm text-slate-600 mb-1">경력</label>
          <select v-model="careerType" class="w-full h-14 px-4 rounded-lg bg-gray-100 border border-gray-200
               text-slate-700 focus:bg-white focus:ring-2 focus:ring-slate-400 transition">
            <option :value="null">전체</option>
            <option value="신입">신입</option>
            <option value="경력">경력</option>
            <option value="경력무관">무관</option>
          </select>
        </div>

        <!-- 검색 버튼 (오른쪽 작은 버튼) -->
        <div class="flex flex-col items-end">
          <label class="text-sm text-transparent mb-1">검색</label>

          <button @click="onSearch"
            class="px-6 h-14 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-800 transition">
            검색
          </button>
        </div>

      </div>
    </section>





    <!-- Job Listings -->
    <main class="max-w-7xl mx-auto px-6 py-12">

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
        <RouterLink v-for="job in jobs" :key="job.id" :to="`/jobs/${job.id}`"
          class="bg-white rounded-2xl shadow-sm p-6 hover:shadow-xl transition border border-gray-100">
          <div class="text-sm bg-slate-100 inline-block px-3 py-1 mb-3 rounded-lg font-semibold text-slate-600">
            {{ job.department }}
          </div>

          <h3 class="text-xl font-bold text-slate-800 mb-4 leading-tight">
            {{ job.title }}
          </h3>

          <div class="text-sm text-gray-600 space-y-2 mb-4">
            <div class="flex items-center gap-2">
              <Briefcase class="w-4 h-4" />
              <span>{{ job.experience }}</span>
            </div>
            <div class="flex items-center gap-2">
              <MapPin class="w-4 h-4" />
              <span>{{ job.location }}</span>
            </div>
          </div>

          <div class="flex justify-between text-sm text-gray-500">
            <span class="text-orange-600 font-medium">{{ job.deadline }}</span>
            <span class="flex items-center gap-1">
              <Eye class="w-4 h-4" /> {{ job.views }}
            </span>
          </div>
        </RouterLink>
      </div>

      <ScrollObserver @show="onScrollShow" />

      <div v-if="isLoading" class="text-center mt-6 text-slate-500">
        불러오는 중...
      </div>

      <div v-if="!hasMore && !isLoading" class="text-center mt-10 text-slate-400">
        더 이상 공고가 없습니다.
      </div>
    </main>
  </div>
</template>
