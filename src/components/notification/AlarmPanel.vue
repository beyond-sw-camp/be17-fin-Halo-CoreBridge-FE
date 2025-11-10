<template>
  <div>
    <!-- 플로팅 알림 버튼 -->
    <div class="fixed bottom-6 right-6 z-50">
      <button
        @click="togglePanel"
        :class="[
          'relative p-4 text-white rounded-full shadow-lg transition-all hover:scale-110 active:scale-95',
          isConnected ? 'bg-slate-600 hover:bg-slate-700' : 'bg-gray-400 hover:bg-gray-500'
        ]"
      >
        <Bell class="w-6 h-6" />
        
        <!-- 읽지 않은 알림 배지 -->
        <span
          v-if="unreadCount > 0"
          class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 animate-pulse"
        >
          {{ unreadCount > 99 ? '99+' : unreadCount }}
        </span>

        <!-- 연결 상태 표시 -->
        <span
          :class="[
            'absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white',
            isConnected ? 'bg-green-500' : 'bg-red-500'
          ]"
        />
      </button>
    </div>

    <!-- 알림 패널 -->
    <Transition name="slide-fade">
      <div
        v-if="isOpen"
        class="fixed bottom-24 right-6 w-96 bg-white rounded-2xl shadow-2xl z-50 border border-gray-200 overflow-hidden"
      >
        <!-- 헤더 -->
        <div class="bg-gradient-to-r from-slate-600 to-slate-700 px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Bell class="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 class="text-white font-bold text-lg">알림</h3>
                <div class="flex items-center gap-2">
                  <p class="text-white/80 text-xs">{{ unreadCount }}개의 새 알림</p>
                  <span
                    :class="[
                      'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs',
                      isConnected ? 'bg-green-500/20 text-green-100' : 'bg-red-500/20 text-red-100'
                    ]"
                  >
                    <span :class="['w-1.5 h-1.5 rounded-full', isConnected ? 'bg-green-300' : 'bg-red-300']" />
                    {{ isConnected ? '연결됨' : '연결 끊김' }}
                  </span>
                </div>
              </div>
            </div>
            <button @click="togglePanel" class="p-2 hover:bg-white/10 rounded-lg transition">
              <X class="w-5 h-5 text-white" />
            </button>
          </div>

          <!-- 탭 -->
          <div class="flex gap-2 mt-4">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition',
                activeTab === tab.id ? 'bg-white text-slate-700' : 'text-white/70 hover:bg-white/10'
              ]"
            >
              {{ tab.label }}
              <span
                v-if="tab.count > 0"
                :class="[
                  'ml-2 px-2 py-0.5 rounded-full text-xs',
                  activeTab === tab.id ? 'bg-slate-100 text-slate-700' : 'bg-white/20 text-white'
                ]"
              >
                {{ tab.count }}
              </span>
            </button>
          </div>
        </div>

        <!-- 연결 끊김 경고 -->
        <div v-if="!isConnected" class="px-6 py-3 bg-red-50 border-b border-red-100 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <AlertCircle class="w-4 h-4 text-red-600" />
            <span class="text-sm text-red-700 font-medium">서버 연결이 끊어졌습니다</span>
          </div>
          <button
            @click="reconnect"
            class="px-3 py-1 text-xs font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-lg transition"
          >
            재연결
          </button>
        </div>

        <!-- 액션 -->
        <div class="px-6 py-3 bg-gray-50 border-b flex items-center justify-between">
          <button
            @click="markAllAsRead"
            :disabled="unreadCount === 0"
            class="text-sm text-slate-600 hover:text-slate-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            모두 읽음 처리
          </button>
          <div class="flex items-center gap-2">
            <button
              @click="refreshNotifications"
              class="p-1.5 text-slate-600 hover:text-slate-800 hover:bg-gray-200 rounded-lg transition"
              title="새로고침"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button
              @click="clearAll"
              class="text-sm text-red-600 hover:text-red-800 font-medium transition"
            >
              전체 삭제
            </button>
          </div>
        </div>

        <!-- 목록 -->
        <div class="max-h-[500px] overflow-y-auto">
          <TransitionGroup name="list">
            <div
              v-for="n in filteredNotifications"
              :key="n.id"
              @click="handleNotificationClick(n)"
              :class="[
                'px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer',
                !n.read && 'bg-blue-50/50'
              ]"
            >
              <div class="flex items-start gap-4">
                <div
                  :class="[
                    'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                    getNotificationColor(n.type)
                  ]"
                >
                  <component :is="getNotificationIcon(n.type)" class="w-5 h-5" />
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-2">
                    <h4
                      :class="[
                        'text-sm font-semibold',
                        n.read ? 'text-gray-700' : 'text-gray-900'
                      ]"
                    >
                      {{ n.title }}
                    </h4>
                    <button
                      @click.stop="deleteNotification(n.id)"
                      class="p-1 hover:bg-gray-200 rounded transition flex-shrink-0"
                    >
                      <X class="w-4 h-4 text-gray-400" />
                    </button>
                  </div>

                  <p class="text-sm text-gray-600 mt-1 line-clamp-2">{{ n.message }}</p>

                  <div class="flex items-center gap-3 mt-2">
                    <span class="flex items-center gap-1 text-xs text-gray-500">
                      <Clock class="w-3 h-3" />
                      {{ getTimeAgo(n.timestamp) }}
                    </span>

                    <span v-if="n.jobTitle" class="flex items-center gap-1 text-xs text-gray-500">
                      <Briefcase class="w-3 h-3" />
                      {{ n.jobTitle }}
                    </span>

                    <span v-if="!n.read" class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                  </div>

                  <div v-if="n.action" class="mt-3">
                    <button
                      @click.stop="handleAction(n)"
                      class="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                    >
                      {{ n.action.label }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </TransitionGroup>

          <!-- 빈 상태 -->
          <div v-if="filteredNotifications.length === 0" class="py-12 text-center">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell class="w-8 h-8 text-gray-400" />
            </div>
            <p class="text-gray-500 font-medium">알림이 없습니다</p>
            <p class="text-sm text-gray-400 mt-1">새로운 알림이 오면 여기에 표시됩니다</p>
          </div>
        </div>

        <!-- 더 보기 -->
        <div v-if="filteredNotifications.length > 0" class="px-6 py-3 bg-gray-50 border-t">
          <button
            @click="viewAllNotifications"
            class="w-full text-center text-sm text-slate-600 hover:text-slate-800 font-medium transition"
          >
            모든 알림 보기
          </button>
        </div>
      </div>
    </Transition>

    <!-- 오버레이 (모바일) -->
    <Transition name="fade">
      <div
        v-if="isOpen"
        @click="togglePanel"
        class="fixed inset-0 bg-black/20 z-40 lg:hidden"
      />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import {
  Bell, X, Clock, Briefcase, UserPlus,
  AlertCircle, CheckCircle, Calendar, TrendingUp
} from 'lucide-vue-next'
import { useNotificationSSE } from '@/composables/notification/useNotificationSSE'
import type { NotificationItem } from '@/types/notification/notification'

// ========== LocalStorage 키 ==========
const LS_KEY = 'halo_notifications'

// ========== LocalStorage 저장 함수 ==========
function saveToStorage(list: NotificationItem[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(list.slice(0, 30)))
  } catch (err) {
    console.warn('LocalStorage 저장 실패:', err)
  }
}

// ========== SSE 연결 훅 ==========
const {
  notifications,
  isConnected,
  connect,
  close,
  requestNotificationPermission,
  refreshNotifications: refresh
} = useNotificationSSE()

// 컴포넌트 마운트 시 연결
onMounted(() => {
  connect()
  requestNotificationPermission()
})

// 컴포넌트 언마운트 시 종료
onUnmounted(() => {
  close()
})

// ========== 상태 ==========
const isOpen = ref(false)
const activeTab = ref<'all' | 'unread'>('all')

// ========== 탭 ==========
const tabs = computed(() => [
  { id: 'all', label: '전체', count: notifications.value.length },
  { id: 'unread', label: '읽지 않음', count: unreadCount.value },
])

// ========== 계산된 값 ==========
const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

const filteredNotifications = computed(() => {
  const list = activeTab.value === 'unread'
    ? notifications.value.filter(n => !n.read)
    : notifications.value
  
  // 최신순 정렬 (이미 composable에서 정렬되지만 안전하게)
  return [...list].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
})

// ========== 메서드 ==========
const togglePanel = () => {
  isOpen.value = !isOpen.value
}

const reconnect = () => {
  close()
  setTimeout(() => connect(), 500)
}

const refreshNotifications = () => {
  refresh()
}

// ✅ 수정: 클릭 시 읽음 처리 + LocalStorage 저장
const handleNotificationClick = (n: NotificationItem) => {
  if (!n.read) {
    n.read = true
    // LocalStorage에 저장
    saveToStorage(notifications.value)
  }
  if (n.action) handleAction(n)
}

// 액션 처리
const handleAction = (n: NotificationItem) => {
  if (!n.action) return
  
  switch (n.action.type) {
    case 'open_link':
      if (n.link) window.open(n.link, '_blank', 'noopener,noreferrer')
      break
    case 'view_application':
      console.log('지원서 확인:', n.jobTitle)
      // TODO: 라우터로 이동
      break
    case 'view_job':
      console.log('공고 확인:', n.jobTitle)
      // TODO: 라우터로 이동
      break
    case 'view_schedule':
      console.log('일정 확인:', n.jobTitle)
      // TODO: 라우터로 이동
      break
    case 'view_applicants':
      console.log('지원자 목록 확인:', n.jobTitle)
      // TODO: 라우터로 이동
      break
  }
}

// ✅ 수정: 개별 삭제 + LocalStorage 저장
const deleteNotification = (id: number) => {
  const idx = notifications.value.findIndex(n => n.id === id)
  if (idx > -1) {
    notifications.value.splice(idx, 1)
    // LocalStorage에 저장
    saveToStorage(notifications.value)
  }
}

// ✅ 수정: 모두 읽음 + LocalStorage 저장
const markAllAsRead = () => {
  notifications.value.forEach(n => {
    n.read = true
  })
  // LocalStorage에 저장
  saveToStorage(notifications.value)
}

// ✅ 수정: 전체 삭제 + LocalStorage 저장
const clearAll = () => {
  if (confirm('모든 알림을 삭제하시겠습니까?')) {
    notifications.value.splice(0, notifications.value.length)
    // LocalStorage에 저장
    saveToStorage(notifications.value)
  }
}

// 모든 알림 보기
const viewAllNotifications = () => {
  console.log('모든 알림 페이지로 이동')
  // TODO: 라우터로 이동
}

// ========== 시간 표시 ==========
const getTimeAgo = (timestamp?: string) => {
  if (!timestamp) return ''
  
  const now = new Date()
  const time = new Date(timestamp)
  const diff = Math.floor((now.getTime() - time.getTime()) / 1000)
  
  if (diff < 60) return '방금 전'
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`
  if (diff < 604800) return `${Math.floor(diff / 86400)}일 전`
  
  return time.toLocaleDateString('ko-KR')
}

// ========== 아이콘 & 색상 ==========
const getNotificationIcon = (type: string) => {
  const icons: Record<string, any> = {
    application: UserPlus,
    deadline: AlertCircle,
    interview: Calendar,
    system: Bell,
    update: TrendingUp,
    success: CheckCircle
  }
  return icons[type] || Bell
}

const getNotificationColor = (type: string) => {
  const colors: Record<string, string> = {
    application: 'bg-blue-100 text-blue-600',
    deadline: 'bg-red-100 text-red-600',
    interview: 'bg-purple-100 text-purple-600',
    system: 'bg-gray-100 text-gray-600',
    update: 'bg-green-100 text-green-600',
    success: 'bg-emerald-100 text-emerald-600'
  }
  return colors[type] || 'bg-gray-100 text-gray-600'
}

// ========== 연결 상태 모니터링 ==========
watch(isConnected, (connected) => {
  console.log('SSE 연결 상태:', connected ? '연결됨' : '끊김')
})
</script>

<style scoped>
/* 슬라이드 페이드 */
.slide-fade-enter-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 1, 1);
}
.slide-fade-enter-from {
  transform: translateY(20px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateY(10px);
  opacity: 0;
}

/* 페이드 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* 리스트 애니메이션 */
.list-enter-active, .list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
.list-move {
  transition: transform 0.3s ease;
}

/* 스크롤바 스타일 */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}
.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* 말줄임 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
