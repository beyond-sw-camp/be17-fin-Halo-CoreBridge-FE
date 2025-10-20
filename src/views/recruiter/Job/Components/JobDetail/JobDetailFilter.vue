<template>
  <div class="flex gap-4 mb-6">
    <!-- 검색 -->
    <div class="flex-1 relative">
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        type="text"
        placeholder="지원자 이름, 이메일 검색..."
        class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent"
      />
      <Search class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
    </div>

    <!-- 필터 버튼 -->
    <button
      @click="$emit('toggleFilter')"
      class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
    >
      <Filter class="w-5 h-5" />
      필터
    </button>
  </div>
</template>

<script setup lang="ts">
import { Search, Filter } from 'lucide-vue-next'

defineProps<{ modelValue: string }>()
defineEmits<{
  (e: 'update:modelValue', v: string): void
  (e: 'toggleFilter'): void
}>()
</script>
