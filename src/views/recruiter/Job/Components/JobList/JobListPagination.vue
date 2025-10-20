<script setup lang="ts">
const props = defineProps<{
  currentPage: number
  totalPages: number
}>()

const emit = defineEmits(['page-change'])

const goToPage = (page: number) => {
  emit('page-change', page)
}
</script>

<template>
  <div
    class="mt-6 flex items-center justify-between border-t border-gray-200 pt-4 text-sm"
  >
    <div class="text-gray-600">
      페이지 {{ currentPage }} / {{ totalPages }}
    </div>
    <div class="flex gap-2">
      <button
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        이전
      </button>

      <button
        v-for="page in totalPages"
        :key="page"
        @click="goToPage(page)"
        :class="[
          'px-4 py-2 rounded-lg font-medium text-sm',
          currentPage === page
            ? 'bg-slate-600 text-white'
            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
        ]"
      >
        {{ page }}
      </button>

      <button
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        다음
      </button>
    </div>
  </div>
</template>
