<script setup lang="ts">
import { RouterView } from 'vue-router'
import JobHeader from '@/components/JobHeader.vue'


// ✅ URL 바뀔 때마다 탭 상태 자동 갱신 (새로고침 시도 대응)
// watch(
//   () => route.path,
//   (newPath) => {
//     const lastSegment = newPath.split('/').pop()
//     if (lastSegment && tabs.value.some(t => t.id === lastSegment)) {
//       activeTab.value = lastSegment
//     }
//   },
//   { immediate: true }
// )

</script>

<template>
  <div class="mx-auto px-4 sm:px-6 lg:px-8 pt-6">
    <!-- ✅ 공통 헤더 -->
    <!-- <JobHeader :jobPosting="jobHeader" v-model:activeTab="activeTab" @update:activeTab="handleTabChange"
      :showSalaryBox="true" @edit="handleEdit" @pause="handlePause" @delete="handleDelete" /> -->
    <JobHeader />
  </div>

  <!-- ✅ 탭별 하위 페이지 출력 -->
  <RouterView class="mx-auto px-4 sm:px-6 lg:px-8 pb-6" />
</template>

<style scoped></style>
