<script setup lang="ts">

interface Props {
  openModal: boolean
  isDeletedError: boolean
  deletedErrorMsg: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  confirm: []
}>()

const handleClose = () => {
  emit('close')
}

const handleConfirm = async () => {
  emit('confirm')
  handleClose()
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
            <div class="p-8" v-if="!isDeletedError">

              <!-- Title & Description -->
              <div class="text-center mb-6">
                <h3 class="text-2xl font-bold text-slate-800 mb-3">채용 프로세스 삭제</h3>
              </div>

              <!-- Action Buttons -->
              <div class="flex flex-col gap-3">
                <button
                  @click="handleConfirm"
                  class="hover:cursor-pointer flex-1 px-6 py-3 bg-red-500 hover:bg-red-700 text-white rounded-xl font-medium transition-all"
                >
                  삭제하기
                </button>
                <button
                  @click="handleClose"
                  class="hover:cursor-pointer px-6 py-3 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl font-medium transition-all"
                >
                  돌아가기
                </button>
              </div>
            </div>
            <div v-else class="p-8">
              <!-- Title & Description -->
              <div class="text-center mb-6 w-96">
                <h3 class="text-sm font-bold text-slate-800 mb-3 p-2">{{ props.deletedErrorMsg }}</h3>
              </div>

              <!-- Action Buttons -->
              <div class="flex flex-col gap-3">
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
