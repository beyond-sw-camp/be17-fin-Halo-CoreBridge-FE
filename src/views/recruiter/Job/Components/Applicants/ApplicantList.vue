<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h2 class="text-xl font-semibold text-slate-600 mb-4">
      지원자 목록 ({{ applicants.length }})
    </h2>

    <div v-if="applicants.length" class="space-y-4">
      <ApplicantListCard
        v-for="a in applicants"
        :key="a.id"
        :applicant="a"
        @click="$emit('select', a.id)"
      />
    </div>

    <div v-else class="text-center py-12">
      <p class="text-gray-500">검색 결과가 없습니다.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import ApplicantListCard from '@/components/applicant/ApplicantListCard.vue'

interface Applicant {
  id: number
  name: string
  email: string
  appliedAt: string
  status: string
  statusColor: string
  careerYears: number
  education: string
  certificates: number
  skills: string[]
}

defineProps<{
  applicants: Applicant[]
}>()

defineEmits<{
  (e: 'select', id: number): void
}>()
</script>
