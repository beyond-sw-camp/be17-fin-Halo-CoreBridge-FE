<script setup lang="ts">
import { ref, watch } from 'vue'
import { Search } from 'lucide-vue-next'

const props = defineProps<{
  searchQuery: string
  selectedStatus: string
}>()

const emit = defineEmits(['update:searchQuery', 'update:selectedStatus', 'filter-change', 'search'])

const localSearch = ref(props.searchQuery)
const localStatus = ref(props.selectedStatus)

// ✅ 상위에서 v-model로 연결되도록 watch 사용
watch(localSearch, (val) => {
  emit('update:searchQuery', val)
  emit('search', val)
  emit('filter-change', { search: val, status: localStatus.value })
})

watch(localStatus, (val) => {
  emit('update:selectedStatus', val)
  emit('filter-change', { search: localSearch.value, status: val })
})
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-200 p-6 mb-6 flex flex-col lg:flex-row gap-4">
    <!-- 검색창 -->
    <div class="flex-1 relative">
      <input
        v-model="localSearch"
        type="text"
        placeholder="공고명, 포지션, 부서, 키워드로 검색..."
        class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-gray-900 placeholder-gray-500"
      />
      <Search class="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
    </div>

    <!-- 상태 필터 -->
    <div class="w-full lg:w-56">
      <select
        v-model="localStatus"
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-gray-900"
      >
        <option value="">전체 상태</option>
        <option value="recruiting">모집 중</option>
        <option value="screening">서류 검토 중</option>
        <option value="interviewing">면접 중</option>
        <option value="paused">모집 중단</option>
        <option value="closed">모집 마감</option>
      </select>
    </div>
  </div>
</template>
