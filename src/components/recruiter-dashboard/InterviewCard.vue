<template>
  <div
    class="pl-4 py-2 border-l-4"
    :class="borderClass"
  >
    <p class="font-semibold text-gray-900">{{ interview.name }}</p>
    <p class="text-sm text-gray-600">{{ interview.position }}</p>
    <div class="flex items-center mt-2 text-xs text-gray-500">
      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      {{ interview.time }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Interview {
  id: number;
  name: string;
  position: string;
  time: string;
  isToday: boolean;
}

interface Props {
  interview: Interview;
}

const props = defineProps<Props>();

const borderClass = computed(() => {
  return props.interview.isToday ? 'border-slate-600' : 'border-gray-300';
});
</script>
