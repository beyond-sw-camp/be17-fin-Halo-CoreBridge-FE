<script setup lang="ts">
import type {  RecruitProcessEditForm } from '@/types/jobPosting/RecruitProcess.ts'
import ColorCode from '@/components/common/ColorCode.vue'

interface Props {
  openModal: boolean
  editProcess: RecruitProcessEditForm
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  confirm: [recruitProcessEdit: RecruitProcessEditForm]
}>()

const recruitProcessEditForm: RecruitProcessEditForm = props.editProcess

const handleClose = () => {
  emit('close')
}

const handleConfirm = async () => {

  emit('confirm', recruitProcessEditForm)
  handleClose()
}

const handleColorCodeChange = (colorCode: string) => {
  recruitProcessEditForm.colorCode = colorCode
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
          <div v-if="openModal" class="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4">
            <!-- Content -->
            <div class="p-8">

              <!-- Title & Description -->
              <div class="text-center mb-6">
                <h3 class="text-2xl font-bold text-slate-800 mb-3">채용 프로세스 수정</h3>
              </div>

              <!-- Cancellation Reason -->
              <div class="mb-6 flex flex-col gap-2">
                <label class="block text-sm font-semibold text-slate-700 mb-2">수정 내용</label>
                <input
                  class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all resize-none"
                  v-model="recruitProcessEditForm.name"
                >
                <ColorCode @color-code="handleColorCodeChange" />
              </div>

              <!-- Action Buttons -->
              <div class="flex flex-col gap-3">
                <button
                  @click="handleConfirm"
                  class="hover:cursor-pointer flex-1 px-6 py-3 bg-slate-500 hover:bg-slate-700 text-white rounded-xl font-medium transition-all"
                >
                  수정
                </button>
                <button
                  @click="handleClose"
                  class="hover:cursor-pointer px-6 py-3 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl font-medium transition-all"
                >
                  돌아가기
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped></style>
