<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 상단 헤더 -->
    <div class="bg-white border-b border-gray-200 px-6 py-4 mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-slate-600 mb-2">채용 프로세스 일정 관리</h1>
          <p class="text-gray-600">후보자별 채용 단계를 체계적으로 관리하세요</p>
        </div>
        <div class="flex gap-3">
          <button @click="openShareModal" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 shadow-sm">
            <Share2 class="w-5 h-5" />일정 공유
          </button>
          <button @click="openAddModal" class="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition flex items-center gap-2 shadow-sm">
            <Plus class="w-5 h-5" />일정 추가
          </button>
        </div>
      </div>
    </div>

    <!-- 통계 카드 -->
    <div class="px-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div v-for="stat in statistics" :key="stat.label" class="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
          <p class="text-sm text-gray-600 mb-2">{{ stat.label }}</p>
          <div class="flex items-center gap-3">
            <div :class="['w-10 h-10 rounded-lg flex items-center justify-center', getIconBgClass(stat.color)]">
              <Calendar v-if="stat.icon === 'calendar'" :class="['w-5 h-5', getIconColorClass(stat.color)]" />
              <Clock v-else-if="stat.icon === 'clock'" :class="['w-5 h-5', getIconColorClass(stat.color)]" />
              <AlertCircle v-else-if="stat.icon === 'alert'" :class="['w-5 h-5', getIconColorClass(stat.color)]" />
              <Users v-else-if="stat.icon === 'users'" :class="['w-5 h-5', getIconColorClass(stat.color)]" />
              <Check v-else-if="stat.icon === 'check'" :class="['w-5 h-5', getIconColorClass(stat.color)]" />
            </div>
            <p :class="['text-2xl font-bold', getValueColorClass(stat.color, stat.isAlert)]">{{ stat.value }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 파이프라인 -->
    <div class="px-6 mb-6">
      <div class="bg-white rounded-lg shadow p-3">
        <h3 class="text-center font-bold text-slate-600 mb-2 text-xs tracking-tight">채용 파이프라인</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-1.5">
          <div v-for="stage in pipelineStages" :key="stage.name" class="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition">
            <div class="flex items-center gap-1.5 mb-1">
              <div :class="['w-3 h-3 rounded-full flex-shrink-0', stage.color]"></div>
              <span class="text-xs font-medium text-gray-700 whitespace-nowrap">{{ stage.name }}</span>
            </div>
            <span class="text-base font-bold text-slate-600">{{ stage.count }}명</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 캘린더 그리드 -->
    <div class="px-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 캘린더 -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow p-6">
            <!-- 필터 -->
            <div class="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div class="flex flex-wrap gap-3 items-center">
                <select v-model="filters.type" class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600 text-xs bg-white">
                  <option value="">전체 유형</option>
                  <option value="document_review">서류 전형</option>
                  <option value="interview_1">1차 면접</option>
                  <option value="interview_2">2차 면접</option>
                  <option value="interview_final">최종 면접</option>
                  <option value="negotiation">처우 협상</option>
                  <option value="onboarding_prep">온보딩 준비</option>
                  <option value="onboarding">온보딩</option>
                  <option value="follow_up">사후 관리</option>
                  <option value="meeting">팀 회의</option>
                  <option value="event">채용 이벤트</option>
                </select>
                <input v-model="searchQuery" type="text" placeholder="검색..." class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600 text-xs bg-white flex-1 min-w-[120px]" />
              </div>
            </div>

            <!-- 캘린더 헤더 -->
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-bold text-slate-600">{{ currentYearMonth }}</h2>
              <div class="flex gap-2">
                <button @click="previousMonth" class="p-2 hover:bg-gray-100 rounded-lg transition"><ChevronLeft class="w-5 h-5" /></button>
                <button @click="goToToday" class="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition">오늘</button>
                <button @click="nextMonth" class="p-2 hover:bg-gray-100 rounded-lg transition"><ChevronRight class="w-5 h-5" /></button>
              </div>
            </div>

            <!-- 드래그 안내 -->
            <div class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
              <CalendarDays class="w-4 h-4 text-blue-600 flex-shrink-0" />
              <p class="text-sm text-blue-700"><strong>TIP:</strong> 캘린더에서 날짜를 드래그하여 일정 기간을 선택하고 등록할 수 있습니다. 셀 하나를 더블클릭하면 해당 날짜의 일정을 바로 등록할 수 있습니다.</p>
            </div>

            <!-- 캘린더 그리드 -->
            <div class="grid grid-cols-7 gap-2 select-none">
              <div v-for="day in weekDays" :key="day" class="text-center py-3 text-sm font-semibold text-gray-600">{{ day }}</div>
              <div 
                v-for="(date, index) in calendarDates" 
                :key="index" 
                :class="getDateCellClass(date, index)" 
                @mousedown="date.date && startDrag(index, date)" 
                @mouseenter="date.date && updateDrag(index)" 
                @mouseup="date.date && handleEndDrag()" 
                @click="date.date && handleCellClick(date)"
                @dblclick="date.date && handleDoubleClick(date)"
              >
                <template v-if="date.date">
                  <div :class="getDateNumberClass(date, index)">{{ date.date }}</div>
                  <div v-if="date.isToday" class="text-xs text-slate-600 font-semibold pointer-events-none">오늘</div>
                  <div v-if="date.schedulesStarting.length > 0 || date.schedulesEnding.length > 0" class="space-y-1 mt-1">
                    <!-- 시작하는 일정 -->
                    <div v-for="schedule in date.schedulesStarting.slice(0, 2)" :key="'start-' + schedule.id" :class="['text-[10px] px-1 py-0.5 rounded flex items-center gap-1 cursor-pointer hover:opacity-80 font-semibold', getScheduleColorClass(schedule)]" @click.stop="viewScheduleDetail(schedule.id)">
                      <UserCheck v-if="schedule.sharedWith && schedule.sharedWith.length > 0" class="w-2 h-2 flex-shrink-0" />
                      <span class="bg-green-200 text-white px-1 py-0.5 rounded text-[9px] font-bold flex-shrink-0">시작</span>
                      <span class="truncate">{{ schedule.candidateName || schedule.title }}</span>
                    </div>
                    <!-- 끝나는 일정 -->
                    <div v-for="schedule in date.schedulesEnding.slice(0, 2)" :key="'end-' + schedule.id" :class="['text-[10px] px-1 py-0.5 rounded flex items-center gap-1 cursor-pointer hover:opacity-80 font-semibold', getScheduleColorClass(schedule)]" @click.stop="viewScheduleDetail(schedule.id)">
                      <UserCheck v-if="schedule.sharedWith && schedule.sharedWith.length > 0" class="w-2 h-2 flex-shrink-0" />
                      <span class="bg-red-600 text-white px-1 py-0.5 rounded text-[9px] font-bold flex-shrink-0">끝</span>
                      <span class="truncate">{{ schedule.candidateName || schedule.title }}</span>
                    </div>
                    <div v-if="(date.schedulesStarting.length + date.schedulesEnding.length) > 2" class="text-xs text-gray-500 font-semibold pointer-events-none">+{{ (date.schedulesStarting.length + date.schedulesEnding.length) - 2 }}건</div>
                  </div>
                </template>
              </div>
            </div>

            <!-- 범례 -->
            <div class="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t">
              <div class="flex items-center gap-2"><div class="w-4 h-4 bg-slate-50 border-2 border-slate-600 rounded"></div><span class="text-sm text-gray-600">오늘</span></div>
              <div class="flex items-center gap-2"><div class="w-4 h-4 bg-blue-200 border-2 border-blue-400 rounded"></div><span class="text-sm text-gray-600">드래그 선택</span></div>
              <div class="flex items-center gap-2"><UserCheck class="w-4 h-4 text-blue-600" /><span class="text-sm text-gray-600">공유된 일정</span></div>
              <div class="flex items-center gap-2"><div class="w-4 h-4 bg-orange-100 rounded"></div><span class="text-sm text-gray-600">서류전형</span></div>
              <div class="flex items-center gap-2"><div class="w-4 h-4 bg-blue-100 rounded"></div><span class="text-sm text-gray-600">면접</span></div>
              <div class="flex items-center gap-2"><div class="w-4 h-4 bg-green-100 rounded"></div><span class="text-sm text-gray-600">온보딩</span></div>
            </div>
          </div>
        </div>

        <!-- 사이드바 -->
        <div class="lg:col-span-1">
          <div class="grid grid-cols-1 gap-6">
            <!-- 선택된 날짜 일정 -->
            <div class="bg-white rounded-lg shadow p-5">
              <h3 class="text-lg font-bold text-slate-600 mb-4">{{ selectedDateLabel }}</h3>
              <div v-if="selectedDateSchedules.length > 0" class="space-y-3 max-h-96 overflow-y-auto">
                <div v-for="schedule in selectedDateSchedules" :key="schedule.id" :class="['border-l-4 p-3 rounded transition-all cursor-pointer hover:shadow-md', getScheduleBorderClass(schedule)]" @click="viewScheduleDetail(schedule.id)">
                  <div class="flex items-start justify-between mb-2">
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 mb-1">
                        <component :is="getScheduleIcon(schedule.type)" class="w-3 h-3 flex-shrink-0" />
                        <span class="text-xs font-semibold text-gray-500 uppercase">{{ getScheduleTypeLabel(schedule.type) }}</span>
                      </div>
                      <p class="font-semibold text-sm text-gray-900 truncate">{{ schedule.candidateName || schedule.title }}</p>
                      <p class="text-xs text-gray-600">{{ schedule.position }}</p>
                    </div>
                    <span v-if="schedule.priority === 'high'" class="px-2 py-0.5 text-xs font-semibold text-red-700 bg-red-100 rounded">긴급</span>
                  </div>
                  <div class="text-xs text-gray-600 space-y-1">
                    <p class="flex items-center gap-1"><Clock class="w-3 h-3" />{{ schedule.time }}</p>
                    <p class="flex items-center gap-1 truncate"><MapPin class="w-3 h-3" />{{ schedule.location }}</p>
                    <p v-if="schedule.sharedWith && schedule.sharedWith.length > 0" class="flex items-center gap-1"><Share2 class="w-3 h-3 text-blue-600" /><span class="text-blue-600 font-medium">{{ schedule.sharedWith.length }}명과 공유중</span></p>
                  </div>
                  <div class="flex gap-2 mt-2">
                    <button @click.stop="editSchedule(schedule.id)" class="flex-1 py-1.5 bg-slate-100 text-slate-700 text-xs rounded hover:bg-slate-200 transition">수정</button>
                    <button @click.stop="shareSchedule(schedule.id)" class="flex-1 py-1.5 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200 transition flex items-center justify-center gap-1"><Share2 class="w-3 h-3" />공유</button>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-6 text-gray-500 text-sm">선택한 날짜에 예정된 일정이 없습니다</div>
            </div>

            <!-- 빠른 작업 -->
            <div class="bg-white rounded-lg shadow p-5">
              <h3 class="text-lg font-bold text-slate-600 mb-4">빠른 작업</h3>
              <div class="space-y-2">
                <button @click="openAddModal" class="w-full py-2 px-4 text-sm text-left text-white bg-slate-600 rounded-lg hover:bg-slate-700 flex items-center gap-2 transition"><Plus class="w-4 h-4" />일정 추가</button>
                <button @click="alert('지원자 풀 보기')" class="w-full py-2 px-4 text-sm text-left text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition"><Users class="w-4 h-4" />지원자 풀 보기</button>
                <button @click="alert('캘린더 동기화')" class="w-full py-2 px-4 text-sm text-left text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition"><Calendar class="w-4 h-4" />캘린더 동기화</button>
                <button @click="alert('채용 리포트')" class="w-full py-2 px-4 text-sm text-left text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition"><FileText class="w-4 h-4" />채용 리포트</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 일정 생성/수정 모달 -->
    <JobProcessScheduleCreate
      :show-modal="showAddModal"
      :editing-id="editingScheduleId"
      :initial-data="editingScheduleData"
      :team-members="teamMembers"
      @close="closeAddModal"
      @save="handleSaveSchedule"
    />

    <!-- 일정 공유 모달 -->
    <JobProcessScheduleShare
      :show-modal="showShareModal"
      :available-schedules="availableSchedules"
      :team-members="teamMembers"
      @close="closeShareModal"
      @confirm="handleConfirmShare"
    />

    <!-- 일정 상세정보 모달 -->
    <ScheduleDetailModal
      :show-modal="showDetailModal"
      :schedule="selectedSchedule"
      :team-members="teamMembers"
      @close="closeDetailModal"
      @edit="editScheduleFromDetail"
      @delete="deleteSchedule"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus, Share2, ChevronLeft, ChevronRight, CalendarDays, Calendar, Clock, AlertCircle, Users, Check, UserCheck, MapPin, FileText, Briefcase, UserCircle2, Handshake, Rocket, Activity, FileCheck,  GraduationCap, Heart, UsersRound, PartyPopper } from 'lucide-vue-next'
import JobProcessScheduleCreate from './JobProcessSchedule_Create.vue'
import JobProcessScheduleShare from './JobProcessSchedule_Share.vue'
import ScheduleDetailModal from './JobProcessSchedule_Detail.vue'

const weekDays = ['일', '월', '화', '수', '목', '금', '토']
const searchQuery = ref('')
const filters = ref({ type: '', position: '', status: '', date: '', sharedWith: '' })

const schedules = ref([
  { id: 1, type: 'document_review', candidateId: 1001, candidateName: '김지원', position: '프론트엔드 개발자', date: '2025-10-18', endDate: '2025-10-20', time: '10:00 - 12:00', location: '온라인 검토', priority: 'medium', status: 'scheduled', interviewer: '인사팀', stage: '서류 전형', notes: '5년차 경력, React 전문가', sharedWith: [1, 2, 5] },
  { id: 2, type: 'interview_1', candidateId: 1003, candidateName: '이민호', position: '백엔드 개발자', date: '2025-10-16', endDate: '2025-10-16', time: '10:00 - 11:00', location: 'Zoom', priority: 'medium', status: 'scheduled', interviewer: '개발팀 리드', stage: '1차 기술 면접', notes: 'Node.js, AWS 경험 보유', sharedWith: [1, 2] },
  { id: 3, type: 'interview_1', candidateId: 1004, candidateName: '정수아', position: '프론트엔드 개발자', date: '2025-10-16', endDate: '2025-10-18', time: '14:00 - 15:00', location: '3층 회의실 A', priority: 'high', status: 'scheduled', interviewer: 'CTO, 개발팀 리드', stage: '1차 기술 면접', notes: '대기업 출신, Vue.js 전문', sharedWith: [1, 2, 3] }
])

const teamMembers = ref([
  { id: 1, name: '김현수', role: 'CTO', department: '개발팀', email: 'kim@company.com' },
  { id: 2, name: '이지은', role: '개발팀 리드', department: '개발팀', email: 'lee@company.com' },
  { id: 3, name: '박민준', role: '시니어 개발자', department: '개발팀', email: 'park@company.com' },
  { id: 4, name: '정서아', role: '디자인 리드', department: '디자인팀', email: 'jung@company.com' },
  { id: 5, name: '최영호', role: 'HR 매니저', department: '인사팀', email: 'choi@company.com' },
  { id: 6, name: '강민지', role: 'HR 담당자', department: '인사팀', email: 'kang@company.com' },
  { id: 7, name: '윤서준', role: '프로덕트 매니저', department: '프로덕트팀', email: 'yoon@company.com' },
  { id: 8, name: '임하늘', role: '마케팅 리드', department: '마케팅팀', email: 'lim@company.com' }
])

const statistics = ref([
  { label: '금주 면접', value: '12건', icon: 'calendar', color: 'blue', isAlert: false },
  { label: '오늘 일정', value: '4건', icon: 'clock', color: 'yellow', isAlert: false },
  { label: '긴급 처리', value: '3건', icon: 'alert', color: 'red', isAlert: true },
  { label: '진행중 지원자', value: '28명', icon: 'users', color: 'purple', isAlert: false },
  { label: '이번달 채용', value: '8명', icon: 'check', color: 'green', isAlert: false }
])

const pipelineStages = ref([
  { name: '서류 전형', count: 45, color: 'bg-orange-500' },
  { name: '1차 면접', count: 18, color: 'bg-blue-500' },
  { name: '2차 면접', count: 12, color: 'bg-indigo-500' },
  { name: '최종 면접', count: 7, color: 'bg-purple-500' },
  { name: '처우 협상', count: 4, color: 'bg-pink-500' },
  { name: '온보딩 대기', count: 3, color: 'bg-green-500' }
])

// 모달 상태
const showAddModal = ref(false)
const showShareModal = ref(false)
const showDetailModal = ref(false)
const editingScheduleId = ref<number | null>(null)
const editingScheduleData = ref(null)
const selectedSchedule = ref(null)

// 드래그 상태
const isDragging = ref(false)
const dragStartIndex = ref<number | null>(null)
const dragEndIndex = ref<number | null>(null)
const selectedDateRange = ref<{ start: string | null; end: string | null }>({ start: null, end: null })

// 캘린더 상태
const currentDate = ref(new Date())
const selectedDate = ref(new Date())

// 더블클릭 방지를 위한 타이머
let clickTimer: number | null = null
const clickDelay = 250 // 밀리초

// Computed
const currentYearMonth = computed(() => {
  return `${currentDate.value.getFullYear()}년 ${currentDate.value.getMonth() + 1}월`
})

const selectedDateLabel = computed(() => {
  const month = selectedDate.value.getMonth() + 1
  const day = selectedDate.value.getDate()
  const today = new Date()
  const diffTime = selectedDate.value.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  let label = `${month}월 ${day}일`
  
  if (diffDays === 0) label += ' (오늘)'
  else if (diffDays === 1) label += ' (내일)'
  else if (diffDays === -1) label += ' (어제)'
  return label
})

const filteredSchedules = computed(() => {
  let result = schedules.value

  if (filters.value.type) {
    result = result.filter(s => s.type === filters.value.type)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(s =>
      (s.candidateName && s.candidateName.toLowerCase().includes(query)) ||
      (s.title && s.title.toLowerCase().includes(query)) ||
      (s.position && s.position.toLowerCase().includes(query))
    )
  }

  return result
})

const calendarDates = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startDayOfWeek = firstDay.getDay()

  const dates = []

  // 이전 달 빈 칸
  for (let i = 0; i < startDayOfWeek; i++) {
    dates.push({ date: null, isToday: false, hasSchedules: false, schedulesStarting: [], schedulesEnding: [], schedules: [] })
  }

  // 현재 달 날짜
  const today = new Date()

  for (let date = 1; date <= daysInMonth; date++) {
    const currentDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`

    // 해당 날짜에 시작하는 일정
    const schedulesStarting = filteredSchedules.value.filter(s => s.date === currentDateStr)

    // 해당 날짜에 끝나는 일정
    const schedulesEnding = filteredSchedules.value.filter(s => {
      const endDate = s.endDate || s.date
      return endDate === currentDateStr && s.date !== currentDateStr
    })

    dates.push({
      date,
      isToday: year === today.getFullYear() && month === today.getMonth() && date === today.getDate(),
      hasSchedules: schedulesStarting.length > 0 || schedulesEnding.length > 0,
      schedulesStarting,
      schedulesEnding,
      schedules: [...schedulesStarting, ...schedulesEnding]
    })
  }

  return dates
})

const selectedDateSchedules = computed(() => {
  const year = selectedDate.value.getFullYear()
  const month = selectedDate.value.getMonth()
  const date = selectedDate.value.getDate()
  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`

  return filteredSchedules.value.filter(s => {
    const endDate = s.endDate || s.date
    return dateStr >= s.date && dateStr <= endDate
  })
})

const availableSchedules = computed(() => {
  return schedules.value.map(s => ({
    id: s.id,
    type: s.type,
    candidateName: s.candidateName,
    title: s.title,
    date: s.date,
    time: s.time,
    sharedWith: s.sharedWith
  }))
})

// 캘린더 네비게이션
const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

const goToToday = () => {
  currentDate.value = new Date()
  selectedDate.value = new Date()
}

// 드래그 함수
const startDrag = (index: number, dateObj: any) => {
  if (!dateObj.date) return

  isDragging.value = true
  dragStartIndex.value = index
  dragEndIndex.value = index

  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dateObj.date).padStart(2, '0')}`

  selectedDateRange.value.start = dateStr
  selectedDateRange.value.end = dateStr
}

const updateDrag = (index: number) => {
  if (isDragging.value && dragStartIndex.value !== null) {
    dragEndIndex.value = index

    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth()

    const startIdx = Math.min(dragStartIndex.value, dragEndIndex.value)
    const endIdx = Math.max(dragStartIndex.value, dragEndIndex.value)

    let startDate = null
    let endDate = null

    for (let i = startIdx; i <= endIdx; i++) {
      const dateObj = calendarDates.value[i]
      if (dateObj && dateObj.date) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dateObj.date).padStart(2, '0')}`
        if (!startDate) startDate = dateStr
        endDate = dateStr
      }
    }

    if (startDate && endDate) {
      selectedDateRange.value.start = startDate
      selectedDateRange.value.end = endDate
    }
  }
}

const handleEndDrag = () => {
  if (isDragging.value && selectedDateRange.value.start && selectedDateRange.value.end) {
    const startDate = selectedDateRange.value.start
    const endDate = selectedDateRange.value.end

    // 하나의 셀만 선택된 경우 더블클릭 처리를 기다림
    if (startDate === endDate) {
      isDragging.value = false
      dragStartIndex.value = null
      dragEndIndex.value = null
      selectedDateRange.value = { start: null, end: null }
      return
    }

    const confirmed = confirm(`${startDate} ~ ${endDate}\n이 기간으로 일정을 등록하시겠습니까?`)

    if (confirmed) {
      editingScheduleData.value = {
        startDate: startDate,
        endDate: endDate
      }
      openAddModal()
    }
  }

  isDragging.value = false
  dragStartIndex.value = null
  dragEndIndex.value = null

  if (!showAddModal.value) {
    selectedDateRange.value = { start: null, end: null }
  }
}

const isDateInDragRange = (index: number) => {
  if (!isDragging.value || dragStartIndex.value === null || dragEndIndex.value === null) return false
  const start = Math.min(dragStartIndex.value, dragEndIndex.value)
  const end = Math.max(dragStartIndex.value, dragEndIndex.value)
  return index >= start && index <= end
}

// 셀 클릭/더블클릭 핸들러
const handleCellClick = (dateObj: any) => {
  if (!isDragging.value && dateObj.date) {
    selectedDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), dateObj.date)
  }
}

const handleDoubleClick = (dateObj: any) => {
  if (!dateObj.date) return
  
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dateObj.date).padStart(2, '0')}`
  
  editingScheduleData.value = {
    startDate: dateStr,
    endDate: dateStr
  }
  openAddModal()
}

// 모달 함수
const openAddModal = () => {
  editingScheduleId.value = null
  showAddModal.value = true
}

const closeAddModal = () => {
  showAddModal.value = false
  editingScheduleData.value = null
  selectedDateRange.value = { start: null, end: null }
}

const openShareModal = () => {
  showShareModal.value = true
}

const closeShareModal = () => {
  showShareModal.value = false
}

const openDetailModal = (schedule: any) => {
  selectedSchedule.value = schedule
  showDetailModal.value = true
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedSchedule.value = null
}

const editSchedule = (scheduleId: number) => {
  const schedule = schedules.value.find(s => s.id === scheduleId)
  if (schedule) {
    editingScheduleId.value = scheduleId
    editingScheduleData.value = { 
      type: schedule.type,
      title: schedule.candidateName || schedule.title,
      position: schedule.position,
      startDate: schedule.date,
      endDate: schedule.endDate,
      startTime: schedule.time ? schedule.time.split(' - ')[0] : '',
      endTime: schedule.time ? schedule.time.split(' - ')[1] : '',
      location: schedule.location,
      priority: schedule.priority,
      interviewer: schedule.interviewer,
      notes: schedule.notes,
      status: schedule.status
    }
    showAddModal.value = true
  }
}

const editScheduleFromDetail = (scheduleId: number) => {
  closeDetailModal()
  editSchedule(scheduleId)
}

const deleteSchedule = (scheduleId: number) => {
  const confirmed = confirm('정말 이 일정을 삭제하시겠습니까?')
  if (confirmed) {
    const index = schedules.value.findIndex(s => s.id === scheduleId)
    if (index !== -1) {
      schedules.value.splice(index, 1)
      closeDetailModal()
      alert('일정이 삭제되었습니다.')
    }
  }
}

const shareSchedule = (scheduleId: number) => {
  showShareModal.value = true
}

const viewScheduleDetail = (scheduleId: number) => {
  const schedule = schedules.value.find(s => s.id === scheduleId)
  if (schedule) {
    openDetailModal(schedule)
  }
}

const handleSaveSchedule = (scheduleData: any) => {
  console.log('저장할 일정:', scheduleData)

  if (scheduleData.isRecurring) {
    // 반복 일정 생성 로직
    const recurringSchedules = generateRecurringSchedules(scheduleData)
    schedules.value.push(...recurringSchedules)
    alert(`${recurringSchedules.length}개의 반복 일정이 생성되었습니다!`)
  } else {
    if (scheduleData.id) {
      // 수정
      const index = schedules.value.findIndex(s => s.id === scheduleData.id)
      if (index !== -1) {
        schedules.value[index] = {
          ...schedules.value[index],
          type: scheduleData.type,
          candidateName: scheduleData.title,
          title: scheduleData.title,
          position: scheduleData.position || '',
          date: scheduleData.startDate,
          endDate: scheduleData.endDate,
          time: `${scheduleData.startTime || '00:00'} - ${scheduleData.endTime || '23:59'}`,
          location: scheduleData.location || '',
          priority: scheduleData.priority,
          interviewer: scheduleData.interviewer || '',
          notes: scheduleData.notes || '',
          status: scheduleData.status
        }
        alert('일정이 수정되었습니다!')
      }
    } else {
      // 새로 생성
      const newId = Math.max(...schedules.value.map(s => s.id), 0) + 1
      const newSchedule = {
        id: newId,
        type: scheduleData.type,
        candidateId: newId + 1000,
        candidateName: scheduleData.title,
        title: scheduleData.title,
        position: scheduleData.position || '',
        date: scheduleData.startDate,
        endDate: scheduleData.endDate,
        time: `${scheduleData.startTime || '00:00'} - ${scheduleData.endTime || '23:59'}`,
        location: scheduleData.location || '',
        priority: scheduleData.priority,
        status: 'scheduled',
        interviewer: scheduleData.interviewer || '',
        stage: getScheduleTypeLabel(scheduleData.type),
        notes: scheduleData.notes || '',
        sharedWith: []
      }

      schedules.value.push(newSchedule)
      alert('일정이 생성되었습니다!')
    }
  }

  editingScheduleData.value = null
  closeAddModal()
}

// 반복 일정 생성 함수
const generateRecurringSchedules = (scheduleData: any) => {
  const generatedSchedules: any[] = []
  const startDate = new Date(scheduleData.startDate)
  const pattern = scheduleData.recurring
  
  let currentDate = new Date(startDate)
  let count = 0
  const maxOccurrences = pattern.endType === 'count' ? pattern.occurrences : 100
  const endDate = pattern.endType === 'date' ? new Date(pattern.endDate) : null
  
  while (count < maxOccurrences) {
    // 종료일 체크
    if (endDate && currentDate > endDate) break
    
    // 요일 체크 (주간 반복일 때)
    let shouldInclude = true
    if (pattern.frequency === 'weekly' && pattern.daysOfWeek.length > 0) {
      shouldInclude = pattern.daysOfWeek.includes(currentDate.getDay())
    }
    
    if (shouldInclude) {
      const dateStr = currentDate.toISOString().split('T')[0]
      const newId = Math.max(...schedules.value.map(s => s.id), 0) + generatedSchedules.length + 1
      
      generatedSchedules.push({
        id: newId,
        type: scheduleData.type,
        candidateId: newId + 1000,
        candidateName: scheduleData.title,
        title: scheduleData.title,
        position: scheduleData.position || '',
        date: dateStr,
        endDate: dateStr,
        time: `${scheduleData.startTime || '00:00'} - ${scheduleData.endTime || '23:59'}`,
        location: scheduleData.location || '',
        priority: scheduleData.priority,
        status: 'scheduled',
        interviewer: scheduleData.interviewer || '',
        stage: getScheduleTypeLabel(scheduleData.type),
        notes: scheduleData.notes || '',
        sharedWith: []
      })
      
      count++
    }
    
    // 다음 날짜 계산
    if (pattern.frequency === 'daily') {
      currentDate.setDate(currentDate.getDate() + pattern.interval)
    } else if (pattern.frequency === 'weekly') {
      currentDate.setDate(currentDate.getDate() + 1)
    } else if (pattern.frequency === 'monthly') {
      currentDate.setMonth(currentDate.getMonth() + pattern.interval)
    } else if (pattern.frequency === 'yearly') {
      currentDate.setFullYear(currentDate.getFullYear() + pattern.interval)
    }
    
    // 무한루프 방지
    if (count > 1000) break
  }
  
  return generatedSchedules
}

const handleConfirmShare = (data: any) => {
  console.log('공유 데이터:', data)

  data.schedules.forEach((scheduleId: number) => {
    const schedule = schedules.value.find(s => s.id === scheduleId)
    if (schedule) {
      const existingShares = schedule.sharedWith || []
      schedule.sharedWith = [...new Set([...existingShares, ...data.members])]
    }
  })

  alert(`${data.schedules.length}개 일정을 ${data.members.length}명에게 공유했습니다!`)
  closeShareModal()
}

// Helper functions
const getDateCellClass = (date: any, index: number) => {
  return [
    'aspect-square border rounded-lg p-2 cursor-pointer transition-all',
    date.isToday ? 'border-2 border-slate-600 bg-slate-50' : date.hasSchedules ? 'border-gray-200 bg-blue-50' : 'border-gray-200',
    !date.date && 'border-0 cursor-default',
    date.date && !isDragging.value && 'hover:bg-blue-50 hover:border-blue-300',
    isDateInDragRange(index) && 'bg-blue-200 border-blue-400 ring-2 ring-blue-300',
    dragStartIndex.value === index && isDragging.value && 'bg-blue-300 border-blue-500',
    dragEndIndex.value === index && isDragging.value && 'bg-blue-300 border-blue-500'
  ]
}

const getDateNumberClass = (date: any, index: number) => {
  return ['text-sm mb-1 pointer-events-none', date.isToday ? 'font-bold text-slate-600' : 'text-gray-600', isDateInDragRange(index) && 'text-blue-900 font-bold']
}

// constant
type ScheduleType = 'document_review' | 'interview_1' | 'interview_2' | 'interview_final' | 'negotiation' | 'onboarding_prep' | 'onboarding' | 'follow_up' | 'meeting' | 'event'

const SCHEDULE_TYPE_LABELS: Record<ScheduleType, string> = {
  document_review: '서류전형', interview_1: '1차면접', interview_2: '2차면접', interview_final: '최종면접',
  negotiation: '처우협상', onboarding_prep: '온보딩준비', onboarding: '온보딩', follow_up: '사후관리',
  meeting: '회의', event: '이벤트'
}

const SCHEDULE_TYPE_ICONS: Record<ScheduleType, any> = {
  document_review: FileCheck, interview_1: Briefcase, interview_2: Briefcase, interview_final: UserCheck,
  negotiation: Handshake, onboarding_prep: FileText, onboarding: GraduationCap, follow_up: Heart,
  meeting: UsersRound, event: PartyPopper
}

const SCHEDULE_TYPE_COLORS: Record<ScheduleType, string> = {
  document_review: 'bg-orange-100 text-orange-700', interview_1: 'bg-blue-100 text-blue-700',
  interview_2: 'bg-indigo-100 text-indigo-700', interview_final: 'bg-purple-100 text-purple-700',
  negotiation: 'bg-pink-100 text-pink-700', onboarding_prep: 'bg-teal-100 text-teal-700',
  onboarding: 'bg-green-100 text-green-700', follow_up: 'bg-cyan-100 text-cyan-700',
  meeting: 'bg-yellow-100 text-yellow-700', event: 'bg-emerald-100 text-emerald-700'
}

const SCHEDULE_TYPE_BORDER_COLORS: Record<ScheduleType, string> = {
  document_review: 'border-orange-500 bg-orange-50', interview_1: 'border-blue-500 bg-blue-50',
  interview_2: 'border-indigo-500 bg-indigo-50', interview_final: 'border-purple-500 bg-purple-50',
  negotiation: 'border-pink-500 bg-pink-50', onboarding_prep: 'border-teal-500 bg-teal-50',
  onboarding: 'border-green-500 bg-green-50', follow_up: 'border-cyan-500 bg-cyan-50',
  meeting: 'border-yellow-500 bg-yellow-50', event: 'border-emerald-500 bg-emerald-50'
}

const POSITION_MAP: Record<string, string> = {
  frontend: '프론트엔드 개발자', backend: '백엔드 개발자', fullstack: '풀스택 개발자',
  designer: 'UX/UI 디자이너', pm: '프로덕트 매니저', marketing: '마케팅', sales: '영업'
}

const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토']

// 유틸리티 함수들
const getScheduleColorClass = (schedule: any) => {
  if (schedule.priority === 'high') return 'bg-red-100 text-red-700 font-semibold'
  return SCHEDULE_TYPE_COLORS[schedule.type as ScheduleType]
}

const getScheduleBorderClass = (schedule: any) => {
  if (schedule.priority === 'high') return 'border-red-500 bg-red-50'
  return SCHEDULE_TYPE_BORDER_COLORS[schedule.type as ScheduleType]
}

const getScheduleIcon = (type: ScheduleType) => SCHEDULE_TYPE_ICONS[type]
const getScheduleTypeLabel = (type: ScheduleType) => SCHEDULE_TYPE_LABELS[type]

const getIconBgClass = (color: string) => {
  const classes: Record<string, string> = { blue: 'bg-blue-100', yellow: 'bg-yellow-100', red: 'bg-red-100', purple: 'bg-purple-100', green: 'bg-green-100' }
  return classes[color] || 'bg-gray-100'
}

const getIconColorClass = (color: string) => {
  const classes: Record<string, string> = { blue: 'text-blue-600', yellow: 'text-yellow-600', red: 'text-red-600', purple: 'text-purple-600', green: 'text-green-600' }
  return classes[color] || 'text-gray-600'
}

const getValueColorClass = (color: string, isAlert: boolean) => {
  if (isAlert) return 'text-red-600'
  const classes: Record<string, string> = { blue: 'text-blue-600', yellow: 'text-yellow-600', red: 'text-red-600', purple: 'text-purple-600', green: 'text-green-600' }
  return classes[color] || 'text-gray-900'
}

</script>
