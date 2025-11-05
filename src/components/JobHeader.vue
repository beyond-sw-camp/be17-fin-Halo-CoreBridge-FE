<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink, useRouter } from 'vue-router'
import { getHeaderById } from '@/api/jobposting/index'
import { Building2, MapPin, Briefcase, DollarSign, Share2 } from 'lucide-vue-next'

// -----------------------------
// 타입 정의
// -----------------------------
interface headerResponse {
  id: number
  title: string
  status: string
  departmentName: string
  employmentType: string
  location: string
  careerType: string
  minExperience: number
  maxExperience: number
  skills: string[]
  salaryType: string
  salaryMin: number
  salaryMax: number
  salaryNegotiable: boolean
}

// -----------------------------
// 상태 관리
// -----------------------------
const route = useRoute()
const jobId = Number(route.params.id)
const jobPosting = ref<headerResponse | null>(null)
const isLoading = ref(true)
const errorMessage = ref('')
const router = useRouter()

// -----------------------------
// API 호출
// -----------------------------
onMounted(async () => {
  try {
    const response = await getHeaderById(jobId)
    if (response.success) {
      jobPosting.value = response.results as headerResponse
    } else {
      errorMessage.value = response.message || '데이터를 불러오지 못했습니다.'
    }
  } catch (err: any) {
    console.error(err)
    errorMessage.value = '서버 오류가 발생했습니다.'
  } finally {
    isLoading.value = false
  }
})

// -----------------------------
// UI 관련 유틸
// -----------------------------
const getStatusClass = (status?: string) => {
  if (status === '채용중') return 'bg-green-100 text-green-700'
  if (status === '마감') return 'bg-gray-200 text-gray-600'
  return 'bg-gray-100 text-gray-700'
}

const formatExperience = (min?: number | null, max?: number | null) => {

  //  둘 다 0이면 "경력 무관"
  if (min === 0 && max === 0) return ''

  //  둘 다 값이 있고 같다면 "3년"
  if (min != null && max != null && min === max) return `• ${min}년`

  //  둘 다 값이 있으면 "3~5년"
  if (min != null && max != null) return `• ${min}~${max}년`

  //  하나만 있는 경우
  if (min != null) return `• ${min}년 이상`
  if (max != null) return `• ${max}년 이하`

  return ''
}

const formatSalary = (type: string, min: number, max: number) => {
  if (min === 0 && max === 0) return '회사 내규에 따름'

  const formattedMin = min.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })
  const formattedMax = max.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })

  return `${formattedMin} ~ ${formattedMax}`
}


// -----------------------------
// 탭 관련
// -----------------------------
interface Tab {
  id: number
  path: string
  name: string
}

const url = '/recruiter/jobs/'
const tabs = ref<Tab[]>([
  { id: 1, path: url + route.params.id, name: '공고 정보' },
  { id: 2, path: url + route.params.id + '/manage', name: '지원자 관리' },
  { id: 3, path: url + route.params.id + '/applicants', name: '지원자 목록' },
  { id: 4, path: url + route.params.id + '/schedule', name: '채용 일정' },
  { id: 5, path: url + route.params.id + '/process', name: '프로세스 설정' },
])

const isActive = (tab: Tab) => route.path === tab.path

const goToEditPage = () => {
  if (!jobPosting.value) return
  router.push({
    path: `/job-posting/${jobId}/edit`,
    query: { mode: 'edit' },
  })
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
    <!-- 로딩 / 에러 처리 -->
    <div v-if="isLoading" class="text-center text-gray-500 py-6">로딩 중...</div>
    <div v-else-if="errorMessage" class="text-center text-red-500 py-6">{{ errorMessage }}</div>

    <div v-else-if="jobPosting">
      <div class="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
        <!-- 왼쪽: 공고 기본 정보 -->
        <section>
          <div class="flex items-start gap-6 mb-6">
            <div
              class="w-20 h-20 bg-slate-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
              채용
            </div>

            <div class="flex-1">
              <!-- 제목 / 상태 -->
              <div class="flex items-center gap-3 mb-2">
                <h2 class="text-2xl font-bold text-slate-800">{{ jobPosting.title }}</h2>
                <span
                  :class="[getStatusClass(jobPosting.status), 'px-3 py-1 text-sm rounded-full font-medium']">
                  {{ jobPosting.status }}
                </span>
              </div>

              <!-- 세부 정보 -->
              <div class="space-y-2 text-gray-600 mb-4">
                <div class="flex items-center gap-2">
                  <Building2 :size="18" />
                  {{ jobPosting.departmentName }} • {{ jobPosting.employmentType }}
                </div>

                <div class="flex items-center gap-2">
                  <MapPin :size="18" />
                  {{ jobPosting.location }}
                </div>

                <div class="flex items-center gap-2">
                  <Briefcase :size="18" />
                  {{ jobPosting.careerType }} 
                  {{ formatExperience(jobPosting.minExperience, jobPosting.maxExperience) }}
                </div>
              </div>

              <!-- 기술 스택 -->
              <div class="flex gap-2 flex-wrap">
                <span
                  v-for="(tech, index) in jobPosting.skills.slice(0, 3)"
                  :key="index"
                  class="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                  {{ tech }}
                </span>
                <span
                  v-if="jobPosting.skills.length > 3"
                  class="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                  +{{ jobPosting.skills.length - 3 }}
                </span>
              </div>
            </div>
          </div>
        </section>

        <!-- 오른쪽: 액션 버튼 -->
        <section>
          <div class="space-y-3">
            <button @click="goToEditPage"
              class="w-full px-4 py-3 bg-white text-slate-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium">
              공고 수정
            </button>
            <button
              class="w-full px-4 py-3 bg-white text-slate-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium">
              모집 중단
            </button>
            <button
              class="w-full px-4 py-3 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition text-sm font-medium">
              공고 삭제
            </button>
          </div>
        </section>
      </div>

      <!-- 연봉 섹션 -->
      <div class="bg-slate-50 rounded-lg p-4 border border-slate-200 mb-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <DollarSign :size="24" class="text-slate-600" />
            <div>
              <div class="text-sm text-gray-600">연봉 (단위 : 만원)</div>
              <div class="text-xl font-bold text-slate-800">
                {{ formatSalary(jobPosting.salaryType, jobPosting.salaryMin, jobPosting.salaryMax) }}
              </div>
            </div>
          </div>
          <span class="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium">
            {{ jobPosting.salaryNegotiable ? '협의 가능' : '고정 급여' }}
          </span>
        </div>
      </div>

      <!-- 탭 네비게이션 -->
      <div class="border-b border-gray-200">
        <div class="flex items-center justify-between w-full h-10">
          <nav class="flex gap-8">
            <RouterLink
              v-for="tab in tabs"
              :key="tab.id"
              :to="tab.path"
              :class="[
                'pb-4 px-1 border-b-2 font-medium transition-colors',
                isActive(tab)
                  ? 'border-slate-600 text-slate-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              {{ tab.name }}
            </RouterLink>
          </nav>

          <button
            v-if="route.path.includes('/schedule')"
            class="mb-5 flex-shrink-0 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 shadow-sm">
            <Share2 class="w-5 h-5" />
            일정 공유
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
