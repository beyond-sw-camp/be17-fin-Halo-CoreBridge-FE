<script setup lang="ts">
import { computed } from 'vue'
import {
  UserRound,
  Lock,
  Bell,
  Briefcase,
  Calendar,
  Globe,
  Smartphone,
  LogOut,
  SquarePen,
  Trash2,
  MessagesSquare
} from 'lucide-vue-next'

interface Props {
  icon: string;
  label: string;
  variant?: 'default' | 'danger';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default'
})

defineEmits<{
  click: [];
}>()

// Computed
const buttonClass = computed(() => {
  if (props.variant === 'danger') {
    return 'hover:bg-red-50 text-red-600'
  }
  return 'hover:bg-slate-100 text-gray-700'
})

const iconComponent = computed(() => {
  const icons: Record<string, unknown> = {
    user: UserRound,
    lock: Lock,
    bell: Bell,
    briefcase: Briefcase,
    calendar: Calendar,
    globe: Globe,
    mobile: Smartphone,
    logout: LogOut,
    squarePen: SquarePen,
    trash2: Trash2,
    messagesSquare: MessagesSquare
  }

  return icons[props.icon] || UserRound
})
</script>
<template>
  <button @click="$emit('click')"
    class="hover:cursor-pointer w-full px-4 py-3 text-left transition flex items-center space-x-3" :class="buttonClass">
    <component :is="iconComponent" class="w-5 h-5 flex-shrink-0 text-gray-600" />
    <span class="truncate">{{ label }}</span>
  </button>
</template>
<style scoped></style>
