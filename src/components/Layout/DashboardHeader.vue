<script setup lang="ts">
import ProfileDropdown from '@/components/recruiter-dashboard/ProfileDropdown.vue'
import { useUserStore } from '@/store/useUserStore'

const userStore = useUserStore()

</script>

<template>
    <!-- Header -->
    <header
        class="h-16 bg-white backdrop-blur-sm  flex items-center justify-end px-6 shadow-md fixed top-0 right-0 z-50 left-52">
        <!-- <div class="flex items-center flex-1 max-w-xl">
            <div class="relative w-full">
                <Search size="20" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="검색..."
                    class="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent transition-all" />
            </div>
        </div> -->
        <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-3 pl-4 border-l border-slate-200">
                <div class="text-center">
                    <p class="text-sm font-medium text-slate-800">{{ userStore.userInfo.name }}</p>
                    <p class="text-xs text-slate-500">{{ userStore.userInfo.role }}</p>
                </div>
                <!-- <div
                    class="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center text-white font-medium shadow-md">
                    CS</div> -->
            </div>
            <ProfileDropdown />
        </div>
    </header>
</template>

<style scoped></style>
