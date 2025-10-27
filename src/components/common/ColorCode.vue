<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ColorCode } from '@/types/common/ColorCode.ts'

const props = defineProps<{
  colorCodeName?: string
}>()

const emit = defineEmits<{
  colorCode: [code: string]
}>()

const colorCode = ref<ColorCode[]>([
  {
    name: '파랑',
    code: 'BLUE'
  },
  {
    name: '빨강',
    code: 'RED'
  },
  {
    name: '주황',
    code: 'ORANGE'
  },
  {
    name: '보라',
    code: 'PURPLE'
  },
  {
    name: '분홍',
    code: 'PINK'
  }
])

const selectedColor = ref<string>(props.colorCodeName ?? 'BLUE')

watch(selectedColor, (newVal) => {

  if (newVal !== undefined) {
    emit('colorCode', newVal)
  }

},{immediate:true})

</script>

<template>
  <select v-model="selectedColor"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500">
    <option
      v-for="color in colorCode"
      :key="color.code"
      :value="color.code"
    >
      {{ color.name }}
    </option>
  </select>
</template>

<style scoped>

</style>
