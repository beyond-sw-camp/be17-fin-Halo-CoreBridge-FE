<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Building2,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  User,
  Mail,
  FileText,
  CheckCircle,
  Star,
  ThumbsUp,
  Gift,
  Info,
  Code
} from 'lucide-vue-next'
import { getJobById, getHeaderById } from '@/api/job-posting'

// -----------------------------
// Interfaces
// -----------------------------
interface ColorCode {
  name: string
  label: string
  code: string
}

interface RecruitProcessRead {
  id: number
  name: string
  colorCode: ColorCode
  orderIdx: number
}

interface JobPostingDetailResponse {
  id: number
  summary: string
  responsibilities: string
  requirements: string
  preferred: string
  benefits: string
  additionalInfo: string
  status: string
  createDate: string
  applyStartDate: string
  applyEndDate: string
  hireEndDate: string
  headCount: number
  applicantCount: number
  skills: string[]
  recruitProcesses: RecruitProcessRead[]
  workingHours: string
  location: string
  contactName: string
  contactEmail: string
}

interface HeaderResponse {
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
// State
// -----------------------------
const route = useRoute()
const router = useRouter()
const jobId = Number(route.params.id)

const basicInfo = ref<HeaderResponse | null>(null)
const detailInfo = ref<JobPostingDetailResponse | null>(null)
const recruitmentProcess = ref<RecruitProcessRead[]>([])
const isLoading = ref(true)
const errorMessage = ref('')

// -----------------------------
// API 호출
// -----------------------------
const getHeaderInfo = async () => {
  const response = await getHeaderById(jobId)
  if (!response.success) throw new Error(response.message)
  basicInfo.value = response.results as HeaderResponse
}

const getDetailInfo = async () => {
  const response = await getJobById(jobId)
  if (!response.success) throw new Error(response.message)
  detailInfo.value = response.results as JobPostingDetailResponse
  recruitmentProcess.value = response.results.recruitProcesses || []
}

onMounted(async () => {
  try {
    await Promise.all([getHeaderInfo(), getDetailInfo()])
  } catch (error: any) {
    console.error(error)
    errorMessage.value = error.message || '데이터를 불러오는 중 오류가 발생했습니다.'
  } finally {
    isLoading.value = false
  }
})

// -----------------------------
// Utility Methods
// -----------------------------
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

const formatDateRange = (start?: string, end?: string) => {
  if (!start || !end) return '-'

  const parse = (str: string) => {
    if (str.includes('T')) return new Date(str)
    const [datePart] = str.split(' ')
    const [y, m, d] = datePart.split('.').map(Number)
    return new Date(y, m - 1, d)
  }

  const s = parse(start)
  const e = parse(end)

  if (isNaN(+s) || isNaN(+e)) return '-'

  const pad = (n: number) => String(n).padStart(2, '0')
  const toYMD = (d: Date) => `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`
  const toMD = (d: Date) => `${pad(d.getMonth() + 1)}.${pad(d.getDate())}`

  return s.getFullYear() === e.getFullYear()
    ? `${toYMD(s)} ~ ${toMD(e)}`
    : `${toYMD(s)} ~ ${toYMD(e)}`
}

const getStatusClass = (status?: string): string => {
  return status === '채용중'
    ? 'bg-green-100 text-green-700'
    : 'bg-gray-100 text-gray-700'
}

const exit = () => router.push('/jobs')
const handleApply = () => router.push(`/apply/${jobId}`)
</script>

<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- 로딩 상태 -->
    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <span class="text-gray-500 animate-pulse">불러오는 중...</span>
    </div>

    <!-- 에러 상태 -->
    <div v-else-if="errorMessage" class="text-center text-red-500 py-20">
      {{ errorMessage }}
    </div>

    <!-- 메인 콘텐츠 -->
    <main v-else class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <header class="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 h-20 z-10">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex justify-between items-center">
            <h1 class="text-2xl font-bold text-slate-600">채용 상세</h1>
            <button class="px-4 py-2 text-slate-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              @click="exit">
              나가기
            </button>
          </div>
        </div>
      </header>

      <!-- Body -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8 mt-20">
        <div class="flex items-start gap-6 mb-6">
          <div class="w-20 h-20 bg-slate-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
            채용
          </div>

          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h1 class="text-3xl font-bold text-slate-800">{{ basicInfo?.title }}</h1>
              <span :class="getStatusClass(basicInfo?.status)" class="px-3 py-1 text-sm rounded-full font-medium">
                {{ basicInfo?.status }}
              </span>
            </div>

            <div class="space-y-2 text-gray-600 mb-4">
              <div class="flex items-center gap-2">
                <Building2 :size="20" />
                {{ basicInfo?.departmentName }} • {{ basicInfo?.employmentType }}
              </div>
              <div class="flex items-center gap-2">
                <MapPin :size="20" />
                {{ basicInfo?.location }}
              </div>
              <div class="flex items-center gap-2">
                <Briefcase :size="20" />
                {{ basicInfo?.careerType }} 
                {{ formatExperience(basicInfo?.minExperience, basicInfo?.maxExperience) }}
              </div>
            </div>

            <div class="flex gap-2 flex-wrap">
              <!-- 5개까지만 표시 -->
              <span v-for="(skill, index) in basicInfo?.skills.slice(0, 5)" :key="index"
                class="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                {{ skill }}
              </span>

              <!-- 남은 개수 표시 -->
              <span v-if="(basicInfo?.skills?.length || 0) > 5"
                class="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                +{{ basicInfo!.skills.length - 5 }}
              </span>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between pt-6 border-t border-gray-200">
          <div>
            <div class="text-2xl text-gray-600">{{ basicInfo?.salaryType }}</div>
            <div class="text-lg text-gray-500">
              {{ basicInfo?.salaryNegotiable ? '협의 후 결정' : '고정 급여' }}
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div class="text-right text-sm text-gray-600">
              <div>마감일: <span class="font-medium text-red-600">{{ detailInfo?.applyEndDate }}</span></div>
              <div>지원자: <span class="font-medium">{{ detailInfo?.applicantCount }}명</span></div>
            </div>
            <button @click="handleApply"
              class="px-8 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium text-lg shadow-sm">
              지원하기
            </button>
          </div>
        </div>
      </div>

      <!-- Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
        <!-- Left Column -->
        <div class="lg:col-span-2 space-y-6">
          <section v-for="section in [
            { title: '직무 소개', icon: FileText, content: detailInfo?.summary },
            { title: '주요 업무', icon: CheckCircle, content: detailInfo?.responsibilities },
            { title: '필수 자격 요건', icon: Star, content: detailInfo?.requirements },
            { title: '우대 사항', icon: ThumbsUp, content: detailInfo?.preferred },
            { title: '복리후생', icon: Gift, content: detailInfo?.benefits },
            { title: '기타 안내사항', icon: Info, content: detailInfo?.additionalInfo }
          ]" :key="section.title" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-bold text-slate-600 mb-4 flex items-center gap-2">
              <component :is="section.icon" :size="24" class="text-slate-600" />
              {{ section.title }}
            </h3>
            <p class="text-gray-700 whitespace-pre-line">
              {{ section.content || '내용 없음' }}
            </p>
          </section>
        </div>

        <!-- Right Column -->
        <div class="space-y-6">
          <!-- Tech Stack -->
          <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Code :size="20" class="text-slate-600" />
              기술 스택
            </h3>
            <div class="flex flex-wrap gap-2">
              <span v-for="(tech, index) in basicInfo?.skills" :key="index"
                class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                {{ tech }}
              </span>
            </div>
          </section>

          <!-- Job Info -->
          <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-bold text-slate-800 mb-4">채용 정보</h3>
            <div class="space-y-4 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">모집 인원</span>
                <span class="font-medium">{{ detailInfo?.headCount }}명</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">현재 지원자</span>
                <span class="font-medium text-slate-600">{{ detailInfo?.applicantCount }}명</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">등록일</span>
                <span class="font-medium">{{ detailInfo?.applyStartDate }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">접수 기간</span>
                <span class="font-medium">{{ formatDateRange(detailInfo?.applyStartDate, detailInfo?.applyEndDate)
                }}</span>
              </div>
            </div>
          </section>

          <!-- recruitProcess -->
          <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-bold text-slate-600 mb-6">채용 프로세스</h3>

            <ul class="relative space-y-6">
              <!-- 수직 라인 -->
              <div class="absolute left-1.5 top-3 bottom-3 w-0.5 bg-gray-200"></div>

              <li v-for="step in recruitmentProcess" :key="step.id" class="relative flex items-start gap-3">
                <!-- 동그라미 -->
                <div class="z-10 w-4 h-4 rounded-full flex-shrink-0 border-2 border-white shadow"
                  :class="`bg-${step.colorCode.code}`"></div>

                <!-- 프로세스 내용 -->
                <div>
                  <!-- orderIdx (연하게) -->
                  <span class="text-sm text-gray-400 font-medium">{{ step.orderIdx }}. </span>
                  <!-- 프로세스명 -->
                  <span class="font-semibold text-slate-800">{{ step.name }}</span>
                </div>
              </li>
            </ul>
          </section>

          <!-- Work Condition -->
          <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Clock :size="20" class="text-slate-600" />근무 조건
            </h3>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">근무 시간</span>
                <span class="font-medium">{{ detailInfo?.workingHours }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">근무지</span>
                <span class="font-medium">{{ detailInfo?.location }}</span>
              </div>
            </div>
          </section>

          <!-- Contact Info -->
          <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <User :size="20" class="text-slate-600" />문의처
            </h3>
            <div class="space-y-3 text-sm">
              <div class="flex items-center gap-3">
                <Mail :size="16" class="text-gray-400" />
                <span class="text-gray-700">{{ detailInfo?.contactEmail }}</span>
              </div>
              <div class="flex items-center gap-3">
                <User :size="16" class="text-gray-400" />
                <span class="text-gray-700">담당자: {{ detailInfo?.contactName }}</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      <!-- Footer -->
      <footer class="fixed bottom-0 left-0 right-0 bg-white shadow-sm border-t border-gray-200 h-20 z-10">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex items-center justify-end">
            <button class="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition font-medium"
              @click="handleApply">
              지원하기
            </button>
          </div>
        </div>
      </footer>
    </main>
  </div>
</template>
