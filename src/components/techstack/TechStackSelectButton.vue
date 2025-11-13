<script setup lang="ts">
import { ref } from 'vue'
import TechStackModal from './TechStackModal.vue'

const props = defineProps<{
  modelValue: string[]
  options: { code: string; label: string }[]
}>()

const emit = defineEmits(['update:modelValue'])

const isModalOpen = ref(false)

// 모달에서 저장 시 부모에게 전달
const updateSelected = (val: string[]) => {
  emit('update:modelValue', val)
  isModalOpen.value = false
}
</script>

<template>
  <div>
    <!-- 버튼 UI -->
    <button
      type="button"
      class="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition shadow-sm"
      @click="isModalOpen = true"
    >
      + 기술 스택 추가
    </button>

    <!-- 모달 -->
    <TechStackModal
      v-if="isModalOpen"
      :selected="modelValue"
      :options="options"
      @close="isModalOpen = false"
      @save="updateSelected"
    />
  </div>
</template>
