<script setup>
import { LoaderCircle } from 'lucide-vue-next';
import { useLoadingStore } from '@/store/useLoadingStore';

const loadingStore = useLoadingStore()

</script>

<template>
    <div v-if="loadingStore.isLoading" class="fixed inset-0 flex justify-center items-center z-50 bg-white/70">
        <LoaderCircle class="animate-spin text-slate-600" size="45" />
    </div>
</template>

<style scoped></style>