<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { X, Calendar, FileText, MapPin, Users, List } from 'lucide-vue-next'
import InterviewCancelModal from '@/components/recruiter-dashboard/interview/cancel-modal/InterviewCancelModal.vue'

interface Applicant {
  name: string
  position: string
  experience: string
  initial: string
}

interface Interview {
  id: number
  date: string
  time: string
  applicant: Applicant
  type: string
  duration: string
  location: string
  locationDetail?: string
  interviewers: Array<{ name: string, initial: string }>
  status: 'ongoing' | 'scheduled' | 'completed' | 'cancelled'
  notes?: string
  fullDate?: string
}

interface Props {
  openModal: boolean
  interviewId: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  edit: [interview: Interview]
  cancel: [interview: Interview]
}>()

const interview = reactive(
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
    locationDetail: '본사 3층 회의실',
    interviewers: [
      {
        name: '박명수',
        initial: '박'
      },
      {
        name: '유재석',
        initial: '유'
      }
    ],
    notes: 'React, Vue.js 실무 경험 확인',
    status: 'ongoing'
  }
)

const getStatusColor = computed(() => {
  if (!interview) return ''
  const colors: Record<string, string> = {
    ongoing: 'bg-green-500 text-white',
    scheduled: 'bg-blue-100 text-blue-700',
    completed: 'bg-slate-100 text-slate-700',
    cancelled: 'bg-red-100 text-red-700'
  }
  return colors[interview.status]
})

const getStatusLabel = computed(() => {
  if (!interview) return ''
  const labels: Record<string, string> = {
    ongoing: '진행중',
    scheduled: '예정',
    completed: '완료',
    cancelled: '취소'
  }
  return labels[interview.status]
})

const handleClose = () => {
  emit('close')
}

const handleEdit = () => {
}

const handleCancel = () => {
}

const handleViewResume = () => {
  // 이력서 보기 로직
}

const isOpenCancelModal = ref(false)
const openCancelModal = () => {
  isOpenCancelModal.value = true
}

const closeCancelModal = () => {
  isOpenCancelModal.value = false
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div v-if="openModal" class="fixed inset-0 bg-white/50 bg-opacity-50 flex items-center justify-center z-50" @click.self="handleClose">
        <!-- Modal -->
        <Transition
          enter-active-class="transition-all duration-200"
          leave-active-class="transition-all duration-200"
          enter-from-class="opacity-0 scale-95"
          leave-to-class="opacity-0 scale-95"
        >
          <div v-if="openModal" class="bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <!-- Header -->
            <div class="sticky top-0 bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between rounded-t-2xl z-10">
              <div>
                <h2 class="text-2xl font-bold text-slate-800">면접 상세 정보</h2>
                <p class="text-sm text-slate-500 mt-1">면접 일정 및 참여자 정보를 확인하세요</p>
              </div>
              <button @click="handleClose" class="p-2 hover:bg-slate-100 rounded-xl transition-all hover:cursor-pointer">
                <X :size="24" class="text-slate-600" />
              </button>
            </div>

            <!-- Content -->
            <div class="p-8">
              <!-- Status Badge -->
              <div class="mb-6">
                <span class="inline-flex px-4 py-2 text-sm font-medium rounded-xl" :class="getStatusColor">
                  {{ getStatusLabel }}
                </span>
              </div>

              <!-- Applicant Info -->
              <div class="bg-gradient-to-br from-slate-600 to-slate-800 rounded-2xl p-6 text-white mb-8">
                <div class="flex items-center space-x-4">
                  <div class="flex-1">
                    <h3 class="text-2xl font-bold mb-2">{{ interview.applicant.name }}</h3>
                    <p class="text-slate-200">{{ interview.applicant.position }} · {{ interview.applicant.experience }}</p>
                  </div>
                </div>
              </div>

              <!-- Interview Details Grid -->
              <div class="grid grid-cols-2 gap-6 mb-8">
                <!-- Date & Time -->
                <div class="bg-slate-50 rounded-xl p-5">
                  <div class="flex items-center space-x-2 mb-3">
                    <Calendar :size="20" class="text-slate-600" />
                    <h4 class="font-semibold text-slate-800">일정</h4>
                  </div>
                  <p class="text-slate-600 font-medium">{{ interview.date || '2025년 10월 22일 (수)' }}</p>
                  <p class="text-slate-500 text-sm mt-1">{{ interview.time }} - {{ interview.duration }}</p>
                </div>

                <!-- Type -->
                <div class="bg-slate-50 rounded-xl p-5">
                  <div class="flex items-center space-x-2 mb-3">
                    <FileText :size="20" class="text-slate-600" />
                    <h4 class="font-semibold text-slate-800">면접 유형</h4>
                  </div>
                  <p class="text-slate-600 font-medium">{{ interview.type }}</p>
                  <p class="text-slate-500 text-sm mt-1">{{ interview.duration }} 소요 예정</p>
                </div>

                <!-- Location -->
                <div class="bg-slate-50 rounded-xl p-5">
                  <div class="flex items-center space-x-2 mb-3">
                    <MapPin :size="20" class="text-slate-600" />
                    <h4 class="font-semibold text-slate-800">장소</h4>
                  </div>
                  <p class="text-slate-600 font-medium">{{ interview.location }}</p>
                  <p class="text-slate-500 text-sm mt-1">{{ interview.locationDetail || '본사 3층' }}</p>
                </div>

                <!-- Interviewers -->
                <div class="bg-slate-50 rounded-xl p-5">
                  <div class="flex items-center space-x-2 mb-3">
                    <Users :size="20" class="text-slate-600" />
                    <h4 class="font-semibold text-slate-800">면접관</h4>
                  </div>
                  <div class="flex items-center space-x-2">
                    <div class="flex -space-x-2">
                      <div
                        v-for="(interviewer, idx) in interview.interviewers.slice(0, 3)"
                        :key="idx"
                        class="w-8 h-8 bg-slate-600 rounded-lg flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                      >
                        {{ interviewer.initial }}
                      </div>
                    </div>
                    <span class="text-slate-600 font-medium text-sm">
                      {{ interview.interviewers.map(i => i.name).join(', ') }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Interview Notes -->
              <div v-if="interview.notes" class="bg-slate-50 rounded-xl p-6 mb-8">
                <div class="flex items-center space-x-2 mb-4">
                  <List :size="20" class="text-slate-600" />
                  <h4 class="font-semibold text-slate-800">면접 메모</h4>
                </div>
                <p class="text-slate-600 leading-relaxed whitespace-pre-line">{{ interview.notes }}</p>
              </div>

              <!-- Action Buttons -->
              <div class="flex space-x-3">
                <button
                  @click="handleEdit"
                  class="flex-1 px-6 py-3 bg-gradient-to-r hover:cursor-pointer from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white rounded-xl font-medium transition-all"
                >
                  면접 수정
                </button>
                <button
                  @click="openCancelModal"
                  class="px-6 py-3 border border-slate-200 hover:cursor-pointer hover:bg-slate-50 text-slate-700 rounded-xl font-medium transition-all"
                >
                  취소하기
                </button>
                <InterviewCancelModal :open-modal="isOpenCancelModal" :interview="interview" @close="closeCancelModal" />
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped></style>
