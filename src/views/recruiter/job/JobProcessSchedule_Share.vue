<template>
  <!-- 일정 공유 모달 (JobProcessSchedule용) -->
  <div v-if="showModal" class="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50 p-4" @click="closeModal">
    <div class="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" @click.stop>
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Share2 class="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900">일정 공유</h2>
            <p class="text-sm text-gray-500">팀원들과 일정을 공유하세요</p>
          </div>
        </div>
        <button @click="closeModal" class="p-2 hover:bg-gray-100 rounded-lg transition">
          <X class="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 space-y-6">
        <!-- 공유할 일정 선택 -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <label class="block text-sm font-semibold text-gray-700">공유할 일정 선택</label>
            <div class="flex gap-2">
              <button @click="selectAllSchedules" class="text-xs text-blue-600 hover:text-blue-700 font-medium">
                전체 선택
              </button>
              <span class="text-gray-300">|</span>
              <button @click="clearAllSchedules" class="text-xs text-gray-600 hover:text-gray-700 font-medium">
                선택 해제
              </button>
            </div>
          </div>
          <div class="max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3 space-y-2 bg-gray-50">
            <div 
              v-for="schedule in availableSchedules" 
              :key="schedule.id" 
              class="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-blue-50 transition cursor-pointer" 
              @click="toggleSchedule(schedule.id)"
            >
              <input 
                type="checkbox" 
                :checked="selectedSchedules.includes(schedule.id)" 
                class="w-4 h-4 text-blue-600 rounded" 
                @click.stop 
              />
              <div class="flex-1 min-w-0">
                <p class="font-medium text-sm text-gray-900 truncate">
                  {{ schedule.candidateName || schedule.title }}
                </p>
                <p class="text-xs text-gray-500">{{ schedule.date }} · {{ schedule.time }}</p>
              </div>
              <span :class="['text-xs px-2 py-1 rounded font-medium', getScheduleColorClass(schedule)]">
                {{ getScheduleTypeLabel(schedule.type) }}
              </span>
              <UserCheck 
                v-if="schedule.sharedWith && schedule.sharedWith.length > 0" 
                class="w-4 h-4 text-blue-500 flex-shrink-0" 
                title="이미 공유된 일정"
              />
            </div>
            <p v-if="availableSchedules.length === 0" class="text-center text-sm text-gray-500 py-4">
              공유 가능한 일정이 없습니다
            </p>
          </div>
          <p class="text-xs text-gray-500 mt-2">
            {{ selectedSchedules.length }}개의 일정이 선택되었습니다
          </p>
        </div>

        <!-- 공유 대상 선택 -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <label class="block text-sm font-semibold text-gray-700">공유 대상 선택</label>
            <div class="flex gap-2">
              <button @click="selectAllMembers" class="text-xs text-blue-600 hover:text-blue-700 font-medium">
                전체 선택
              </button>
              <span class="text-gray-300">|</span>
              <button @click="clearAllMembers" class="text-xs text-gray-600 hover:text-gray-700 font-medium">
                선택 해제
              </button>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div 
              v-for="member in teamMembers" 
              :key="member.id" 
              class="flex items-center gap-3 p-3 border-2 rounded-lg transition cursor-pointer" 
              :class="selectedMembers.includes(member.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'" 
              @click="toggleMember(member.id)"
            >
              <input 
                type="checkbox" 
                :checked="selectedMembers.includes(member.id)" 
                class="w-4 h-4 text-blue-600 rounded" 
                @click.stop 
              />
              <div class="flex-1 min-w-0">
                <p class="font-medium text-sm text-gray-900">{{ member.name }}</p>
                <p class="text-xs text-gray-500 truncate">{{ member.role }} · {{ member.department }}</p>
              </div>
            </div>
          </div>
          <p class="text-xs text-gray-500 mt-2">
            {{ selectedMembers.length }}명이 선택되었습니다
          </p>
        </div>

        <!-- 권한 설정 -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-3">공유 권한</label>
          <div class="space-y-2">
            <label 
              class="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition" 
              :class="shareSettings.permission === 'view' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'"
            >
              <input 
                v-model="shareSettings.permission" 
                type="radio" 
                value="view" 
                class="w-4 h-4 text-blue-600" 
              />
              <div class="flex-1">
                <p class="font-medium text-gray-900">보기 전용</p>
                <p class="text-xs text-gray-500">일정을 확인만 할 수 있습니다</p>
              </div>
              <Eye class="w-5 h-5 text-gray-400" />
            </label>
            <label 
              class="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition" 
              :class="shareSettings.permission === 'edit' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'"
            >
              <input 
                v-model="shareSettings.permission" 
                type="radio" 
                value="edit" 
                class="w-4 h-4 text-blue-600" 
              />
              <div class="flex-1">
                <p class="font-medium text-gray-900">편집 가능</p>
                <p class="text-xs text-gray-500">일정을 수정하고 관리할 수 있습니다</p>
              </div>
              <Edit class="w-5 h-5 text-gray-400" />
            </label>
          </div>
        </div>

        <!-- 알림 설정 -->
        <div>
          <label class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
            <input 
              v-model="shareSettings.sendNotification" 
              type="checkbox" 
              class="w-5 h-5 text-blue-600 rounded" 
            />
            <div class="flex-1">
              <p class="font-medium text-gray-900">알림 보내기</p>
              <p class="text-sm text-gray-500">공유 대상에게 이메일 알림을 전송합니다</p>
            </div>
            <Mail class="w-5 h-5 text-gray-400" />
          </label>
        </div>

        <!-- 메시지 -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            메시지 (선택사항)
          </label>
          <textarea 
            v-model="shareSettings.message" 
            rows="3" 
            placeholder="일정 공유와 함께 전달할 메시지를 입력하세요..." 
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
          ></textarea>
          <p class="text-xs text-gray-500 mt-1">
            {{ shareSettings.message.length }}/500 자
          </p>
        </div>

        <!-- 공유 요약 -->
        <div v-if="selectedSchedules.length > 0 && selectedMembers.length > 0" class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div class="flex items-start gap-3">
            <Info class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div class="flex-1">
              <p class="text-sm font-semibold text-blue-900 mb-1">공유 요약</p>
              <p class="text-xs text-blue-700">
                <strong>{{ selectedSchedules.length }}개</strong>의 일정을 
                <strong>{{ selectedMembers.length }}명</strong>에게 
                <strong>{{ shareSettings.permission === 'view' ? '보기 전용' : '편집 가능' }}</strong> 권한으로 공유합니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3 rounded-b-xl">
        <button 
          @click="closeModal" 
          class="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-white transition"
        >
          취소
        </button>
        <button 
          @click="confirmShare" 
          :disabled="!canShare" 
          :class="[
            'flex-1 px-4 py-2.5 rounded-lg text-white font-medium transition flex items-center justify-center gap-2',
            canShare ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'
          ]"
        >
          <Share2 class="w-4 h-4" />
          {{ selectedSchedules.length }}건 일정을 {{ selectedMembers.length }}명에게 공유
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Share2, X, Mail, Eye, Edit, UserCheck, Info } from 'lucide-vue-next'

// Props
interface Schedule {
  id: number
  type: string
  candidateName?: string
  title?: string
  date: string
  time: string
  sharedWith?: number[]
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
  availableSchedules?: Schedule[]
  teamMembers?: TeamMember[]
}

const props = withDefaults(defineProps<Props>(), {
  showModal: false,
  availableSchedules: () => [],
  teamMembers: () => []
})

// Emits
const emit = defineEmits<{
  'close': []
  'confirm': [{
    members: number[]
    schedules: number[]
    settings: {
      permission: string
      sendNotification: boolean
      message: string
    }
  }]
}>()

// State
const selectedMembers = ref<number[]>([])
const selectedSchedules = ref<number[]>([])
const shareSettings = ref({
  permission: 'view',
  sendNotification: true,
  message: ''
})

// Computed
const canShare = computed(() => {
  return selectedMembers.value.length > 0 && selectedSchedules.value.length > 0
})

// Methods
const toggleMember = (memberId: number) => {
  const index = selectedMembers.value.indexOf(memberId)
  if (index > -1) {
    selectedMembers.value.splice(index, 1)
  } else {
    selectedMembers.value.push(memberId)
  }
}

const selectAllMembers = () => {
  selectedMembers.value = props.teamMembers.map(m => m.id)
}

const clearAllMembers = () => {
  selectedMembers.value = []
}

const toggleSchedule = (scheduleId: number) => {
  const index = selectedSchedules.value.indexOf(scheduleId)
  if (index > -1) {
    selectedSchedules.value.splice(index, 1)
  } else {
    selectedSchedules.value.push(scheduleId)
  }
}

const selectAllSchedules = () => {
  selectedSchedules.value = props.availableSchedules.map(s => s.id)
}

const clearAllSchedules = () => {
  selectedSchedules.value = []
}

const closeModal = () => {
  emit('close')
  resetState()
}

const confirmShare = () => {
  if (!canShare.value) return
  
  emit('confirm', {
    members: selectedMembers.value,
    schedules: selectedSchedules.value,
    settings: { ...shareSettings.value }
  })
  
  resetState()
}

const resetState = () => {
  selectedMembers.value = []
  selectedSchedules.value = []
  shareSettings.value = {
    permission: 'view',
    sendNotification: true,
    message: ''
  }
}

// Helper functions
const getScheduleColorClass = (schedule: Schedule) => {
  const typeColors: Record<string, string> = {
    document_review: 'bg-orange-100 text-orange-700',
    interview_1: 'bg-blue-100 text-blue-700',
    interview_2: 'bg-indigo-100 text-indigo-700',
    interview_final: 'bg-purple-100 text-purple-700',
    negotiation: 'bg-pink-100 text-pink-700',
    onboarding_prep: 'bg-green-100 text-green-700',
    onboarding: 'bg-green-100 text-green-700',
    follow_up: 'bg-teal-100 text-teal-700',
    meeting: 'bg-gray-100 text-gray-700',
    event: 'bg-yellow-100 text-yellow-700'
  }
  return typeColors[schedule.type] || 'bg-gray-100 text-gray-700'
}

const getScheduleTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    document_review: '서류전형',
    interview_1: '1차면접',
    interview_2: '2차면접',
    interview_final: '최종면접',
    negotiation: '처우협상',
    onboarding_prep: '온보딩준비',
    onboarding: '온보딩',
    follow_up: '사후관리',
    meeting: '회의',
    event: '이벤트'
  }
  return labels[type] || type
}
</script>
