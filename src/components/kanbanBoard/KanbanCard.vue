<script setup lang="ts">
import { User } from 'lucide-vue-next'

defineProps<{
  name: string
  role: string
  tags?: string[]
  note?: string
  avatarText?: string
  accentClass?: string // 예: 'border-slate-200' (없으면 기본)
}>()
</script>

<template>
  <article
    class="bg-white border rounded-xl p-3 shadow-sm hover:shadow-md transition"
    :class="accentClass || 'border-slate-200'"
  >
    <div class="flex items-center gap-3">
      <div
        class="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 text-sm font-semibold"
      >
        {{ avatarText || (name ? name[0] : '') }}
      </div>
      <div class="min-w-0">
        <h3 class="font-semibold text-slate-800 truncate">{{ name }}</h3>
        <p class="text-xs text-slate-500 truncate flex items-center gap-1">
          <User :size="14" class="opacity-60" /> {{ role }}
        </p>
      </div>
    </div>

    <ul v-if="tags?.length" class="flex flex-wrap gap-1 mt-3">
      <li
        v-for="tag in tags"
        :key="tag"
        class="text-[11px] px-2 py-0.5 rounded-full border border-slate-200 text-slate-600 bg-slate-50"
      >
        {{ tag }}
      </li>
    </ul>

    <p v-if="note" class="text-xs text-slate-400 mt-3 line-clamp-2">
      {{ note }}
    </p>
  </article>
</template>
