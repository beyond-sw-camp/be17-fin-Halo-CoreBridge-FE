<template>
  <tr class="border-b border-gray-100 hover:bg-slate-100 cursor-pointer transition" @click="$emit('click')">
    <td class="py-4 px-4">
      <p class="font-semibold text-gray-900">{{ posting.position }}</p>
      <p class="text-xs text-gray-500">{{ posting.requirement }}</p>
    </td>
    <td class="py-4 px-4 text-gray-600">{{ posting.department }}</td>
    <td class="py-4 px-4 text-center text-gray-900 font-semibold">
      {{ posting.applicants }}
    </td>
    <td class="py-4 px-4 text-center text-gray-900 font-semibold">
      {{ posting.documentPassed }}
    </td>
    <td class="py-4 px-4 text-center text-gray-900 font-semibold">
      {{ posting.interviewing }}
    </td>
    <td class="py-4 px-4 text-center">
      <span class="px-3 py-1 text-xs rounded-full" :class="statusBadgeClass">
        {{ posting.status }}
      </span>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface JobPosting {
  id: number;
  position: string;
  requirement: string;
  department: string;
  applicants: number;
  documentPassed: number;
  interviewing: number;
  status: string;
  statusColor: string;
}

interface Props {
  posting: JobPosting;
}

const props = defineProps<Props>();
defineEmits<{
  click: [];
}>();

const statusBadgeClass = computed(() => {
  const colorMap: Record<string, string> = {
    green: 'bg-green-100 text-green-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    red: 'bg-red-100 text-red-700',
    gray: 'bg-gray-100 text-gray-700'
  };
  return colorMap[props.posting.statusColor] || 'bg-gray-100 text-gray-700';
});
</script>
