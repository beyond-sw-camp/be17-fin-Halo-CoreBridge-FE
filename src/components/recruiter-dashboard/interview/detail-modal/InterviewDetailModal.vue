<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { X, Calendar, FileText, MapPin, Users, List } from 'lucide-vue-next'
import InterviewCancelModal from '@/components/recruiter-dashboard/interview/cancel-modal/InterviewCancelModal.vue'
import type { Interview } from '@/types/interview/interview'
import interviewAPI from '@/api/interview/index'

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

const interview = ref<Interview>({
  id: 0,
  name: '',
  startDateTime: '',
  duration: '',
  process: '',
  location: '',
  description: '',
  interviewers: [],
  interviewStatus: {
    code: '',
    label: ''
  },
  interviewType: {
    code: '',
    label: ''
  }
})

const getInitial = (name: string) => {
  return name.charAt(0).toUpperCase()
}

const getStatusColor = computed(() => {
  if (!interview.value) return ''
  const colors: Record<string, string> = {
    ONGOING: 'bg-green-500 text-white',
    SCHEDULED: 'bg-blue-100 text-blue-700',
    COMPLETED: 'bg-slate-100 text-slate-700',
    CANCELLED: 'bg-red-100 text-red-700'
  }
  return colors[interview.value.interviewStatus.code]
})

const getStatusLabel = computed(() => {
  if (!interview.value) return ''
  const labels: Record<string, string> = {
    ONGOING: '진행중',
    SCHEDULED: '예정',
    COMPLETED: '완료',
    CANCELLED: '취소'
  }
  return labels[interview.value.interviewStatus.code]
})

const handleClose = () => {
  emit('close')
}

const handleEdit = () => {
}

const handleCancel = () => {
}

const isOpenCancelModal = ref(false)
const openCancelModal = () => {
  isOpenCancelModal.value = true
}

const closeCancelModal = () => {
  isOpenCancelModal.value = false
}

onMounted(async () => {

  if (props.openModal) {
    await loadInterview()
  }

})

// 모달 다시 열릴 때도 재조회
watch(() => props.openModal, async (newVal) => {

  if (newVal) {
    await loadInterview()
  }

})

const loadInterview = async () => {

  const response = await interviewAPI.requestInterivew(props.interviewId)
  if (response.success) {
    interview.value = response.results
  } else {
    alert(response.message)
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200" enter-from-class="opacity-0" leave-to-class="opacity-0">
      <div v-if="openModal" class="fixed inset-0 bg-white/50 bg-opacity-50 flex items-center justify-center z-50"
        @click.self="handleClose">
        <!-- Modal -->
        <Transition enter-active-class="transition-all duration-200" leave-active-class="transition-all duration-200"
          enter-from-class="opacity-0 scale-95" leave-to-class="opacity-0 scale-95">
          <div v-if="openModal"
            class="bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <!-- Header -->
            <div
              class="sticky top-0 bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between rounded-t-2xl z-10">
              <div>
                <h2 class="text-2xl font-bold text-slate-800">면접 상세 정보</h2>
                <p class="text-sm text-slate-500 mt-1">면접 일정 및 참여자 정보를 확인하세요</p>
              </div>
              <button @click="handleClose"
                class="p-2 hover:bg-slate-100 rounded-xl transition-all hover:cursor-pointer">
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
                    <h3 class="text-2xl font-bold mb-2">{{ interview.name }}</h3>
                  </div>
                </div>
              </div>

              <!-- Interview Details Grid -->
              <div class="grid grid-cols-3 gap-6 mb-5">
                <!-- Date & Time -->
                <div class="bg-slate-50 rounded-xl p-5">
                  <div class="flex items-center space-x-2 mb-3">
                    <Calendar :size="20" class="text-slate-600" />
                    <h4 class="font-semibold text-slate-800">일정</h4>
                  </div>
                  <p class="text-slate-600 font-medium">{{ interview.startDateTime || '2025년 10월 22일 (수)' }}</p>
                </div>

                <!-- Type -->
                <div class="bg-slate-50 rounded-xl p-5">
                  <div class="flex items-center space-x-2 mb-3">
                    <FileText :size="20" class="text-slate-600" />
                    <h4 class="font-semibold text-slate-800">면접 유형</h4>
                  </div>
                  <p class="text-slate-600 font-medium">{{ interview.interviewType.label }}</p>
                  <p class="text-slate-500 text-sm mt-1">{{ interview.duration }}분 소요 예정</p>
                </div>

                <!-- Location -->
                <div class="bg-slate-50 rounded-xl p-5">
                  <div class="flex items-center space-x-2 mb-3">
                    <MapPin :size="20" class="text-slate-600" />
                    <h4 class="font-semibold text-slate-800">장소</h4>
                  </div>
                  <p class="text-slate-600 font-medium">{{ interview.location }}</p>
                </div>
              </div>

              <!-- Interviewers -->
              <div class="bg-slate-50 rounded-xl p-5 mb-5 overflow-y-auto max-h-48">
                <div class="flex items-center space-x-2 mb-3">
                  <Users :size="20" class="text-slate-600" />
                  <h4 class="font-semibold text-slate-800">면접관</h4>
                </div>
                <div class="flex items-center space-x-2" v-for="(interviewer, idx) in interview.interviewers"
                  :key="idx">
                  <div class="flex gap-2 items-center">
                    <div
                      class="w-8 h-8 bg-slate-600 rounded-lg flex items-center justify-center text-white text-xs font-medium border-2 border-white">
                      {{ getInitial(interviewer.name) }}
                    </div>
                    <span class="text-slate-600 font-medium text-sm">
                      {{ interviewer.name }}
                    </span>
                  </div>

                </div>
              </div>

              <!-- Interview Notes -->
              <div class="bg-slate-50 rounded-xl p-6 mb-8">
                <div class="flex items-center space-x-2 mb-4">
                  <List :size="20" class="text-slate-600" />
                  <h4 class="font-semibold text-slate-800">면접 메모</h4>
                </div>
                <p class="text-slate-600 leading-relaxed whitespace-pre-line">{{ interview.description }}</p>
              </div>

              <!-- Action Buttons -->
              <div class="flex space-x-3" v-if="interview.interviewStatus.code === 'SCHEDULED'">
                <button @click="openCancelModal"
                  class="flex-1 px-6 py-3 border bg-slate-50 border-slate-300 hover:cursor-pointer hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-all">
                  취소하기
                </button>
                <InterviewCancelModal :open-modal="isOpenCancelModal" @close="closeCancelModal"
                  :interview="interview" />
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped></style>
