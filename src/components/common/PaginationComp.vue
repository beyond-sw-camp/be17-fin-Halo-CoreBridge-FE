<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

interface Props {
    totalPages: number
    currentPage: number // 1-based (UI용)
    groupSize?: number
}
const props = withDefaults(defineProps<Props>(), {
    groupSize: 10,
})

const emit = defineEmits(['update:currentPage'])

// 그룹 계산
const currentGroup = computed(() => Math.ceil(props.currentPage / props.groupSize))
const startPage = computed(() => (currentGroup.value - 1) * props.groupSize + 1)
const endPage = computed(() => Math.min(startPage.value + props.groupSize - 1, props.totalPages))

const visiblePages = computed(() => {
    const pages = []
    for (let i = startPage.value; i <= endPage.value; i++) pages.push(i)
    return pages
})

// 이동 로직
const goToPage = (page: number) => {
    if (page < 1 || page > props.totalPages) return
    emit('update:currentPage', page)
}

const goToPrevGroup = () => {
    if (startPage.value > 1) emit('update:currentPage', startPage.value - 1)
}

const goToNextGroup = () => {
    if (endPage.value < props.totalPages) emit('update:currentPage', endPage.value + 1)
}
</script>

<template>
    <div class="flex items-center justify-center space-x-2">
        <button class="hover:cursor-pointer p-2 hover:bg-slate-200 rounded-xl transition-all disabled:opacity-50"
            :disabled="startPage === 1" @click="goToPrevGroup">
            <ChevronLeft :size="20" />
        </button>

        <button v-for="page in visiblePages" :key="page" @click="goToPage(page)"
            class="hover:cursor-pointer px-4 py-2 rounded-xl font-medium transition-all"
            :class="page === currentPage ? 'bg-slate-600 text-white' : 'hover:bg-slate-200'">
            {{ page }}
        </button>

        <button class="hover:cursor-pointer p-2 hover:bg-slate-200 rounded-xl transition-all disabled:opacity-50"
            :disabled="endPage === totalPages" @click="goToNextGroup">
            <ChevronRight :size="20" />
        </button>
    </div>
</template>
<style scoped></style>