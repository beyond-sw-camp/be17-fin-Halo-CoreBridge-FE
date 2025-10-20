<script setup lang="ts">
import Sidebar from '@/components/layout/SideBar.vue'
import DashboardHeader from '@/components/layout/DashboardHeader.vue'
import { RouterView } from 'vue-router'

</script>

<template>
    <div class="flex h-screen overflow-hidden bg-slate-50">
        <!-- 왼쪽 사이드바 - 고정 너비 -->
        <Sidebar />

        <!-- 오른쪽 메인 컨텐츠 -->
        <main class="flex-1 overflow-y-auto bg-slate-50 pt-16">
            <DashboardHeader />
            <div class="p-2 ">
                <RouterView />
            </div>
        </main>
    </div>
</template>
<style scoped></style>