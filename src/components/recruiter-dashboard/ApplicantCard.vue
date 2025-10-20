<template>
  <div
    class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
    @click="$emit('click')"
  >
    <div class="flex items-center space-x-4">
      <div class="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center text-white font-semibold">
        {{ applicant.initial }}
      </div>
      <div>
        <p class="font-semibold text-gray-900">{{ applicant.name }}</p>
        <p class="text-sm text-gray-600">
          {{ applicant.position }} • {{ applicant.experience }}
        </p>
      </div>
    </div>
    <div class="flex items-center space-x-3">
      <span
        class="px-3 py-1 text-xs rounded-full"
        :class="statusBadgeClass"
      >
        {{ applicant.status }}
      </span>
      <span class="text-sm text-gray-500">{{ applicant.timeAgo }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Applicant {
  id: number;
  name: string;
  position: string;
  experience: string;
  status: string;
  statusColor: string;
  timeAgo: string;
  initial: string;
}

interface Props {
  applicant: Applicant;
}

const props = defineProps<Props>();
defineEmits<{
  click: [];
}>();

const statusBadgeClass = computed(() => {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    purple: 'bg-purple-100 text-purple-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    orange: 'bg-orange-100 text-orange-700'
  };
  return colorMap[props.applicant.statusColor] || 'bg-gray-100 text-gray-700';
});
</script>
