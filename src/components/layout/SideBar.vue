<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { adminNavs, recruiterNavs } from '@/constants/SidebarNavs'
import { useRoute, useRouter } from 'vue-router'
import { useSidebarStore } from '@/store/useSidebarStore'

const sidebarOpen = ref(true) 
const currentPath = ref('')
const expandedMenus = ref<Set<string>>(new Set())

const roleTitle = computed(() => (route.path.startsWith('/admin') ? 'Admin' : 'Recruiter'))
const roleSubtitle = computed(() => (route.path.startsWith('/admin') ? '시스템 관리' : '채용 관리'))
const roleInitial = computed(() => (route.path.startsWith('/admin') ? 'A' : 'R'))

const route = useRoute()
const router = useRouter()

const sidebar = useSidebarStore()

// URL 기준으로 메뉴 자동 선택
const currentNavs = computed(() => {
  if (route.path.startsWith('/admin')) return adminNavs
  if (route.path.startsWith('/recruiter')) return recruiterNavs
  return []
})

const clickTap = (path: string) => {
  currentPath.value = path
  sidebar.setPath(path)
  router.push(path)
}

// 메뉴 확장/축소
const toggleMenu = (itemPath: string) => {
  if (expandedMenus.value.has(itemPath)) {
    expandedMenus.value.delete(itemPath)
  } else {
    expandedMenus.value.add(itemPath)
  }
}

// 활성화 확인 (부모 메뉴도 포함)
const isActive = (navPath: string) => {
  return navPath === sidebar.currentPath
}

const isParentActive = (item: any) => {
  if (!item.children) return false
  return item.children.some((child: any) => child.path === sidebar.currentPath)
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

    <nav class="flex-1 py-6 px-3 gap-3 flex flex-col border-r border-slate-200 shadow-sm overflow-y-auto">
      <div v-for="item in currentNavs" :key="item.path" class="space-y-1">
        <!-- 자식이 없는 메뉴 -->
        <button v-if="!item.children" @click="clickTap(item.path)"
          class="w-full flex items-center px-3 py-3 rounded-lg transition-all duration-200" :class="[
            isActive(item.path)
              ? 'bg-slate-600 text-white shadow-lg'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200 hover:cursor-pointer'
          ]">
          <component :is="item.icon" size="20" class="flex-shrink-0" />
          <span v-if="sidebarOpen" class="ml-3 font-medium text-sm">{{ item.label }}</span>
        </button>

        <!-- 자식이 있는 메뉴 (드롭다운) -->
        <div v-else>
          <button @click="toggleMenu(item.path)"
            class="w-full flex items-center justify-between px-3 py-3 rounded-lg transition-all duration-200" :class="[
              isParentActive(item)
                ? 'bg-slate-100 text-slate-900'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200 hover:cursor-pointer'
            ]">
            <div class="flex items-center">
              <component :is="item.icon" size="20" class="flex-shrink-0" />
              <span v-if="sidebarOpen" class="ml-3 font-medium text-sm">{{ item.label }}</span>
            </div>
          </button>

          <!-- 자식 메뉴 -->
          <div class="ml-4 mt-3 space-y-3 border-l-2 border-slate-200 pl-2">
            <button v-for="child in item.children" :key="child.path" @click="clickTap(child.path)"
              class="w-full flex items-center px-3 py-2 rounded-lg transition-all duration-200 text-sm" :class="[
                isActive(child.path)
                  ? 'bg-slate-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 hover:cursor-pointer'
              ]">
              <component :is="child.icon" size="16" class="flex-shrink-0" />
              <span class="ml-2 font-medium">{{ child.label }}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  </aside>
</template>

<style scoped></style>
