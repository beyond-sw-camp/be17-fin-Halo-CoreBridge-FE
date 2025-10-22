<script setup lang="ts">
import { ref } from 'vue'
import {
  User,
  Clipboard,
  MapPin,
  Users,
  Bell,
  FileText,
  Check,
  Home,
  Monitor,
  Wifi
} from 'lucide-vue-next'

const props = defineProps<{
  interviewData: any
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit'): void
  (e: 'back'): void
}>()

const notifications = ref({
  sendEmail: true,
  notifyInterviewers: true,
  sendReminder: true
})

const getInitialColor = (index: number) => {
  const colors = [
    'from-slate-600 to-slate-800',
    'from-blue-600 to-blue-800',
    'from-purple-600 to-purple-800'
  ]
  return colors[index % colors.length]
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
            <div class="flex-1 h-1 bg-green-500"></div>
          </div>
          <div class="flex items-center space-x-2 flex-1">
            <div class="flex items-center space-x-2 flex-1">
              <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Check :size="16" class="text-white" />
              </div>
              <span class="text-sm font-medium text-slate-800">면접관 배정</span>
            </div>
            <div class="flex-1 h-1 bg-slate-600"></div>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
              <span class="text-white text-sm font-bold">3</span>
            </div>
            <span class="text-sm font-medium text-slate-800">확인</span>
          </div>
        </div>
      </div>

      <!-- Form Content -->
      <div class="px-8 py-6 overflow-y-auto flex-1">
        <!-- Success Icon -->
        <div class="flex flex-col items-center justify-center mb-8">
          <div class="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <Check :size="40" class="text-white" />
          </div>
          <h2 class="text-2xl font-bold text-slate-800 mb-2">면접 정보 확인</h2>
          <p class="text-sm text-slate-600">아래 내용을 확인하고 등록을 완료하세요</p>
        </div>

        <!-- 지원자 정보 -->
        <div class="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-4">
          <h3 class="text-sm font-bold text-slate-800 mb-4 flex items-center">
            <User :size="16" class="mr-2" />
            지원자 정보
          </h3>
          <div class="flex items-start space-x-4">
            <div class="w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-800 rounded-2xl flex items-center justify-center">
              <span class="text-white text-2xl font-bold">김</span>
            </div>
            <div class="flex-1 grid grid-cols-2 gap-4">
              <div>
                <p class="text-xs text-slate-500 mb-1">이름</p>
                <p class="text-sm font-bold text-slate-800">김지원</p>
              </div>
              <div>
                <p class="text-xs text-slate-500 mb-1">지원 포지션</p>
                <p class="text-sm font-bold text-slate-800">프론트엔드 개발자</p>
              </div>
              <div>
                <p class="text-xs text-slate-500 mb-1">경력</p>
                <p class="text-sm font-bold text-slate-800">3년</p>
              </div>
              <div>
                <p class="text-xs text-slate-500 mb-1">지원일</p>
                <p class="text-sm font-bold text-slate-800">2025.09.15</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 면접 기본 정보 -->
        <div class="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-4">
          <h3 class="text-sm font-bold text-slate-800 mb-4 flex items-center">
            <Clipboard :size="16" class="mr-2" />
            면접 기본 정보
          </h3>
          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-4">
              <div>
                <p class="text-xs text-slate-500 mb-1">면접 제목</p>
                <p class="text-sm font-bold text-slate-800">프론트엔드 개발자 1차 기술 면접</p>
              </div>
              <div>
                <p class="text-xs text-slate-500 mb-1">면접 유형</p>
                <p class="text-sm font-bold text-slate-800">1차 면접</p>
              </div>
              <div>
                <p class="text-xs text-slate-500 mb-1">면접 방식</p>
                <p class="text-sm font-bold text-slate-800">오프라인 면접</p>
              </div>
            </div>
            <div class="space-y-4">
              <div>
                <p class="text-xs text-slate-500 mb-1">면접 일시</p>
                <p class="text-sm font-bold text-slate-800">2025년 10월 25일 (금) 14:00</p>
              </div>
              <div>
                <p class="text-xs text-slate-500 mb-1">소요 시간</p>
                <p class="text-sm font-bold text-slate-800">60분</p>
              </div>
              <div>
                <p class="text-xs text-slate-500 mb-1">종료 예정</p>
                <p class="text-sm font-bold text-slate-800">15:00</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 장소 정보 -->
        <div class="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-4">
          <h3 class="text-sm font-bold text-slate-800 mb-4 flex items-center">
            <MapPin :size="16" class="mr-2" />
            장소 정보
          </h3>
          <div class="flex items-start space-x-4">
            <div class="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <Home :size="24" class="text-green-600" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-bold text-slate-800 mb-1">회의실 A</p>
              <p class="text-xs text-slate-600 mb-3">본관 3층 301호</p>
              <div class="flex flex-wrap gap-2">
                <span class="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg flex items-center space-x-1">
                  <Users :size="12" />
                  <span>최대 6인</span>
                </span>
                <span class="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg flex items-center space-x-1">
                  <Monitor :size="12" />
                  <span>빔 프로젝터</span>
                </span>
                <span class="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg flex items-center space-x-1">
                  <Wifi :size="12" />
                  <span>무선 인터넷</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 면접관 정보 -->
        <div class="bg-blue-50 rounded-xl p-6 border border-blue-200 mb-4">
          <h3 class="text-sm font-bold text-slate-800 mb-4 flex items-center justify-between">
            <span class="flex items-center">
              <Users :size="16" class="mr-2" />
              배정된 면접관
            </span>
            <span class="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-lg">총 3명</span>
          </h3>
          <div class="space-y-3">
            <!-- Interviewer 1 -->
            <div class="bg-white rounded-xl p-4 border border-blue-200">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center">
                    <span class="text-white font-bold text-lg">박</span>
                  </div>
                  <div>
                    <p class="text-sm font-bold text-slate-800">박면접</p>
                    <p class="text-xs text-slate-500 mb-1">개발팀 팀장</p>
                    <div class="flex items-center space-x-2">
                      <span class="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">주 면접관</span>
                      <span class="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-medium rounded">기술 역량</span>
                    </div>
                  </div>
                </div>
                <span class="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-lg">대기중</span>
              </div>
            </div>

            <!-- Interviewer 2 -->
            <div class="bg-white rounded-xl p-4 border border-blue-200">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
                    <span class="text-white font-bold text-lg">이</span>
                  </div>
                  <div>
                    <p class="text-sm font-bold text-slate-800">이평가</p>
                    <p class="text-xs text-slate-500 mb-1">시니어 개발자</p>
                    <div class="flex items-center space-x-2">
                      <span class="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-medium rounded">보조 면접관</span>
                      <span class="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-medium rounded">문제 해결력</span>
                    </div>
                  </div>
                </div>
                <span class="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-lg">대기중</span>
              </div>
            </div>

            <!-- Interviewer 3 -->
            <div class="bg-white rounded-xl p-4 border border-blue-200">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center">
                    <span class="text-white font-bold text-lg">김</span>
                  </div>
                  <div>
                    <p class="text-sm font-bold text-slate-800">김디자인</p>
                    <p class="text-xs text-slate-500 mb-1">리드 디자이너</p>
                    <div class="flex items-center space-x-2">
                      <span class="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-medium rounded">참관</span>
                      <span class="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-medium rounded">커뮤니케이션</span>
                    </div>
                  </div>
                </div>
                <span class="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-lg">대기중</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 알림 설정 -->
        <div class="bg-yellow-50 rounded-xl p-6 border border-yellow-200 mb-4">
          <h3 class="text-sm font-bold text-slate-800 mb-4 flex items-center">
            <Bell :size="16" class="mr-2" />
            알림 설정
          </h3>
          <div class="space-y-3">
            <label class="flex items-start p-3 bg-white border border-yellow-200 rounded-xl hover:border-yellow-300 cursor-pointer transition-all">
              <input
                v-model="notifications.sendEmail"
                type="checkbox"
                class="w-5 h-5 text-slate-600 border-slate-300 rounded focus:ring-slate-500 mr-3 mt-0.5" />
              <div>
                <span class="text-sm font-medium text-slate-700 block">지원자에게 면접 안내 메일 발송</span>
                <span class="text-xs text-slate-500">면접 일정, 장소, 준비사항이 포함된 이메일이 발송됩니다</span>
              </div>
            </label>
            <label class="flex items-start p-3 bg-white border border-yellow-200 rounded-xl hover:border-yellow-300 cursor-pointer transition-all">
              <input
                v-model="notifications.notifyInterviewers"
                type="checkbox"
                class="w-5 h-5 text-slate-600 border-slate-300 rounded focus:ring-slate-500 mr-3 mt-0.5" />
              <div>
                <span class="text-sm font-medium text-slate-700 block">면접관에게 알림 전송</span>
                <span class="text-xs text-slate-500">배정된 면접관에게 이메일 및 캘린더 초대가 발송됩니다</span>
              </div>
            </label>
            <label class="flex items-start p-3 bg-white border border-yellow-200 rounded-xl hover:border-yellow-300 cursor-pointer transition-all">
              <input
                v-model="notifications.sendReminder"
                type="checkbox"
                class="w-5 h-5 text-slate-600 border-slate-300 rounded focus:ring-slate-500 mr-3 mt-0.5" />
              <div>
                <span class="text-sm font-medium text-slate-700 block">면접 1시간 전 리마인더</span>
                <span class="text-xs text-slate-500">면접 시작 1시간 전 모든 참여자에게 알림을 발송합니다</span>
              </div>
            </label>
          </div>
        </div>

        <!-- 추가 메모 -->
        <div class="bg-slate-50 rounded-xl p-6 border border-slate-200">
          <h3 class="text-sm font-bold text-slate-800 mb-4 flex items-center">
            <FileText :size="16" class="mr-2" />
            메모
          </h3>
          <div class="bg-white rounded-lg p-4 border border-slate-200">
            <p class="text-sm text-slate-600">
              지원자의 React 프로젝트 경험을 중점적으로 평가해주세요.
            </p>
          </div>
        </div>
      </div>
</template>
<style scoped></style>
