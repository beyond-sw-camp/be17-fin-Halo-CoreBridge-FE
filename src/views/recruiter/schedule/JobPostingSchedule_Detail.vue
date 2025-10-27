<template>
  <!-- 일정 상세 정보 모달 -->
  <div v-if="showModal && schedule" class="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50 p-4" @click="closeModal">
    <div class="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" @click.stop>
      <!-- Header -->
      <div class="sticky top-0 bg-gradient-to-r from-slate-500 to-slate-600 px-6 py-4 flex items-center justify-between rounded-t-xl z-10">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <Briefcase class="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 class="text-xl font-bold text-white">{{ schedule.title }}</h2>
            <p class="text-sm text-slate-100">채용 공고 상세 정보</p>
          </div>
        </div>
        <button @click="closeModal" class="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition">
          <X class="w-5 h-5 text-white" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 space-y-6">
        <!-- 기본 정보 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 bg-gray-50 rounded-lg">
            <div class="flex items-center gap-2 mb-2">
              <Building class="w-4 h-4 text-gray-600" />
              <p class="text-xs font-semibold text-gray-500 uppercase">부서</p>
            </div>
            <p class="font-semibold text-gray-900">{{ schedule.department }}</p>
          </div>

          <div class="p-4 bg-gray-50 rounded-lg">
            <div class="flex items-center gap-2 mb-2">
              <Award class="w-4 h-4 text-gray-600" />
              <p class="text-xs font-semibold text-gray-500 uppercase">경력</p>
            </div>
            <p class="font-semibold text-gray-900">{{ schedule.experience }}</p>
          </div>

          <div class="p-4 bg-gray-50 rounded-lg">
            <div class="flex items-center gap-2 mb-2">
              <FileText class="w-4 h-4 text-gray-600" />
              <p class="text-xs font-semibold text-gray-500 uppercase">고용 형태</p>
            </div>
            <p class="font-semibold text-gray-900">{{ schedule.type }}</p>
          </div>

          <div class="p-4 bg-gray-50 rounded-lg">
            <div class="flex items-center gap-2 mb-2">
              <CheckCircle class="w-4 h-4 text-gray-600" />
              <p class="text-xs font-semibold text-gray-500 uppercase">상태</p>
            </div>
            <span :class="['px-3 py-1 rounded-full text-xs font-semibold', getStatusBadgeClass(schedule.status)]">
              {{ getStatusLabel(schedule.status) }}
            </span>
          </div>
        </div>

        <!-- 일정 정보 -->
        <div class="p-4 border-2 border-slate-200 rounded-lg">
          <h3 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Calendar class="w-5 h-5 text-slate-600" />
            일정 정보
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar class="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p class="text-xs text-gray-500 mb-1">게시일</p>
                <p class="font-semibold text-gray-900">{{ formatDate(schedule.postedDate) }}</p>
                <p v-if="schedule.startTime" class="text-xs text-gray-600 mt-1">{{ schedule.startTime }}</p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar class="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p class="text-xs text-gray-500 mb-1">마감일</p>
                <p class="font-semibold text-gray-900">{{ formatDate(schedule.deadline) }}</p>
                <p v-if="schedule.endTime" class="text-xs text-gray-600 mt-1">{{ schedule.endTime }}</p>
              </div>
            </div>
          </div>

          <div v-if="schedule.daysLeft !== undefined" class="mt-4 flex items-center gap-2 p-3 rounded-lg" :class="schedule.daysLeft <= 7 ? 'bg-red-50' : 'bg-blue-50'">
            <Clock :class="['w-5 h-5', schedule.daysLeft <= 7 ? 'text-red-600' : 'text-blue-600']" />
            <p :class="['font-semibold', schedule.daysLeft <= 7 ? 'text-red-900' : 'text-blue-900']">
              마감까지 <strong class="text-lg">{{ schedule.daysLeft }}</strong>일 남음
              <span v-if="schedule.daysLeft <= 7" class="ml-2 px-2 py-0.5 bg-red-600 text-white text-xs rounded-full">긴급</span>
            </p>
          </div>
        </div>

        <!-- 담당자 정보 -->
        <div v-if="assignedMember" class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <User class="w-5 h-5 text-blue-600" />
            담당자
          </h3>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span class="text-white font-bold">{{ assignedMember.name.charAt(0) }}</span>
            </div>
            <div>
              <p class="font-semibold text-gray-900">{{ assignedMember.name }}</p>
              <p class="text-sm text-gray-600">{{ assignedMember.role }} · {{ assignedMember.department }}</p>
            </div>
          </div>
        </div>

        <!-- 반복 일정 정보 -->
        <div v-if="schedule.isRecurring" class="p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <h3 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Repeat class="w-5 h-5 text-purple-600" />
            반복 일정
          </h3>
          <div class="space-y-2">
            <p class="text-sm text-gray-700">
              <strong>반복 주기:</strong> {{ getRecurringTypeLabel(schedule.recurringType) }}
            </p>
            <div v-if="schedule.recurringDays && schedule.recurringDays.length > 0" class="flex items-center gap-2">
              <strong class="text-sm text-gray-700">반복 요일:</strong>
              <div class="flex gap-1">
                <span 
                  v-for="day in schedule.recurringDays" 
                  :key="day"
                  class="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded"
                >
                  {{ getDayLabel(day) }}
                </span>
              </div>
            </div>
            <p v-if="schedule.recurringEndDate" class="text-sm text-gray-700">
              <strong>반복 종료일:</strong> {{ formatDate(schedule.recurringEndDate) }}
            </p>
          </div>
        </div>

        <!-- 공고 설명 -->
        <div v-if="schedule.description" class="p-4 border border-gray-200 rounded-lg">
          <h3 class="font-bold text-gray-900 mb-2 flex items-center gap-2">
            <FileText class="w-5 h-5 text-gray-600" />
            공고 설명
          </h3>
          <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ schedule.description }}</p>
        </div>

        <!-- 주요 업무 -->
        <div v-if="schedule.responsibilities" class="p-4 border border-gray-200 rounded-lg">
          <h3 class="font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Briefcase class="w-5 h-5 text-gray-600" />
            주요 업무
          </h3>
          <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ schedule.responsibilities }}</p>
        </div>

        <!-- 자격 요건 -->
        <div v-if="schedule.requirements" class="p-4 border border-gray-200 rounded-lg">
          <h3 class="font-bold text-gray-900 mb-2 flex items-center gap-2">
            <CheckCircle class="w-5 h-5 text-gray-600" />
            자격 요건
          </h3>
          <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ schedule.requirements }}</p>
        </div>

        <!-- 우대 사항 -->
        <div v-if="schedule.preferences" class="p-4 border border-gray-200 rounded-lg">
          <h3 class="font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Star class="w-5 h-5 text-gray-600" />
            우대 사항
          </h3>
          <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ schedule.preferences }}</p>
        </div>

        <!-- 복리후생 -->
        <div v-if="schedule.benefits" class="p-4 border border-gray-200 rounded-lg">
          <h3 class="font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Gift class="w-5 h-5 text-gray-600" />
            복리후생
          </h3>
          <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ schedule.benefits }}</p>
        </div>

        <!-- 지원 현황 -->
        <div class="p-4 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
          <h3 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Users class="w-5 h-5 text-blue-600" />
            지원 현황
          </h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div class="text-center p-3 bg-white rounded-lg">
              <p class="text-2xl font-bold text-blue-600">{{ schedule.applicants || 0 }}</p>
              <p class="text-xs text-gray-600 mt-1">총 지원자</p>
            </div>
            <div class="text-center p-3 bg-white rounded-lg">
              <p class="text-2xl font-bold text-orange-600">{{ schedule.screening || 0 }}</p>
              <p class="text-xs text-gray-600 mt-1">서류 전형</p>
            </div>
            <div class="text-center p-3 bg-white rounded-lg">
              <p class="text-2xl font-bold text-purple-600">{{ schedule.interview1 || 0 }}</p>
              <p class="text-xs text-gray-600 mt-1">1차 면접</p>
            </div>
            <div class="text-center p-3 bg-white rounded-lg">
              <p class="text-2xl font-bold text-green-600">{{ schedule.final || 0 }}</p>
              <p class="text-xs text-gray-600 mt-1">최종 합격</p>
            </div>
          </div>
          <div class="mt-3">
            <div class="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>진행률</span>
              <span class="font-semibold">{{ schedule.progress || 0 }}%</span>
            </div>
            <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                class="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                :style="{ width: `${schedule.progress || 0}%` }"
              ></div>
            </div>
          </div>
        </div>

        <!-- 공유 정보 -->
        <div v-if="schedule.sharedWith && schedule.sharedWith.length > 0" class="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Share2 class="w-5 h-5 text-green-600" />
            공유 정보
          </h3>
          <p class="text-sm text-gray-700 mb-2">이 공고는 <strong>{{ getSharedMembers.length }}명</strong>과 공유되었습니다</p>
          <div class="flex flex-wrap gap-2">
            <div 
              v-for="member in getSharedMembers" 
              :key="member.id"
              class="flex items-center gap-2 px-3 py-1.5 bg-white border border-green-200 rounded-lg"
            >
              <div class="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                <span class="text-white text-xs font-bold">{{ member.name.charAt(0) }}</span>
              </div>
              <span class="text-sm text-gray-900">{{ member.name }}</span>
            </div>
          </div>
        </div>

        <!-- 설정 정보 -->
        <div class="flex flex-wrap gap-3">
          <div v-if="schedule.isUrgent" class="flex items-center gap-2 px-4 py-2 bg-orange-100 border border-orange-300 rounded-lg">
            <AlertCircle class="w-4 h-4 text-orange-600" />
            <span class="text-sm font-semibold text-orange-900">긴급 공고</span>
          </div>
          <div v-if="schedule.isPublic" class="flex items-center gap-2 px-4 py-2 bg-blue-100 border border-blue-300 rounded-lg">
            <Globe class="w-4 h-4 text-blue-600" />
            <span class="text-sm font-semibold text-blue-900">외부 공개</span>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3 rounded-b-xl">
        <button 
          @click="closeModal" 
          class="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-white transition"
        >
          닫기
        </button>
        <button 
          @click="editSchedule" 
          class="flex-1 px-4 py-2.5 bg-slate-600 text-white rounded-lg font-medium hover:bg-slate-700 transition flex items-center justify-center gap-2"
        >
          <Edit class="w-4 h-4" />
          수정하기
        </button>
        <button 
          @click="shareSchedule" 
          class="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2"
        >
          <Share2 class="w-4 h-4" />
          공유하기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { 
  Briefcase, X, Calendar, Clock, Users, Building, Award, FileText, 
  CheckCircle, Star, Gift, AlertCircle, Globe, Share2, Edit, User, Repeat
} from 'lucide-vue-next'

// Props
interface Schedule {
  id: number
  title: string
  department: string
  experience: string
  type: string
  status: string
  postedDate: string
  deadline: string
  startTime?: string
  endTime?: string
  daysLeft?: number
  description?: string
  responsibilities?: string
  requirements?: string
  preferences?: string
  benefits?: string
  applicants?: number
  screening?: number
  interview1?: number
  interview2?: number
  final?: number
  progress?: number
  isUrgent?: boolean
  isPublic?: boolean
  sharedWith?: number[]
  assignedTo?: number
  isRecurring?: boolean
  recurringType?: 'daily' | 'weekly' | 'biweekly' | 'monthly'
  recurringDays?: number[]
  recurringEndDate?: string
}

interface TeamMember {
  id: number
  name: string
  role: string
  department: string
  email: string
}

interface Props {
  showModal?: boolean
  schedule?: Schedule | null
  teamMembers?: TeamMember[]
}

const props = withDefaults(defineProps<Props>(), {
  showModal: false,
  schedule: null,
  teamMembers: () => []
})

// Emits
const emit = defineEmits<{
  'close': []
  'edit': [id: number]
  'share': [id: number]
}>()

// Computed
const assignedMember = computed(() => {
  if (!props.schedule?.assignedTo) return null
  return props.teamMembers.find(m => m.id === props.schedule.assignedTo)
})

const getSharedMembers = computed(() => {
  if (!props.schedule?.sharedWith) return []
  return props.teamMembers.filter(m => props.schedule!.sharedWith!.includes(m.id))
})

// Methods
const closeModal = () => {
  emit('close')
}

const editSchedule = () => {
  if (props.schedule) {
    emit('edit', props.schedule.id)
  }
}

const shareSchedule = () => {
  if (props.schedule) {
    emit('share', props.schedule.id)
  }
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const weekDays = ['일', '월', '화', '수', '목', '금', '토']
  const dayOfWeek = weekDays[date.getDay()]
  return `${year}년 ${month}월 ${day}일 (${dayOfWeek})`
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'recruiting': '채용중',
    'screening': '서류검토중',
    'interviewing': '면접진행중',
    'closed': '마감',
    'paused': '일시중단'
  }
  return labels[status] || status
}

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    'recruiting': 'bg-green-100 text-green-700',
    'screening': 'bg-blue-100 text-blue-700',
    'interviewing': 'bg-purple-100 text-purple-700',
    'closed': 'bg-gray-100 text-gray-700',
    'paused': 'bg-yellow-100 text-yellow-700'
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

const getRecurringTypeLabel = (type?: string) => {
  const labels: Record<string, string> = {
    'daily': '매일',
    'weekly': '매주',
    'biweekly': '격주',
    'monthly': '매월'
  }
  return type ? labels[type] : ''
}

const getDayLabel = (day: number) => {
  const labels = ['일', '월', '화', '수', '목', '금', '토']
  return labels[day]
}
</script>
