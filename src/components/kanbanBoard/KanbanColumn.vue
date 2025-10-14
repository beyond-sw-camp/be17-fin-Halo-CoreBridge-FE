<script setup lang="ts">
import { Plus } from 'lucide-vue-next'

defineProps<{
  title: string
  count?: number
  toneClass?: string         // 헤더 배경 (예: 'bg-slate-100')
  headerTextClass?: string   // 헤더 텍스트 색 (예: 'text-slate-700')
}>()
</script>

<template>
  <section class="w-80 flex-shrink-0">
    <!-- 컬럼 헤더 -->
    <header
      class="px-3 py-2 rounded-t-xl flex items-center justify-between border border-b-0"
      :class="[toneClass || 'bg-slate-100', headerTextClass || 'text-slate-700', 'border-slate-200']"
    >
      <div class="flex items-center gap-2">
        <h2 class="font-semibold">{{ title }}</h2>
        <span class="text-xs px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">
          {{ count ?? 0 }}
        </span>
      </div>

      <!-- UI만: 동작 없음 -->
      <button
        type="button"
        class="inline-flex items-center gap-1 text-xs bg-slate-600 text-white px-2.5 py-1 rounded-md hover:bg-slate-700 transition"
      >
        <Plus :size="14" /> 추가
      </button>
    </header>

    <!-- 컬럼 바디 -->
    <div class="bg-white rounded-b-xl border border-slate-200 p-3 space-y-3 min-h-[260px]">
      <!-- 비어있을 때 기본 UI -->
      <slot name="empty">
        <div class="border border-dashed border-slate-200 rounded-lg p-6 text-center">
          <p class="text-sm text-slate-500">아직 카드가 없어요.</p>
          <p class="text-xs text-slate-400 mt-1">상단의 ‘추가’ 버튼으로 카드를 만들어보세요.</p>
        </div>
      </slot>

      <!-- 카드 슬롯 -->
      <slot />
    </div>
  </section>
</template>
