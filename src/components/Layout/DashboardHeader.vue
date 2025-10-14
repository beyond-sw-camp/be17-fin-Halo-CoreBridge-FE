<script setup lang="ts">
import { Search, Bell } from 'lucide-vue-next'
import ProfileDropdown from '@/components/RecruiterDashboard/ProfileDropdown.vue'
import { computed, ref } from 'vue'

import { useRoute } from 'vue-router'

const route = useRoute()
const roleTitle = computed(() => (route.path.startsWith('/admin') ? 'Admin' : 'Recruiter'))

interface User {
    name: string;
    email: string;
    role: string;
}

const handleMenuClick = (menuId: string) => {
    const menuNames: Record<string, string> = {
        account: '계정 설정',
        security: '보안 설정',
        notification: '알림 설정',
    };

    console.log('Menu clicked:', menuId);

    // 여기에 각 메뉴에 대한 라우팅 로직 추가
    // router.push({ name: menuId });
};

const handleLogout = () => {
    console.log('Logout clicked');
    // 로그아웃 로직 추가
};

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
            <button
                class="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
                <Bell size="20" />
                <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div class="flex items-center space-x-3 pl-4 border-l border-slate-200">
                <div class="text-center">
                    <p class="text-sm font-medium text-slate-800">이상우</p>
                    <p class="text-xs text-slate-500">{{ roleTitle }}</p>
                </div>
                <!-- <div
                    class="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center text-white font-medium shadow-md">
                    CS</div> -->
            </div>
            <ProfileDropdown @menu-click="handleMenuClick" @logout="handleLogout" />
        </div>
    </header>
</template>

<style scoped></style>