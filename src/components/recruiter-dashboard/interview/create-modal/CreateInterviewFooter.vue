<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
import { computed, defineEmits, defineProps } from 'vue'

const emit = defineEmits(['next', 'back', 'submit'])

const props = defineProps({
  step: Number
})

const handleNext = () => {
  emit('next')
}

const handleBack = () => {
  emit('back')
}

const handleSubmit = () => {
  alert('면접 등록을 클릭하였습니다.')
  emit('submit')
}

const isFirstStep = computed(() => props.step !== undefined && props.step <= 1)
const isLastStep = computed(() => props.step !== undefined && props.step >= 3)

</script>
<template>
  <!-- Footer -->
  <footer class="px-8 py-6 border-t border-slate-300 bg-slate-50 rounded-b-2xl">
    <div class="flex justify-end gap-2">
      <button v-if="!isFirstStep"
              @click="handleBack"
              class=" px-6 py-3 text-slate-900 hover:bg-slate-300 bg-slate-200 flex items-center space-x-2 hover:cursor-pointer bg-gradient-to-r rounded-xl font-medium shadow-lg transition-all">
        <ArrowLeft :size="16" />
        <span>이전</span>
      </button>
      <button
        v-if="!isLastStep"
        @click="handleNext"
        type="button"
        class="hover:cursor-pointer px-8 py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white rounded-xl font-medium shadow-lg transition-all">
        다음 단계
      </button>
      <button
        v-if="isLastStep"
        @click="handleSubmit"
        type="button"
        class="hover:cursor-pointer px-8 py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white rounded-xl font-medium shadow-lg transition-all">
        면접 등록
      </button>
    </div>
  </footer>
</template>
<style scoped>
</style>
