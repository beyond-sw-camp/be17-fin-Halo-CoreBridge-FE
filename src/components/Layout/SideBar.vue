<script setup lang="ts">
import { ref, computed } from 'vue'
import { adminNavs, recruiterNavs } from '@/constants/SidebarNavs'
import { useRoute, useRouter } from 'vue-router'

const sidebarOpen = ref(true)
const currentPath = ref('/admin/dashboard')

const roleTitle = computed(() => (route.path.startsWith('/admin') ? 'Admin' : 'Recruiter'))
const roleSubtitle = computed(() => (route.path.startsWith('/admin') ? '시스템 관리' : '채용 관리'))
const roleInitial = computed(() => (route.path.startsWith('/admin') ? 'A' : 'R'))


const route = useRoute()
const router = useRouter()

// URL 기준으로 메뉴 자동 선택
const currentNavs = computed(() => {
    if (route.path.startsWith('/admin')) return adminNavs
    if (route.path.startsWith('/recruiter')) return recruiterNavs
    return [] // 그 외엔 비움
})

const clickTap = (path: string) => {
    currentPath.value = path

    router.push(path)
}

// 활성화 확인
const isActive = (to: string) => {

    console.log('route.path', route.path)
    return route.path === to
}

</script>

<template>
    <aside
        :class="['transition-all h-screen duration-300 ease-in-out bg-white border-slate-200 flex flex-col', sidebarOpen ? 'w-52' : 'w-20']">
        <div class="h-16 flex items-center justify-between px-4 shadow-md">
            <div class="flex items-center space-x-3">
                <div
                    class="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center shadow-lg">
                    <span class="text-white font-bold text-lg">{{ roleInitial }}</span>
                </div>
                <transition name="fade">
                    <div v-if="sidebarOpen">
                        <h1 class="text-slate-800 font-bold text-lg">{{ roleTitle }}</h1>
                        <p class="text-slate-500 text-xs">{{ roleSubtitle }}</p>
                    </div>
                </transition>
            </div>
        </div>

        <nav class="flex-1  py-6 px-3 gap-3 flex flex-col border-r border-slate-200 shadow-sm overflow-y-auto">
            <div v-for="item in currentNavs" :key="item.path">
                <button @click="clickTap(item.path)"
                    class="w-full flex items-center px-3 py-3 rounded-lg transition-all duration-200"
                    :class="[isActive(item.path) ? 'bg-slate-600 text-white shadow-lg' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200 hover:cursor-pointer']">
                    <component :is="item.icon" size="20" class="flex-shrink-0" />
                    <span v-if="sidebarOpen" class="ml-3 font-medium text-sm">{{ item.label }}</span>
                </button>
            </div>
        </nav>

        <!-- <div class="p-4 border-t border-slate-200">
            <button @click="sidebarOpen = !sidebarOpen"
                class="w-full flex items-center justify-center px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
                <Menu size="20" />
            </button>
        </div> -->
    </aside>
</template>

<style scoped></style>
