<script setup lang="ts">
const emit = defineEmits(['open-job-form'])
</script>

<template>
  <div class="flex justify-between items-center mb-6">
    <div>
      <h2 class="text-3xl font-bold text-slate-600 mb-2">채용 공고</h2>
      <p class="text-gray-600">진행 중인 채용 공고를 관리하세요</p>
    </div>
    <button
      @click="$emit('open-job-form')"
      class="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition font-medium"
    >
      + 새 채용 공고
    </button>
  </div>
</template>
