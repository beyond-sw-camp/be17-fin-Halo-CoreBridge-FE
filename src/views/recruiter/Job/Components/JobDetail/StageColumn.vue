<template>
  <div class="flex-shrink-0 w-80">
    <!-- 컬럼 헤더 -->
    <div :class="['rounded-lg p-4 mb-4 shadow-md', stage.headerClass]">
      <div class="flex items-center justify-between mb-2">
        <h3 class="font-bold text-slate-600 flex items-center gap-2">
          <span :class="['w-3 h-3 rounded-full', stage.dotClass]"></span>
          {{ stage.name }}
        </h3>
        <span class="text-sm text-gray-600 bg-white px-2 py-1 rounded">
          {{ applicants.length }}
        </span>
      </div>
    </div>

    <!-- 지원자 카드 -->
    <div class="space-y-3 min-h-[500px]">
      <ApplicantCard
        v-for="a in applicants"
        :key="a.id"
        :applicant="a"
        :isFinal="stage.id === 'final'"
        @select="$emit('viewApplicant', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ApplicantCard, { type Applicant } from './ApplicantCard.vue'

export interface Stage {
  id: string
  name: string
  headerClass: string
  dotClass: string
}

defineProps<{
  stage: Stage
  applicants: Applicant[]
}>()

defineEmits<{ (e: 'viewApplicant', id: string): void }>()
</script>
