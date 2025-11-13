<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  selected: string[]
  options: { code: string; label: string }[]
}>()

const emit = defineEmits(['close', 'save'])

const searchText = ref('')

// 선택 상태 (로컬에서 관리 → 저장 버튼 누르면 부모로 emit)
const localSelected = ref([...props.selected])

const filteredOptions = computed(() => {
  const keyword = searchText.value.toLowerCase()
  return props.options.filter(o =>
    o.label.toLowerCase().includes(keyword)
  )
})

const toggleSelect = (code: string) => {
  if (localSelected.value.includes(code)) {
    localSelected.value = localSelected.value.filter(c => c !== code)
  } else {
    localSelected.value.push(code)
  }
}

const removeChip = (code: string) => {
  localSelected.value = localSelected.value.filter(c => c !== code)
}

const save = () => {
  emit('save', localSelected.value)
}
</script>

<template>
  <!-- 배경 -->
  <div class="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
    <!-- 모달 카드 -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-xl w-full max-w-lg p-6">
      
      <!-- 헤더 -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-slate-700">기술 스택 선택</h2>
        <button class="text-gray-400 hover:text-gray-600" @click="$emit('close')">✕</button>
      </div>

      <!-- 검색 -->
      <input
        v-model="searchText"
        type="text"
        placeholder="기술 스택 검색..."
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-600 mb-4"
      />

      <!-- 선택된 칩 -->
      <div class="flex flex-wrap gap-2 mb-4">
        <div
          v-for="code in localSelected"
          :key="code"
          class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2"
        >
          {{ props.options.find(o => o.code === code)?.label }}
          <button @click="removeChip(code)" class="hover:text-blue-900">✕</button>
        </div>
      </div>

      <!-- 옵션 리스트 -->
      <div class="border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
        <div
          v-for="opt in filteredOptions"
          :key="opt.code"
          class="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer"
          @click="toggleSelect(opt.code)"
        >
          <span>{{ opt.label }}</span>
          <input type="checkbox" :checked="localSelected.includes(opt.code)" />
        </div>
      </div>

      <!-- 버튼 -->
      <div class="flex justify-end gap-3 mt-6">
        <button
          class="px-4 py-2 text-slate-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          @click="$emit('close')"
        >
          취소
        </button>

        <button
          class="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition font-medium"
          @click="save"
        >
          저장
        </button>
      </div>
    </div>
  </div>
</template>
