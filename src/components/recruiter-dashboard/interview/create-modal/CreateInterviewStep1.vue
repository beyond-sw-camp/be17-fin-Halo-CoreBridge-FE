<script setup lang="ts">
import { ref } from 'vue'
import {
  User,
  Clipboard,
  Calendar,
  MapPin,
  Users,
  FileText
} from 'lucide-vue-next'

interface Applicant {
  id: number
  name: string
  position: string
  experience: string
}

interface Room {
  id: number
  name: string
  location: string
  status: 'available' | 'in-use'
}

interface Interviewer {
  id: number
  name: string
  position: string
  initial: string
  status: 'available' | 'busy'
  weekCount: number
}

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'next', data: any): void
}>()

const formData = ref({
  applicantId: null as number | null,
  position: '',
  interviewType: '1차 면접',
  interviewMode: '오프라인 면접',
  title: '',
  date: '2025-10-25',
  time: '14:00',
  duration: '60분',
  roomId: null as number | null,
  roomLocation: '',
  selectedInterviewers: [] as number[],
  memo: ''
})

const applicants = ref<Applicant[]>([
  { id: 1, name: '김지원', position: '프론트엔드 개발자', experience: '3년' },
  { id: 2, name: '최민수', position: '백엔드 개발자', experience: '5년' },
  { id: 3, name: '한예린', position: 'UX/UI 디자이너', experience: '2년' },
  { id: 4, name: '오성민', position: '마케팅 매니저', experience: '4년' }
])

const rooms = ref<Room[]>([
  { id: 1, name: '회의실 A', location: '본관 3층 301호', status: 'available' },
  { id: 2, name: '회의실 C', location: '본관 4층 401호', status: 'available' },
  { id: 3, name: '화상 면접실 1', location: 'Zoom 화상 회의', status: 'available' },
  { id: 4, name: '임원실', location: '본관 5층 임원실', status: 'available' }
])

const interviewers = ref<Interviewer[]>([
  { id: 1, name: '박면접', position: '개발팀 팀장', initial: '박', status: 'available', weekCount: 8 },
  { id: 2, name: '이평가', position: '시니어 개발자', initial: '이', status: 'available', weekCount: 6 },
  { id: 3, name: '김디자인', position: '리드 디자이너', initial: '김', status: 'available', weekCount: 5 }
])

const currentStep = ref(1)

const onApplicantChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const applicantId = Number(target.value)
  const applicant = applicants.value.find(a => a.id === applicantId)
  if (applicant) {
    formData.value.position = applicant.position
  }
}

const onRoomChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const roomId = Number(target.value)
  const room = rooms.value.find(r => r.id === roomId)
  if (room) {
    formData.value.roomLocation = room.location
  }
}

</script>

<template>

  <div class="px-8 py-4 bg-slate-50 border-b border-slate-200">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-2 flex-1">
        <div class="flex items-center space-x-2 flex-1">
          <div class="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
            <span class="text-white text-sm font-bold">1</span>
          </div>
          <span class="text-sm font-medium text-slate-800">기본 정보</span>
        </div>
        <div class="flex-1 h-1 bg-slate-200"></div>
      </div>
      <div class="flex items-center space-x-2 flex-1">
        <div class="flex items-center space-x-2 flex-1">
          <div class="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
            <span class="text-slate-500 text-sm font-bold">2</span>
          </div>
          <span class="text-sm font-medium text-slate-500">면접관 배정</span>
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
    <!-- Step Indicator -->
    <form class="space-y-6" @submit.prevent="handleNext">


      <!-- 지원자 정보 -->
      <div class="bg-slate-50 rounded-xl p-6 border border-slate-200">
        <h3 class="text-sm font-bold text-slate-800 mb-4 flex items-center">
          <User :size="16" class="mr-2" />
          지원자 정보
        </h3>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">지원자 선택 *</label>
            <select
              v-model="formData.applicantId"
              @change="onApplicantChange"
              class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-600 bg-white"
              required>
              <option :value="null">지원자를 선택하세요</option>
              <option v-for="applicant in applicants" :key="applicant.id" :value="applicant.id">
                {{ applicant.name }} - {{ applicant.position }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">포지션</label>
            <input
              v-model="formData.position"
              type="text"
              readonly
              class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-slate-100 text-slate-600" />
          </div>
        </div>
      </div>

      <!-- 면접 기본 정보 -->
      <div class="bg-slate-50 rounded-xl p-6 border border-slate-200">
        <h3 class="text-sm font-bold text-slate-800 mb-4 flex items-center">
          <Clipboard :size="16" class="mr-2" />
          면접 기본 정보
        </h3>
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">면접 유형 *</label>
              <select
                v-model="formData.interviewType"
                class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-600 bg-white">
                <option>1차 면접</option>
                <option>2차 면접</option>
                <option>최종 면접</option>
                <option>실무 면접</option>
                <option>인성 면접</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">면접 방식 *</label>
              <select
                v-model="formData.interviewMode"
                class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-600 bg-white">
                <option>오프라인 면접</option>
                <option>화상 면접</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">면접 제목 *</label>
            <input
              v-model="formData.title"
              type="text"
              placeholder="예) 프론트엔드 개발자 1차 기술 면접"
              class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-600"
              required />
          </div>
        </div>
      </div>

      <!-- 일정 정보 -->
      <div class="bg-slate-50 rounded-xl p-6 border border-slate-200">
        <h3 class="text-sm font-bold text-slate-800 mb-4 flex items-center">
          <Calendar :size="16" class="mr-2" />
          일정 정보
        </h3>
        <div class="space-y-4">
          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">면접 날짜 *</label>
              <input
                v-model="formData.date"
                type="date"
                class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-600"
                required />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">시작 시간 *</label>
              <input
                v-model="formData.time"
                type="time"
                class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-600"
                required />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">소요 시간 *</label>
              <select
                v-model="formData.duration"
                class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-600 bg-white">
                <option>30분</option>
                <option>60분</option>
                <option>90분</option>
                <option>120분</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- 장소 정보 -->
      <div class="bg-slate-50 rounded-xl p-6 border border-slate-200">
        <h3 class="text-sm font-bold text-slate-800 mb-4 flex items-center">
          <MapPin :size="16" class="mr-2" />
          장소 정보
        </h3>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">면접 장소 *</label>
            <select
              v-model="formData.roomId"
              @change="onRoomChange"
              class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-600 bg-white"
              required>
              <option :value="null">장소를 선택하세요</option>
              <option v-for="room in rooms" :key="room.id" :value="room.id">
                {{ room.name }} ({{ room.status === 'available' ? '사용 가능' : '사용중' }})
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">위치</label>
            <input
              v-model="formData.roomLocation"
              type="text"
              readonly
              class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-slate-100 text-slate-600" />
          </div>
        </div>
      </div>

      <!-- 면접관 선택 -->
      <div class="bg-slate-50 rounded-xl p-6 border border-slate-200">
        <h3 class="text-sm font-bold text-slate-800 mb-4 flex items-center">
          <Users :size="16" class="mr-2" />
          면접관 선택
        </h3>
        <div class="space-y-3">
          <div
            v-for="interviewer in interviewers"
            :key="interviewer.id"
            class="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-all cursor-pointer">
            <div class="flex items-center space-x-3">
              <input
                v-model="formData.selectedInterviewers"
                type="checkbox"
                :value="interviewer.id"
                class="w-5 h-5 text-slate-600 border-slate-300 rounded focus:ring-slate-500" />
              <div class="flex items-center space-x-3">
                <div
                  class="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center">
                  <span class="text-white font-bold">{{ interviewer.initial }}</span>
                </div>
                <div>
                  <p class="text-sm font-bold text-slate-800">{{ interviewer.name }}</p>
                  <p class="text-xs text-slate-500">{{ interviewer.position }} ·
                    {{ interviewer.weekCount }}건 예정</p>
                </div>
              </div>
            </div>
            <span
              class="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-lg">대기중</span>
          </div>
        </div>
      </div>

      <!-- 추가 정보 -->
      <div class="bg-slate-50 rounded-xl p-6 border border-slate-200">
        <h3 class="text-sm font-bold text-slate-800 mb-4 flex items-center">
          <FileText :size="16" class="mr-2" />
          추가 정보
        </h3>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">메모 (선택)</label>
          <textarea
            v-model="formData.memo"
            rows="4"
            placeholder="면접과 관련된 메모나 특이사항을 입력하세요..."
            class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-600 resize-none"></textarea>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped></style>
