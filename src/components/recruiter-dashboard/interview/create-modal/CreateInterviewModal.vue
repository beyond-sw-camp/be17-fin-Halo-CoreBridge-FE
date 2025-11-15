<template>
  <div v-if="close" class="fixed inset-0 bg-black/50 flex items-center justify-center p-8 z-50">
    <div class="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
      <CreateInterviewHeader @close="handClose" />

      <CreateInterviewStep1 :open-modal="props.openModal" :interview-modal-data="props.interviewModalData"
        @close="handClose" />

    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, type Ref } from 'vue'
import { defineProps, defineEmits } from 'vue'

import CreateInterviewHeader from '@/components/recruiter-dashboard/interview/create-modal/CreateInterviewHeader.vue'

import CreateInterviewStep1 from '@/components/recruiter-dashboard/interview/create-modal/CreateInterviewStep1.vue'
import type { InterviewModalData } from '@/types/interview/interview'

const props = defineProps<{
  openModal: boolean
  interviewModalData: InterviewModalData
}>()

const emits = defineEmits(['close'])

const isOpen = computed(() => {
  return props.openModal
})

const close: Ref<Boolean> = ref(isOpen)

const handClose = () => {
  close.value = false
  emits('close')
}
</script>
<style></style>
