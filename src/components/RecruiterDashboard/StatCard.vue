<script setup lang="ts">
import { computed } from 'vue'
import { FileText, Users, Clock, CalendarDays } from 'lucide-vue-next'

interface Props {
  label: string
  value: string | number
  change: string
  icon: string
}

const props = defineProps<Props>()

// 색상 동적 처리
const changeColor = computed(() => {
  if (props.change.includes('증가')) return 'text-green-600'
  if (props.change.includes('긴급')) return 'text-orange-600'
  return 'text-blue-600'
})

// ✅ lucide 아이콘 매핑
const iconComponent = computed(() => {
  const icons: Record<string, unknown> = {
    document: FileText,
    users: Users,
    clock: Clock,
    calendar: CalendarDays,
  }
  return icons[props.icon] || FileText
})
</script>
<template>
  <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm text-gray-600 mb-1">{{ label }}</p>
        <p class="text-3xl font-bold text-slate-600">{{ value }}</p>
        <p class="text-xs mt-2" :class="changeColor">
          {{ change }}
        </p>
      </div>
      <div class="bg-slate-100 rounded-full p-3">
        <component :is="iconComponent" class="w-8 h-8 text-slate-600" />
      </div>
    </div>
  </div>
</template>
<style scoped></style>