<script setup lang="ts">
const props = defineProps<{ jobPosting: any }>()
</script>

<template>
  <section
    v-for="(block, idx) in [
      { title: '직무 소개', content: jobPosting.description },
      { title: '주요 업무', content: jobPosting.responsibilities },
      { title: '필수 자격 요건', content: jobPosting.requirements },
      { title: '우대 사항', content: jobPosting.preferred },
      { title: '복리후생', content: jobPosting.benefits },
      { title: '기타 안내사항', content: jobPosting.additionalInfo }
    ]"
    :key="idx"
    class="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
  >
    <h3 class="text-lg font-bold text-slate-600 mb-4">{{ block.title }}</h3>
    <template v-if="Array.isArray(block.content)">
      <ul class="text-gray-700 space-y-2 list-disc list-inside">
        <li v-for="(item, i) in block.content" :key="i">{{ item }}</li>
      </ul>
    </template>
    <template v-else>
      <p class="text-gray-700 leading-relaxed whitespace-pre-line">{{ block.content }}</p>
    </template>
  </section>
</template>
