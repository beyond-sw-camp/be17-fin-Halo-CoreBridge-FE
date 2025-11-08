<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { navs } from '@/constants/SidebarNavs'
import { useRoute, useRouter } from 'vue-router'
import { useSidebarStore } from '@/store/useSidebarStore'
import { useUserStore } from '@/store/useUserStore'

const userStore = useUserStore()
const currentPath = ref('')
const expandedMenus = ref<Set<string>>(new Set())

const roleTitle = computed(() => (userStore.userInfo.role === '관리자' ? 'Admin' : 'Recruiter'))
const roleSubtitle = computed(() => (userStore.userInfo.role === '관리자' ? '시스템 관리' : '채용 관리'))
const roleInitial = computed(() => (userStore.userInfo.role === '관리자' ? 'A' : 'R'))

const route = useRoute()
const router = useRouter()

const sidebar = useSidebarStore()

const currentNavs = ref(navs)

const clickTap = (path: string) => {
  currentPath.value = path
  sidebar.setPath(path)
  router.push(path)
}

// 활성화 확인 (부모 메뉴도 포함)
const isActive = (navPath: string) => {
  return navPath === sidebar.currentPath
}

onMounted(() => {
  if (route.path === '/recruiter') {
    sidebar.setPath(route.path)
  }

  // 현재 활성화된 메뉴의 부모를 자동으로 열기
  currentNavs.value.forEach((item: any) => {
    if (item.children) {
      const hasActiveChild = item.children.some((child: any) => child.path === route.path)
      if (hasActiveChild) {
        expandedMenus.value.add(item.path)
      }
    }
  })
})
</script>

<template>
  <aside class="transition-all h-screen duration-300 ease-in-out bg-white border-slate-200 flex flex-col w-52">
    <div class="h-16 flex items-center justify-between px-4 shadow-md">
      <div class="flex items-center space-x-3">
        <div
          class="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center shadow-lg">
          <span class="text-white font-bold text-lg">{{ roleInitial }}</span>
        </div>
        <div>
          <h1 class="text-slate-800 font-bold text-lg">{{ roleTitle }}</h1>
          <p class="text-slate-500 text-xs">{{ roleSubtitle }}</p>
        </div>
      </div>
    </div>

    <nav class="flex-1 py-6 px-3 gap-3 flex flex-col border-r border-slate-200 shadow-sm overflow-y-auto">
      <div v-for="item in currentNavs" :key="item.path" class="space-y-1">
        <button @click="clickTap(item.path)"
          class="w-full flex items-center px-3 py-3 rounded-lg transition-all duration-200" :class="[
            isActive(item.path)
              ? 'bg-slate-600 text-white shadow-lg'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200 hover:cursor-pointer'
          ]" v-if="item.role.includes(userStore.userInfo.role)">
          <component :is="item.icon" size="20" class="flex-shrink-0" />
          <span class="ml-3 font-medium text-sm">{{ item.label }}</span>
        </button>

      </div>
    </nav>
  </aside>
</template>

<style scoped></style>
