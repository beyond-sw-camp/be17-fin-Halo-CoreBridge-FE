<script setup lang="ts">
import { ref } from 'vue'
import { Search, Plus, MoreVertical, RefreshCcw, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import CreateInterviewModal from '@/components/recruiter-dashboard/interview/create-modal/CreateInterviewModal.vue'
import InterviewDetailModal from '@/components/recruiter-dashboard/interview/detail-modal/InterviewDetailModal.vue'

interface Interview {
  id: number
  date: string
  time: string
  applicant: {
    name: string
    position: string
    experience: string
    initial: string
  }
  type: string
  duration: string
  location: string
  interviewers: string[]
  status: 'ongoing' | 'scheduled' | 'completed' | 'cancelled'
}

const interviews = ref<Interview[]>([
  {
    id: 1,
    date: '2025-10-22',
    time: '09:00',
    applicant: {
      name: '김지원',
      position: '프론트엔드 개발자',
      experience: '3년',
      initial: '김'
    },
    type: '1차 면접',
    duration: '60분',
    location: '회의실 A',
    interviewers: ['박', '이'],
    status: 'ongoing'
  },
  {
    id: 2,
    date: '2025-10-22',
    time: '11:00',
    applicant: {
      name: '최민수',
      position: '백엔드 개발자',
      experience: '5년',
      initial: '최'
    },
    type: '2차 면접',
    duration: '60분',
    location: '화상면접',
    interviewers: ['정', '김'],
    status: 'scheduled'
  },
  {
    id: 3,
    date: '2025-10-22',
    time: '14:00',
    applicant: {
      name: '한예린',
      position: 'UX/UI 디자이너',
      experience: '2년',
      initial: '한'
    },
    type: '포트폴리오',
    duration: '90분',
    location: '회의실 B',
    interviewers: ['송', '윤'],
    status: 'scheduled'
  },
  {
    id: 4,
    date: '2025-10-21',
    time: '15:00',
    applicant: {
      name: '이서준',
      position: '데이터 분석가',
      experience: '신입',
      initial: '이'
    },
    type: '최종 면접',
    duration: '60분',
    location: '임원실',
    interviewers: ['김', '박'],
    status: 'completed'
  },
  {
    id: 5,
    date: '2025-10-21',
    time: '10:00',
    applicant: {
      name: '박지성',
      position: '프로덕트 매니저',
      experience: '7년',
      initial: '박'
    },
    type: '1차 면접',
    duration: '60분',
    location: '화상면접',
    interviewers: ['최'],
    status: 'completed'
  },
  {
    id: 6,
    date: '2025-10-20',
    time: '13:00',
    applicant: {
      name: '정수빈',
      position: '마케팅 매니저',
      experience: '4년',
      initial: '정'
    },
    type: '2차 면접',
    duration: '60분',
    location: '회의실 C',
    interviewers: ['강', '홍'],
    status: 'cancelled'
  }
])

const getStatusColor = (status: string) => {
  const colors = {
    ongoing: 'bg-green-500 text-white',
    scheduled: 'bg-blue-100 text-blue-700',
    completed: 'bg-slate-100 text-slate-700',
    cancelled: 'bg-red-100 text-red-700'
  }
  return colors[status as keyof typeof colors]
}

const getStatusLabel = (status: string) => {
  const labels = {
    ongoing: '진행중',
    scheduled: '예정',
    completed: '완료',
    cancelled: '취소'
  }
  return labels[status as keyof typeof labels]
}

const isDetailModalOpen = ref(false)
const interviewId = ref(0)
const openDetailModal = (id: number) => {
  interviewId.value = id
  isDetailModalOpen.value = true
}

const closeDetailModal = () => {
  isDetailModalOpen.value = false
}

</script>
<template>
  <InterviewDetailModal @close="closeDetailModal" :open-modal="isDetailModalOpen" :interviewId="interviewId" />
  <div class="min-h-screen ">
    <!-- Header -->
    <header class="mb-3">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-slate-600 mb-2">면접 목록</h1>
          <p class="text-sm text-slate-500 mt-1">전체 면접 일정을 관리하세요</p>
        </div>
      </div>
    </header>

    <!-- Content -->
    <main>
      <!-- Filters -->
      <div class="bg-white rounded-2xl p-6 border border-slate-200 mb-6">
        <div class="grid grid-cols-5 gap-4">
          <div class="col-span-2 relative">
            <Search :size="20" class="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="지원자명, 포지션 검색..."
              class="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent transition-all" />
          </div>
          <select
            class="px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-600 transition-all">
            <option>전체 상태</option>
            <option>예정</option>
            <option>진행중</option>
            <option>완료</option>
            <option>취소</option>
          </select>
          <select
            class="px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-600 transition-all">
            <option>면접 유형</option>
            <option>1차 면접</option>
            <option>2차 면접</option>
            <option>최종 면접</option>
          </select>
          <select
            class="px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-600 transition-all">
            <option>이번주</option>
            <option>이번달</option>
            <option>전체</option>
          </select>
        </div>
        <div class="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
          <p class="text-sm text-slate-600">
            총 <span class="font-bold text-slate-800">156</span>건의 면접
          </p>
          <button class="text-sm text-slate-600 hover:text-slate-800 font-medium flex items-center space-x-1">
            <RefreshCcw :size="16" />
            <span>초기화</span>
          </button>
        </div>
      </div>

      <!-- Interview Cards -->
      <div class="space-y-3">
        <div v-for="interview in interviews" :key="interview.id"
          class="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all hover:cursor-pointer overflow-hidden"
          :class="{ 'opacity-75': interview.status === 'completed' || interview.status === 'cancelled', 'opacity-60': interview.status === 'cancelled' }">
          <div class="flex items-center justify-between" @click="openDetailModal(interview.id)">
            <div class="flex items-center space-x-6 flex-1">
              <!-- Date & Time -->
              <div class="text-center min-w-[80px]">
                <p class="text-lg font-bold text-slate-800">{{ interview.date }}</p>
                <p class="text-md text-slate-500">{{ interview.time }}</p>
              </div>

              <div class="w-px h-12 bg-slate-200"></div>

              <!-- Applicant Info -->
              <div class="flex items-center space-x-4 w-72">
                <div
                  class="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center">
                  <span class="text-white font-semibold">{{ interview.applicant.initial }}</span>
                </div>
                <div>
                  <h3 class="font-semibold text-slate-800 mb-1">{{ interview.applicant.name }}</h3>
                  <p class="text-sm text-slate-500">{{ interview.applicant.position }} · {{
                    interview.applicant.experience }}</p>
                </div>
              </div>

              <div class="w-px h-12 bg-slate-300"></div>

              <!-- Interview Info -->
              <div class="w-44">
                <p class="text-sm font-medium text-slate-800 mb-1">{{ interview.type }}</p>
                <p class="text-sm text-slate-500">{{ interview.duration }} · {{ interview.location }}</p>
              </div>

              <div class="w-px h-12 bg-slate-200"></div>

              <!-- Interviewers -->
              <div class="flex items-center space-x-2">
                <div class="flex -space-x-2">
                  <div v-for="(interviewer, idx) in interview.interviewers" :key="idx"
                    class="w-8 h-8 bg-slate-600 rounded-lg flex items-center justify-center text-white text-xs font-medium border-2 border-white">
                    {{ interviewer }}
                  </div>
                </div>
                <span v-if="interview.interviewers.length > 2" class="text-sm text-slate-500">
                  외 {{ interview.interviewers.length - 2 }}명
                </span>
              </div>
            </div>

            <!-- Status & Actions -->
            <div class="flex items-center space-x-3">
              <span class="px-4 py-2 text-sm font-medium rounded-xl" :class="getStatusColor(interview.status)">
                {{ getStatusLabel(interview.status) }}
              </span>
              <button class="p-2 hover:bg-slate-100 rounded-xl transition-all">
                <MoreVertical :size="20" class="text-slate-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="mt-8 flex items-center justify-center">
        <div class="flex items-center space-x-2">
          <button class="p-2 hover:bg-slate-100 rounded-xl transition-all disabled:opacity-50" disabled>
            <ChevronLeft :size="20" />
          </button>
          <button class="px-4 py-2 bg-slate-600 text-white rounded-xl font-medium">1</button>
          <button class="px-4 py-2 hover:bg-slate-100 rounded-xl font-medium transition-all">2</button>
          <button class="px-4 py-2 hover:bg-slate-100 rounded-xl font-medium transition-all">3</button>
          <button class="px-4 py-2 hover:bg-slate-100 rounded-xl font-medium transition-all">4</button>
          <button class="p-2 hover:bg-slate-100 rounded-xl transition-all">
            <ChevronRight :size="20" />
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

* {
  font-family: 'Inter', sans-serif;
}
</style>
