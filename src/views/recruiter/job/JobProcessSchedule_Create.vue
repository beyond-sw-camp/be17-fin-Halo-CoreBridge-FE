<template>
  <!-- 일정 생성/수정 모달 (JobProcessSchedule용 - Recurring 기능 포함) -->
  <div v-if="showModal" class="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50 p-4" @click="closeModal">
    <div class="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" @click.stop>
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl z-10">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-slate-500 to-slate-600 rounded-lg flex items-center justify-center">
            <CalendarPlus class="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900">
              {{ editingId ? '일정 수정' : '새 일정 만들기' }}
            </h2>
            <p class="text-sm text-gray-500">채용 프로세스 일정을 등록하세요</p>
          </div>
        </div>
        <button @click="closeModal" class="p-2 hover:bg-gray-100 rounded-lg transition">
          <X class="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div v-if="formData.startDate && formData.endDate" class="m-5 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div class="flex items-center gap-2 text-sm text-blue-700">
          <CalendarDays class="w-4 h-4" />
          <span class="font-semibold">선택된 기간:</span>
          <span>{{ formData.startDate }}</span>
          <span v-if="formData.startDate !== formData.endDate">~ {{ formData.endDate }}</span>
          <span class="ml-2 px-2 py-0.5 bg-blue-200 rounded-full text-xs font-bold">{{ getDaysDifference() }}일</span>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- 왼쪽 컬럼: 기본 정보 -->
          <div class="space-y-5">
            <!-- 일정 유형 -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                일정 유형 <span class="text-red-500">*</span>
              </label>
              <select 
                v-model="formData.type" 
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
              >
                <option value="">유형을 선택하세요</option>
                <option value="document_review">📄 서류 전형</option>
                <option value="interview_1">💼 1차 면접</option>
                <option value="interview_2">👥 2차 면접</option>
                <option value="interview_final">⭐ 최종 면접</option>
                <option value="negotiation">💰 처우 협상</option>
                <option value="onboarding_prep">📋 온보딩 준비</option>
                <option value="onboarding">🎉 온보딩</option>
                <option value="follow_up">📞 사후 관리</option>
                <option value="meeting">🤝 팀 회의</option>
                <option value="event">📅 채용 이벤트</option>
              </select>
            </div>

            <!-- 제목/후보자명 -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                {{ isInterviewType ? '후보자명' : '일정 제목' }} <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="formData.title" 
                type="text" 
                :placeholder="isInterviewType ? '후보자 이름을 입력하세요' : '일정 제목을 입력하세요'" 
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
              />
            </div>

            <!-- 포지션 (면접/협상일 때만) -->
            <div v-if="isInterviewType">
              <label class="block text-sm font-semibold text-gray-700 mb-2">포지션</label>
              <input 
                v-model="formData.position" 
                type="text" 
                placeholder="지원 포지션 (예: 프론트엔드 개발자)" 
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
              />
            </div>

            <!-- 날짜 -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                날짜 <span class="text-red-500">*</span>
              </label>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs text-gray-500 mb-1">시작일</label>
                  <input 
                    v-model="formData.startDate" 
                    type="date" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                  />
                </div>
                <div>
                  <label class="block text-xs text-gray-500 mb-1">종료일</label>
                  <input 
                    v-model="formData.endDate" 
                    type="date" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                  />
                </div>
              </div>
              <p v-if="daysDifference > 0" class="text-xs text-gray-500 mt-1">
                총 {{ daysDifference }}일 일정
              </p>
            </div>

            <!-- 시간 (30분 단위) -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">시간</label>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs text-gray-500 mb-1">시작 시간</label>
                  <select 
                    v-model="formData.startTime" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm bg-white"
                  >
                    <option value="">선택</option>
                    <option v-for="time in timeOptions" :key="time" :value="time">{{ time }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs text-gray-500 mb-1">종료 시간</label>
                  <select 
                    v-model="formData.endTime" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm bg-white"
                  >
                    <option value="">선택</option>
                    <option v-for="time in timeOptions" :key="time" :value="time">{{ time }}</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- 장소 -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">장소</label>
              <input 
                v-model="formData.location" 
                type="text" 
                placeholder="회의실, Zoom 링크, 온라인 등" 
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
              />
            </div>

            <!-- 담당자/면접관 (teamMembers에서 선택) -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                {{ isInterviewType ? '면접관' : '담당자' }}
              </label>
              <select 
                v-model="formData.interviewer" 
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm bg-white"
              >
                <option value="">선택하세요</option>
                <option v-for="member in teamMembers" :key="member.id" :value="member.name">
                  {{ member.name }} ({{ member.role }} · {{ member.department }})
                </option>
              </select>
              <p class="text-xs text-gray-500 mt-1">팀원 목록에서 담당자를 선택할 수 있습니다</p>
            </div>

            <!-- 우선순위 -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">우선순위</label>
              <div class="grid grid-cols-3 gap-2">
                <button 
                  @click="formData.priority = 'low'" 
                  :class="[
                    'py-2.5 px-3 rounded-lg text-sm font-medium transition',
                    formData.priority === 'low' 
                      ? 'bg-green-600 text-white shadow-md' 
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  ]"
                >
                  낮음
                </button>
                <button 
                  @click="formData.priority = 'medium'" 
                  :class="[
                    'py-2.5 px-3 rounded-lg text-sm font-medium transition',
                    formData.priority === 'medium' 
                      ? 'bg-yellow-600 text-white shadow-md' 
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  ]"
                >
                  보통
                </button>
                <button 
                  @click="formData.priority = 'high'" 
                  :class="[
                    'py-2.5 px-3 rounded-lg text-sm font-medium transition',
                    formData.priority === 'high' 
                      ? 'bg-red-600 text-white shadow-md' 
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  ]"
                >
                  높음
                </button>
              </div>
            </div>

            <!-- 메모 -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">메모</label>
              <textarea 
                v-model="formData.notes" 
                rows="3" 
                placeholder="추가 메모사항을 입력하세요..." 
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm resize-none"
              ></textarea>
            </div>
          </div>

          <!-- 오른쪽 컬럼: 반복 설정 -->
          <div class="space-y-5">
            <!-- 반복 일정 설정 -->
            <div class="border-2 border-slate-200 rounded-lg p-5 bg-slate-50">
              <div class="flex items-center justify-between mb-4">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input 
                    v-model="formData.isRecurring" 
                    type="checkbox" 
                    class="w-5 h-5 text-slate-600 rounded" 
                  />
                  <span class="text-sm font-semibold text-gray-900">반복 일정으로 설정</span>
                </label>
                <Repeat class="w-5 h-5 text-slate-600" />
              </div>

              <div v-if="formData.isRecurring" class="space-y-4">
                <!-- 반복 주기 -->
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-2">반복 주기</label>
                  <select 
                    v-model="formData.recurring.frequency" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm bg-white"
                  >
                    <option value="daily">매일</option>
                    <option value="weekly">매주</option>
                    <option value="monthly">매월</option>
                    <option value="yearly">매년</option>
                  </select>
                </div>

                <!-- 반복 간격 -->
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-2">반복 간격</label>
                  <div class="flex items-center gap-2">
                    <input 
                      v-model.number="formData.recurring.interval" 
                      type="number" 
                      min="1" 
                      max="365" 
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                    />
                    <span class="text-sm text-gray-600 font-medium whitespace-nowrap">{{ intervalLabel }}마다</span>
                  </div>
                  <p class="text-xs text-gray-500 mt-1">예: 2주마다 반복하려면 2를 입력</p>
                </div>

                <!-- 요일 선택 (주간 반복일 때만) -->
                <div v-if="formData.recurring.frequency === 'weekly'">
                  <label class="block text-xs font-semibold text-gray-700 mb-2">반복 요일 선택 <span class="text-red-500">*</span></label>
                  <div class="grid grid-cols-7 gap-1.5">
                    <button 
                      v-for="day in weekDays" 
                      :key="day.value" 
                      @click="toggleWeekDay(day.value)" 
                      :class="[
                        'py-2 px-1.5 rounded-lg text-xs font-semibold transition',
                        formData.recurring.daysOfWeek.includes(day.value) 
                          ? 'bg-slate-600 text-white shadow-md' 
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      ]"
                    >
                      {{ day.label }}
                    </button>
                  </div>
                  <p class="text-xs text-red-500 mt-1" v-if="formData.recurring.daysOfWeek.length === 0">
                    최소 1개 이상의 요일을 선택해주세요
                  </p>
                </div>

                <!-- 월간 반복 방식 (월간 반복일 때만) -->
                <div v-if="formData.recurring.frequency === 'monthly'">
                  <label class="block text-xs font-semibold text-gray-700 mb-2">반복 방식</label>
                  <div class="space-y-2">
                    <label class="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                      <input 
                        v-model="formData.recurring.monthlyType" 
                        type="radio" 
                        value="date" 
                        class="w-4 h-4 text-slate-600" 
                      />
                      <span class="text-xs text-gray-700">같은 날짜에 반복 (예: 매월 15일)</span>
                    </label>
                    <label class="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                      <input 
                        v-model="formData.recurring.monthlyType" 
                        type="radio" 
                        value="day" 
                        class="w-4 h-4 text-slate-600" 
                      />
                      <span class="text-xs text-gray-700">같은 요일에 반복 (예: 매월 셋째 월요일)</span>
                    </label>
                  </div>
                </div>

                <!-- 반복 종료 조건 -->
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-2">반복 종료</label>
                  <div class="space-y-2">
                    <label class="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                      <input 
                        v-model="formData.recurring.endType" 
                        type="radio" 
                        value="never" 
                        class="w-4 h-4 text-slate-600" 
                      />
                      <span class="text-xs text-gray-700">종료일 없음</span>
                    </label>
                    
                    <label class="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                      <input 
                        v-model="formData.recurring.endType" 
                        type="radio" 
                        value="date" 
                        class="w-4 h-4 text-slate-600" 
                      />
                      <div class="flex-1 flex items-center gap-2">
                        <span class="text-xs text-gray-700">종료일:</span>
                        <input 
                          v-model="formData.recurring.endDate" 
                          type="date" 
                          :disabled="formData.recurring.endType !== 'date'"
                          class="flex-1 px-2 py-1 border border-gray-300 rounded text-xs disabled:bg-gray-100"
                          @click.stop
                        />
                      </div>
                    </label>
                    
                    <label class="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                      <input 
                        v-model="formData.recurring.endType" 
                        type="radio" 
                        value="count" 
                        class="w-4 h-4 text-slate-600" 
                      />
                      <div class="flex-1 flex items-center gap-2">
                        <input 
                          v-model.number="formData.recurring.occurrences" 
                          type="number" 
                          min="1" 
                          max="100" 
                          :disabled="formData.recurring.endType !== 'count'"
                          class="w-16 px-2 py-1 border border-gray-300 rounded text-xs disabled:bg-gray-100"
                          @click.stop
                        />
                        <span class="text-xs text-gray-700">회 반복</span>
                      </div>
                    </label>
                  </div>
                </div>

                <!-- 반복 일정 요약 -->
                <div class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div class="flex items-start gap-2">
                    <Info class="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p class="text-xs font-semibold text-blue-900 mb-1">반복 일정 요약</p>
                      <p class="text-xs text-blue-700">{{ recurringSummary }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else class="text-center py-4">
                <Calendar class="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p class="text-xs text-gray-500">체크박스를 선택하여 반복 일정을 설정하세요</p>
              </div>
            </div>

            <!-- 미리보기 (반복일정이 아닐 때) -->
            <div v-if="!formData.isRecurring" class="border-2 border-gray-200 rounded-lg p-5 bg-gray-50">
              <h4 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Calendar class="w-4 h-4" />
                일정 미리보기
              </h4>
              <div class="space-y-2 text-xs text-gray-600">
                <div class="flex items-center gap-2">
                  <span class="font-semibold w-16">유형:</span>
                  <span>{{ getScheduleTypeLabel(formData.type) || '미선택' }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="font-semibold w-16">제목:</span>
                  <span>{{ formData.title || '미입력' }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="font-semibold w-16">날짜:</span>
                  <span>{{ formData.startDate || '미선택' }} ~ {{ formData.endDate || '미선택' }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="font-semibold w-16">시간:</span>
                  <span>{{ formData.startTime || '미선택' }} ~ {{ formData.endTime || '미선택' }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="font-semibold w-16">담당자:</span>
                  <span>{{ formData.interviewer || '미선택' }}</span>
                </div>
              </div>
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
          @click="saveSchedule" 
          :disabled="!isFormValid" 
          :class="[
            'flex-1 px-4 py-2.5 rounded-lg text-white font-medium transition flex items-center justify-center gap-2',
            isFormValid ? 'bg-slate-600 hover:bg-slate-700' : 'bg-gray-300 cursor-not-allowed'
          ]"
        >
          <Check class="w-4 h-4" />
          {{ editingId ? '수정하기' : (formData.isRecurring ? '반복 일정 만들기' : '일정 만들기') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { CalendarPlus, X, Check, Repeat, Calendar, Info } from 'lucide-vue-next'

// Props
interface TeamMember {
  id: number
  name: string
  role: string
  department: string
}

interface Props {
  showModal?: boolean
  editingId?: number | null
  initialData?: any
  teamMembers?: TeamMember[]
}

const props = withDefaults(defineProps<Props>(), {
  showModal: false,
  editingId: null,
  initialData: null,
  teamMembers: () => []
})

// Emits
const emit = defineEmits<{
  'close': []
  'save': [data: any]
}>()

// Week days
const weekDays = [
  { label: '일', value: 0 },
  { label: '월', value: 1 },
  { label: '화', value: 2 },
  { label: '수', value: 3 },
  { label: '목', value: 4 },
  { label: '금', value: 5 },
  { label: '토', value: 6 }
]

// 30분 단위 시간 옵션 생성
const timeOptions = computed(() => {
  const times: string[] = []
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const h = hour.toString().padStart(2, '0')
      const m = minute.toString().padStart(2, '0')
      times.push(`${h}:${m}`)
    }
  }
  return times
})

// Form data
const formData = ref({
  type: '',
  title: '',
  position: '',
  startDate: '',
  endDate: '',
  startTime: '',
  endTime: '',
  location: '',
  priority: 'medium',
  interviewer: '',
  notes: '',
  status: 'scheduled',
  isRecurring: false,
  recurring: {
    frequency: 'weekly',
    interval: 1,
    daysOfWeek: [] as number[],
    monthlyType: 'date',
    endType: 'never',
    endDate: '',
    occurrences: 10
  }
})

// Computed
const isInterviewType = computed(() => {
  return ['document_review', 'interview_1', 'interview_2', 'interview_final', 'negotiation'].includes(formData.value.type)
})

const daysDifference = computed(() => {
  if (!formData.value.startDate || !formData.value.endDate) return 0
  const start = new Date(formData.value.startDate)
  const end = new Date(formData.value.endDate)
  const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  return diff + 1
})

const intervalLabel = computed(() => {
  const labels: Record<string, string> = {
    daily: '일',
    weekly: '주',
    monthly: '개월',
    yearly: '년'
  }
  return labels[formData.value.recurring.frequency] || '일'
})

const recurringSummary = computed(() => {
  const pattern = formData.value.recurring
  const frequencyLabels: Record<string, string> = {
    daily: '매일',
    weekly: '매주',
    monthly: '매월',
    yearly: '매년'
  }
  
  let summary = `${frequencyLabels[pattern.frequency]}`
  
  if (pattern.interval > 1) {
    summary += ` (${pattern.interval}${intervalLabel.value}마다)`
  }
  
  if (pattern.frequency === 'weekly' && pattern.daysOfWeek.length > 0) {
    const dayNames = pattern.daysOfWeek.map(d => weekDays[d].label).join(', ')
    summary += ` ${dayNames}요일`
  }
  
  if (pattern.frequency === 'monthly') {
    summary += pattern.monthlyType === 'date' ? ' 같은 날짜에' : ' 같은 요일에'
  }
  
  summary += ' 반복'
  
  if (pattern.endType === 'date' && pattern.endDate) {
    summary += `, ${pattern.endDate}까지`
  } else if (pattern.endType === 'count') {
    summary += `, ${pattern.occurrences}회 반복`
  }
  
  return summary
})

const isFormValid = computed(() => {
  const basic = formData.value.type && 
                 formData.value.title && 
                 formData.value.startDate
  
  if (!basic) return false
  
  if (formData.value.isRecurring) {
    const pattern = formData.value.recurring
    
    if (pattern.frequency === 'weekly' && pattern.daysOfWeek.length === 0) {
      return false
    }
    
    if (pattern.endType === 'date' && !pattern.endDate) {
      return false
    }
    
    if (pattern.endType === 'count' && pattern.occurrences < 1) {
      return false
    }
  }
  
  return true
})

const getDaysDifference = () => {
  if (!formData.value.startDate || !formData.value.endDate) return 1
  return calculateDaysDifference(formData.value.startDate, formData.value.endDate)
}

const calculateDaysDifference = (startDate: string, endDate: string): number => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
}

// Methods
const toggleWeekDay = (day: number) => {
  const index = formData.value.recurring.daysOfWeek.indexOf(day)
  if (index > -1) {
    formData.value.recurring.daysOfWeek.splice(index, 1)
  } else {
    formData.value.recurring.daysOfWeek.push(day)
    formData.value.recurring.daysOfWeek.sort((a, b) => a - b)
  }
}

const closeModal = () => {
  emit('close')
  resetForm()
}

const saveSchedule = () => {
  if (!isFormValid.value) return
  
  emit('save', {
    ...formData.value,
    id: props.editingId
  })
  
  resetForm()
}

const resetForm = () => {
  formData.value = {
    type: '',
    title: '',
    position: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    location: '',
    priority: 'medium',
    interviewer: '',
    notes: '',
    status: 'scheduled',
    isRecurring: false,
    recurring: {
      frequency: 'weekly',
      interval: 1,
      daysOfWeek: [],
      monthlyType: 'date',
      endType: 'never',
      endDate: '',
      occurrences: 10
    }
  }
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

// Watch for initial data (edit mode)
watch(() => props.initialData, (data) => {
  if (data) {
    formData.value = { 
      ...formData.value,
      ...data 
    }
  }
}, { immediate: true, deep: true })

// Watch showModal to reset or apply initial data
watch(() => props.showModal, (isOpen) => {
  if (isOpen && props.initialData) {
    // 모달이 열릴 때 initial data 적용
    formData.value = { 
      ...formData.value,
      ...props.initialData 
    }
  }
})

// Auto-fill endDate when startDate changes
watch(() => formData.value.startDate, (newDate) => {
  if (newDate && !formData.value.endDate) {
    formData.value.endDate = newDate
  }
})
</script>
