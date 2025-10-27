<script setup lang="ts">
import { CalendarPlus, X } from 'lucide-vue-next'
import { defineEmits } from 'vue';

const emits = defineEmits(['close'])

const handleClose = () => {
  emits('close')
}

</script>
<template>
  <Header class="px-8 py-6 border-b border-slate-200">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div class="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center">
          <CalendarPlus :size="24" class="text-white" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-slate-800">새 면접 등록</h1>
          <p class="text-sm text-slate-500">면접 일정을 등록하세요</p>
        </div>
      </div>
      <button @click="handleClose" class="p-2 hover:bg-slate-100 rounded-xl transition-all hover:cursor-pointer">
        <X :size="24" class="text-slate-600" />
      </button>
    </div>
  </Header>
</template>
<style scoped></style>
