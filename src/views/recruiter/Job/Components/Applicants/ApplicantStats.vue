<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div class="flex items-center gap-3">
        <div class="p-2 bg-blue-50 rounded-lg">
          <Users :size="24" class="text-blue-600" />
        </div>
        <div>
          <p class="text-sm text-gray-600">전체 지원자</p>
          <p class="text-2xl font-bold text-slate-700">{{ total }}</p>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div class="flex items-center gap-3">
        <div class="p-2 bg-yellow-50 rounded-lg">
          <FileText :size="24" class="text-yellow-600" />
        </div>
        <div>
          <p class="text-sm text-gray-600">서류 심사</p>
          <p class="text-2xl font-bold text-slate-700">{{ pending }}</p>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div class="flex items-center gap-3">
        <div class="p-2 bg-green-50 rounded-lg">
          <CheckCircle :size="24" class="text-green-600" />
        </div>
        <div>
          <p class="text-sm text-gray-600">서류 통과</p>
          <p class="text-2xl font-bold text-slate-700">{{ passed }}</p>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div class="flex items-center gap-3">
        <div class="p-2 bg-purple-50 rounded-lg">
          <Clock :size="24" class="text-purple-600" />
        </div>
        <div>
          <p class="text-sm text-gray-600">면접 대기</p>
          <p class="text-2xl font-bold text-slate-700">{{ interview }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Users, FileText, CheckCircle, Clock } from 'lucide-vue-next'

defineProps<{
  total: number
  pending: number
  passed: number
  interview: number
}>()
</script>
