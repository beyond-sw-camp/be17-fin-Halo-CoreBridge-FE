<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Search, MoreVertical, Home, Video, Briefcase, Users, Monitor, Wifi, Mic, Tv, Coffee, Share2, Sparkles } from 'lucide-vue-next'

interface Room {
  id: number
  name: string
  location: string
  type: 'offline' | 'online' | 'executive'
  capacity: number
  status: 'available' | 'in-use' | 'maintenance'
  features: { icon: any; label: string }[]
  todayReservations: number
  nextReservation: string
  currentUse?: string
  endTime?: string
  maintenanceReason?: string
  recoveryDate?: string
  color: string
}

const rooms = ref<Room[]>([
  {
    id: 1,
    name: '회의실 A',
    location: '본관 3층 301호',
    type: 'offline',
    capacity: 6,
    status: 'available',
    features: [
      { icon: Users, label: '최대 6인' },
      { icon: Monitor, label: '빔 프로젝터' },
      { icon: Wifi, label: '무선 인터넷' }
    ],
    todayReservations: 3,
    nextReservation: '14:00',
    color: 'green'
  },
  {
    id: 2,
    name: '회의실 B',
    location: '본관 3층 302호',
    type: 'offline',
    capacity: 10,
    status: 'in-use',
    features: [
      { icon: Users, label: '최대 10인' },
      { icon: Monitor, label: '대형 스크린' },
      { icon: Mic, label: '음향 시스템' }
    ],
    todayReservations: 4,
    nextReservation: '10:00',
    currentUse: '김지원 1차 면접',
    endTime: '10:00 (25분 후)',
    color: 'yellow'
  },
  {
    id: 3,
    name: '회의실 C',
    location: '본관 4층 401호',
    type: 'offline',
    capacity: 4,
    status: 'available',
    features: [
      { icon: Users, label: '최대 4인' },
      { icon: Tv, label: 'TV 모니터' },
      { icon: Coffee, label: '다과' }
    ],
    todayReservations: 1,
    nextReservation: '16:00',
    color: 'green'
  },
  {
    id: 4,
    name: '회의실 D',
    location: '본관 4층 402호',
    type: 'offline',
    capacity: 8,
    status: 'maintenance',
    features: [
      { icon: Users, label: '최대 8인' },
      { icon: Monitor, label: '화이트보드' }
    ],
    todayReservations: 0,
    nextReservation: '-',
    maintenanceReason: '음향 장비 수리',
    recoveryDate: '2025.10.23',
    color: 'red'
  },
  {
    id: 5,
    name: '화상 면접실 1',
    location: 'Zoom 화상 회의',
    type: 'online',
    capacity: 30,
    status: 'available',
    features: [
      { icon: Users, label: '최대 30인' },
      { icon: Video, label: '녹화 가능' },
      { icon: Share2, label: '화면 공유' }
    ],
    todayReservations: 5,
    nextReservation: '11:00',
    color: 'green'
  },
  {
    id: 6,
    name: '임원실',
    location: '본관 5층 임원실',
    type: 'executive',
    capacity: 6,
    status: 'available',
    features: [
      { icon: Users, label: '최대 6인' },
      { icon: Coffee, label: '고급 다과' },
      { icon: Sparkles, label: '프리미엄' }
    ],
    todayReservations: 2,
    nextReservation: '16:00',
    color: 'purple'
  }
])

const getStatusBadge = (status: string) => {
  const badges = {
    available: { label: '사용 가능', class: 'bg-green-100 text-green-700' },
    'in-use': { label: '사용중', class: 'bg-yellow-500 text-white' },
    maintenance: { label: '정비중', class: 'bg-red-500 text-white' }
  }
  return badges[status as keyof typeof badges]
}

const getColorClasses = (color: string, status: string) => {
  if (status === 'in-use') {
    return {
      bg: 'bg-gradient-to-r from-yellow-50 to-transparent',
      border: 'border-yellow-200',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      featureBg: 'bg-white'
    }
  }
  if (status === 'maintenance') {
    return {
      bg: 'bg-gradient-to-r from-red-50 to-transparent opacity-60',
      border: 'border-red-200',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      featureBg: 'bg-white'
    }
  }

  const colorMap: any = {
    green: {
      bg: 'bg-white',
      border: 'border-slate-200',
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
      featureBg: 'bg-slate-50'
    },
    purple: {
      bg: 'bg-gradient-to-r from-purple-50 to-transparent',
      border: 'border-purple-200',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      featureBg: 'bg-white'
    }
  }
  return colorMap[color] || colorMap.green
}

const getRoomIcon = (type: string) => {
  return type === 'online' ? Video : type === 'executive' ? Briefcase : Home
}
</script>

<template>
  <div class="min-h-screen">
    <!-- Header -->
    <header class="mb-3">
      <div>
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-slate-600 mb-2">면접실 관리</h1>
            <p class="text-sm text-slate-500 mt-1">면접 공간과 리소스를 관리하세요</p>
          </div>
          <button class="px-6 py-2.5 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white rounded-xl font-medium flex items-center space-x-2 shadow-sm transition-all">
            <Plus :size="16" />
            <span>장소 추가</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Content -->
    <main>
      <!-- Stats -->
      <div class="grid grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-2xl p-6 border border-slate-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-500 mb-1">전체 면접실</p>
              <p class="text-3xl font-bold text-slate-800">8</p>
            </div>
            <div class="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
              <Home :size="28" class="text-blue-600" />
            </div>
          </div>
        </div>
        <div class="bg-white rounded-2xl p-6 border border-slate-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-500 mb-1">사용 가능</p>
              <p class="text-3xl font-bold text-green-600">5</p>
            </div>
            <div class="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center">
              <svg class="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-2xl p-6 border border-slate-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-500 mb-1">사용중</p>
              <p class="text-3xl font-bold text-yellow-600">2</p>
            </div>
            <div class="w-14 h-14 bg-yellow-50 rounded-2xl flex items-center justify-center">
              <svg class="w-7 h-7 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-2xl p-6 border border-slate-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-500 mb-1">정비중</p>
              <p class="text-3xl font-bold text-red-600">1</p>
            </div>
            <div class="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center">
              <svg class="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
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
              placeholder="면접실 검색..."
              class="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-600 transition-all" />
          </div>
          <select class="px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-600">
            <option>전체 유형</option>
            <option>오프라인 회의실</option>
            <option>화상 면접실</option>
          </select>
          <select class="px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-600">
            <option>전체 상태</option>
            <option>사용 가능</option>
            <option>사용중</option>
            <option>정비중</option>
          </select>
        </div>
      </div>

      <!-- Room Grid -->
      <div class="grid grid-cols-2 gap-6">
        <div
          v-for="room in rooms"
          :key="room.id"
          class="rounded-2xl p-6 border hover:shadow-lg transition-all"
          :class="[getColorClasses(room.color, room.status).bg, getColorClasses(room.color, room.status).border]">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-start space-x-4">
              <div
                class="w-14 h-14 rounded-2xl flex items-center justify-center"
                :class="[getColorClasses(room.color, room.status).iconBg]">
                <component
                  :is="getRoomIcon(room.type)"
                  :size="28"
                  :class="[getColorClasses(room.color, room.status).iconColor]" />
              </div>
              <div>
                <div class="flex items-center space-x-2 mb-1">
                  <h3 class="text-lg font-bold text-slate-800">{{ room.name }}</h3>
                  <span
                    class="px-3 py-1 text-xs font-semibold rounded-lg"
                    :class="getStatusBadge(room.status).class">
                    {{ getStatusBadge(room.status).label }}
                  </span>
                  <span v-if="room.type === 'executive'" class="px-3 py-1 bg-purple-500 text-white text-xs font-semibold rounded-lg">
                    프리미엄
                  </span>
                </div>
                <p class="text-sm text-slate-600">{{ room.location }}</p>
              </div>
            </div>
            <button class="p-2 hover:bg-slate-100 rounded-xl transition-all">
              <MoreVertical :size="20" class="text-slate-600" />
            </button>
          </div>

          <div class="flex flex-wrap gap-2 mb-4">
            <div
              v-for="(feature, idx) in room.features"
              :key="idx"
              class="flex items-center space-x-1 px-3 py-1.5 rounded-lg"
              :class="[getColorClasses(room.color, room.status).featureBg]">
              <component :is="feature.icon" :size="16" class="text-slate-600" />
              <span class="text-sm text-slate-700">{{ feature.label }}</span>
            </div>
          </div>

          <div
            v-if="room.status === 'in-use'"
            class="flex items-center justify-between pt-4 border-t"
            :class="[getColorClasses(room.color, room.status).border]">
            <div>
              <p class="text-xs text-slate-500">현재 사용중</p>
              <p class="text-sm font-bold text-slate-800">{{ room.currentUse }}</p>
            </div>
            <div>
              <p class="text-xs text-slate-500">종료 예정</p>
              <p class="text-sm font-semibold text-yellow-700">{{ room.endTime }}</p>
            </div>
          </div>

          <div
            v-else-if="room.status === 'maintenance'"
            class="flex items-center justify-between pt-4 border-t"
            :class="[getColorClasses(room.color, room.status).border]">
            <div>
              <p class="text-xs text-slate-500">정비 사유</p>
              <p class="text-sm font-bold text-red-700">{{ room.maintenanceReason }}</p>
            </div>
            <div>
              <p class="text-xs text-slate-500">복구 예정</p>
              <p class="text-sm font-semibold text-slate-800">{{ room.recoveryDate }}</p>
            </div>
          </div>

          <div
            v-else
            class="flex items-center justify-between pt-4 border-t border-slate-200">
            <div>
              <p class="text-xs text-slate-500">오늘 예약</p>
              <p class="text-lg font-bold text-slate-800">{{ room.todayReservations }}건</p>
            </div>
            <div>
              <p class="text-xs text-slate-500">다음 예약</p>
              <p class="text-sm font-semibold text-slate-800">{{ room.nextReservation }}</p>
            </div>
            <button class="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-xl font-medium transition-all">
              예약하기
            </button>
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
