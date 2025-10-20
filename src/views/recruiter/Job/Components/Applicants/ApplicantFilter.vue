<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
    <div class="flex flex-col md:flex-row gap-4">
      <!-- 검색 -->
      <div class="flex-1 relative">
        <Search :size="20" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          v-model="searchModel"
          type="text"
          placeholder="이름, 이메일로 검색..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
        />
      </div>

      <!-- 상태 필터 + 추가 필터 버튼 -->
      <div class="flex gap-2">
        <div class="relative">
          <Filter :size="20" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            v-model="statusModel"
            class="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent appearance-none bg-white cursor-pointer"
          >
            <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </div>

        <!-- <button
          @click="$emit('toggleFilter')"
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
        >
          <Filter class="w-5 h-5" />
          추가 필터
        </button> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Search, Filter } from 'lucide-vue-next'

interface StatusOption {
  value: string
  label: string
}

const props = defineProps<{
  search: string
  status: string
  statusOptions: StatusOption[]
}>()

const emit = defineEmits<{
  (e: 'update:search', v: string): void
  (e: 'update:status', v: string): void
  (e: 'toggleFilter'): void
}>()

// 🔧 v-model 커스텀: 부모와 양방향 동기화
const searchModel = computed({
  get: () => props.search,
  set: (v: string) => emit('update:search', v),
})

const statusModel = computed({
  get: () => props.status,
  set: (v: string) => emit('update:status', v),
})
</script>
