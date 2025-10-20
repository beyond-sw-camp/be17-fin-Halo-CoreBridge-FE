<template>
  <div
    class="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all duration-200 shadow-sm"
    @click="$emit('select', applicant.id)"
  >
    <div class="flex items-start justify-between mb-3">
      <div class="flex items-center gap-3">
        <div
          :class="[
            'w-10 h-10 rounded-full flex items-center justify-center text-white font-medium',
            isFinal ? 'bg-green-600' : 'bg-slate-600'
          ]"
        >
          {{ applicant.name.charAt(0) }}
        </div>
        <div>
          <div class="font-medium text-slate-600">{{ applicant.name }}</div>
          <div class="text-xs text-gray-500">{{ applicant.experience }}년 경력</div>
        </div>
      </div>

      <div :class="['flex items-center gap-2', isFinal ? 'text-green-600' : 'text-gray-600']">
        <Calendar class="w-4 h-4" />
        {{ applicant.statusText }}
      </div>
    </div>

    <div v-if="applicant.skills?.length" class="flex flex-wrap gap-1">
      <span
        v-for="(skill, i) in applicant.skills.slice(0, 4)"
        :key="i"
        class="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[11px]"
      >
        {{ skill }}
      </span>
      <span v-if="applicant.skills.length > 4" class="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[11px]">
        +{{ applicant.skills.length - 4 }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Calendar } from 'lucide-vue-next'

export interface Applicant {
  id: string
  name: string
  email: string
  experience: number
  stageId: string
  appliedDate: string
  interviewDate?: string
  statusText: string
  skills: string[]
}

defineProps<{
  applicant: Applicant
  isFinal?: boolean
}>()

defineEmits<{ (e: 'select', id: string): void }>()
</script>
