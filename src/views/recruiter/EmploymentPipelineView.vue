<script setup>
import { Plus } from 'lucide-vue-next'
import KanbanBoard from '@/components/kanbanBoard/KanbanBoard.vue'
</script>

<template>
    <div class="p-6">
        <!-- 헤더 -->
    <header class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">지원자 관리</h1>
        <p class="text-sm text-slate-500 mt-1">공고별 진행 현황을 칸반으로 확인하세요</p>
      </div>
      <button
        type="button"
        class="flex items-center gap-2 bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition"
      >
        <Plus :size="18" />
        <span>새 공고 만들기</span>
      </button>
    </header>

    <!-- 칸반 보드(UI 전용) -->
    <KanbanBoard />
    </div>
</template>

<style scoped></style>