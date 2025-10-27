<template>
  <div
    v-if="close"
    class="fixed inset-0 bg-black/50 flex items-center justify-center p-8 z-50">
    <div
      class="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
      <CreateInterviewHeader @close="handClose" />

      <component :is="currentComponent" />
      <CreateInterviewFooter @next="nextStep" @back="backStep" @submit="submitStep" :step="step" />

    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, type Ref } from 'vue'
import { defineProps, defineEmits } from 'vue'

import CreateInterviewHeader from '@/components/recruiter-dashboard/interview/create-modal/CreateInterviewHeader.vue'
import CreateInterviewFooter from '@/components/recruiter-dashboard/interview/create-modal/CreateInterviewFooter.vue'

import CreateInterviewStep1 from '@/components/recruiter-dashboard/interview/create-modal/CreateInterviewStep1.vue'
import CreateInterviewStep2 from '@/components/recruiter-dashboard/interview/create-modal/CreateInterviewStep2.vue'
import CreateInterviewStep3 from '@/components/recruiter-dashboard/interview/create-modal/CreateInterviewStep3.vue'

const props = defineProps({
  openModal: Boolean,
})

const emits = defineEmits(['close'])

const isOpen = computed(() => {
  return props.openModal
})

const step = ref(1)
const close: Ref<Boolean> = ref(isOpen)

const currentStep = () => {
  switch (step.value) {
    case 1:
      return CreateInterviewStep1
    case 2:
      return CreateInterviewStep2
    case 3:
      return CreateInterviewStep3
  }
}
const currentComponent = computed(currentStep)

const nextStep = () => {
  if (step.value < 3) {
    step.value++
  }
}

const backStep = () => {
  if (step.value > 1) {
    step.value--
  }
}

const submitStep = () => {

}

const handClose = () => {
  close.value = false
  emits('close')
}
</script>
<style></style>
