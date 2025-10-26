<script setup lang="ts">
import { ref } from 'vue'
import { UserPlus, Search, MoreVertical, Users, CalendarCheck, UserX } from 'lucide-vue-next'

interface Interviewer {
  id: number
  name: string
  initial: string
  position: string
  email: string
  weekInterviews: number
  completionRate: number
  avgRating: number
  status: 'available' | 'interviewing' | 'vacation'
  skills: string[]
  color: string
}

const interviewers = ref<Interviewer[]>([
  {
    id: 1,
    name: '박면접',
    initial: '박',
    position: '개발팀 팀장',
    email: 'park@company.com',
    weekInterviews: 8,
    completionRate: 95,
    avgRating: 4.2,
    status: 'available',
    skills: ['프론트엔드', '백엔드', '시스템 설계'],
    color: 'from-slate-600 to-slate-800'
  },
  {
    id: 2,
    name: '이평가',
    initial: '이',
    position: '시니어 개발자',
    email: 'lee@company.com',
    weekInterviews: 6,
    completionRate: 100,
    avgRating: 4.5,
    status: 'interviewing',
    skills: ['프론트엔드', '코드 리뷰'],
    color: 'from-blue-600 to-blue-800'
  },
  {
    id: 3,
    name: '김디자인',
    initial: '김',
    position: '리드 디자이너',
    email: 'kim@company.com',
    weekInterviews: 5,
    completionRate: 90,
    avgRating: 4.3,
    status: 'available',
    skills: ['UX/UI', '포트폴리오', '그래픽'],
    color: 'from-purple-600 to-purple-800'
  },
  {
    id: 4,
    name: '정개발',
    initial: '정',
    position: '백엔드 개발자',
    email: 'jung@company.com',
    weekInterviews: 0,
    completionRate: 88,
    avgRating: 4.0,
    status: 'vacation',
    skills: ['백엔드', '데이터베이스', 'API'],
    color: 'from-slate-400 to-slate-600'
  }
])

const getStatusBadge = (status: string) => {
  const badges = {
    available: { label: '대기중', class: 'bg-green-100 text-green-700' },
    interviewing: { label: '면접중', class: 'bg-blue-100 text-blue-700' },
    vacation: { label: '휴가', class: 'bg-red-100 text-red-700' }
  }
  return badges[status as keyof typeof badges]
}
</script>

<template>
  <div class="min-h-screen">
    <!-- Header -->
    <header class="mb-3">
      <div >
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-slate-600 mb-2">면접관 관리</h1>
            <p class="text-sm text-slate-500 mt-1">면접관 현황과 일정을 관리하세요</p>
          </div>
          <button class="px-6 py-2.5 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white rounded-xl font-medium flex items-center space-x-2 shadow-sm transition-all">
            <UserPlus :size="16" />
            <span>면접관 추가</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Content -->
    <main>
      <!-- Stats -->
      <div class="grid grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-2xl p-6 border border-slate-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-500 mb-1">전체 면접관</p>
              <p class="text-3xl font-bold text-slate-800">24</p>
            </div>
            <div class="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
              <Users :size="28" class="text-blue-600" />
            </div>
          </div>
        </div>
        <div class="bg-white rounded-2xl p-6 border border-slate-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-500 mb-1">오늘 배정</p>
              <p class="text-3xl font-bold text-slate-800">12</p>
            </div>
            <div class="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center">
              <CalendarCheck :size="28" class="text-green-600" />
            </div>
          </div>
        </div>
        <div class="bg-white rounded-2xl p-6 border border-slate-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-500 mb-1">부재중</p>
              <p class="text-3xl font-bold text-slate-800">3</p>
            </div>
            <div class="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center">
              <UserX :size="28" class="text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-2xl p-6 border border-slate-200 mb-6">
        <div class="grid grid-cols-3 gap-4">
          <div class="relative">
            <Search :size="20" class="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="이름, 부서 검색..."
              class="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-600 transition-all" />
          </div>
          <select class="px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-600">
            <option>전체 부서</option>
            <option>개발팀</option>
            <option>디자인팀</option>
            <option>마케팅팀</option>
          </select>
          <select class="px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-600">
            <option>전체 상태</option>
            <option>대기중</option>
            <option>면접중</option>
            <option>부재중</option>
          </select>
        </div>
      </div>

      <!-- Interviewer Grid -->
      <div class="grid grid-cols-2 gap-6">
        <div
          v-for="interviewer in interviewers"
          :key="interviewer.id"
          class="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all"
          :class="{ 'opacity-60': interviewer.status === 'vacation' }">
          <div class="flex items-start justify-between mb-6">
            <div class="flex items-start space-x-4">
              <div
                class="w-16 h-16 bg-gradient-to-br rounded-2xl flex items-center justify-center"
                :class="interviewer.color">
                <span class="text-white text-2xl font-bold">{{ interviewer.initial }}</span>
              </div>
              <div>
                <div class="flex items-center space-x-2 mb-1">
                  <h3 class="text-lg font-bold text-slate-800">{{ interviewer.name }}</h3>
                  <span
                    class="px-3 py-1 text-xs font-semibold rounded-lg"
                    :class="getStatusBadge(interviewer.status).class">
                    {{ getStatusBadge(interviewer.status).label }}
                  </span>
                </div>
                <p class="text-sm text-slate-600 mb-2">{{ interviewer.position }}</p>
                <p class="text-sm text-slate-500">{{ interviewer.email }}</p>
              </div>
            </div>
            <button class="p-2 hover:bg-slate-100 rounded-xl transition-all">
              <MoreVertical :size="20" class="text-slate-600" />
            </button>
          </div>

          <div class="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-slate-200">
            <div>
              <p class="text-xs text-slate-500 mb-1">이번주 면접</p>
              <p class="text-2xl font-bold text-slate-800">{{ interviewer.weekInterviews }}</p>
            </div>
            <div>
              <p class="text-xs text-slate-500 mb-1">완료율</p>
              <p class="text-2xl font-bold text-green-600">{{ interviewer.completionRate }}%</p>
            </div>
            <div>
              <p class="text-xs text-slate-500 mb-1">평균 평점</p>
              <p class="text-2xl font-bold text-yellow-600">{{ interviewer.avgRating }}</p>
            </div>
          </div>

          <div class="flex flex-wrap gap-2">
            <span
              v-for="skill in interviewer.skills"
              :key="skill"
              class="px-3 py-1.5 text-xs font-medium rounded-lg"
              :class="[
                interviewer.status === 'vacation'
                  ? 'bg-slate-100 text-slate-600'
                  : interviewer.color.includes('purple')
                  ? 'bg-purple-50 text-purple-700'
                  : 'bg-blue-50 text-blue-700'
              ]">
              {{ skill }}
            </span>
          </div>
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
