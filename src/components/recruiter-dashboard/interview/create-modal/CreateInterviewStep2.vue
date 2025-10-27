<script setup lang="ts">
import { ref } from 'vue'
import {
  Check,
  Plus,
  Search,
  UserPlus,
  X
} from 'lucide-vue-next'

interface SelectedInterviewer {
  id: number
  name: string
  position: string
  initial: string
  role: string
  area: string
}

interface AvailableInterviewer {
  id: number
  name: string
  initial: string
  position: string
  weekCount: number
  status: 'available' | 'busy' | 'unavailable'
}

const props = defineProps<{
  interviewData: any
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'next', data: any): void
  (e: 'back'): void
}>()

const selectedInterviewers = ref<SelectedInterviewer[]>([
  {
    id: 1,
    name: '박면접',
    position: '개발팀 팀장',
    initial: '박',
    role: '주 면접관',
    area: '기술 역량'
  },
  {
    id: 2,
    name: '이평가',
    position: '시니어 개발자',
    initial: '이',
    role: '보조 면접관',
    area: '기술 역량'
  },
  {
    id: 3,
    name: '김디자인',
    position: '리드 디자이너',
    initial: '김',
    role: '보조 면접관',
    area: '커뮤니케이션'
  }
])

const availableInterviewers = ref<AvailableInterviewer[]>([
  { id: 4, name: '정개발', initial: '정', position: '백엔드 개발자', weekCount: 5, status: 'available' },
  { id: 5, name: '송마케팅', initial: '송', position: '마케팅 팀장', weekCount: 3, status: 'available' },
  { id: 6, name: '최데이터', initial: '최', position: '데이터 분석가', weekCount: 12, status: 'busy' },
  { id: 7, name: '강기획', initial: '강', position: '프로덕트 매니저', weekCount: 4, status: 'available' },
  { id: 8, name: '윤디자인', initial: '윤', position: 'UI 디자이너', weekCount: 0, status: 'unavailable' }
])

const searchQuery = ref('')

const removeInterviewer = (id: number) => {
  selectedInterviewers.value = selectedInterviewers.value.filter(i => i.id !== id)
}

const addInterviewer = (interviewer: AvailableInterviewer) => {
  if (interviewer.status !== 'available') return

  selectedInterviewers.value.push({
    id: interviewer.id,
    name: interviewer.name,
    position: interviewer.position,
    initial: interviewer.initial,
    role: '보조 면접관',
    area: '기술 역량'
  })
}

const getStatusBadge = (status: string) => {
  const badges = {
    available: { label: '대기중', class: 'bg-green-100 text-green-700' },
    busy: { label: '과부하', class: 'bg-yellow-100 text-yellow-700' },
    unavailable: { label: '부재중', class: 'bg-red-100 text-red-700' }
  }
  return badges[status as keyof typeof badges]
}

const getInitialColor = (index: number) => {
  const colors = [
    'from-slate-600 to-slate-800',
    'from-blue-600 to-blue-800',
    'from-purple-600 to-purple-800',
    'from-green-600 to-green-800',
    'from-orange-600 to-orange-800'
  ]
  return colors[index % colors.length]
}

const handleNext = () => {
  emit('next', {
    ...props.interviewData,
    interviewers: selectedInterviewers.value
  })
}

const handleBack = () => {
  emit('back')
}

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <!-- Step Indicator -->
  <div class="px-8 py-4 bg-slate-50 border-b border-slate-200">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-2 flex-1">
        <div class="flex items-center space-x-2 flex-1">
          <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <Check :size="16" class="text-white" />
          </div>
          <span class="text-sm font-medium text-slate-800">기본 정보</span>
        </div>
        <div class="flex-1 h-1 bg-slate-600"></div>
      </div>
      <div class="flex items-center space-x-2 flex-1">
        <div class="flex items-center space-x-2 flex-1">
          <div class="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
            <span class="text-white text-sm font-bold">2</span>
          </div>
          <span class="text-sm font-medium text-slate-800">면접관 배정</span>
        </div>
        <div class="flex-1 h-1 bg-slate-200"></div>
      </div>
      <div class="flex items-center space-x-2">
        <div class="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
          <span class="text-slate-500 text-sm font-bold">3</span>
        </div>
        <span class="text-sm font-medium text-slate-500">확인</span>
      </div>
    </div>
  </div>

  <!-- Form Content -->
  <div class="px-8 py-6 overflow-y-auto flex-1">
    <!-- 면접 정보 요약 -->
    <div class="bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl p-6 text-white mb-6">
      <div class="grid grid-cols-4 gap-4">
        <div>
          <p class="text-xs text-slate-200 mb-1">지원자</p>
          <p class="text-sm font-bold">김지원</p>
        </div>
        <div>
          <p class="text-xs text-slate-200 mb-1">포지션</p>
          <p class="text-sm font-bold">프론트엔드 개발자</p>
        </div>
        <div>
          <p class="text-xs text-slate-200 mb-1">일시</p>
          <p class="text-sm font-bold">2025.10.25 14:00</p>
        </div>
        <div>
          <p class="text-xs text-slate-200 mb-1">장소</p>
          <p class="text-sm font-bold">회의실 A</p>
        </div>
      </div>
    </div>

    <!-- 선택된 면접관 -->
    <div class="bg-blue-50 rounded-xl p-6 border border-blue-200 mb-6">
      <h3 class="text-sm font-bold text-slate-800 mb-4 flex items-center justify-between">
            <span class="flex items-center">
              <CheckCircle :size="16" class="mr-2 text-blue-600" />
              선택된 면접관
            </span>
        <span class="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-lg">
              {{ selectedInterviewers.length }}명
            </span>
      </h3>
      <div class="space-y-3">
        <div
          v-for="(interviewer, index) in selectedInterviewers"
          :key="interviewer.id"
          class="bg-white rounded-xl p-4 border border-blue-200 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center space-x-3">
              <div
                class="w-12 h-12 bg-gradient-to-br rounded-xl flex items-center justify-center"
                :class="getInitialColor(index)">
                <span class="text-white font-bold text-lg">{{ interviewer.initial }}</span>
              </div>
              <div>
                <p class="text-sm font-bold text-slate-800">{{ interviewer.name }}</p>
                <p class="text-xs text-slate-500">{{ interviewer.position }}</p>
              </div>
            </div>
            <button
              @click="removeInterviewer(interviewer.id)"
              class="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-all">
              <X :size="20" />
            </button>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-slate-600 mb-1">면접관 역할</label>
              <select
                v-model="interviewer.role"
                class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600 bg-white">
                <option>주 면접관</option>
                <option>보조 면접관</option>
                <option>참관</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-600 mb-1">평가 영역</label>
              <select
                v-model="interviewer.area"
                class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600 bg-white">
                <option>기술 역량</option>
                <option>문제 해결력</option>
                <option>커뮤니케이션</option>
                <option>인성</option>
                <option>종합</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 추가 가능한 면접관 -->
    <div class="bg-slate-50 rounded-xl p-6 border border-slate-200">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-bold text-slate-800 flex items-center">
          <UserPlus :size="16" class="mr-2" />
          면접관 추가
        </h3>
        <div class="relative w-64">
          <Search :size="16"
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="이름, 부서 검색..."
            class="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600" />
        </div>
      </div>

      <div class="space-y-2 max-h-80 overflow-y-auto">
        <div
          v-for="(interviewer, index) in availableInterviewers"
          :key="interviewer.id"
          class="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl transition-all"
          :class="[
                interviewer.status === 'available' ? 'hover:border-slate-400 cursor-pointer' : 'opacity-60'
              ]">
          <div class="flex items-center space-x-3">
            <div
              class="w-10 h-10 bg-gradient-to-br rounded-xl flex items-center justify-center"
              :class="[
                    interviewer.status === 'available' ? getInitialColor(index + 3) : 'from-slate-400 to-slate-600'
                  ]">
              <span class="text-white font-bold">{{ interviewer.initial }}</span>
            </div>
            <div>
              <p class="text-sm font-bold text-slate-800">{{ interviewer.name }}</p>
              <p class="text-xs text-slate-500">
                {{ interviewer.position }} ·
                {{ interviewer.status === 'unavailable' ? '휴가중' : `이번주 ${interviewer.weekCount}건 예정`
                }}
              </p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
                <span
                  class="px-3 py-1 text-xs font-semibold rounded-lg"
                  :class="getStatusBadge(interviewer.status).class">
                  {{ getStatusBadge(interviewer.status).label }}
                </span>
            <button
              @click="addInterviewer(interviewer)"
              :disabled="interviewer.status !== 'available'"
              class="p-2 rounded-lg transition-all"
              :class="[
                    interviewer.status === 'available'
                      ? 'bg-slate-600 hover:bg-slate-700 text-white'
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  ]">
              <Plus :size="16" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
