<template>
  <!-- 일정 상세정보 모달 -->
  <div v-if="showModal && schedule" class="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl z-10">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3 flex-1">
            <div :class="['w-12 h-12 rounded-lg flex items-center justify-center', getScheduleIconBg(schedule.type)]">
              <component :is="getScheduleIcon(schedule.type)" :class="['w-6 h-6', getScheduleIconColor(schedule.type)]" />
            </div>
            <div class="flex-1 min-w-0">
              <h2 class="text-xl font-bold text-gray-900 truncate">{{ schedule.candidateName || schedule.title }}</h2>
              <div class="flex items-center gap-2 mt-1">
                <span :class="['px-2 py-0.5 text-xs font-semibold rounded', getScheduleTypeBadge(schedule.type)]">
                  {{ getScheduleTypeLabel(schedule.type) }}
                </span>
                <span v-if="schedule.priority === 'high'" class="px-2 py-0.5 text-xs font-semibold text-red-700 bg-red-100 rounded">
                  긴급
                </span>
                <span v-if="schedule.priority === 'medium'" class="px-2 py-0.5 text-xs font-semibold text-yellow-700 bg-yellow-100 rounded">
                  보통
                </span>
                <span v-if="schedule.priority === 'low'" class="px-2 py-0.5 text-xs font-semibold text-green-700 bg-green-100 rounded">
                  낮음
                </span>
              </div>
            </div>
          </div>
          <button @click="closeModal" class="p-2 hover:bg-gray-100 rounded-lg transition flex-shrink-0">
            <X class="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6">
        <!-- 기본 정보 -->
        <div class="space-y-4">
          <!-- 포지션 (면접/협상일 때만) -->
          <div v-if="schedule.position" class="flex items-start gap-3">
            <div class="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Briefcase class="w-5 h-5 text-blue-600" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-semibold text-gray-700 mb-1">포지션</p>
              <p class="text-base text-gray-900">{{ schedule.position }}</p>
            </div>
          </div>

          <!-- 날짜 -->
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Calendar class="w-5 h-5 text-purple-600" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-semibold text-gray-700 mb-1">날짜</p>
              <p class="text-base text-gray-900">
                {{ formatDate(schedule.date) }}
                <span v-if="schedule.endDate && schedule.endDate !== schedule.date">
                  ~ {{ formatDate(schedule.endDate) }}
                </span>
              </p>
              <p v-if="schedule.endDate && schedule.endDate !== schedule.date" class="text-sm text-gray-500 mt-1">
                총 {{ getDaysDifference(schedule.date, schedule.endDate) }}일
              </p>
            </div>
          </div>

          <!-- 시간 -->
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Clock class="w-5 h-5 text-green-600" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-semibold text-gray-700 mb-1">시간</p>
              <p class="text-base text-gray-900">{{ schedule.time || '시간 미정' }}</p>
            </div>
          </div>

          <!-- 장소 -->
          <div v-if="schedule.location" class="flex items-start gap-3">
            <div class="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin class="w-5 h-5 text-orange-600" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-semibold text-gray-700 mb-1">장소</p>
              <p class="text-base text-gray-900">{{ schedule.location }}</p>
            </div>
          </div>

          <!-- 담당자/면접관 -->
          <div v-if="schedule.interviewer" class="flex items-start gap-3">
            <div class="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <UserCircle2 class="w-5 h-5 text-indigo-600" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-semibold text-gray-700 mb-1">
                {{ isInterviewType ? '면접관' : '담당자' }}
              </p>
              <p class="text-base text-gray-900">{{ schedule.interviewer }}</p>
            </div>
          </div>

          <!-- 상태 -->
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Activity class="w-5 h-5 text-teal-600" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-semibold text-gray-700 mb-1">상태</p>
              <div class="flex items-center gap-2">
                <span :class="getStatusBadge(schedule.status)">
                  {{ getStatusLabel(schedule.status) }}
                </span>
              </div>
            </div>
          </div>

          <!-- 공유 정보 -->
          <div v-if="schedule.sharedWith && schedule.sharedWith.length > 0" class="flex items-start gap-3">
            <div class="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Share2 class="w-5 h-5 text-blue-600" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-semibold text-gray-700 mb-2">공유 대상 ({{ schedule.sharedWith.length }}명)</p>
              <div class="flex flex-wrap gap-2">
                <div 
                  v-for="memberId in schedule.sharedWith" 
                  :key="memberId" 
                  class="flex items-center gap-1.5 px-2 py-1 bg-blue-50 rounded-lg"
                >
                  <UserCheck class="w-3 h-3 text-blue-600" />
                  <span class="text-sm text-blue-900">{{ getTeamMemberName(memberId) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 메모 -->
          <div v-if="schedule.notes" class="flex items-start gap-3">
            <div class="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText class="w-5 h-5 text-gray-600" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-semibold text-gray-700 mb-2">메모</p>
              <div class="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ schedule.notes }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 진행 체크리스트 (면접일 때만) -->
        <div v-if="isInterviewType" class="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <h4 class="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
            <CheckSquare class="w-4 h-4" />
            진행 체크리스트
          </h4>
          <div class="space-y-2">
            <label class="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:bg-white p-2 rounded transition">
              <input type="checkbox" class="w-4 h-4 text-slate-600 rounded" />
              <span>면접 자료 준비 완료</span>
            </label>
            <label class="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:bg-white p-2 rounded transition">
              <input type="checkbox" class="w-4 h-4 text-slate-600 rounded" />
              <span>후보자 연락 완료</span>
            </label>
            <label class="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:bg-white p-2 rounded transition">
              <input type="checkbox" class="w-4 h-4 text-slate-600 rounded" />
              <span>회의실 예약 완료</span>
            </label>
            <label class="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:bg-white p-2 rounded transition">
              <input type="checkbox" class="w-4 h-4 text-slate-600 rounded" />
              <span>면접관 일정 확인 완료</span>
            </label>
          </div>
        </div>

        <!-- 다음 단계 안내 -->
        <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div class="flex items-start gap-3">
            <Info class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p class="text-sm font-semibold text-blue-900 mb-1">다음 단계</p>
              <p class="text-sm text-blue-700">{{ getNextStepGuide(schedule.type) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3 rounded-b-xl">
        <button 
          @click="handleDelete" 
          class="px-4 py-2.5 border border-red-300 rounded-lg text-red-700 font-medium hover:bg-red-50 transition flex items-center gap-2"
        >
          <Trash2 class="w-4 h-4" />
          삭제
        </button>
        <button 
          @click="handleEdit" 
          class="flex-1 px-4 py-2.5 bg-slate-600 text-white rounded-lg font-medium hover:bg-slate-700 transition flex items-center justify-center gap-2"
        >
          <Edit class="w-4 h-4" />
          수정하기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { 
  X, Calendar, Clock, MapPin, UserCircle2, Share2, UserCheck, FileText, 
  Briefcase, Activity, Info, Edit, Trash2, CheckSquare
} from 'lucide-vue-next'

// Props
interface TeamMember {
  id: number
  name: string
  role: string
  department: string
}

interface Schedule {
  id: number
  type: string
  candidateName?: string
  title?: string
  position?: string
  date: string
  endDate?: string
  time?: string
  location?: string
  priority: string
  status: string
  interviewer?: string
  notes?: string
  sharedWith?: number[]
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
  'edit': [scheduleId: number]
  'delete': [scheduleId: number]
}>()

// Computed
const isInterviewType = computed(() => {
  if (!props.schedule) return false
  return ['document_review', 'interview_1', 'interview_2', 'interview_final', 'negotiation'].includes(props.schedule.type)
})

// Methods
const closeModal = () => {
  emit('close')
}

const handleEdit = () => {
  if (props.schedule) {
    emit('edit', props.schedule.id)
  }
}

const handleDelete = () => {
  if (props.schedule) {
    emit('delete', props.schedule.id)
  }
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()]
  return `${year}년 ${month}월 ${day}일 (${dayOfWeek})`
}

const getDaysDifference = (startDate: string, endDate: string) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  return diff + 1
}

const getTeamMemberName = (memberId: number) => {
  const member = props.teamMembers.find(m => m.id === memberId)
  return member ? member.name : `멤버 ${memberId}`
}

const getScheduleIcon = (type: string) => {
  const iconMap: Record<string, any> = {
    document_review: FileText,
    interview_1: UserCircle2,
    interview_2: UserCircle2,
    interview_final: Briefcase,
    negotiation: UserCircle2,
    onboarding_prep: FileText,
    onboarding: Activity,
    follow_up: UserCircle2,
    meeting: UserCircle2,
    event: Calendar
  }
  return iconMap[type] || Calendar
}

const getScheduleIconBg = (type: string) => {
  const bgMap: Record<string, string> = {
    document_review: 'bg-orange-100',
    interview_1: 'bg-blue-100',
    interview_2: 'bg-indigo-100',
    interview_final: 'bg-purple-100',
    negotiation: 'bg-pink-100',
    onboarding_prep: 'bg-green-100',
    onboarding: 'bg-emerald-100',
    follow_up: 'bg-teal-100',
    meeting: 'bg-gray-100',
    event: 'bg-yellow-100'
  }
  return bgMap[type] || 'bg-gray-100'
}

const getScheduleIconColor = (type: string) => {
  const colorMap: Record<string, string> = {
    document_review: 'text-orange-600',
    interview_1: 'text-blue-600',
    interview_2: 'text-indigo-600',
    interview_final: 'text-purple-600',
    negotiation: 'text-pink-600',
    onboarding_prep: 'text-green-600',
    onboarding: 'text-emerald-600',
    follow_up: 'text-teal-600',
    meeting: 'text-gray-600',
    event: 'text-yellow-600'
  }
  return colorMap[type] || 'text-gray-600'
}

const getScheduleTypeLabel = (type: string) => {
  const labelMap: Record<string, string> = {
    document_review: '서류 전형',
    interview_1: '1차 면접',
    interview_2: '2차 면접',
    interview_final: '최종 면접',
    negotiation: '처우 협상',
    onboarding_prep: '온보딩 준비',
    onboarding: '온보딩',
    follow_up: '사후 관리',
    meeting: '팀 회의',
    event: '채용 이벤트'
  }
  return labelMap[type] || type
}

const getScheduleTypeBadge = (type: string) => {
  const badgeMap: Record<string, string> = {
    document_review: 'bg-orange-100 text-orange-700',
    interview_1: 'bg-blue-100 text-blue-700',
    interview_2: 'bg-indigo-100 text-indigo-700',
    interview_final: 'bg-purple-100 text-purple-700',
    negotiation: 'bg-pink-100 text-pink-700',
    onboarding_prep: 'bg-green-100 text-green-700',
    onboarding: 'bg-emerald-100 text-emerald-700',
    follow_up: 'bg-teal-100 text-teal-700',
    meeting: 'bg-gray-100 text-gray-700',
    event: 'bg-yellow-100 text-yellow-700'
  }
  return badgeMap[type] || 'bg-gray-100 text-gray-700'
}

const getStatusLabel = (status: string) => {
  const labelMap: Record<string, string> = {
    scheduled: '예정됨',
    in_progress: '진행중',
    completed: '완료',
    cancelled: '취소됨',
    postponed: '연기됨'
  }
  return labelMap[status] || status
}

const getStatusBadge = (status: string) => {
  const badgeMap: Record<string, string> = {
    scheduled: 'px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded',
    in_progress: 'px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-700 rounded',
    completed: 'px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded',
    cancelled: 'px-2 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded',
    postponed: 'px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-700 rounded'
  }
  return badgeMap[status] || 'px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-700 rounded'
}

const getNextStepGuide = (type: string) => {
  const guideMap: Record<string, string> = {
    document_review: '서류 검토 완료 후 합격자에게 1차 면접 일정을 안내하세요.',
    interview_1: '1차 면접 평가 완료 후 2차 면접 일정을 조율하세요.',
    interview_2: '2차 면접 결과를 종합하여 최종 면접 여부를 결정하세요.',
    interview_final: '최종 합격 시 처우 협상 일정을 잡으세요.',
    negotiation: '협상 완료 후 온보딩 준비를 시작하세요.',
    onboarding_prep: '온보딩에 필요한 자료와 환경을 준비하세요.',
    onboarding: '신입 사원이 잘 적응할 수 있도록 지속적으로 지원하세요.',
    follow_up: '정기적인 피드백과 면담을 통해 적응 상태를 확인하세요.',
    meeting: '회의록을 작성하고 다음 액션 아이템을 정리하세요.',
    event: '이벤트 결과를 분석하고 다음 이벤트 계획에 반영하세요.'
  }
  return guideMap[type] || '일정을 완료하고 다음 단계를 진행하세요.'
}
</script>
