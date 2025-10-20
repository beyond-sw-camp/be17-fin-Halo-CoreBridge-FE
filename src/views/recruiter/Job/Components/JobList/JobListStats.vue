<script setup lang="ts">
interface Stats {
  total: number
  active: number
  totalApplicants: number
  hired: number
}

const props = defineProps<{
  stats: Stats
}>()
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
    <div
      class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col justify-between"
    >
      <div class="flex items-center justify-between mb-2">
        <span class="text-gray-600 text-sm font-medium">전체 공고</span>
        <span class="text-2xl">📋</span>
      </div>
      <div class="text-3xl font-bold text-slate-600">{{ stats.total }}</div>
    </div>

    <div
      class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col justify-between"
    >
      <div class="flex items-center justify-between mb-2">
        <span class="text-gray-600 text-sm font-medium">모집 중</span>
        <span class="text-2xl">✅</span>
      </div>
      <div class="text-3xl font-bold text-green-600">{{ stats.active }}</div>
    </div>

    <div
      class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col justify-between"
    >
      <div class="flex items-center justify-between mb-2">
        <span class="text-gray-600 text-sm font-medium">전체 지원자</span>
        <span class="text-2xl">👥</span>
      </div>
      <div class="text-3xl font-bold text-blue-600">{{ stats.totalApplicants }}</div>
    </div>

    <div
      class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col justify-between"
    >
      <div class="flex items-center justify-between mb-2">
        <span class="text-gray-600 text-sm font-medium">최종 합격</span>
        <span class="text-2xl">🎉</span>
      </div>
      <div class="text-3xl font-bold text-purple-600">{{ stats.hired }}</div>
    </div>
  </div>
</template>
