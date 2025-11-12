<script setup lang="ts">
import { Briefcase, Calendar, Award, GraduationCap } from 'lucide-vue-next'

interface Applicant {
  id: number
  name: string
  email: string
  appliedAt: string
  status: string
  statusColor: string // 예: "blue-500", "green-500" (API 기반)
  education: string
  certificates: number
  careerType: string
  skills: string[]
}

interface Props {
  applicant: Applicant
}

defineProps<Props>()
defineEmits(['click', 'viewDetail'])

// Tailwind 색상 → HEX 매핑
function getColorHex(code: string): string {
  const map: Record<string, string> = {
    'blue-500': '#3b82f6',
    'orange-500': '#f97316',
    'purple-500': '#a855f7',
    'pink-500': '#ec4899',
    'green-500': '#22c55e',
    'red-500': '#ef4444',
    'yellow-500': '#eab308',
    'gray-500': '#6b7280',
    'slate-500': '#64748b'
  }
  return map[code] || '#94a3b8' // fallback color
}
</script>

<template>
  <div
    @click="$emit('click')"
    class="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all cursor-pointer bg-white"
  >
    <div class="flex items-start justify-between mb-4">
      <!-- 왼쪽 프로필 -->
      <div class="flex items-center gap-4">
        <div
          class="w-12 h-12 rounded-full flex items-center justify-center"
          :style="{ backgroundColor: getColorHex(applicant.statusColor) + '20' }"
        >
          <span class="text-lg font-semibold text-slate-600">
            {{ applicant.name[0] }}
          </span>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-slate-700">{{ applicant.name }}</h3>
          <p class="text-sm text-gray-500">{{ applicant.email }}</p>
        </div>
      </div>

      <!-- 오른쪽 상태 뱃지 -->
      <span
        class="px-3 py-1 rounded-full text-xs font-medium transition-all"
        :style="{
          backgroundColor: getColorHex(applicant.statusColor) + '22',
          color: getColorHex(applicant.statusColor)
        }"
      >
        {{ applicant.status }}
      </span>
    </div>

    <!-- 지원자 기본정보 -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      <div class="flex items-center gap-2">
        <Briefcase :size="16" class="text-gray-400" />
        <span class="text-sm text-gray-600">{{ applicant.careerType }}</span>
      </div>
      <div class="flex items-center gap-2">
        <GraduationCap :size="16" class="text-gray-400" />
        <span class="text-sm text-gray-600">{{ applicant.education }}</span>
      </div>
      <div class="flex items-center gap-2">
        <Award :size="16" class="text-gray-400" />
        <span class="text-sm text-gray-600">자격증 {{ applicant.certificates }}개</span>
      </div>
      <div class="flex items-center gap-2">
        <Calendar :size="16" class="text-gray-400" />
        <span class="text-sm text-gray-600">{{ applicant.appliedAt }}</span>
      </div>
    </div>

    <!-- 스킬 리스트 -->
    <div class="flex flex-wrap gap-2">
      <span
        v-for="skill in applicant.skills.slice(0, 5)"
        :key="skill"
        class="px-2 py-1 bg-slate-50 text-slate-600 rounded text-xs"
      >
        {{ skill }}
      </span>
      <span
        v-if="applicant.skills.length > 5"
        class="px-2 py-1 text-slate-500 rounded text-xs"
      >
        +{{ applicant.skills.length - 5 }}
      </span>
    </div>
  </div>
</template>
