<script setup lang="ts">
import { ref } from 'vue'
import { AlertCircle, AlertTriangle } from 'lucide-vue-next'
import { useRouter, useRoute } from 'vue-router'
import type { Interview, InterviewCancelForm } from '@/types/interview/interview'
import interviewAPI from '@/api/interview'

interface Props {
  openModal: boolean
  interview: Interview
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  confirm: [interviewId: number, reason: string]
}>()

const cancelReason = ref('')

const handleClose = () => {
  cancelReason.value = ''
  emit('close')
}

const handleConfirm = async () => {

  if (props.interview) {

    const req: InterviewCancelForm = {
      interveiwId: props.interview.id,
      cancelReason: cancelReason.value
    }

    const response = await interviewAPI.requestInterviewCancel(req)
    if (response.success) {
      alert(response.message)
    } else {
      alert(response.message)
    }

    handleClose()
    window.location.reload()
  }
}


</script>

<template>
  <Teleport to="body">
    <Transition enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200" enter-from-class="opacity-0" leave-to-class="opacity-0">
      <div v-if="openModal" class="fixed inset-0 bg-white/50 bg-opacity-50 flex items-center justify-center z-40"
        @click.self="handleClose">
        <!-- Modal -->
        <Transition enter-active-class="transition-all duration-200" leave-active-class="transition-all duration-200"
          enter-from-class="opacity-0 scale-95" leave-to-class="opacity-0 scale-95">
          <div v-if="openModal" class="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4">
            <!-- Content -->
            <div class="p-8">
              <!-- Warning Icon -->
              <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle :size="32" class="text-red-600" />
              </div>

              <!-- Title & Description -->
              <div class="text-center mb-6">
                <h3 class="text-2xl font-bold text-slate-800 mb-3">면접 일정을 취소하시겠습니까?</h3>
                <p class="text-slate-600 leading-relaxed">
                  이 작업은 되돌릴 수 없으며, 지원자와 면접관에게 취소 알림이 전송됩니다.
                </p>
              </div>

              <!-- Interview Info -->
              <div class="bg-slate-50 rounded-xl p-5 mb-6">
                <div class="flex items-center space-x-4 mb-4">
                  <div>
                    <h4 class="font-semibold text-slate-800">{{ interview.name }}</h4>
                  </div>
                </div>
                <div class="space-y-2 text-sm">
                  <div class="flex items-center justify-between">
                    <span class="text-slate-500">일정</span>
                    <span class="font-medium text-slate-800">{{ interview.startDateTime }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-slate-500">면접 유형</span>
                    <span class="font-medium text-slate-800">
                      {{ interview.interviewType.label }} · {{ interview.duration }}분
                    </span>
                  </div>
                  <div class="flex items-center justify-between" v-if="interview.interviewType.code !== 'ONLINE'">
                    <span class="text-slate-500">장소</span>
                    <span class="font-medium text-slate-800">{{ interview.location }}</span>
                  </div>
                </div>
              </div>

              <!-- Cancellation Reason -->
              <div class="mb-6">
                <label class="block text-sm font-semibold text-slate-700 mb-2">취소 사유 (선택)</label>
                <textarea v-model="cancelReason" rows="3" placeholder="취소 사유를 입력하면 지원자에게 전달됩니다"
                  class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all resize-none"></textarea>
              </div>

              <!-- Action Buttons -->
              <div class="flex space-x-3">
                <button @click="handleConfirm"
                  class="hover:cursor-pointer flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all">
                  면접 취소
                </button>
                <button @click="handleClose"
                  class="hover:cursor-pointer px-6 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-medium transition-all">
                  돌아가기
                </button>
              </div>

              <!-- Warning Note -->
              <div class="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <div class="flex space-x-3">
                  <AlertTriangle :size="20" class="text-amber-600 flex-shrink-0 mt-0.5" />
                  <p class="text-sm text-amber-800">
                    면접 취소 시 이메일 알림이 자동으로 발송됩니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped></style>
